// Generate export files from the data
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';

const root = process.cwd();
const dataDir = join(root, 'src', 'data');
const exportDir = join(root, 'export-output');

// Load data
const initial = JSON.parse(readFileSync(join(dataDir, '01_initial.json'), 'utf8'));
const update = JSON.parse(readFileSync(join(dataDir, '02_update.json'), 'utf8'));

// Import logic (simplified replication of the app's store)
const records = {};
const log = [];

function hasUsableText(src) {
  if (src.source_type === 'call') {
    return !!(src.payload.transcript && src.payload.transcript.trim().length > 0);
  }
  const tp = src.transcript_payload;
  if (!tp || !tp.turns || tp.turns.length === 0) return false;
  return tp.turns.some(t => t.text && t.text.trim().length > 0);
}

function importBatch(batch) {
  for (const src of batch.records) {
    const key = `${src.source_type}:${src.source_id}`;
    const existing = records[key];
    const incomingRev = batch.revision;

    if (!existing) {
      records[key] = {
        ...src,
        applied_revision: incomingRev,
        import_batch: batch.batch_id,
      };
      log.push({ action: 'initial', ref: src.record_ref, rev: incomingRev });
    } else if (incomingRev > existing.applied_revision) {
      records[key] = {
        ...src,
        applied_revision: incomingRev,
        import_batch: batch.batch_id,
      };
      const textNow = hasUsableText(records[key]);
      const textBefore = hasUsableText(existing);
      log.push({ action: 'updated', ref: src.record_ref, rev: incomingRev, textNow, textBefore });
    } else {
      log.push({ action: 'duplicate_skipped', ref: src.record_ref, rev: incomingRev });
    }
  }
}

// Import both batches
importBatch(initial);
importBatch(update);

const allRecords = Object.values(records);
console.log(`Total records: ${allRecords.length}`);
console.log(`With usable text: ${allRecords.filter(r => hasUsableText(r)).length}`);
console.log(`M07 has text: ${hasUsableText(records['meeting:4f304fff-fd40-5cfc-a366-0a134c445c2a'])}`);

// Verify replay: import initial again
const beforeCount = Object.keys(records).length;
importBatch(initial);
const afterCount = Object.keys(records).length;
console.log(`Re-import initial: ${beforeCount} → ${afterCount} (should be same)`);

// Generate manifest
const manifest = allRecords.map(r => ({
  source_type: r.source_type,
  source_id: r.source_id,
  record_ref: r.record_ref,
  applied_revision: r.applied_revision,
  routes: [r.record_ref.startsWith('M') || r.record_ref.startsWith('C') ? 'auto' : 'intake_required'],
  output_paths: [`exports/${r.record_ref}.md`],
  review_state: hasUsableText(r) ? 'routed' : 'intake',
  manual_override: false,
  analysis_fresh: true,
  has_usable_text: hasUsableText(r),
}));

// Write manifest
mkdirSync(exportDir, { recursive: true });
writeFileSync(join(exportDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`Manifest written: ${manifest.length} entries`);

// Write import log
console.log('\nImport log:');
log.forEach(l => console.log(`  ${l.action}: ${l.ref} (rev ${l.rev})`));
