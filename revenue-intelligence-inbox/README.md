# Revenue Intelligence Inbox

A workspace that helps a sales manager review calls and meetings, understand activity, route conversations to the right analysis, and decide what needs attention. Built for the SpendNest Revenue Intelligence Inbox assignment.

## Quick start

```bash
cd revenue-intelligence-inbox
npm install
npm run dev
```

Open http://localhost:5173 in your browser. The app auto-loads both data batches on first visit and opens in the post-update state (44 records, 18 with usable text).

### Build for production / deployment

```bash
npm run build
npm run preview
```

The `dist/` folder contains static files. Deploy it to any static host:

**Quickest (Netlify Drop, no account needed for one-off):**
1. Run `npm run build`
2. Open https://app.netlify.com/drop in your browser
3. Drag the `dist/` folder onto the page
4. You get an instant public URL

**Vercel:**
```bash
npm i -g vercel
vercel --prod
```

**surge.sh:**
```bash
npm i -g surge
surge dist
```

**GitHub Pages:** push the `dist/` folder to a `gh-pages` branch.

The app uses `base: './'` so it works at any path, including opening `dist/index.html` directly as a file.

## How to reproduce the replay checks

The app auto-loads both batches. To test the full replay sequence from a clean state:

1. Go to **Import / Replay** in the sidebar.
2. Click **Reset (clean start)** — all records are cleared from localStorage.
3. Click **Import 01_initial.json** — 44 records load (17 with usable text).
4. Click **Import reversed** — the same batch with records in reverse order. All 44 are skipped as duplicates (same revision). Record count stays 44.
5. Go to **Conversations**, find **M07** (Willowfield Trust), click it, and change its route (e.g. to Customer Success). The correction is saved to localStorage.
6. Go back to **Import / Replay**, click **Import 02_update.json** — M07 gets its late transcript (27 turns). Record count stays 44. M07's manual route is preserved.
7. Click **Import initial again** — revision 1 is older than M07's applied revision 2, so it's ignored. No changes.
8. **Refresh the browser** (Cmd+R). M07's manual route and updated text survive in localStorage.

Alternatively, click **Demo load (both batches)** to jump straight to the post-update state.

## Where outputs are written

Go to **Exports** in the sidebar and click **Generate & download export (.zip)**. The ZIP contains:

```
exports/
  sales-coaching/       — calls needing rep technique feedback
  deal-followup/        — active pipeline with agreed next steps
  customer-success/     — existing customer support and onboarding
  partnership/          — channel partnership development
  vendor-evaluation/    — SpendNest evaluating a supplier
  internal/             — internal meetings and training
  intake-required/      — no usable text, needs human review
  manager-brief-2026-08-21.md
manifest.json
manifest.csv
README.md
```

The manifest (JSON and CSV) identifies: source_type, source_id, record_ref, applied_revision, routes, output_paths, review_state, manual_override, analysis_fresh, has_usable_text.

## Metric definitions

Full definitions are in the app under **Metrics & Definitions** (sidebar). Key ones:

- **Selected records**: distinct (source_type, source_id) after applying revisions. Not name, record_ref, or array position.
- **Usable text coverage**: nonblank call transcript or ≥1 nonblank meeting turn, divided by selected records. Shown separately for calls and meetings.
- **Source-reported connection rate**: calls with is_connected=true ÷ calls with non-null is_connected. Stored metric, not ground truth. Unknown count shown separately.
- **Routing distribution**: candidate-derived routes, one per record. Manual overrides take precedence.
- **Activity by person**: call reps (rep_name/rep_email) distinguished from meeting organisers (organizer_email).

## Pre-generated vs runtime

**Pre-generated:** The 18 conversations with usable text have differentiated, evidence-backed analysis prepared by reading each transcript. Each analysis cites evidence (meeting turn numbers or call quotes), states what the evidence does not establish, and assigns next-step ownership when stated. The manager brief for 21 August 2026 is also pre-generated.

**Runtime:** The app computes metrics, routing suggestions, import/dedup/update logic, export generation, and manifest creation at runtime. Source labels (observed_outcome, classification_status) are displayed as stored, not treated as ground truth.

**No-text records:** The 26 records without usable text are flagged for intake review. They are not given fabricated analysis. A missing transcript does not establish that a conversation never happened.

**Update handling:** When a source revision changes (like M07), the app applies the newer source data, checks whether a pre-generated analysis exists for the new text, and marks the review state accordingly. No automatic AI call is made. The analysis freshness indicator shows whether the analysis reflects the current source revision.

## Three important findings

### 1. Price transparency eroded trust in an active deal (M03)

**What I noticed:** The Asterloom Systems customer caught a price increase from INR 26,000 to INR 39,000. The rep had bundled a one-time setup charge into the recurring subscription without disclosing it. The customer explicitly called this out — M03, Turn 23: *"But you previously told me INR 26,000. Why has that become INR 39,000?"* The rep clarified (Turn 24), but the initial conflation damaged credibility. The customer also discovered the cards are prepaid, not credit (Turn 6), which is a potential deal-breaker. The customer explicitly asked for details before another call (Turn 36).

