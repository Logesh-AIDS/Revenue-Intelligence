import type { StoredRecord, RouteKey } from '../types';
import { hasUsableText, effectiveRoute } from './store';
import { ROUTES } from './routes';

export interface DashboardMetrics {
  totalRecords: number;
  totalCalls: number;
  totalMeetings: number;
  usableTextCount: number;
  coveragePct: number;
  callTextCount: number;
  callCoveragePct: number;
  meetingTextCount: number;
  meetingCoveragePct: number;
  connectedCount: number;
  connectedDenominator: number;
  connectionRatePct: number;
  connectionUnknownCount: number;
  routeCounts: Record<string, number>;
  reviewStateCounts: Record<string, number>;
  manualOverrideCount: number;
  personActivity: PersonActivity[];
}

export interface PersonActivity {
  person: string;
  role: 'call_rep' | 'meeting_organizer';
  calls: number;
  meetings: number;
  textRecords: number;
  records: StoredRecord[];
}

export function computeMetrics(records: StoredRecord[]): DashboardMetrics {
  const totalRecords = records.length;
  const calls = records.filter((r) => r.source_type === 'call');
  const meetings = records.filter((r) => r.source_type === 'meeting');
  const totalCalls = calls.length;
  const totalMeetings = meetings.length;

  const usableText = records.filter((r) => hasUsableText(r));
  const usableTextCount = usableText.length;
  const coveragePct = totalRecords > 0 ? (usableTextCount / totalRecords) * 100 : 0;

  const callText = calls.filter((r) => hasUsableText(r));
  const meetingText = meetings.filter((r) => hasUsableText(r));
  const callTextCount = callText.length;
  const meetingTextCount = meetingText.length;
  const callCoveragePct = totalCalls > 0 ? (callTextCount / totalCalls) * 100 : 0;
  const meetingCoveragePct = totalMeetings > 0 ? (meetingTextCount / totalMeetings) * 100 : 0;

  // Source-reported connection rate (calls only, per DATA_DICTIONARY)
  const callsWithConnInfo = calls.filter((r) => (r.payload as any).is_connected !== null);
  const connectedDenominator = callsWithConnInfo.length;
  const connectedCount = callsWithConnInfo.filter((r) => (r.payload as any).is_connected === true).length;
  const connectionRatePct = connectedDenominator > 0 ? (connectedCount / connectedDenominator) * 100 : 0;
  const connectionUnknownCount = calls.filter((r) => (r.payload as any).is_connected === null).length;

  // Route distribution
  const routeCounts: Record<string, number> = {};
  for (const rec of records) {
    const route = effectiveRoute(rec);
    routeCounts[route] = (routeCounts[route] || 0) + 1;
  }

  // Review state distribution
  const reviewStateCounts: Record<string, number> = {};
  for (const rec of records) {
    reviewStateCounts[rec.review_state] = (reviewStateCounts[rec.review_state] || 0) + 1;
  }

  // Manual overrides
  const manualOverrideCount = records.filter((r) => r.manual_route !== null).length;

  // Person activity
  const personMap = new Map<string, PersonActivity>();

  for (const rec of calls) {
    const p = (rec.payload as any);
    const name = p.rep_name || p.rep_email || 'Unknown';
    if (!personMap.has(name)) {
      personMap.set(name, { person: name, role: 'call_rep', calls: 0, meetings: 0, textRecords: 0, records: [] });
    }
    const pa = personMap.get(name)!;
    pa.calls++;
    if (hasUsableText(rec)) pa.textRecords++;
    pa.records.push(rec);
  }

  for (const rec of meetings) {
    const p = (rec.payload as any);
    const name = p.organizer_email || 'Unknown';
    const existing = personMap.get(name);
    if (existing) {
      existing.meetings++;
      if (hasUsableText(rec)) existing.textRecords++;
      existing.records.push(rec);
    } else {
      personMap.set(name, {
        person: name,
        role: 'meeting_organizer',
        calls: 0,
        meetings: 1,
        textRecords: hasUsableText(rec) ? 1 : 0,
        records: [rec],
      });
    }
  }

  const personActivity = Array.from(personMap.values()).sort((a, b) => {
    const aTotal = a.calls + a.meetings;
    const bTotal = b.calls + b.meetings;
    return bTotal - aTotal;
  });

  return {
    totalRecords,
    totalCalls,
    totalMeetings,
    usableTextCount,
    coveragePct,
    callTextCount,
    callCoveragePct,
    meetingTextCount,
    meetingCoveragePct,
    connectedCount,
    connectedDenominator,
    connectionRatePct,
    connectionUnknownCount,
    routeCounts,
    reviewStateCounts,
    manualOverrideCount,
    personActivity,
  };
}

/** Format a record_ref + source_type for display */
export function recordDisplayLabel(rec: StoredRecord): string {
  if (rec.source_type === 'call') {
    const p = rec.payload as any;
    return `${rec.record_ref} — ${p.rep_name || p.rep_email || 'Unknown rep'}`;
  }
  const p = rec.payload as any;
  return `${rec.record_ref} — ${p.title || 'Untitled meeting'}`;
}

/** Get the effective route metadata */
export function getRouteMeta(route: RouteKey) {
  return ROUTES[route];
}
