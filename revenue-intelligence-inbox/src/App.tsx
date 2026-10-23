import { useState, useEffect, useCallback, useMemo } from 'react';
import type { StoredRecord, ImportBatch, RouteKey } from './types';
import {
  loadState,
  saveState,
  importBatch,
  setManualRoute,
  resetState,
  getAllRecords,
  getRecordCount,
  hasUsableText,
  effectiveRoute,
} from './lib/store';
import { computeMetrics } from './lib/metrics';
import initialBatch from './data/01_initial.json';
import updateBatch from './data/02_update.json';
import Dashboard from './components/Dashboard';
import ConversationList from './components/ConversationList';
import RecordDetail from './components/RecordDetail';
import ImportPanel from './components/ImportPanel';
import ManagerBrief from './components/ManagerBrief';
import ExportPanel from './components/ExportPanel';
import AboutPanel from './components/AboutPanel';
import FilterBar from './components/FilterBar';

type View = 'dashboard' | 'conversations' | 'detail' | 'import' | 'brief' | 'export' | 'about';

interface AppState {
  records: Record<string, StoredRecord>;
  importLog: any[];
}

export interface Filters {
  person: string;
  sourceType: string;
  route: string;
  textOnly: boolean;
}

const EMPTY_FILTERS: Filters = { person: '', sourceType: '', route: '', textOnly: false };

