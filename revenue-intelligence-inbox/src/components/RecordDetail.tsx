import { useState, useRef, useEffect } from 'react';
import type { StoredRecord, RouteKey } from '../types';
import { hasUsableText, effectiveRoute, isManualOverride } from '../lib/store';
import { isAnalysisFresh } from '../lib/routing';
import { ROUTES, ROUTE_LIST } from '../lib/routes';

interface Props {
  record: StoredRecord;
  onRouteChange: (source_type: string, source_id: string, route: RouteKey | null) => void;
  onBack: () => void;
  allRecords: StoredRecord[];
  onSelectRecord: (key: string) => void;
}

export default function RecordDetail({ record, onRouteChange, onBack, allRecords, onSelectRecord }: Props) {
  const [showRaw, setShowRaw] = useState(false);
  const [highlightedTurn, setHighlightedTurn] = useState<number | null>(null);
  const turnRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const route = effectiveRoute(record);
  const meta = ROUTES[route];
  const hasText = hasUsableText(record);
  const manual = isManualOverride(record);
  const fresh = isAnalysisFresh(record);

  // Navigation
  const currentIndex = allRecords.findIndex(
    (r) => r.source_type === record.source_type && r.source_id === record.source_id,
  );
  const prevRecord = currentIndex > 0 ? allRecords[currentIndex - 1] : null;
  const nextRecord = currentIndex < allRecords.length - 1 ? allRecords[currentIndex + 1] : null;

  const scrollToTurn = (turnNum: number) => {
    setHighlightedTurn(turnNum);
    const el = turnRefs.current[turnNum];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => setHighlightedTurn(null), 2000);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1">
            ← Back to list
          </button>
          <span className="text-slate-300">|</span>
          <h1 className="text-lg font-bold text-slate-800 font-mono">{record.record_ref}</h1>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            record.source_type === 'call' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
          }`}>
            {record.source_type}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {prevRecord && (
            <button
              onClick={() => onSelectRecord(`${prevRecord.source_type}:${prevRecord.source_id}`)}
              className="text-sm text-slate-500 hover:text-slate-700 px-2 py-1 rounded border border-slate-200"
            >
              ← {prevRecord.record_ref}
            </button>
          )}
          {nextRecord && (
            <button
              onClick={() => onSelectRecord(`${nextRecord.source_type}:${nextRecord.source_id}`)}
              className="text-sm text-slate-500 hover:text-slate-700 px-2 py-1 rounded border border-slate-200"
            >
              {nextRecord.record_ref} →
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left column: metadata + route */}
        <div className="space-y-4">
          {/* Metadata card */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-800 text-sm mb-3">Source metadata</h3>
            <MetadataTable record={record} />
          </div>

          {/* Route card */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-800 text-sm">Route assignment</h3>
              {manual && (
                <span className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-0.5 rounded-full">
                  ✎ Manually corrected
                </span>
              )}
            </div>

            {/* Current route */}
            <div className="mb-3 p-3 rounded-lg" style={{ background: `${meta.color}10` }}>
              <div className="flex items-center gap-2">
                <span className="text-lg">{meta.icon}</span>
                <span className="font-semibold text-slate-800">{meta.label}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1.5">
                {manual ? record.manual_route && ROUTES[record.manual_route].description : meta.description}
              </p>
            </div>

            {/* Route correction */}
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Change route</p>
              {ROUTE_LIST.map((r) => (
                <button
                  key={r.key}
                  onClick={() => onRouteChange(record.source_type, record.source_id, r.key)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left ${
                    route === r.key
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-base">{r.icon}</span>
                  <span className="font-medium">{r.short}</span>
                  {route === r.key && manual && <span className="ml-auto text-xs">✎</span>}
                </button>
              ))}
              {manual && (
                <button
                  onClick={() => onRouteChange(record.source_type, record.source_id, null)}
                  className="w-full text-xs text-slate-400 hover:text-slate-600 py-1.5 text-center"
                >
                  Reset to auto-suggested ({ROUTES[record.routes.suggested].short})
                </button>
              )}
            </div>

            {/* Suggested vs effective */}
            {manual && (
              <div className="mt-3 pt-3 border-t border-slate-100">
                <div className="text-xs text-slate-400">Auto-suggested: {ROUTES[record.routes.suggested].label}</div>
                <div className="text-xs text-purple-600">Manual override: {ROUTES[record.manual_route!].label}</div>
                {record.manual_route_at && (
                  <div className="text-xs text-slate-400 mt-1">Changed at: {new Date(record.manual_route_at).toLocaleString()}</div>
                )}
              </div>
            )}
          </div>

          {/* Review state */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-800 text-sm mb-3">Review state</h3>
            <div className="text-sm text-slate-600 capitalize">{record.review_state.replace('_', ' ')}</div>
            {!fresh && record.analysis && (
              <div className="mt-2 text-xs text-amber-600 bg-amber-50 px-2 py-1.5 rounded">
                ⚠ Analysis reflects source revision {record.analysis_revision}, but current source is revision {record.applied_revision}. Analysis needs review.
              </div>
            )}
            <div className="mt-2 text-xs text-slate-400">
              Source revision: {record.applied_revision} · Import batch: {record.import_batch}
            </div>
          </div>
        </div>

        {/* Middle + right: transcript and analysis */}
        <div className="lg:col-span-2 space-y-4">
          {/* Title / context */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h2 className="text-lg font-bold text-slate-800">
              {record.source_type === 'call'
                ? `Call — ${(record.payload as any).rep_name || (record.payload as any).rep_email || 'Unknown rep'}`
                : (record.payload as any).title || 'Untitled meeting'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {record.source_type === 'call'
                ? `${(record.payload as any).direction} · ${(record.payload as any).started_at} · ${formatDuration((record.payload as any).duration_seconds)}`
                : `${(record.payload as any).starts_at} → ${(record.payload as any).ends_at} · ${(record.payload as any).recording_status}`}
            </p>
          </div>

          {hasText && record.analysis ? (
            <>
              {/* Analysis */}
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-800">Analysis</h3>
                  <span className="text-xs text-slate-400">
                    {record.analysis.generated === 'pre-generated' ? 'Pre-generated' : 'Runtime'} · Rev {record.analysis_revision}
                  </span>
                </div>

                <AnalysisSection title="What happened" content={record.analysis.summary} />
                <AnalysisSection title="Why it matters" content={record.analysis.significance} />

                {/* Evidence */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">Supporting evidence</h4>
                  <div className="space-y-2">
                    {record.analysis.evidence.map((e, i) => {
                      const isMeetingTurn = e.reference.includes('Turn');
                      const turnMatch = e.reference.match(/Turn (\d+)/);
                      return (
                        <div
                          key={i}
                          className="bg-slate-50 rounded-lg p-3 border-l-3"
                          style={{ borderLeft: `3px solid ${meta.color}` }}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-mono font-semibold text-slate-600">{e.reference}</span>
                            {isMeetingTurn && turnMatch && (
                              <button
                                onClick={() => scrollToTurn(parseInt(turnMatch[1]))}
                                className="text-xs text-brand-600 hover:underline"
                              >
                                Jump to turn ↓
                              </button>
                            )}
                          </div>
                          <blockquote className="text-sm text-slate-600 italic border-l-2 border-slate-200 pl-3 my-1">
                            {e.passage}
                          </blockquote>
                          <p className="text-xs text-slate-400 mt-1">{e.note}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <AnalysisSection title="What the evidence does not establish" content={record.analysis.limitations} />

                {/* Next steps */}
                <div className="mb-1">
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">Next steps</h4>
                  <div className="space-y-1.5">
                    {record.analysis.nextSteps.map((s, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-brand-600 mt-0.5">→</span>
                        <div>
                          <span className="text-slate-700">{s.action}</span>
                          <span className="text-slate-400 text-xs ml-2">— Owner: {s.owner}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Transcript */}
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-800">Source transcript</h3>
                  <button
                    onClick={() => setShowRaw(!showRaw)}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    {showRaw ? 'Formatted view' : 'Raw text'}
                  </button>
                </div>

                {record.source_type === 'call' ? (
                  <CallTranscript text={(record.payload as any).transcript} />
                ) : showRaw ? (
                  <pre className="text-sm text-slate-600 whitespace-pre-wrap font-mono">
                    {JSON.stringify(record.transcript_payload, null, 2)}
                  </pre>
                ) : (
                  <MeetingTranscript
                    turns={record.transcript_payload?.turns || []}
                    turnRefs={turnRefs}
                    highlightedTurn={highlightedTurn}
                  />
                )}
              </div>
            </>
          ) : (
            <NoTextCard record={record} />
          )}
        </div>
      </div>
    </div>
  );
}

function AnalysisSection({ title, content }: { title: string; content: string }) {
  return (
    <div className="mb-4">
      <h4 className="text-sm font-semibold text-slate-700 mb-1">{title}</h4>
      <p className="text-sm text-slate-600 leading-relaxed">{content}</p>
    </div>
  );
}

function MeetingTranscript({
  turns,
  turnRefs,
  highlightedTurn,
}: {
  turns: any[];
  turnRefs: React.MutableRefObject<Record<number, HTMLDivElement | null>>;
  highlightedTurn: number | null;
}) {
  if (turns.length === 0) {
    return <p className="text-sm text-slate-400">No turns available.</p>;
  }
  return (
    <div className="space-y-3 max-h-[600px] overflow-y-auto">
      {turns.map((turn, i) => {
        const turnNum = i + 1;
        const isHighlighted = highlightedTurn === turnNum;
        return (
          <div
            key={i}
            ref={(el) => { turnRefs.current[turnNum] = el; }}
            className={`p-3 rounded-lg border ${
              isHighlighted ? 'border-brand-400 bg-brand-50' : 'border-slate-100 bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3 mb-1">
              <span className="text-xs font-mono font-semibold text-slate-400">Turn {turnNum}</span>
              <span className="text-xs text-slate-400">{turn.timecode}</span>
              <span className="text-xs font-medium text-slate-600">{turn.speaker}</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">{turn.text}</p>
          </div>
        );
      })}
    </div>
  );
}

