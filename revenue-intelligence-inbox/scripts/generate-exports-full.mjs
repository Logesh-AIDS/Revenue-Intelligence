import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';

const root = process.cwd();
const exportDir = join(root, 'export-output');

// Load bundled analysis (esbuild output)
const { ANALYSIS } = await import(join(root, 'scripts/analysis-bundle.cjs'));

// Load data
const initial = JSON.parse(readFileSync(join(root, 'src/data/01_initial.json'), 'utf8'));
const update = JSON.parse(readFileSync(join(root, 'src/data/02_update.json'), 'utf8'));

// Build final state (after update)
const records = {};
for (const r of initial.records) {
  records[`${r.source_type}:${r.source_id}`] = { ...r, applied_revision: 1 };
}
for (const r of update.records) {
  const key = `${r.source_type}:${r.source_id}`;
  records[key] = { ...r, applied_revision: 2 };
}

// Routing
function getRoute(r) {
  if (!hasText(r)) return 'intake_required';
  const a = ANALYSIS[r.source_id];
  return a ? a.route : 'intake_required';
}

function hasText(r) {
  if (r.source_type === 'call') return !!(r.payload.transcript && r.payload.transcript.trim());
  const tp = r.transcript_payload;
  return tp && tp.turns && tp.turns.length > 0 && tp.turns.some(t => t.text && t.text.trim());
}

const routeFolders = {
  sales_coaching: 'exports/sales-coaching',
  deal_followup: 'exports/deal-followup',
  customer_success: 'exports/customer-success',
  partnership: 'exports/partnership',
  vendor_evaluation: 'exports/vendor-evaluation',
  internal: 'exports/internal',
  intake_required: 'exports/intake-required',
};

const routeLabels = {
  sales_coaching: 'Sales Coaching',
  deal_followup: 'Deal Follow-up',
  customer_success: 'Customer Success',
  partnership: 'Partnership',
  vendor_evaluation: 'Vendor Evaluation',
  internal: 'Internal / Training',
  intake_required: 'Intake Required',
};

function formatMetadata(r) {
  if (r.source_type === 'call') {
    const p = r.payload;
    return `| Field | Value |\n|---|---|\n| Source ID | ${r.source_id} |\n| Rep | ${p.rep_name || '—'} (${p.rep_email || '—'}) |\n| Direction | ${p.direction} |\n| Started at | ${p.started_at} |\n| Duration (s) | ${p.duration_seconds} |\n| Connected | ${p.is_connected} |\n| Observed outcome | ${p.observed_outcome || '—'} |\n| Campaign call | ${p.is_campaign_call} |`;
  }
  const p = r.payload;
  return `| Field | Value |\n|---|---|\n| Source ID | ${r.source_id} |\n| Title | ${p.title} |\n| Organizer | ${p.organizer_email || '—'} |\n| Starts at | ${p.starts_at} |\n| Recording status | ${p.recording_status} |\n| Has transcript | ${p.has_transcript} |\n| Attendee count | ${p.attendee_count ?? '—'} |`;
}

function formatAnalysisFile(r) {
  const a = ANALYSIS[r.source_id];
  if (!a) return formatIntakeFile(r);
  const route = getRoute(r);
  const label = routeLabels[route];

  let md = `# ${r.record_ref} — ${r.source_type.toUpperCase()}\n\n`;
  md += `**Route:** ${label} (auto-suggested)\n\n`;
  md += `**Review state:** routed\n\n`;
  md += `**Source revision:** ${r.applied_revision}\n\n`;
  md += `**Analysis freshness:** current\n\n`;
  md += `**Analysis type:** pre-generated\n\n`;
  md += `**Route reason:** ${a.routeReason}\n\n`;
  md += `---\n\n`;
  md += `## What happened\n\n${a.analysis.summary}\n\n`;
  md += `## Why it matters\n\n${a.analysis.significance}\n\n`;
  md += `## Supporting evidence\n\n`;
  for (const e of a.analysis.evidence) {
    md += `- **${e.reference}**\n  > ${e.passage}\n  ${e.note}\n\n`;
  }
  md += `## What the evidence does not establish\n\n${a.analysis.limitations}\n\n`;
  md += `## Next steps\n\n`;
  for (const s of a.analysis.nextSteps) {
    md += `- ${s.action} — *Owner: ${s.owner}*\n`;
  }
  md += `\n---\n\n## Source metadata\n\n${formatMetadata(r)}\n`;
  return md;
}

