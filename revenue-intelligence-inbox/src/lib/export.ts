import type { StoredRecord, ManifestEntry } from '../types';
import { hasUsableText, effectiveRoute, isManualOverride } from './store';
import { isAnalysisFresh } from './routing';
import { ROUTES } from './routes';
import JSZip from 'jszip';

interface ExportFile {
  path: string;
  content: string;
}

interface ExportResult {
  files: ExportFile[];
  manifest: ManifestEntry[];
  zipBlob: Blob;
}

export function generateExport(records: StoredRecord[]): ExportResult {
  const files: ExportFile[] = [];
  const manifest: ManifestEntry[] = [];

  // Group records by route
  const byRoute: Record<string, StoredRecord[]> = {};
  for (const rec of records) {
    const route = effectiveRoute(rec);
    if (!byRoute[route]) byRoute[route] = [];
    byRoute[route].push(rec);
  }

  // Generate per-record analysis files
  for (const rec of records) {
    const route = effectiveRoute(rec);
    const meta = ROUTES[route];
    const hasText = hasUsableText(rec);
    const fresh = isAnalysisFresh(rec);

    const outputPaths: string[] = [];

    if (hasText && rec.analysis) {
      // Generate analysis markdown file
      const safeRef = rec.record_ref;
      const fileName = `${safeRef}.md`;
      const filePath = `${meta.exportFolder}/${fileName}`;
      const content = formatAnalysisFile(rec);
      files.push({ path: filePath, content });
      outputPaths.push(filePath);
    } else {
      // Intake file for no-text records
      const safeRef = rec.record_ref;
      const fileName = `${safeRef}.md`;
      const filePath = `${meta.exportFolder}/${fileName}`;
      const content = formatIntakeFile(rec);
      files.push({ path: filePath, content });
      outputPaths.push(filePath);
    }

    manifest.push({
      source_type: rec.source_type,
      source_id: rec.source_id,
      record_ref: rec.record_ref,
      applied_revision: rec.applied_revision,
      routes: [route],
      output_paths: outputPaths,
      review_state: rec.review_state,
      manual_override: isManualOverride(rec),
      analysis_fresh: fresh,
      has_usable_text: hasText,
    });
  }

  // Generate manager brief
  files.push({
    path: 'exports/manager-brief-2026-08-21.md',
    content: generateManagerBrief(records),
  });

  // Generate manifest CSV
  files.push({
    path: 'manifest.csv',
    content: generateManifestCSV(manifest),
  });

  // Generate manifest JSON
  files.push({
    path: 'manifest.json',
    content: JSON.stringify(manifest, null, 2),
  });

  // Generate README
  files.push({
    path: 'README.md',
    content: generateExportReadme(records),
  });

  // Build ZIP
  const zip = new JSZip();
  for (const f of files) {
    zip.file(f.path, f.content);
  }

  return { files, manifest, zipBlob: new Blob([]) }; // zipBlob filled in async
}

export async function generateExportWithZip(records: StoredRecord[]): Promise<ExportResult> {
  const base = generateExport(records);
  const zip = new JSZip();
  for (const f of base.files) {
    zip.file(f.path, f.content);
  }
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  return { ...base, zipBlob };
}

function formatAnalysisFile(rec: StoredRecord): string {
  const a = rec.analysis!;
  const route = effectiveRoute(rec);
  const meta = ROUTES[route];
  const manual = isManualOverride(rec);

  let md = `# ${rec.record_ref} — ${rec.source_type.toUpperCase()}\n\n`;
  md += `**Route:** ${meta.label}${manual ? ' (manually corrected)' : ' (auto-suggested)'}\n\n`;
  md += `**Review state:** ${rec.review_state}\n\n`;
  md += `**Source revision:** ${rec.applied_revision}\n\n`;
  md += `**Analysis freshness:** ${isAnalysisFresh(rec) ? 'current' : 'stale — pending review'}\n\n`;
  md += `**Analysis type:** ${a.generated}\n\n`;
  md += `---\n\n`;
  md += `## What happened\n\n${a.summary}\n\n`;
  md += `## Why it matters\n\n${a.significance}\n\n`;
  md += `## Supporting evidence\n\n`;
  for (const e of a.evidence) {
    md += `- **${e.reference}**\n  > ${e.passage}\n  ${e.note}\n\n`;
  }
  md += `## What the evidence does not establish\n\n${a.limitations}\n\n`;
  md += `## Next steps\n\n`;
  for (const s of a.nextSteps) {
    md += `- ${s.action} — *Owner: ${s.owner}*\n`;
  }
  md += `\n---\n\n`;
  md += `## Source metadata\n\n`;
  md += formatMetadata(rec);
  return md;
}

function formatIntakeFile(rec: StoredRecord): string {
  const route = effectiveRoute(rec);
  const meta = ROUTES[route];
  let md = `# ${rec.record_ref} — ${rec.source_type.toUpperCase()}\n\n`;
  md += `**Route:** ${meta.label} (auto-suggested)\n\n`;
  md += `**Review state:** ${rec.review_state}\n\n`;
  md += `**Source revision:** ${rec.applied_revision}\n\n`;
  md += `**Has usable text:** No\n\n`;
  md += `---\n\n`;
  md += `## Intake note\n\n`;
  md += `This record has no usable supplied text. It needs human review to determine whether further action is required.\n\n`;
  if (rec.source_type === 'meeting') {
    const tp = rec.transcript_payload;
    if (tp?.unavailable_reason) {
      md += `**Unavailable reason:** ${tp.unavailable_reason}\n\n`;
    }
  }
  md += `## Source metadata\n\n`;
  md += formatMetadata(rec);
  return md;
}