function CallTranscript({ text }: { text: string }) {
  return (
    <div className="bg-slate-50 rounded-lg p-4 max-h-[600px] overflow-y-auto">
      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{text}</p>
    </div>
  );
}

function NoTextCard({ record }: { record: StoredRecord }) {
  const reason = record.transcript_payload?.unavailable_reason;
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
      <div className="text-4xl mb-3">📭</div>
      <h3 className="font-semibold text-slate-700 mb-2">No usable supplied text</h3>
      <p className="text-sm text-slate-500 max-w-md mx-auto">
        This record has no usable transcript. It is flagged for intake review, not given fabricated analysis.
        A missing transcript does not establish that a conversation never happened.
      </p>
      {reason && (
        <div className="mt-4 inline-block bg-amber-50 text-amber-700 text-sm px-4 py-2 rounded-lg">
          <strong>Reason:</strong> {reason}
        </div>
      )}
      {record.source_type === 'call' && (
        <div className="mt-4 text-xs text-slate-400">
          observed_outcome: {(record.payload as any).observed_outcome} · is_connected: {(record.payload as any).is_connected}
        </div>
      )}
    </div>
  );
}

function MetadataTable({ record }: { record: StoredRecord }) {
  if (record.source_type === 'call') {
    const p = record.payload as any;
    const rows: [string, string][] = [
      ['Source ID', record.source_id.slice(0, 12) + '…'],
      ['Rep', `${p.rep_name || '—'} (${p.rep_email || '—'})`],
      ['Direction', `${p.direction} (${p.direction_raw})`],
      ['Started at', p.started_at],
      ['Duration', formatDuration(p.duration_seconds)],
      ['Talk time', p.talk_time_seconds ? formatDuration(p.talk_time_seconds) : '—'],
      ['Connected', String(p.is_connected)],
      ['Conversation', String(p.is_conversation)],
      ['Outcome', p.observed_outcome || '—'],
      ['Campaign', String(p.is_campaign_call)],
      ['First dial', String(p.first_dial_ever)],
      ['Prior dials', String(p.prior_dials_ever)],
      ['Class. status', p.classification_status || '—'],
    ];
    return (
      <div className="space-y-1">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between text-xs">
            <span className="text-slate-400">{k}</span>
            <span className="text-slate-700 font-medium text-right">{v}</span>
          </div>
        ))}
      </div>
    );
  }
  const p = record.payload as any;
  const rows: [string, string][] = [
    ['Source ID', record.source_id.slice(0, 12) + '…'],
    ['Title', p.title],
    ['Organizer', p.organizer_email || '—'],
    ['Starts', p.starts_at],
    ['Ends', p.ends_at],
    ['Duration', formatDuration(p.duration_seconds)],
    ['Provider', p.provider],
    ['Recording', p.recording_status],
    ['Has transcript', String(p.has_transcript)],
    ['Attendees', String(p.attendee_count ?? '—')],
    ['Redacted', String(p.redacted)],
  ];
  return (
    <div className="space-y-1">
      {rows.map(([k, v]) => (
        <div key={k} className="flex justify-between text-xs">
          <span className="text-slate-400">{k}</span>
          <span className="text-slate-700 font-medium text-right max-w-[60%] truncate">{v}</span>
        </div>
      ))}
    </div>
  );
}

function formatDuration(seconds: number): string {
  if (!seconds) return '—';
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}