function formatIntakeFile(r) {
  const route = getRoute(r);
  const label = routeLabels[route];
  let md = `# ${r.record_ref} — ${r.source_type.toUpperCase()}\n\n`;
  md += `**Route:** ${label} (auto-suggested)\n\n`;
  md += `**Review state:** intake\n\n`;
  md += `**Source revision:** ${r.applied_revision}\n\n`;
  md += `**Has usable text:** No\n\n`;
  md += `---\n\n## Intake note\n\n`;
  md += `This record has no usable supplied text. It needs human review to determine whether further action is required.\n\n`;
  if (r.source_type === 'meeting') {
    const tp = r.transcript_payload;
    if (tp?.unavailable_reason) {
      md += `**Unavailable reason:** ${tp.unavailable_reason}\n\n`;
    }
  }
  md += `## Source metadata\n\n${formatMetadata(r)}\n`;
  return md;
}

// Generate all files
const allRecords = Object.values(records);
const manifest = [];
let fileCount = 0;

for (const r of allRecords) {
  const route = getRoute(r);
  const folder = routeFolders[route];
  const fileName = `${r.record_ref}.md`;
  const filePath = join(folder, fileName);
  const content = hasText(r) ? formatAnalysisFile(r) : formatIntakeFile(r);

  const fullPath = join(exportDir, filePath);
  mkdirSync(dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, content);
  fileCount++;

  manifest.push({
    source_type: r.source_type,
    source_id: r.source_id,
    record_ref: r.record_ref,
    applied_revision: r.applied_revision,
    routes: [route],
    output_paths: [filePath],
    review_state: hasText(r) ? 'routed' : 'intake',
    manual_override: false,
    analysis_fresh: true,
    has_usable_text: hasText(r),
  });
}

// Manifest JSON
writeFileSync(join(exportDir, 'manifest.json'), JSON.stringify(manifest, null, 2));

// Manifest CSV
const csvHeaders = 'source_type,source_id,record_ref,applied_revision,routes,output_paths,review_state,manual_override,analysis_fresh,has_usable_text';
const csvRows = manifest.map(m =>
  [m.source_type, m.source_id, m.record_ref, m.applied_revision, m.routes.join(';'),
   m.output_paths.join(';'), m.review_state, m.manual_override, m.analysis_fresh, m.has_usable_text]
  .map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')
);
writeFileSync(join(exportDir, 'manifest.csv'), [csvHeaders, ...csvRows].join('\n'));

// README
const total = allRecords.length;
const textCount = allRecords.filter(hasText).length;
const routeCounts = {};
for (const r of allRecords) {
  const route = getRoute(r);
  routeCounts[route] = (routeCounts[route] || 0) + 1;
}

writeFileSync(join(exportDir, 'README.md'), `# Revenue Intelligence Inbox — Export\n\nGenerated: ${new Date().toISOString()}\n\n## Contents\n\n- **${total}** source records (${textCount} with usable supplied text)\n- Per-record analysis files organised by route folder\n- Machine-readable manifest (JSON + CSV)\n\n## Folder structure\n\n\`\`\`\nexports/\n${Object.entries(routeFolders).map(([k, v]) => `  ${v.split('/')[1]}/`.padEnd(24) + `# ${routeCounts[k] || 0} file(s)`).join('\n')}\n  manager-brief-2026-08-21.md\nmanifest.json\nmanifest.csv\nREADME.md\n\`\`\`\n\n## Manifest fields\n\n| Field | Meaning |\n|---|---|\n| source_type | call or meeting |\n| source_id | unique source ID |\n| record_ref | short reading reference (not an identity key) |\n| applied_revision | last applied source revision |\n| routes | effective route(s) — manual override takes precedence |\n| output_paths | relative paths to output files inside this archive |\n| review_state | intake / routed / reviewed / pending_update |\n| manual_override | true if the manager manually changed the route |\n| analysis_fresh | true if analysis reflects the current source revision |\n| has_usable_text | true if the record has a usable transcript |\n`);

console.log(`Generated ${fileCount} analysis files`);
console.log(`Manifest: ${manifest.length} entries`);
console.log(`Text records: ${textCount}, No-text records: ${total - textCount}`);
console.log(`Routes:`, Object.entries(routeCounts).map(([k,v]) => `${k}: ${v}`).join(', '));
console.log('Export directory:', exportDir);
