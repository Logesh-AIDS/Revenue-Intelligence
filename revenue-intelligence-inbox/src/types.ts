// ============================================================================
// Core type definitions for RevMaker
// ============================================================================

/** A source delivery batch (the JSON envelope) */
export interface ImportBatch {
  batch_id: string;
  revision: number;
  exported_at: string;
  records: SourceRecord[];
}

/** A single source record as received in a delivery */
export interface SourceRecord {
  record_ref: string;
  source_type: 'call' | 'meeting';
  source_id: string;
  payload: CallPayload | MeetingPayload;
  transcript_payload: MeetingTranscript | null;
}

/** Call metadata fields (see DATA_DICTIONARY.md) */
export interface CallPayload {
  id: string;
  external_call_id: string;
  workspace_slug: string;
  rep_email: string | null;
  rep_name: string | null;
  rep_user_id: string | null;
  direction: string;
  direction_raw: string;
  from_number: string | null;
  to_number: string | null;
  started_at: string;
  duration_seconds: number;
  talk_time_seconds: number | null;
  speaker_count: number | null;
  segment_count: number | null;
  is_connected: boolean | null;
  is_conversation: boolean | null;
  observed_outcome: string | null;
  classification_reason: string | null;
  classification_status: string | null;
  is_campaign_call: boolean | null;
  first_dial_ever: boolean | null;
  first_connect_ever: boolean | null;
  prior_dials_ever: number | null;
  prior_connects_ever: number | null;
  summary: string | null;
  summary_status: string | null;
  transcript: string | null;
}

/** Meeting metadata fields (see DATA_DICTIONARY.md) */
export interface MeetingPayload {
  id: string;
  title: string;
  starts_at: string;
  ends_at: string;
  duration_seconds: number;
  provider: string;
  join_url: string;
  organizer_email: string | null;
  attendee_count: number | null;
  recording_status: string;
  recording_detail: string | null;
  recording_id: string | null;
  has_transcript: boolean;
  has_video: boolean;
  summary: string | null;
  summary_status: string | null;
  redacted: boolean;
}

/** Meeting transcript response */
export interface MeetingTranscript {
  meeting_id: string;
  turns: TranscriptTurn[];
  unavailable_reason: string | null;
}

export interface TranscriptTurn {
  speaker: string;
  starts_at_seconds: number;
  timecode: string;
  text: string;
}

// ============================================================================
// Application state — derived from source but kept separate
// ============================================================================

/** A record in the application store (source + candidate-derived state) */
export interface StoredRecord {
  // Source identity
  source_type: 'call' | 'meeting';
  source_id: string;
  record_ref: string;

  // Source data (replaced wholesale on newer revision)
  payload: CallPayload | MeetingPayload;
  transcript_payload: MeetingTranscript | null;

  // Applied revision tracking
  applied_revision: number;

  // Candidate-derived processing state
  routes: RouteAssignment;
  manual_route: RouteKey | null;
  manual_route_at: string | null;
  review_state: ReviewState;
  analysis: ConversationAnalysis | null;
  analysis_revision: number | null; // revision the analysis was prepared against
  import_batch: string;
  last_updated: string;
}

export type RouteKey =
  | 'sales_coaching'
  | 'deal_followup'
  | 'customer_success'
  | 'partnership'
  | 'vendor_evaluation'
  | 'internal'
  | 'intake_required';

export interface RouteAssignment {
  suggested: RouteKey;
  reason: string;
}

export type ReviewState =
  | 'intake'        // not yet reviewed
  | 'routed'        // auto-routed, awaiting manager confirmation
  | 'reviewed'      // manager has reviewed
  | 'pending_update'; // source changed, analysis is stale

/** Pre-generated analysis for a conversation with usable text */
export interface ConversationAnalysis {
  summary: string;
  significance: string;
  evidence: EvidenceItem[];
  limitations: string;
  nextSteps: NextStep[];
  generated: 'pre-generated' | 'runtime';
}

export interface EvidenceItem {
  /** For meetings: turn number (1-based). For calls: short exact quote. */
  reference: string;
  passage: string;
  note: string;
}

export interface NextStep {
  action: string;
  owner: string;
}

// ============================================================================
// Import log
// ============================================================================

export interface ImportLogEntry {
  timestamp: string;
  batch_id: string;
  revision: number;
  action: 'initial' | 'duplicate_skipped' | 'updated' | 'new' | 'ignored_older';
  record_ref: string;
  source_type: string;
  source_id: string;
  detail: string;
}

// ============================================================================
// Routing category metadata
// ============================================================================

export interface RouteMeta {
  key: RouteKey;
  label: string;
  short: string;
  description: string;
  color: string;
  icon: string;
  exportFolder: string;
}

// ============================================================================
// Export manifest
// ============================================================================

export interface ManifestEntry {
  source_type: string;
  source_id: string;
  record_ref: string;
  applied_revision: number;
  routes: string[];
  output_paths: string[];
  review_state: string;
  manual_override: boolean;
  analysis_fresh: boolean;
  has_usable_text: boolean;
}
