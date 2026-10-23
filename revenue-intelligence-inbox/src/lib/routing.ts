import type {
  SourceRecord,
  StoredRecord,
  RouteKey,
  RouteAssignment,
  ConversationAnalysis,
} from '../types';
import { ANALYSIS } from './analysis';
import { hasUsableText } from './store';

// ============================================================================
// Routing engine — computes the suggested route for each record.
//
// Rules (applied in order):
// 1. No usable supplied text → intake_required
// 2. Has a pre-generated analysis → use its route
// 3. Fallback → intake_required
//
// The manual override always takes precedence (handled in store.ts).
// ============================================================================

export function computeSuggestedRoute(src: SourceRecord | StoredRecord): RouteAssignment {
  if (!hasUsableText(src)) {
    return {
      suggested: 'intake_required',
      reason: 'No usable supplied text. Needs human review to determine if further action is required.',
    };
  }

  const id = src.source_id;
  const pre = ANALYSIS[id];
  if (pre) {
    return { suggested: pre.route, reason: pre.routeReason };
  }

  return {
    suggested: 'intake_required',
    reason: 'Text is present but no pre-generated analysis exists. Needs human review.',
  };
}

/** Get the pre-generated analysis for a record at a given revision */
export function getAnalysis(
  src: SourceRecord | StoredRecord,
  revision: number,
): ConversationAnalysis | null {
  if (!hasUsableText(src)) return null;
  const pre = ANALYSIS[src.source_id];
  if (!pre) return null;
  return pre.analysis;
}

/** Check if a record's analysis reflects its current source revision */
export function isAnalysisFresh(rec: StoredRecord): boolean {
  if (!rec.analysis) return true; // no analysis = fresh (nothing to be stale)
  return rec.analysis_revision === rec.applied_revision;
}
