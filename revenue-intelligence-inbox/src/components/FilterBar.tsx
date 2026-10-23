import type { StoredRecord } from '../types';
import { effectiveRoute } from '../lib/store';
import { ROUTE_LIST } from '../lib/routes';
import type { Filters } from '../App';

interface Props {
  filters: Filters;
  setFilters: (f: Filters) => void;
  allRecords: StoredRecord[];
  filteredCount: number;
  totalCount: number;
  onClear: () => void;
}

export default function FilterBar({ filters, setFilters, allRecords, filteredCount, totalCount, onClear }: Props) {
  const hasFilters = filters.person || filters.sourceType || filters.route || filters.textOnly;

  // Build person options from all records (not filtered)
  const personOptions = Array.from(
    new Set(
      allRecords.map((r) => {
        if (r.source_type === 'call') {
          const p = r.payload as any;
          return p.rep_name || p.rep_email || '';
        }
        return (r.payload as any).organizer_email || '';
      }).filter(Boolean),
    ),
  ).sort();

  return (
    <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-4 md:px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-wrap gap-2 md:gap-3 items-center">
        {/* Active filter count badge */}
        {hasFilters ? (
          <div className="flex items-center gap-1.5 bg-brand-50 border border-brand-200 rounded-lg px-2.5 py-1.5">
            <span className="text-xs font-semibold text-brand-700">{filteredCount}/{totalCount}</span>
            <span className="text-xs text-brand-500">filtered</span>
          </div>
        ) : (
          <span className="text-xs font-medium text-slate-400 px-2">All {totalCount} records</span>
        )}

        {/* Person filter */}
        <select
          value={filters.person}
          onChange={(e) => setFilters({ ...filters, person: e.target.value })}
          className={`text-sm border rounded-lg px-3 py-1.5 bg-white cursor-pointer transition-colors ${
            filters.person ? 'border-brand-400 bg-brand-50 text-brand-700' : 'border-slate-300 hover:border-slate-400'
          }`}
        >
          <option value="">All people</option>
          {personOptions.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        {/* Source type filter */}
        <select
          value={filters.sourceType}
          onChange={(e) => setFilters({ ...filters, sourceType: e.target.value })}
          className={`text-sm border rounded-lg px-3 py-1.5 bg-white cursor-pointer transition-colors ${
            filters.sourceType ? 'border-brand-400 bg-brand-50 text-brand-700' : 'border-slate-300 hover:border-slate-400'
          }`}
        >
          <option value="">All types</option>
          <option value="call">Calls</option>
          <option value="meeting">Meetings</option>
        </select>

        {/* Route filter */}
        <select
          value={filters.route}
          onChange={(e) => setFilters({ ...filters, route: e.target.value })}
          className={`text-sm border rounded-lg px-3 py-1.5 bg-white cursor-pointer transition-colors ${
            filters.route ? 'border-brand-400 bg-brand-50 text-brand-700' : 'border-slate-300 hover:border-slate-400'
          }`}
        >
          <option value="">All routes</option>
          {ROUTE_LIST.map((r) => (
            <option key={r.key} value={r.key}>{r.icon} {r.label}</option>
          ))}
        </select>

        {/* Text only toggle */}
        <button
          onClick={() => setFilters({ ...filters, textOnly: !filters.textOnly })}
          className={`text-sm px-3 py-1.5 rounded-lg border cursor-pointer transition-colors ${
            filters.textOnly
              ? 'border-brand-400 bg-brand-50 text-brand-700 font-medium'
              : 'border-slate-300 text-slate-600 hover:border-slate-400'
          }`}
        >
          {filters.textOnly ? '✓ ' : ''}Text only
        </button>

        {/* Clear button */}
        {hasFilters && (
          <button
            onClick={onClear}
            className="text-sm text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            ✕ Clear all
          </button>
        )}
      </div>
    </div>
  );
}
