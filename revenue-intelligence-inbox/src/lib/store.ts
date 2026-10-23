import type {
  StoredRecord,
  SourceRecord,
  ImportBatch,
  ImportLogEntry,
  RouteKey,
  ReviewState,
} from '../types';
import { computeSuggestedRoute, getAnalysis } from './routing';
import { ANALYSIS } from './analysis';

const STORAGE_KEY = 'rii_state_v1';
const LOG_KEY = 'rii_import_log_v1';

interface PersistState {
  records: Record<string, StoredRecord>; // key = `${source_type}:${source_id}`
  importLog: ImportLogEntry[];
}

function recordKey(source_type: string, source_id: string): string {
  return `${source_type}:${source_id}`;
}

function nowISO(): string {
  return new Date().toISOString();
}

/** Build a StoredRecord from a fresh SourceRecord */
function buildStoredRecord(
  src: SourceRecord,
  revision: number,
  batchId: string,
  isFirstImport: boolean,
  existing?: StoredRecord,
): StoredRecord {
  const key = recordKey(src.source_type, src.source_id);
  const hasText = hasUsableText(src);
  const suggested = computeSuggestedRoute(src);
  const analysis = getAnalysis(src, revision);
  const analysisRevision = analysis ? revision : null;

  // Preserve manual route if it exists
  const manualRoute = existing?.manual_route ?? null;
  const manualRouteAt = existing?.manual_route_at ?? null;

  // Determine review state
  let reviewState: ReviewState;
  if (existing) {
    if (existing.applied_revision < revision) {
      // Source revision changed. If we have a fresh pre-generated analysis
      // for the new text, mark as 'routed' (auto-suggested, awaiting review).
      // If no analysis exists, mark as 'pending_update' (stale).
      // Either way, the freshness indicator makes the state clear.
      if (existing.manual_route) {
        reviewState = 'reviewed';
      } else if (analysis) {
        reviewState = 'routed';
      } else {
        reviewState = 'pending_update';
      }
    } else {
      reviewState = existing.review_state;
    }
  } else {
    reviewState = hasText ? 'routed' : 'intake';
  }

  return {
    source_type: src.source_type,
    source_id: src.source_id,
    record_ref: src.record_ref,
    payload: src.payload,
    transcript_payload: src.transcript_payload,
    applied_revision: revision,
    routes: suggested,
    manual_route: manualRoute,
    manual_route_at: manualRouteAt,
    review_state: reviewState,
    analysis,
    analysis_revision: analysisRevision,
    import_batch: batchId,
    last_updated: nowISO(),
  };
}

/** Check if a record has usable supplied text */
export function hasUsableText(src: SourceRecord | StoredRecord): boolean {
  if (src.source_type === 'call') {
    const p = src.payload as any;
    return !!(p.transcript && p.transcript.trim().length > 0);
  } else {
    const tp = src.transcript_payload;
    if (!tp || !tp.turns || tp.turns.length === 0) return false;
    return tp.turns.some((t) => t.text && t.text.trim().length > 0);
  }
}

// ============================================================================
// Import logic — the core replay/dedup/update engine
// ============================================================================

export function importBatch(
  state: PersistState,
  batch: ImportBatch,
): { state: PersistState; log: ImportLogEntry[] } {
  const newRecords = { ...state.records };
  const log: ImportLogEntry[] = [];
  const ts = nowISO();
  const isInitial = Object.keys(state.records).length === 0;

  for (const src of batch.records) {
    const key = recordKey(src.source_type, src.source_id);
    const existing = newRecords[key];
    const incomingRev = batch.revision;

    if (!existing) {
      // New record
      const stored = buildStoredRecord(src, incomingRev, batch.batch_id, isInitial);
      newRecords[key] = stored;
      log.push({
        timestamp: ts,
        batch_id: batch.batch_id,
        revision: incomingRev,
        action: isInitial ? 'initial' : 'new',
        record_ref: src.record_ref,
        source_type: src.source_type,
        source_id: src.source_id,
        detail: `Imported as new record (rev ${incomingRev})`,
      });
    } else if (incomingRev > existing.applied_revision) {
      // Newer revision — full replace of source payload + transcript
      const stored = buildStoredRecord(src, incomingRev, batch.batch_id, false, existing);
      newRecords[key] = stored;
      const textNow = hasUsableText(stored);
      const textBefore = hasUsableText(existing);
      const detail = textNow && !textBefore
        ? `Updated to rev ${incomingRev} — usable text now available`
        : `Updated to rev ${incomingRev}`;
      log.push({
        timestamp: ts,
        batch_id: batch.batch_id,
        revision: incomingRev,
        action: 'updated',
        record_ref: src.record_ref,
        source_type: src.source_type,
        source_id: src.source_id,
        detail,
      });
    } else {
      // Same or older revision — ignore (no duplicate)
      log.push({
        timestamp: ts,
        batch_id: batch.batch_id,
        revision: incomingRev,
        action: incomingRev === existing.applied_revision ? 'duplicate_skipped' : 'ignored_older',
        record_ref: src.record_ref,
        source_type: src.source_type,
        source_id: src.source_id,
        detail: `Skipped — existing rev ${existing.applied_revision} >= incoming rev ${incomingRev}`,
      });
    }
  }

  return { state: { records: newRecords, importLog: [...state.importLog, ...log] }, log };
}

// ============================================================================
// Manual route correction
// ============================================================================

export function setManualRoute(
  state: PersistState,
  source_type: string,
  source_id: string,
  route: RouteKey | null,
): PersistState {
  const key = recordKey(source_type, source_id);
  const rec = state.records[key];
  if (!rec) return state;

  const updated: StoredRecord = {
    ...rec,
    manual_route: route,
    manual_route_at: route ? nowISO() : null,
    review_state: route ? 'reviewed' : rec.review_state,
    last_updated: nowISO(),
  };

  return {
    ...state,
    records: { ...state.records, [key]: updated },
  };
}

export function setReviewState(
  state: PersistState,
  source_type: string,
  source_id: string,
  reviewState: ReviewState,
): PersistState {
  const key = recordKey(source_type, source_id);
  const rec = state.records[key];
  if (!rec) return state;

  return {
    ...state,
    records: { ...state.records, [key]: { ...rec, review_state: reviewState, last_updated: nowISO() } },
  };
}

/** Get the effective route (manual override takes precedence over suggested) */
export function effectiveRoute(rec: StoredRecord): RouteKey {
  return rec.manual_route ?? rec.routes.suggested;
}

export function isManualOverride(rec: StoredRecord): boolean {
  return rec.manual_route !== null;
}

// ============================================================================
// Persistence
// ============================================================================

export function loadState(): PersistState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PersistState;
      if (parsed.records && parsed.importLog) return parsed;
    }
  } catch {
    // ignore corrupt state
  }
  return { records: {}, importLog: [] };
}

export function saveState(state: PersistState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage may be full; best-effort
  }
}

export function clearState(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(LOG_KEY);
}

export function resetState(): PersistState {
  clearState();
  return { records: {}, importLog: [] };
}

export function getAllRecords(state: PersistState): StoredRecord[] {
  return Object.values(state.records).sort((a, b) => {
    // Sort: text records first, then by record_ref
    const aText = hasUsableText(a);
    const bText = hasUsableText(b);
    if (aText !== bText) return aText ? -1 : 1;
    return a.record_ref.localeCompare(b.record_ref, undefined, { numeric: true });
  });
}

export function getRecordCount(state: PersistState): number {
  return Object.keys(state.records).length;
}

export { recordKey };