function formatMetadata(rec: StoredRecord): string {
  if (rec.source_type === 'call') {
    const p = rec.payload as any;
    return [
      `| Field | Value |`,
      `|---|---|`,
      `| Source ID | ${rec.source_id} |`,
      `| Rep | ${p.rep_name || '—'} (${p.rep_email || '—'}) |`,
      `| Direction | ${p.direction} |`,
      `| Started at | ${p.started_at} |`,
      `| Duration (s) | ${p.duration_seconds} |`,
      `| Connected | ${p.is_connected} |`,
      `| Observed outcome | ${p.observed_outcome || '—'} |`,
      `| Campaign call | ${p.is_campaign_call} |`,
    ].join('\n');
  }
  const p = rec.payload as any;
  return [
    `| Field | Value |`,
    `|---|---|`,
    `| Source ID | ${rec.source_id} |`,
    `| Title | ${p.title} |`,
    `| Organizer | ${p.organizer_email || '—'} |`,
    `| Starts at | ${p.starts_at} |`,
    `| Recording status | ${p.recording_status} |`,
    `| Has transcript | ${p.has_transcript} |`,
    `| Attendee count | ${p.attendee_count ?? '—'} |`,
  ].join('\n');
}

function generateManifestCSV(manifest: ManifestEntry[]): string {
  const headers = [
    'source_type',
    'source_id',
    'record_ref',
    'applied_revision',
    'routes',
    'output_paths',
    'review_state',
    'manual_override',
    'analysis_fresh',
    'has_usable_text',
  ];
  const rows = manifest.map((m) =>
    [
      m.source_type,
      m.source_id,
      m.record_ref,
      m.applied_revision,
      m.routes.join(';'),
      m.output_paths.join(';'),
      m.review_state,
      m.manual_override,
      m.analysis_fresh,
      m.has_usable_text,
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(','),
  );
  return [headers.join(','), ...rows].join('\n');
}

function generateExportReadme(records: StoredRecord[]): string {
  const total = records.length;
  const textCount = records.filter((r) => hasUsableText(r)).length;
  const routes = new Set(records.map((r) => effectiveRoute(r)));

  return `# Revenue Intelligence Inbox — Export

Generated: ${new Date().toISOString()}

## Contents

- **${total}** source records (${textCount} with usable supplied text)
- Per-record analysis files organised by route folder
- Manager brief for 21 August 2026
- Machine-readable manifest (JSON + CSV)

## Folder structure

\`\`\`
exports/
  sales-coaching/       — calls needing rep technique feedback
  deal-followup/        — active pipeline with agreed next steps
  customer-success/     — existing customer support and onboarding
  partnership/          — channel partnership development
  vendor-evaluation/    — SpendNest evaluating a supplier
  internal/             — internal meetings and training
  intake-required/      — no usable text, needs human review
  manager-brief-2026-08-21.md
manifest.json
manifest.csv
README.md
\`\`\`

## Manifest fields

| Field | Meaning |
|---|---|
| source_type | call or meeting |
| source_id | unique source ID |
| record_ref | short reading reference (not an identity key) |
| applied_revision | last applied source revision |
| routes | effective route(s) — manual override takes precedence |
| output_paths | relative paths to output files inside this archive |
| review_state | intake / routed / reviewed / pending_update |
| manual_override | true if the manager manually changed the route |
| analysis_fresh | true if analysis reflects the current source revision |
| has_usable_text | true if the record has a usable transcript |
`;
}

function generateManagerBrief(records: StoredRecord[]): string {
  // This is a simplified version for export; the full brief is in the app
  const textRecords = records.filter((r) => hasUsableText(r));
  const coaching = records.filter((r) => effectiveRoute(r) === 'sales_coaching');
  const followup = records.filter((r) => effectiveRoute(r) === 'deal_followup');
  const cs = records.filter((r) => effectiveRoute(r) === 'customer_success');
  const partnership = records.filter((r) => effectiveRoute(r) === 'partnership');
  const vendor = records.filter((r) => effectiveRoute(r) === 'vendor_evaluation');

  let md = `# Manager Brief — 21 August 2026 (Asia/Kolkata)\n\n`;
  md += `*Pre-generated. Review all ${textRecords.length} supplied conversations after applying the update.*\n\n`;
  md += `## Activity overview\n\n`;
  md += `- ${records.length} selected source records (30 calls, 14 meetings)\n`;
  md += `- ${textRecords.length} with usable supplied text (after update)\n`;
  md += `- Routing: ${coaching.length} coaching, ${followup.length} deal follow-up, ${cs.length} customer success, ${partnership.length} partnership, ${vendor.length} vendor evaluation\n\n`;
  md += `*See the in-app Manager Brief screen for the full version with evidence links.*\n`;
  return md;
}
