import type { DashboardMetrics } from '../lib/metrics';
import type { StoredRecord, RouteKey } from '../types';
import { effectiveRoute } from '../lib/store';
import { ROUTES, ROUTE_LIST } from '../lib/routes';
import type { Filters } from '../App';

interface Props {
  metrics: DashboardMetrics;       // filtered metrics
  fullMetrics: DashboardMetrics;   // unfiltered (for comparison)
  isFiltered: boolean;
  filters: Filters;
  setFilters: (f: Filters) => void;
  records: StoredRecord[];         // filtered records
  onSelectRecord: (key: string) => void;
  onNavigate: (view: any) => void;
}

export default function Dashboard({ metrics, fullMetrics, isFiltered, filters, setFilters, records, onSelectRecord, onNavigate }: Props) {
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            21 August 2026 · Asia/Kolkata · Selected records, not a full-team day
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isFiltered && (
            <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg font-medium">
              Showing {records.length} of {fullMetrics.totalRecords} records
            </span>
          )}
          <button
            onClick={() => onNavigate('conversations')}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            View conversations →
          </button>
        </div>
      </div>

      {/* Metric cards — clickable, filter-aware */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <MetricCard
          label="Selected records"
          value={metrics.totalRecords}
          fullValue={isFiltered ? fullMetrics.totalRecords : null}
          sub={`${metrics.totalCalls} calls · ${metrics.totalMeetings} meetings`}
          hint="Click to view all conversations"
          color="#2563eb"
          onClick={() => onNavigate('conversations')}
        />
        <MetricCard
          label="Usable text"
          value={`${metrics.coveragePct.toFixed(0)}%`}
          fullValue={isFiltered ? `${fullMetrics.coveragePct.toFixed(0)}%` : null}
          sub={`${metrics.usableTextCount} of ${metrics.totalRecords} records`}
          hint="Click to filter text-only"
          color="#10b981"
          onClick={() => setFilters({ ...filters, textOnly: !filters.textOnly })}
          active={filters.textOnly}
        />
        <MetricCard
          label="Connection rate"
          value={metrics.totalCalls > 0 ? `${metrics.connectionRatePct.toFixed(0)}%` : '—'}
          fullValue={isFiltered && fullMetrics.totalCalls > 0 ? `${fullMetrics.connectionRatePct.toFixed(0)}%` : null}
          sub={metrics.totalCalls > 0 ? `${metrics.connectedCount} of ${metrics.connectedDenominator} calls` : 'No calls in filter'}
          hint="Stored metric · not ground truth"
          color="#f59e0b"
        />
        <MetricCard
          label="Route overrides"
          value={metrics.manualOverrideCount}
          fullValue={isFiltered ? fullMetrics.manualOverrideCount : null}
          sub={`${metrics.reviewStateCounts.reviewed || 0} reviewed`}
          hint="Manual vs auto-suggested"
          color="#8b5cf6"
        />
      </div>

      {/* Routing distribution — click bars to filter */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800 text-sm md:text-base">Routing distribution</h3>
          {filters.route && (
            <button
              onClick={() => setFilters({ ...filters, route: '' })}
              className="text-xs text-brand-600 hover:underline"
            >
              ✕ Clear route filter
            </button>
          )}
        </div>
        <div className="space-y-2.5">
          {ROUTE_LIST.map((route) => {
            const count = metrics.routeCounts[route.key] || 0;
            const pct = metrics.totalRecords > 0 ? (count / metrics.totalRecords) * 100 : 0;
            const isActive = filters.route === route.key;
            return (
              <button
                key={route.key}
                onClick={() => setFilters({ ...filters, route: isActive ? '' : route.key })}
                className={`w-full flex items-center gap-2 md:gap-3 group transition-all rounded-lg px-2 py-1 ${
                  isActive ? 'bg-brand-50' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-1.5 md:gap-2 w-28 md:w-44 flex-shrink-0">
                  <span className="text-sm md:text-base">{route.icon}</span>
                  <span className={`text-xs md:text-sm ${isActive ? 'text-brand-700 font-semibold' : 'text-slate-600'}`}>
                    {route.short}
                  </span>
                </div>
                <div className="flex-1 bg-slate-100 rounded-full h-6 overflow-hidden relative">
                  <div
                    className="h-full rounded-full flex items-center justify-end px-2 transition-all duration-300 group-hover:opacity-80"
                    style={{ width: `${Math.max(pct, 3)}%`, background: route.color }}
                  >
                    <span className="text-xs text-white font-semibold">{count}</span>
                  </div>
                </div>
                <span className="text-xs text-slate-400 w-10 text-right">{pct.toFixed(0)}%</span>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-slate-400 mt-3 hidden md:block">
          Click a route to filter. One route per record; manual overrides take precedence.
        </p>
      </div>

      {/* Review state — click to navigate to conversations */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-5">
        <h3 className="font-semibold text-slate-800 text-sm md:text-base mb-4">Review state</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { key: 'intake', label: 'Intake', desc: 'Not yet reviewed', color: '#94a3b8', bg: 'bg-slate-100' },
            { key: 'routed', label: 'Routed', desc: 'Auto-suggested', color: '#3b82f6', bg: 'bg-blue-100' },
            { key: 'reviewed', label: 'Reviewed', desc: 'Manager confirmed', color: '#10b981', bg: 'bg-emerald-100' },
            { key: 'pending_update', label: 'Pending', desc: 'Source changed', color: '#ef4444', bg: 'bg-red-100' },
          ].map((rs) => {
            const count = metrics.reviewStateCounts[rs.key] || 0;
            return (
              <button
                key={rs.key}
                onClick={() => onNavigate('conversations')}
                className="text-left p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all"
              >
                <div className={`inline-block w-2 h-2 rounded-full mb-1.5 ${rs.bg}`} style={{ background: rs.color }} />
                <div className="text-xl md:text-2xl font-bold text-slate-800">{count}</div>
                <div className="text-xs font-medium text-slate-600">{rs.label}</div>
                <div className="text-xs text-slate-400">{rs.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Activity by person — click to filter AND navigate */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-5">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-slate-800 text-sm md:text-base">Activity by person</h3>
          {filters.person && (
            <button
              onClick={() => setFilters({ ...filters, person: '' })}
              className="text-xs text-brand-600 hover:underline"
            >
              ✕ Clear person filter
            </button>
          )}
        </div>
        <p className="text-xs text-slate-500 mb-3 hidden md:block">
          Click a row to filter by person. Call reps are distinguished from meeting organisers.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-200">
                <th className="pb-2 pr-2 font-medium text-xs uppercase tracking-wide">Person</th>
                <th className="pb-2 font-medium text-xs uppercase tracking-wide">Role</th>
                <th className="pb-2 font-medium text-right text-xs uppercase tracking-wide">Calls</th>
                <th className="pb-2 font-medium text-right text-xs uppercase tracking-wide">Meetings</th>
                <th className="pb-2 font-medium text-right text-xs uppercase tracking-wide">Text</th>
                <th className="pb-2 font-medium text-right text-xs uppercase tracking-wide">Total</th>
              </tr>
            </thead>
            <tbody>
              {metrics.personActivity.map((p) => {
                const isActive = filters.person === p.person;
                return (
                  <tr
                    key={p.person}
                    className={`border-b border-slate-50 cursor-pointer clickable transition-colors ${
                      isActive ? 'bg-brand-50' : 'hover:bg-slate-50'
                    }`}
                    onClick={() => {
                      setFilters({ ...filters, person: isActive ? '' : p.person });
                      onNavigate('conversations');
                    }}
                  >
                    <td className="py-2.5 pr-2 font-medium text-slate-700">
                      <span className="flex items-center gap-1.5">
                        {isActive && <span className="text-brand-500">●</span>}
                        {p.person}
                      </span>
                    </td>
                    <td className="py-2.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        p.role === 'call_rep'
                          ? 'bg-blue-50 text-blue-600 border border-blue-100'
                          : 'bg-purple-50 text-purple-600 border border-purple-100'
                      }`}>
                        {p.role === 'call_rep' ? 'Rep' : 'Org'}
                      </span>
                    </td>
                    <td className="py-2.5 text-right text-slate-600">{p.calls}</td>
                    <td className="py-2.5 text-right text-slate-600">{p.meetings}</td>
                    <td className="py-2.5 text-right text-slate-600">{p.textRecords}</td>
                    <td className="py-2.5 text-right font-semibold text-slate-800">{p.calls + p.meetings}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Coverage detail — clickable bars */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-5">
        <h3 className="font-semibold text-slate-800 text-sm md:text-base mb-4">Transcript coverage</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CoverageBar
            label="Calls"
            count={metrics.callTextCount}
            total={metrics.totalCalls}
            pct={metrics.callCoveragePct}
            color="#3b82f6"
            onClick={() => setFilters({ ...filters, sourceType: filters.sourceType === 'call' ? '' : 'call' })}
            active={filters.sourceType === 'call'}
          />
          <CoverageBar
            label="Meetings"
            count={metrics.meetingTextCount}
            total={metrics.totalMeetings}
            pct={metrics.meetingCoveragePct}
            color="#10b981"
            onClick={() => setFilters({ ...filters, sourceType: filters.sourceType === 'meeting' ? '' : 'meeting' })}
            active={filters.sourceType === 'meeting'}
          />
        </div>
      </div>

      {/* Recent conversations — quick preview of filtered records */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-800 text-sm md:text-base">
            {isFiltered ? 'Matching conversations' : 'Conversations with text'}
          </h3>
          <button
            onClick={() => onNavigate('conversations')}
            className="text-xs text-brand-600 hover:underline"
          >
            View all →
          </button>
        </div>
        <div className="space-y-1.5">
          {records
            .filter((r) => {
              const p = r.payload as any;
              return r.source_type === 'call'
                ? p.transcript && p.transcript.trim()
                : r.transcript_payload?.turns && r.transcript_payload.turns.length > 0;
            })
            .slice(0, 6)
            .map((r) => {
              const route = effectiveRoute(r);
              const meta = ROUTES[route];
              const key = `${r.source_type}:${r.source_id}`;
              return (
                <button
                  key={key}
                  onClick={() => onSelectRecord(key)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors text-left group"
                >
                  <span className="font-mono text-xs font-semibold text-slate-500 w-8 flex-shrink-0">{r.record_ref}</span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                    style={{ background: `${meta.color}20`, color: meta.color }}
                  >
                    {meta.icon} {meta.short}
                  </span>
                  <span className="text-sm text-slate-600 truncate flex-1">
                    {r.source_type === 'call'
                      ? (r.payload as any).rep_name || (r.payload as any).rep_email || 'Unknown'
                      : (r.payload as any).title || 'Untitled'}
                  </span>
                  <span className="text-slate-300 group-hover:text-brand-500 text-xs transition-colors flex-shrink-0">→</span>
                </button>
              );
            })}
          {records.filter((r) => {
            const p = r.payload as any;
            return r.source_type === 'call'
              ? p.transcript && p.transcript.trim()
              : r.transcript_payload?.turns && r.transcript_payload.turns.length > 0;
          }).length === 0 && (
            <p className="text-sm text-slate-400 text-center py-4">No conversations with text match the current filters.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label, value, fullValue, sub, hint, color, onClick, active,
}: {
  label: string;
  value: string | number;
  fullValue: string | number | null;
  sub: string;
  hint: string;
  color: string;
  onClick?: () => void;
  active?: boolean;
}) {
  const Comp = onClick ? 'button' : 'div';
  return (
    <Comp
      onClick={onClick}
      className={`bg-white rounded-xl border p-3 md:p-4 text-left transition-all w-full ${
        onClick ? 'hover:shadow-md hover:border-slate-300 cursor-pointer' : ''
      } ${active ? 'border-brand-400 ring-2 ring-brand-100' : 'border-slate-200'}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1 h-7 rounded-full" style={{ background: color }} />
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-xl md:text-2xl font-bold text-slate-800">{value}</span>
        {fullValue !== null && fullValue !== undefined && (
          <span className="text-xs text-slate-400 line-through">{fullValue}</span>
        )}
      </div>
      <div className="text-xs md:text-sm text-slate-500 mt-1">{sub}</div>
      <div className="text-xs text-slate-400 mt-1 hidden md:block">{hint}</div>
    </Comp>
  );
}

function CoverageBar({
  label, count, total, pct, color, onClick, active,
}: {
  label: string;
  count: number;
  total: number;
  pct: number;
  color: string;
  onClick: () => void;
  active: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-left p-3 rounded-lg border transition-all ${
        active ? 'border-brand-400 ring-2 ring-brand-100' : 'border-slate-100 hover:border-slate-300'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-600">{label}</span>
        <span className="text-sm text-slate-500">
          {count}/{total}
          <span className="text-slate-400 ml-1">({pct.toFixed(0)}%)</span>
        </span>
      </div>
      <div className="bg-slate-100 rounded-full h-3 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </button>
  );
}
