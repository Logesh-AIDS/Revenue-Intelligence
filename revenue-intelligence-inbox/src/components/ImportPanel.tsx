import { useState } from 'react';
import type { ImportBatch } from '../types';
import { getRecordCount, hasUsableText, effectiveRoute } from '../lib/store';
import initialBatch from '../data/01_initial.json';
import updateBatch from '../data/02_update.json';
import { ROUTES } from '../lib/routes';

interface Props {
  state: any;
  onImport: (batch: ImportBatch) => void;
  onReset: () => void;
  onDemoLoad: () => void;
  recordCount: number;
}

export default function ImportPanel({ state, onImport, onReset, onDemoLoad, recordCount }: Props) {
  const [replayLog, setReplayLog] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setReplayLog((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleImportInitial = () => {
    onImport(initialBatch as ImportBatch);
    addLog(`Imported initial batch (revision 1, 44 records). Record count: ${getRecordCount(state)}`);
  };

  const handleImportInitialShuffled = () => {
    const batch = { ...(initialBatch as any) };
    batch.records = [...batch.records].reverse();
    onImport(batch);
    addLog('Imported initial batch again (reversed order, revision 1). Same/older revision → all skipped as duplicates. No record count change.');
  };

  const handleImportUpdate = () => {
    onImport(updateBatch as ImportBatch);
    addLog('Imported update batch (revision 2, 1 record: M07). M07 updated — usable text now available. Record count unchanged.');
  };

  const handleReset = () => {
    onReset();
    setReplayLog([]);
    addLog('State reset. All records cleared.');
  };

  const handleDemoLoad = () => {
    onDemoLoad();
    setReplayLog([]);
    addLog('Demo load: imported both batches (initial rev 1 + update rev 2). App is now in post-update state.');
  };

  const textCount = Object.values(state.records as any).filter((r: any) => hasUsableText(r as any)).length;
  const m07 = Object.values(state.records as any).find(
    (r: any) => r.record_ref === 'M07',
  ) as any;
  const m07Route = m07 ? ROUTES[effectiveRoute(m07)] : null;
  const m07Manual = m07?.manual_route !== null && m07?.manual_route !== undefined;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Import & Replay</h1>
        <p className="text-sm text-slate-500 mt-1">
          Identity is the pair (source_type, source_id). Same or older revisions are ignored. Manual route decisions survive updates.
        </p>
      </div>

      {/* Current state summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-slate-800">{recordCount}</div>
          <div className="text-xs text-slate-500 mt-1">Unique records</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-slate-800">{textCount}</div>
          <div className="text-xs text-slate-500 mt-1">Usable text (18 after update)</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-slate-800">{state.importLog?.length || 0}</div>
          <div className="text-xs text-slate-500 mt-1">Import log entries</div>
        </div>
      </div>

      {/* M07 status (key test record) */}
      {m07 && (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h3 className="font-semibold text-slate-800 text-sm mb-2">M07 (Willowfield Trust) — key test record</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Usable text:</span>{' '}
              <span className={hasUsableText(m07) ? 'text-emerald-600 font-medium' : 'text-slate-500'}>
                {hasUsableText(m07) ? '✓ Available (27 turns)' : '✗ Not yet'}
              </span>
            </div>
            <div>
              <span className="text-slate-400">Applied revision:</span>{' '}
              <span className="text-slate-700 font-medium">{m07.applied_revision}</span>
            </div>
            <div>
              <span className="text-slate-400">Route:</span>{' '}
              <span className="text-slate-700 font-medium">{m07Route?.label}</span>{' '}
              {m07Manual && <span className="text-purple-600 text-xs">(manually corrected)</span>}
            </div>
            <div>
              <span className="text-slate-400">Review state:</span>{' '}
              <span className="text-slate-700 font-medium">{m07.review_state.replace('_', ' ')}</span>
            </div>
          </div>
        </div>
      )}

      {/* Replay steps */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-800 mb-3">Replay steps (per DATA_CONTRACT.md)</h3>
        <div className="space-y-3">
          <ReplayStep
            num={1}
            title="Initial import"
            desc="Import the initial batch (revision 1, 44 records)."
            action="Import 01_initial.json"
            onAction={handleImportInitial}
          />
          <ReplayStep
            num={2}
            title="Repeat import (reversed order)"
            desc="Import the same batch again with records reversed. No duplicates, no inflated counts."
            action="Import reversed"
            onAction={handleImportInitialShuffled}
          />
          <ReplayStep
            num={3}
            title="Manual correction"
            desc="Go to M07 in Conversations, change its route. The correction is saved to localStorage."
            action="Open conversations →"
            onAction={() => {}}
            isLink
          />
          <ReplayStep
            num={4}
            title="Update import"
            desc="Import the update batch (revision 2). M07 gets its late transcript without adding a second conversation."
            action="Import 02_update.json"
            onAction={handleImportUpdate}
          />
          <ReplayStep
            num={5}
            title="Preserve judgment"
            desc="Import initial again (revision 1, older than applied revision 2 → ignored). Refresh the browser. M07's manual route and updated text survive."
            action="Import initial again"
            onAction={handleImportInitial}
          />
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex gap-3">
        <button
          onClick={handleDemoLoad}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg"
        >
          Demo load (both batches)
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg border border-red-200"
        >
          Reset (clean start)
        </button>
      </div>

      {/* Activity log */}
      <div className="bg-slate-900 rounded-xl p-4 max-h-64 overflow-y-auto">
        <h4 className="text-xs text-slate-400 font-medium mb-2 uppercase tracking-wide">Activity log</h4>
        {replayLog.length === 0 ? (
          <p className="text-xs text-slate-500">No actions yet. Use the replay steps above.</p>
        ) : (
          <div className="space-y-1">
            {replayLog.map((line, i) => (
              <div key={i} className="text-xs text-slate-300 font-mono">{line}</div>
            ))}
          </div>
        )}
      </div>

      {/* Import log from state */}
      {state.importLog && state.importLog.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h4 className="text-sm font-semibold text-slate-700 mb-2">Import log ({state.importLog.length} entries)</h4>
          <div className="max-h-48 overflow-y-auto space-y-1">
            {state.importLog.slice(-20).map((entry: any, i: number) => (
              <div key={i} className="text-xs flex items-center gap-2 py-1 border-b border-slate-50">
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                  entry.action === 'initial' ? 'bg-blue-100 text-blue-600' :
                  entry.action === 'updated' ? 'bg-emerald-100 text-emerald-600' :
                  entry.action === 'duplicate_skipped' ? 'bg-slate-100 text-slate-500' :
                  entry.action === 'ignored_older' ? 'bg-amber-100 text-amber-600' :
                  'bg-slate-100 text-slate-500'
                }`}>
                  {entry.action.replace('_', ' ')}
                </span>
                <span className="font-mono text-slate-600">{entry.record_ref}</span>
                <span className="text-slate-400 truncate">{entry.detail}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ReplayStep({
  num,
  title,
  desc,
  action,
  onAction,
  isLink,
}: {
  num: number;
  title: string;
  desc: string;
  action: string;
  onAction: () => void;
  isLink?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
      <div className="w-7 h-7 rounded-full bg-brand-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
        {num}
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium text-slate-800">{title}</div>
        <div className="text-xs text-slate-500 mt-0.5">{desc}</div>
      </div>
      <button
        onClick={onAction}
        className={`text-sm px-3 py-1.5 rounded-lg font-medium flex-shrink-0 ${
          isLink
            ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            : 'bg-brand-50 text-brand-600 hover:bg-brand-100 border border-brand-200'
        }`}
      >
        {action}
      </button>
    </div>
  );
}
