import type { StoredRecord } from '../types';
import { hasUsableText, effectiveRoute, isManualOverride } from '../lib/store';
import { ROUTES, ROUTE_LIST } from '../lib/routes';
import type { Filters } from '../App';

interface Props {
  records: StoredRecord[];
  allRecords: StoredRecord[];
  filters: Filters;
  setFilters: (f: Filters) => void;
  onSelectRecord: (key: string) => void;
  recordCount: number;
  onNavigate: (view: any) => void;
}

export default function ConversationList({
  records, allRecords, filters, setFilters, onSelectRecord, recordCount, onNavigate,
}: Props) {
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800">Conversations</h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            {records.length} of {recordCount} records · Click any row to inspect evidence and analysis
          </p>
        </div>
        <button
          onClick={() => onNavigate('dashboard')}
          className="text-sm text-brand-600 hover:underline self-start"
        >
          ← Back to dashboard
        </button>
      </div>

      {/* Table — responsive: becomes card list on mobile */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left text-slate-500 border-b border-slate-200">
                <th className="px-4 py-3 font-medium">Ref</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Title / Rep</th>
                <th className="px-4 py-3 font-medium">Route</th>
                <th className="px-4 py-3 font-medium">Text</th>
                <th className="px-4 py-3 font-medium">State</th>
              </tr>
            </thead>
            <tbody>
              {records.map((rec) => (
                <RecordRow key={`${rec.source_type}:${rec.source_id}`} rec={rec} onSelectRecord={onSelectRecord} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-slate-100">
          {records.map((rec) => (
            <MobileRecordCard key={`${rec.source_type}:${rec.source_id}`} rec={rec} onSelectRecord={onSelectRecord} />
          ))}
        </div>

        {records.length === 0 && (
          <div className="p-8 text-center">
            <div className="text-3xl mb-2">🔍</div>
            <p className="text-sm text-slate-400">No records match the current filters.</p>
            <button
              onClick={() => setFilters({ person: '', sourceType: '', route: '', textOnly: false })}
              className="mt-3 text-sm text-brand-600 hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function RecordRow({ rec, onSelectRecord }: { rec: StoredRecord; onSelectRecord: (key: string) => void }) {
  const route = effectiveRoute(rec);
  const meta = ROUTES[route];
  const hasText = hasUsableText(rec);
  const manual = isManualOverride(rec);
  const key = `${rec.source_type}:${rec.source_id}`;

  return (
    <tr
      onClick={() => onSelectRecord(key)}
      className="border-b border-slate-100 hover:bg-blue-50 cursor-pointer clickable transition-colors"
    >
      <td className="px-4 py-3">
        <span className="font-mono font-semibold text-slate-700">{rec.record_ref}</span>
        {manual && <span className="ml-1 text-xs text-purple-600" title="Manually corrected">✎</span>}
      </td>
      <td className="px-4 py-3">
        <span className={`text-xs px-2 py-0.5 rounded-full ${
          rec.source_type === 'call' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
        }`}>
          {rec.source_type}
        </span>
      </td>
      <td className="px-4 py-3 text-slate-700">
        {rec.source_type === 'call'
          ? (rec.payload as any).rep_name || (rec.payload as any).rep_email || 'Unknown'
          : (rec.payload as any).title || 'Untitled'}
      </td>
      <td className="px-4 py-3">
        <span
          className="text-xs px-2 py-1 rounded-full font-medium cursor-pointer"
          style={{ background: `${meta.color}20`, color: meta.color }}
        >
          {meta.icon} {meta.short}
        </span>
      </td>
      <td className="px-4 py-3">
        {hasText
          ? <span className="text-emerald-600 text-xs font-medium">✓ Available</span>
          : <span className="text-slate-400 text-xs">— None</span>}
      </td>
      <td className="px-4 py-3"><StateBadge state={rec.review_state} /></td>
    </tr>
  );
}

function MobileRecordCard({ rec, onSelectRecord }: { rec: StoredRecord; onSelectRecord: (key: string) => void }) {
  const route = effectiveRoute(rec);
  const meta = ROUTES[route];
  const hasText = hasUsableText(rec);
  const manual = isManualOverride(rec);
  const key = `${rec.source_type}:${rec.source_id}`;

  return (
    <button
      onClick={() => onSelectRecord(key)}
      className="w-full p-3 text-left hover:bg-slate-50 transition-colors"
    >
      <div className="flex items-center justify-between mb-1">
        <span className="font-mono font-semibold text-slate-700 text-sm">{rec.record_ref}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full ${
          rec.source_type === 'call' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
        }`}>
          {rec.source_type}
        </span>
      </div>
      <div className="text-sm text-slate-600 mb-2 truncate">
        {rec.source_type === 'call'
          ? (rec.payload as any).rep_name || (rec.payload as any).rep_email || 'Unknown'
          : (rec.payload as any).title || 'Untitled'}
      </div>
      <div className="flex items-center gap-2">
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ background: `${meta.color}20`, color: meta.color }}
        >
          {meta.icon} {meta.short}
          {manual && ' ✎'}
        </span>
        {hasText
          ? <span className="text-emerald-600 text-xs">✓ Text</span>
          : <span className="text-slate-400 text-xs">No text</span>}
        <StateBadge state={rec.review_state} />
      </div>
    </button>
  );
}

function StateBadge({ state }: { state: string }) {
  const styles: Record<string, string> = {
    intake: 'bg-slate-100 text-slate-500',
    routed: 'bg-blue-100 text-blue-600',
    reviewed: 'bg-emerald-100 text-emerald-600',
    pending_update: 'bg-amber-100 text-amber-600',
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${styles[state] || styles.intake}`}>
      {state.replace('_', ' ')}
    </span>
  );
}