**Where it affected the product:** The M03 record detail view shows this evidence under "Supporting evidence" with a jump-to-turn link. The manager brief flags M03 as high priority. The route is "deal_followup" with next steps: "Send proposal with clear, itemised price breakdown — no bundled numbers" and "Do NOT push for a follow-up call." Screen: Record Detail for M03 → Analysis → Supporting evidence items 1 and 2. Manager Brief → "Needs attention — high priority."

### 2. M07's late-arriving transcript reveals an urgent production issue (M07)

**What I noticed:** M07 (Willowfield Trust) initially had no transcript — the unavailable reason said "Transcript not included in this delivery; a later assessment batch supplies it." After the update batch, 27 turns revealed a customer support session with four bugs, the most urgent being payments stuck in "Processing" after release — M07, Turn 19: *"The payments appear to have been released but are stuck showing Processing. I expect an update or resolution in an hour or two."* Without the update batch, this issue would be invisible. The rep also found workarounds for the other bugs but correctly noted that a workaround does not mean the issue is resolved (Turn 15).

**Where it affected the product:** M07's route is "customer_success" and its analysis flags the Processing-stuck issue as urgent. The Import panel specifically tracks M07's status (text availability, applied revision, route, review state). The manager brief lists M07 as high priority. The export manifest shows M07 with applied_revision 2 and analysis_fresh=true. Screen: Import Panel → M07 status card. Record Detail for M07 → Analysis. Manager Brief → "Needs attention — high priority."

### 3. A referral pathway with a hard anonymity constraint (C09)

**What I noticed:** In C09, the prospect (Vedant) declined the product but pointed to the business head Mr Rishabh on a professional networking site. Critically, when asked if the rep could mention his name, Vedant said: *"No, please don't use my name."* This creates a referral constraint: the rep can contact Rishabh but must NOT name Vedant. If another rep contacts Rishabh and names Vedant, it could damage the relationship. This is a compliance/integrity issue, not just a sales tactic. The account is large (130 locations).

**Where it affected the product:** C09's analysis explicitly flags this constraint under "Next steps": "Contact Mr Rishabh via professional networking — WITHOUT naming Vedant. Frame as independent outreach." And: "Flag the anonymity constraint in the CRM so no other rep names Vedant." The route reason notes the "Critical constraint: prospect asked NOT to be named." The manager brief lists this under "Follow-up actions." Screen: Record Detail for C09 → Analysis → Next steps. Manager Brief → "Follow-up actions" → C09.

## One decision I deliberately rejected

**Alternative considered:** Generating analysis at runtime using an LLM API call for each conversation. This would allow the app to produce fresh analysis when M07's transcript arrived in the update batch, and to re-analyze any conversation after a route change.

**Why I rejected it:**
1. The assignment says "Never include API keys or credentials in your submission." A runtime LLM call requires an API key either embedded in the client (insecure) or via a backend (adds infrastructure).
2. The assignment says "Pre-generated analysis is allowed" and "Updated content does not have to trigger a paid AI service." M07's update is a known fixture — I can pre-generate its analysis.
3. Runtime analysis would make the replay test non-deterministic (different output each run), harder for reviewers to verify consistency.

**Trade-off I accepted:** When a source revision changes, the app marks the review state as "routed" or "pending_update" and shows a freshness indicator, rather than silently regenerating analysis. The manager can see whether the analysis reflects the current source revision. The pre-generated analysis for M07 is available, but the app makes clear it was pre-generated, not computed from the runtime update. The resulting choice: the "Analysis freshness" indicator in Record Detail and the `analysis_fresh` field in the manifest.

## Approximate time spent

Approximately 7 hours: 1 hour reading and understanding the data package, 1 hour designing the routing taxonomy and analysis, 3 hours building the app, 1 hour writing pre-generated analysis and the manager brief, 1 hour on README, slides, and verification.

## Known limitations

- No authentication, live CRM integration, or real-time AI analysis.
- Pre-generated analysis covers the 18 conversations with usable text; if new conversations with text were added at runtime (beyond the supplied data), they would be routed to "intake_required" for human review.
- localStorage has a ~5MB limit; sufficient for 44 records but not designed for large-scale use.
- No cross-meeting speaker directory; speaker labels are local to each meeting.
- Pipeline value, deal outcomes, and account links are not invented. Opportunity signals are reported from conversation evidence only.
- The app is a static SPA; exports are generated client-side and downloaded as a ZIP.

## Tech stack

- React 18 + TypeScript + Vite 6
- Tailwind CSS 3
- JSZip for export archive generation
- localStorage for persistence (no backend required)

## Screen recording

The assignment requires a three-minute narrated screen recording. To create it:
1. Run `npm run dev` and open the app
2. Go to Import/Replay → Reset → Import initial → Import reversed → Open M07 and change its route → Import update → Import initial again → Refresh browser
3. Show the dashboard, open a conversation detail (e.g. M03 for the difficult routing decision), and explain one metric, one routing decision, and the duplicate/update test
4. Record with Cmd+Shift+5 (macOS built-in screen recording) or any screen capture tool

## Slides

The five slides are in `slides.html`. Open it in a browser and print to PDF (Cmd+P → Save as PDF). The slides include the three findings, the rejected decision, routing design, verification approach, and trade-offs.