export default function App() {
  const [state, setState] = useState<AppState>(loadState);
  const [view, setView] = useState<View>('dashboard');
  const [selectedRecordKey, setSelectedRecordKey] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [autoLoaded, setAutoLoaded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Auto-load both batches on first visit
  useEffect(() => {
    if (Object.keys(state.records).length === 0 && !autoLoaded) {
      setAutoLoaded(true);
      let s: AppState = state;
      s = importBatch(s, initialBatch as ImportBatch).state;
      s = importBatch(s, updateBatch as ImportBatch).state;
      setState(s);
      saveState(s);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const allRecords = useMemo(() => getAllRecords(state), [state]);
  const recordCount = useMemo(() => getRecordCount(state), [state]);

  // Full metrics (unfiltered — for sidebar + when no filters active)
  const fullMetrics = useMemo(() => computeMetrics(allRecords), [allRecords]);

  // Filtered records — shared across dashboard and conversation list
  const filteredRecords = useMemo(() => {
    return allRecords.filter((r) => {
      if (filters.sourceType && r.source_type !== filters.sourceType) return false;
      if (filters.route && effectiveRoute(r) !== filters.route) return false;
      if (filters.textOnly && !hasUsableText(r)) return false;
      if (filters.person) {
        if (r.source_type === 'call') {
          const p = r.payload as any;
          if ((p.rep_name || p.rep_email || '') !== filters.person) return false;
        } else {
          const p = r.payload as any;
          if ((p.organizer_email || '') !== filters.person) return false;
        }
      }
      return true;
    });
  }, [allRecords, filters]);

  // Filtered metrics — what the dashboard actually displays
  const filteredMetrics = useMemo(() => computeMetrics(filteredRecords), [filteredRecords]);

  const hasActiveFilters = filters.person || filters.sourceType || filters.route || filters.textOnly;

  const handleImport = useCallback((batch: ImportBatch) => {
    setState((prev) => {
      const result = importBatch(prev, batch);
      saveState(result.state);
      return result.state;
    });
  }, []);

  const handleReset = useCallback(() => {
    const fresh = resetState();
    setState(fresh);
    saveState(fresh);
    setView('import');
  }, []);

  const handleDemoLoad = useCallback(() => {
    let s = resetState();
    s = importBatch(s, initialBatch as ImportBatch).state;
    s = importBatch(s, updateBatch as ImportBatch).state;
    setState(s);
    saveState(s);
  }, []);

  const handleRouteChange = useCallback(
    (source_type: string, source_id: string, route: RouteKey | null) => {
      setState((prev) => {
        const updated = setManualRoute(prev, source_type, source_id, route);
        saveState(updated);
        return updated;
      });
    },
    [],
  );

  const handleSelectRecord = useCallback((key: string) => {
    setSelectedRecordKey(key);
    setView('detail');
    setSidebarOpen(false);
  }, []);

  // Navigation helper that clears filters when going to a fresh view
  const handleNavigate = useCallback((v: View) => {
    setView(v);
    setSidebarOpen(false);
    if (v === 'dashboard') {
      // Keep filters — user might want to see filtered dashboard
    }
  }, []);

  const selectedRecord = selectedRecordKey ? state.records[selectedRecordKey] : null;

  const navItems: { key: View; label: string; icon: string }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: '📊' },
    { key: 'conversations', label: 'Conversations', icon: '💬' },
    { key: 'brief', label: 'Manager Brief', icon: '📋' },
    { key: 'import', label: 'Import / Replay', icon: '📥' },
    { key: 'export', label: 'Exports', icon: '📦' },
    { key: 'about', label: 'Metrics & Definitions', icon: 'ℹ️' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-xs font-bold">RM</div>
          <span className="font-semibold text-sm">RevMaker</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-xl">☰</button>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-20" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`w-64 flex-shrink-0 bg-slate-900 text-slate-300 flex flex-col fixed md:relative z-30 h-full transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="px-5 py-5 border-b border-slate-700 hidden md:block">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-sm shadow-lg">
              RM
            </div>
            <div>
              <div className="text-white font-semibold text-sm leading-tight">RevMaker</div>
              <div className="text-slate-400 text-xs">Revenue Intelligence · SpendNest</div>
            </div>
          </div>
        </div>
        <div className="px-5 py-3 md:hidden border-b border-slate-700">
          <span className="text-white font-semibold text-sm">Menu</span>
        </div>

        <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => handleNavigate(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                view === item.key || (item.key === 'conversations' && view === 'detail')
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
              {item.key === 'conversations' && hasActiveFilters && (
                <span className="ml-auto text-xs bg-brand-500 text-white px-1.5 rounded-full">
                  {filteredRecords.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-slate-700 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Source records</span>
            <span className="text-white font-semibold">{recordCount}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>With usable text</span>
            <span className="text-white font-semibold">{fullMetrics.usableTextCount}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Manual overrides</span>
            <span className="text-white font-semibold">{fullMetrics.manualOverrideCount}</span>
          </div>
          {recordCount === 0 && (
            <button
              onClick={handleDemoLoad}
              className="w-full mt-2 px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-lg"
            >
              Load demo data
            </button>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto pt-14 md:pt-0">
        {/* Shared filter bar — visible on dashboard and conversations views */}
        {(view === 'dashboard' || view === 'conversations') && (
          <FilterBar
            filters={filters}
            setFilters={setFilters}
            allRecords={allRecords}
            filteredCount={filteredRecords.length}
            totalCount={recordCount}
            onClear={() => setFilters(EMPTY_FILTERS)}
          />
        )}

        {view === 'dashboard' && (
          <Dashboard
            metrics={filteredMetrics}
            fullMetrics={fullMetrics}
            isFiltered={!!hasActiveFilters}
            filters={filters}
            setFilters={setFilters}
            records={filteredRecords}
            onSelectRecord={handleSelectRecord}
            onNavigate={handleNavigate}
          />
        )}
        {view === 'conversations' && (
          <ConversationList
            records={filteredRecords}
            allRecords={allRecords}
            filters={filters}
            setFilters={setFilters}
            onSelectRecord={handleSelectRecord}
            recordCount={recordCount}
            onNavigate={handleNavigate}
          />
        )}
        {view === 'detail' && selectedRecord && (
          <RecordDetail
            record={selectedRecord}
            onRouteChange={handleRouteChange}
            onBack={() => handleNavigate('conversations')}
            allRecords={filteredRecords}
            onSelectRecord={handleSelectRecord}
          />
        )}
        {view === 'brief' && <ManagerBrief />}
        {view === 'import' && (
          <ImportPanel
            state={state}
            onImport={handleImport}
            onReset={handleReset}
            onDemoLoad={handleDemoLoad}
            recordCount={recordCount}
          />
        )}
        {view === 'export' && <ExportPanel records={allRecords} />}
        {view === 'about' && <AboutPanel />}
        {view === 'detail' && !selectedRecord && (
          <div className="p-8 text-slate-500">No record selected.</div>
        )}
      </main>
    </div>
  );
}
