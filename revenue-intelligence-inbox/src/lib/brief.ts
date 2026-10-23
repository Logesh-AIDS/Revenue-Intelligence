// ============================================================================
// Manager Brief for 21 August 2026 (Asia/Kolkata)
// Pre-generated. Reviews all 18 supplied conversations after applying the
// update. Fixed to this date — does not react to dashboard filters.
// ============================================================================

export interface BriefSection {
  heading: string;
  items: BriefItem[];
}

export interface BriefItem {
  recordRef: string;
  title: string;
  text: string;
  evidence?: string;
  priority?: 'high' | 'medium' | 'low';
}

export const MANAGER_BRIEF: {
  intro: string;
  sections: BriefSection[];
} = {
  intro:
    '21 August 2026, Asia/Kolkata. This brief brings together the day\'s activity, important conversations, coaching priorities, and follow-up actions. It reviews all 18 supplied conversations (after applying the update batch) and references source evidence. Every one of the 44 records has an intake or review state; records without usable text are flagged for intake, not given substantive analysis.',
  sections: [
    {
      heading: 'Activity at a glance',
      items: [
        {
          recordRef: '',
          title: '44 selected source records',
          text: '30 calls and 14 meetings. 18 have usable supplied text (10 calls, 8 meetings). The remaining 26 have no usable text — 20 background calls with null transcripts, 4 meetings recorded but nobody spoke, 2 with the notetaker cancelled, and 1 with no notetaker scheduled. Coverage is 40.9% overall (33.3% for calls, 57.1% for meetings).',
        },
        {
          recordRef: '',
          title: 'Source-reported connection rate',
          text: '12 of 30 calls have is_connected=true (40%). All 30 calls have a non-null is_connected value, so the denominator is 30 with 0 unknown. This is a stored classification metric, not an independent ground-truth measure. Note: 2 of those connected calls (B11, B14) were classified as "unresponsive" — connected but no substantive conversation.',
        },
        {
          recordRef: '',
          title: 'Routing distribution',
          text: '7 deal follow-up, 5 sales coaching, 3 customer success, 2 partnership, 1 vendor evaluation, 1 internal/training, 26 intake required. Route counts are based on candidate-derived routing, not stored labels.',
        },
      ],
    },
    {
      heading: 'Needs attention — high priority',
      items: [
        {
          recordRef: 'M07',
          title: 'Willowfield Trust — 4 bugs, one urgent',
          text: 'Customer support session with four issues. The most urgent: reimbursement payments are stuck showing "Processing" after release (M07, Turn 19). The rep committed to an update within 1–2 hours. Three other bugs: description-edit not saving, attachment upload failing from "Recreate payment" (workaround found), and "Mark as paid" carrying the previous amount forward. All need engineering investigation.',
          evidence: 'M07, Turn 19: "The payments appear to have been released but are stuck showing Processing."',
          priority: 'high',
        },
        {
          recordRef: 'M09',
          title: 'Brookmint Holdings — login token expired twice',
          text: 'Onboarding session where the login invitation for Brookmint Holdings expired again, even after a fresh reset was sent (M09, Turn 21). The customer also raised a valid permission-design concern: a shared accounts mailbox would give the AP officer admin access, which they do not want (M09, Turn 17). Engineering needs to investigate the token issue. The rep committed to an update "today, otherwise Monday."',
          evidence: 'M09, Turn 21: "It says the token has expired. This is the fresh message we just received."',
          priority: 'high',
        },
        {
          recordRef: 'M03',
          title: 'Asterloom Systems — price transparency issue',
          text: 'Active deal where the customer caught a price increase from INR 26,000 to INR 39,000 (M03, Turn 23). The rep explained the difference was a bundled setup charge, but the initial conflation eroded trust. The customer also discovered the cards are prepaid, not credit — a potential deal-breaker (M03, Turn 6). The customer explicitly asked for details before another call (M03, Turn 36). Do not push for a follow-up.',
          evidence: 'M03, Turn 23: "But you previously told me INR 26,000. Why has that become INR 39,000?"',
          priority: 'high',
        },
      ],
    },
    {
      heading: 'Coaching priorities',
      items: [
        {
          recordRef: 'C01',
          title: 'Arun — pushing past "not interested"',
          text: 'C01: Arun cold-called Pranav at Harborlight Advisory. The prospect gave a clear early disinterest signal and asked why he was called. Arun admitted it was a cold call but continued pitching. Coach on disengaging cleanly after a clear "not interested." The contact also questioned how their details were obtained — a list-compliance review is warranted.',
          evidence: 'C01: "I didn\'t ask for this call, and I\'m not interested."',
          priority: 'medium',
        },
        {
          recordRef: 'C05',
          title: 'Meera — feature-matching instead of gap-finding',
          text: 'C05: Meera pitched expense features to a prospect who already had vendor management and store-level payments. The prospect said "We already have that" twice. Coach on probing for gaps before listing features. Competitive intelligence value: the prospect named StoreHarbor as an incumbent.',
          evidence: 'C05: "We already have that." (said twice)',
          priority: 'medium',
        },
        {
          recordRef: 'C06',
          title: 'Meera — large account, satisfied prospect',
          text: 'C06: A 120+ store prospect said their processes are already automated. Meera continued describing cards and instant payments after the prospect said "arrangements are already in place." The account size makes it worth tracking, but no follow-up unless the prospect initiates.',
          evidence: 'C06: "That is why I said the arrangements are already in place."',
          priority: 'low',
        },
        {
          recordRef: 'C10',
          title: 'Meera — stale CRM contact',
          text: 'C10: Called about Meadowbrick, but the contact (Aniket) has left the company. He is now in manufacturing. He explicitly declined a scheduled follow-up call. CRM data-quality update needed: identify the new contact at Meadowbrick. Send a brief to Aniket for the manufacturing context but respect his boundary.',
          evidence: 'C10: "I don\'t work there anymore."',
          priority: 'medium',
        },
      ],
    },
    {
      heading: 'Follow-up actions',
      items: [
        {
          recordRef: 'C07',
          title: 'Dev — send partnership proposal to Willowbank Advisory',
          text: 'C07: Active partnership opportunity. Aditya asked for a proposal via chat app and agreed to a Monday call. The firm already refers clients to digital account providers (currently uncompensated). Commission terms not yet discussed.',
          evidence: 'C07: "could you message me on our chat app and send whatever proposal you have?"',
          priority: 'medium',
        },
        {
          recordRef: 'M01',
          title: 'team06 — send referral link and documents to Harborpath Advisory',
          text: 'M01: Partnership ready to launch. The partner needs a scalable self-service referral link, not manual emails (M01, Turn 20). Commission structure (USD 260 activation) and product limitations (no direct card payments, funding source needed) were disclosed. Also wants a podcast and partner-page feature.',
          evidence: 'M01, Turn 20: "It cannot depend on me manually writing every email. This needs to scale."',
          priority: 'medium',
        },
        {
          recordRef: 'C03',
          title: 'Kiran — send email and call Monday (API access)',
          text: 'C03: Lukewarm follow-up on developer/API access. Milan said the functionality "isn\'t essential enough to spend much on." Price was a prior concern. Agreed email subject: "Developer access and event notifications — follow-up." Audio quality was poor (Milan on roaming).',
          evidence: 'C03: "isn\'t essential enough for us to spend much on it"',
          priority: 'low',
        },
        {
          recordRef: 'C09',
          title: 'Meera — contact Mr Rishabh WITHOUT naming Vedant',
          text: 'C09: Vedant pointed to business head Mr Rishabh on a professional networking site but explicitly said "No, please don\'t use my name." This constraint must be flagged in the CRM so no other rep names Vedant. 130-location account.',
          evidence: 'C09: "No, please don\'t use my name."',
          priority: 'medium',
        },
        {
          recordRef: 'M06',
          title: 'team10 — send security info to Mapletrail Services',
          text: 'M06: Strong fit for receivables automation (260–520 invoices/month, manual AR process). Customer raised a confidentiality/security concern (M06, Turn 31) that must be answered before advancing. One expense-recovery invoice has been outstanding for months.',
          evidence: 'M06, Turn 31: "Confidentiality is important. Payment information is sensitive."',
          priority: 'medium',
        },
        {
          recordRef: 'M04',
          title: 'team09 — confirm bank-card eligibility for Cedarwave',
          text: 'M04: Existing customer. Credit-card need is the main issue. Two open questions need engineering confirmation: can existing bank cards join the transaction feed, and will accounting integration work for bank-card transactions? Customer challenged the value-add over the bank portal (M04, Turn 26).',
          evidence: 'M04, Turn 26: "Then what do we gain by adding SpendNest?"',
          priority: 'medium',
        },
      ],
    },
    {
      heading: 'Strategic / internal',
      items: [
        {
          recordRef: 'M02',
          title: 'LedgerBridge e-invoicing — complete volume template',
          text: 'M02: SpendNest evaluating LedgerBridge for compliant e-invoicing (receivables module extension). Q4 target, possibly slipping. Supplier sent a volume template for pricing (EUR 2,600–6,500 setup). Tension: supplier wants a walkthrough, SpendNest wants written pricing first. Issued vs received invoice volumes should not be treated as equally certain.',
          evidence: 'M02, Turn 18: "We should not present those two columns as equally certain."',
          priority: 'low',
        },
        {
          recordRef: 'M10',
          title: 'Internal billing training — trainer needs back-office access',
          text: 'M10: Internal training on billing workflow. Key takeaways: due dates and collection periods differ, zero-value invoices are not missing payments, account freeze recovery requires manual ops action. The trainer needs back-office super-admin access for the next session.',
          priority: 'low',
        },
      ],
    },
    {
      heading: 'No usable text — intake queue',
      items: [
        {
          recordRef: '',
          title: '26 records need intake review',
          text: '20 background calls (B01–B20) have null transcripts. 4 meetings were recorded but nobody spoke (M05, M07 before update, M08, M11). 2 meetings had the notetaker cancelled (M12, M14). 1 meeting had no notetaker scheduled (M13). These records have no substantive analysis. They are flagged for intake review, not given fabricated conclusions.',
          priority: 'low',
        },
      ],
    },
  ],
};
