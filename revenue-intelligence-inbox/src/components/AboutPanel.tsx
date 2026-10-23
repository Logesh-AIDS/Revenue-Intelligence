export default function AboutPanel() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Metrics & Definitions</h1>
        <p className="text-sm text-slate-500 mt-1">
          Every headline number has a defined denominator, a stated period, and a note on whether missing information affects it.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <h3 className="font-semibold text-slate-800">Metric definitions</h3>

        {[
          {
            name: 'Selected records',
            def: 'Count of distinct (source_type, source_id) after applying revisions. Identity is the pair, not name, record_ref, or array position.',
            denom: 'All records in the store after dedup.',
            period: '21 August 2026 (Asia/Kolkata). All supplied activity falls on one local date.',
            caveats: 'This is a deliberately selected sample, not a full-team day or representative performance ranking. Do not treat the API search total as the count in this package.',
          },
          {
            name: 'Usable text coverage',
            def: 'Records with a nonblank call transcript or at least one nonblank meeting turn, divided by selected source records.',
            denom: 'Selected records in the same filter scope. Shown separately for calls and meetings.',
            period: 'Same as above.',
            caveats: 'A missing transcript does not prove a conversation never happened. Background calls (B01–B20) have null text by design. 4 meetings were recorded but nobody spoke; 2 had the notetaker cancelled; 1 had no notetaker scheduled.',
          },
          {
            name: 'Source-reported connection rate',
            def: 'Calls with is_connected=true divided by calls with non-null is_connected. This is a stored upstream classification, not independent ground truth.',
            denom: 'Calls with non-null is_connected (30 in this dataset). Unknown count shown separately.',
            period: 'Same as above.',
            caveats: 'It may disagree with other fields. Two connected calls (B11, B14) were classified as "unresponsive" — connected but no substantive conversation. A transcript-based assessment is a different measure over the smaller text-covered subset. Do not silently combine them.',
          },
          {
            name: 'Routing distribution',
            def: 'Count of records per candidate-derived route. One route per record. Manual overrides take precedence over auto-suggested routes.',
            denom: 'All 44 records.',
            period: 'Same as above.',
            caveats: 'Route counts reflect the app\'s routing policy, not stored labels. If a record could have multiple routes, the primary route is shown. The app supports manual correction.',
          },
          {
            name: 'Activity by person',
            def: 'Calls grouped by rep_name/rep_email. Meetings grouped by organizer_email. Call reps are distinguished from meeting organisers.',
            denom: 'Records per person.',
            period: 'Same as above.',
            caveats: 'An organiser is not automatically the salesperson or an attendee. No staff-role directory is supplied. No cross-meeting speaker directory exists — speaker labels are local to each meeting.',
          },
          {
            name: 'Manual route overrides',
            def: 'Count of records where the manager manually changed the route from the auto-suggested value.',
            denom: 'All 44 records.',
            period: 'Current session, persisted in localStorage.',
            caveats: 'A manual override survives a source update (the manual route is preserved) and a browser refresh (localStorage). Resetting the app clears all overrides.',
          },
        ].map((m) => (
          <div key={m.name} className="border-b border-slate-100 pb-4 last:border-0">
            <h4 className="text-sm font-semibold text-slate-700 mb-1">{m.name}</h4>
            <div className="space-y-1 text-sm text-slate-600">
              <p><span className="text-slate-400">Definition:</span> {m.def}</p>
              <p><span className="text-slate-400">Denominator:</span> {m.denom}</p>
              <p><span className="text-slate-400">Period:</span> {m.period}</p>
              <p><span className="text-slate-400">Caveats:</span> {m.caveats}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-800 mb-3">Routing taxonomy</h3>
        <div className="space-y-2 text-sm">
          <p className="text-slate-500 text-xs mb-2">
            Candidate-derived categories. A conversation may need one destination, several destinations, or a human decision. The manager can correct any route.
          </p>
          {[
            ['🎯 Sales Coaching', 'Calls where rep technique needs manager feedback — pushing past clear signals, competitive handling, or data quality issues.'],
            ['💼 Deal Follow-up', 'Active pipeline conversations where a prospect showed interest or a next step was agreed. Includes referral pathways.'],
            ['🤝 Customer Success', 'Existing customers needing support, onboarding, account management, or bug escalations.'],
            ['🔗 Partnership', 'Channel partnership development — advisory firms, referral arrangements, commission structures.'],
            ['🔍 Vendor Evaluation', 'SpendNest evaluating a supplier or vendor for its own product — strategic build/buy decisions.'],
            ['📋 Internal / Training', 'Internal meetings and training sessions — not customer-facing.'],
            ['📥 Intake Required', 'No usable supplied text. Needs human review to determine if further action is required.'],
          ].map(([label, desc]) => (
            <div key={label} className="flex gap-3">
              <span className="font-medium text-slate-700 w-44 flex-shrink-0">{label}</span>
              <span className="text-slate-600">{desc}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-800 mb-3">Analysis approach</h3>
        <div className="text-sm text-slate-600 space-y-2">
          <p>
            <span className="font-medium text-slate-700">Pre-generated analysis:</span> The 18 conversations with usable text have pre-generated analysis prepared by reading each transcript. Each analysis is differentiated — no generic summaries. Analysis cites evidence with meeting turn numbers or call quotes, states what the evidence does not establish, and assigns next-step ownership when stated.
          </p>
          <p>
            <span className="font-medium text-slate-700">Runtime computation:</span> The application computes metrics, routing suggestions, import/dedup logic, and export generation at runtime. Source labels (observed_outcome, classification_status) are displayed as stored, not treated as ground truth.
          </p>
          <p>
            <span className="font-medium text-slate-700">No-text records:</span> The 26 records without usable text are flagged for intake review. They are not given fabricated analysis. A missing transcript does not establish that a conversation never happened.
          </p>
          <p>
            <span className="font-medium text-slate-700">Source vs. candidate data:</span> Source fields (payload, transcript_payload) are kept separate from candidate-derived state (routes, analysis, review state). A newer source revision replaces source data wholesale but preserves manual route decisions.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-800 mb-3">Key limitations</h3>
        <ul className="text-sm text-slate-600 space-y-1.5 list-disc pl-5">
          <li>No CRM opportunity table, authoritative deal value, full account history, or confirmed staff-role directory is supplied.</li>
          <li>Pipeline value, deal outcomes, and account links are not invented. Opportunity signals and supported next steps are reported from conversation evidence only.</li>
          <li>Monetary amounts in conversation text keep their stated units; no comparable opportunity-value table exists to normalise them.</li>
          <li>No cross-meeting speaker directory exists — speaker labels like "Team member A" are local to each meeting, not cross-meeting identities.</li>
          <li>Phone-call text has no trustworthy turn timing; evidence is cited by short exact quote with record_ref.</li>
          <li>The data is de-identified and adapted; it is not a verbatim export. Do not attempt to identify original people or publish the dataset.</li>
        </ul>
      </div>
    </div>
  );
}
