import { useState } from 'react';
import type { StoredRecord } from '../types';
import { hasUsableText, effectiveRoute } from '../lib/store';
import { isAnalysisFresh } from '../lib/routing';
import { ROUTES, ROUTE_LIST } from '../lib/routes';
import { generateExport, generateExportWithZip } from '../lib/export';

interface Props {
  records: StoredRecord[];
}

export default function ExportPanel({ records }: Props) {
  const [generated, setGenerated] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [manifestPreview, setManifestPreview] = useState<any[]>([]);
  const [fileList, setFileList] = useState<{ path: string; content: string }[]>([]);

  const handleGenerate = async () => {
    const result = await generateExportWithZip(records);
    setManifestPreview(result.manifest);
    setFileList(result.files);
    setGenerated(true);

    // Trigger download
    setDownloading(true);
    const url = URL.createObjectURL(result.zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'revenue-intelligence-export.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloading(false);
  };

  const handleDownloadManifest = () => {
    const json = JSON.stringify(manifestPreview, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'manifest.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Folder structure preview
  const folderTree = ROUTE_LIST.map((r) => {
    const count = records.filter((rec) => effectiveRoute(rec) === r.key).length;
    return { folder: r.exportFolder, label: r.label, count, icon: r.icon };
  });

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Exports</h1>
        <p className="text-sm text-slate-500 mt-1">
          Generate organised output files with a machine-readable manifest. Each record gets an analysis file in its route folder.
        </p>
      </div>

      {/* Generate button */}
      <div className="flex gap-3">
        <button
          onClick={handleGenerate}
          disabled={downloading}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg"
        >
          {downloading ? 'Generating…' : 'Generate & download export (.zip)'}
        </button>
        {generated && (
          <button
            onClick={handleDownloadManifest}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg border border-slate-200"
          >
            Download manifest.json
          </button>
        )}
      </div>

      {/* Folder structure */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-800 mb-3">Folder structure</h3>
        <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs text-slate-300 overflow-x-auto">
          <pre>{`exports/
${folderTree.map((f) => `  ${f.folder.split('/')[1]}/`.padEnd(28) + `# ${f.count} file(s)`).join('\n')}
  manager-brief-2026-08-21.md
manifest.json
manifest.csv
README.md`}</pre>
        </div>
        <p className="text-xs text-slate-400 mt-3">
          Each record's analysis file is placed in the folder matching its effective route (manual overrides take precedence).
          When a route changes, the obsolete file is superseded by the new one in the new folder.
        </p>
      </div>

      {/* Manifest preview */}
      {generated && manifestPreview.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-800 mb-3">Manifest preview ({manifestPreview.length} entries)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50">
                <tr className="text-left text-slate-500">
                  <th className="px-3 py-2 font-medium">Ref</th>
                  <th className="px-3 py-2 font-medium">Type</th>
                  <th className="px-3 py-2 font-medium">Rev</th>
                  <th className="px-3 py-2 font-medium">Route</th>
                  <th className="px-3 py-2 font-medium">State</th>
                  <th className="px-3 py-2 font-medium">Manual</th>
                  <th className="px-3 py-2 font-medium">Fresh</th>
                  <th className="px-3 py-2 font-medium">Text</th>
                  <th className="px-3 py-2 font-medium">Output path</th>
                </tr>
              </thead>
              <tbody>
                {manifestPreview.map((m, i) => (
                  <tr key={i} className="border-b border-slate-50">
                    <td className="px-3 py-2 font-mono font-semibold text-slate-700">{m.record_ref}</td>
                    <td className="px-3 py-2 text-slate-600">{m.source_type}</td>
                    <td className="px-3 py-2 text-slate-600">{m.applied_revision}</td>
                    <td className="px-3 py-2 text-slate-600">{ROUTES[m.routes[0] as keyof typeof ROUTES]?.short}</td>
                    <td className="px-3 py-2 text-slate-600">{m.review_state}</td>
                    <td className="px-3 py-2">{m.manual_override ? <span className="text-purple-600">✎</span> : '—'}</td>
                    <td className="px-3 py-2">{m.analysis_fresh ? <span className="text-emerald-600">✓</span> : <span className="text-amber-600">⚠</span>}</td>
                    <td className="px-3 py-2">{m.has_usable_text ? <span className="text-emerald-600">✓</span> : '—'}</td>
                    <td className="px-3 py-2 font-mono text-slate-500 truncate max-w-xs">{m.output_paths[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Manifest field definitions */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-800 mb-3">Manifest fields</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-200">
              <th className="pb-2 font-medium">Field</th>
              <th className="pb-2 font-medium">Meaning</th>
            </tr>
          </thead>
          <tbody className="text-slate-600">
            {[
              ['source_type', 'call or meeting'],
              ['source_id', 'unique source ID (identity key)'],
              ['record_ref', 'short reading reference (not an identity key)'],
              ['applied_revision', 'last applied source revision'],
              ['routes', 'effective route(s) — manual override takes precedence'],
              ['output_paths', 'relative paths to output files inside the archive'],
              ['review_state', 'intake / routed / reviewed / pending_update'],
              ['manual_override', 'true if the manager manually changed the route'],
              ['analysis_fresh', 'true if analysis reflects the current source revision'],
              ['has_usable_text', 'true if the record has a usable transcript'],
            ].map(([field, meaning]) => (
              <tr key={field} className="border-b border-slate-50">
                <td className="py-1.5 font-mono text-slate-700 font-medium">{field}</td>
                <td className="py-1.5">{meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
