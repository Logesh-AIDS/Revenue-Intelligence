import type { ConversationAnalysis, RouteKey, EvidenceItem, NextStep } from '../types';

// ============================================================================
// Pre-generated analysis for the 18 conversations with usable supplied text.
//
// This content was prepared by reading each transcript and writing a
// differentiated, evidence-backed analysis. It is NOT a generic summary —
// each conversation gets analysis appropriate to its content.
//
// Meetings cite (record_ref, turn number). Calls cite a short exact quote
// with record_ref, per DATA_CONTRACT.md evidence rules.
// ============================================================================

interface RecordAnalysis {
  route: RouteKey;
  routeReason: string;
  analysis: ConversationAnalysis;
}

export const ANALYSIS: Record<string, RecordAnalysis> = {
  // ---- CALLS (10) --------------------------------------------------------

  '2ec4404c-beee-5377-a63c-aab701da08ed': { // C01 — Arun / Harborlight Advisory
    route: 'sales_coaching',
    routeReason: 'Hostile cold-call reception with the prospect explicitly stating disinterest. Rep technique and contact-list sourcing need manager review.',
    analysis: {
      summary: 'Arun cold-called Pranav at Harborlight Advisory to propose a partnership. Pranav was annoyed — he did not ask for the call, said his number is for work, and was not interested. Arun admitted it was a cold call. Pranav briefly asked what SpendNest does but said their processes are already automated and declined.',
      significance: 'The prospect gave a clear, early "not interested" signal that the rep pushed past. The contact-source was questioned ("where did you find my details?"), which flags a list-compliance issue. No pipeline value was established.',
      evidence: [
        { reference: 'C01 — "I didn\'t ask for this call, and I\'m not interested."', passage: 'I didn\'t ask for this call, and I\'m not interested. This number is for my work, not for people to sell things to me.', note: 'Explicit disinterest delivered early; rep continued pitching.' },
        { reference: 'C01 — "it\'s still a cold call, isn\'t it? Yes, it is."', passage: 'it\'s still a cold call, isn\'t it? Yes, it is. Then where did you find my details?', note: 'Prospect challenged contact sourcing; rep confirmed cold outreach.' },
        { reference: 'C01 — "Our processes are already very automated"', passage: 'Our processes are already very automated. We have a fairly advanced setup, so I don\'t think this is something we need.', note: 'Even when the prospect briefly engaged, the need was denied.' },
      ],
      limitations: 'This is one person\'s reaction on one call. It does not establish whether Harborlight Advisory could ever be a viable partner or whether other contacts there would be more receptive.',
      nextSteps: [
        { action: 'Mark this contact as do-not-call and review the list source for compliance.', owner: 'Sales manager' },
        { action: 'Coach rep on disengaging cleanly after a clear "not interested" rather than continuing the pitch.', owner: 'Sales manager' },
      ],
      generated: 'pre-generated',
    },
  },

  '4b870624-8aad-5315-a60e-0db95981cf99': { // C02 — Arun / Fernhaven Group
    route: 'deal_followup',
    routeReason: 'Rep was trying to reach a specific contact (Leela) and left a voicemail. Minimal interaction but a follow-up action exists.',
    analysis: {
      summary: 'Arun called Fernhaven Group asking for Leela. The receptionist (Kavya) said Leela was not in the office. Arun chose to leave a voicemail. No sales conversation occurred.',
      significance: 'This is a contact-reach attempt, not a substantive conversation. The outcome depends on whether Leela returns the call. The stored observed_outcome is "ooo" (out of office).',
      evidence: [
        { reference: 'C02 — "she isn\'t in the office today"', passage: 'It looks as though she isn\'t in the office today. Would you like to leave a message with me, or would you prefer her voicemail?', note: 'Target contact unavailable; rep left voicemail.' },
        { reference: 'C02 — "Her voicemail would be fine"', passage: 'Her voicemail would be fine, thank you.', note: 'Rep chose voicemail over leaving a message with the receptionist.' },
      ],
      limitations: 'The transcript does not reveal why Arun was calling Leela or whether she is a prospect. No pipeline intent was established.',
      nextSteps: [
        { action: 'Follow up with Leela directly when she returns; the voicemail alone may not generate a callback.', owner: 'Arun' },
      ],
      generated: 'pre-generated',
    },
  },

  '20d509ba-d589-5334-9aef-ea4ce6105b1a': { // C03 — Kiran / Milan (API access)
    route: 'deal_followup',
    routeReason: 'Follow-up on a prior developer-access discussion. Prospect is lukewarm but agreed to email and a Monday call. Audio quality hindered the conversation.',
    analysis: {
      summary: 'Kiran followed up with Milan about API/developer access discussed ~5 weeks ago. Milan remembered but said the functionality "isn\'t essential enough for us to spend much on it." Price was a concern in the prior call. Audio was poor (Milan on roaming). They agreed to continue by email and call Monday.',
      significance: 'A lukewarm prospect with price sensitivity and low urgency. The audio quality hurt the conversation — the rep should have offered the email path earlier. A concrete next step (email + Monday call) was agreed.',
      evidence: [
        { reference: 'C03 — "isn\'t essential enough for us to spend much on it"', passage: 'We did ask about some developer functionality, but it isn\'t essential enough for us to spend much on it. I would need to check with the team.', note: 'Low urgency; price was a prior concern.' },
        { reference: 'C03 — "Could we do this by email?"', passage: 'Could we do this by email? Or call on Monday a bit earlier, when I\'m back indoors?', note: 'Prospect proposed the follow-up channel.' },
        { reference: 'C03 — "Developer access and event notifications — follow-up"', passage: 'Something like "Developer access and event notifications — follow-up".', note: 'Agreed email subject line for follow-up.' },
      ],
      limitations: 'Does not establish whether Milan\'s team will approve any budget. The prior price discussion amount is not in this transcript.',
      nextSteps: [
        { action: 'Send email with agreed subject line "Developer access and event notifications — follow-up".', owner: 'Kiran' },
        { action: 'Call Monday or Tuesday to check if the email was received and the team reviewed it.', owner: 'Kiran' },
      ],
      generated: 'pre-generated',
    },
  },

  'bcdcbf56-d338-5c78-9a97-42c2fc1c9931': { // C04 — Arun / Ritesh (Lanternpath Media)
    route: 'deal_followup',
    routeReason: 'Follow-up voicemail for an expense-platform evaluation. Prior email misrouting may have delayed the deal. No response yet.',
    analysis: {
      summary: 'Arun left a voicemail for Ritesh following up on expense-platform consideration for Lanternpath Media. The initial information had gone to the wrong email; a corrected address was provided. Arun asked Ritesh to call back with a status update.',
      significance: 'An email misrouting may have stalled the evaluation. The prospect has not responded, so the deal status is unknown. The rep correctly acknowledged the error and asked for a decision update.',
      evidence: [
        { reference: 'C04 — "information first went to the wrong email address"', passage: 'My understanding is that our information first went to the wrong email address. We subsequently used the corrected address you gave us.', note: 'Prior delivery error acknowledged; may explain silence.' },
        { reference: 'C04 — "let me know where things stand"', passage: 'Please call me back to let me know where things stand. If you\'ve decided whether to move forward, or if there are questions we can answer.', note: 'Clear ask for a status update.' },
      ],
      limitations: 'Does not establish whether Ritesh received the corrected email or whether Lanternpath Media is still actively evaluating.',
      nextSteps: [
        { action: 'Attempt to reach Ritesh directly beyond voicemail (e.g. a second channel or a colleague).', owner: 'Arun' },
        { action: 'Confirm the corrected email address was received and opened.', owner: 'Arun' },
      ],
      generated: 'pre-generated',
    },
  },

  '75a6b94f-7717-5cfb-9e41-0acc94415e17': { // C05 — Meera / existing-system prospect
    route: 'sales_coaching',
    routeReason: 'Cold call where the prospect already has the capabilities being pitched. Rep could have explored gaps instead of feature-matching. Competitive intelligence value (StoreHarbor).',
    analysis: {
      summary: 'Meera cold-called a prospect (evening) offering SpendNest expense software. The prospect already had vendor management, store-level instant payments, and approvals — said "We already have that" twice. They use StoreHarbor and others. The prospect asked for a presentation "if we ever decide to change."',
      significance: 'The prospect is satisfied with their current stack. The rep feature-matched rather than probing for gaps. StoreHarbor is a competitive mention worth logging. The contact is open to future consideration but has no current need.',
      evidence: [
        { reference: 'C05 — "We already have that" (vendor management)', passage: 'Vendor management as well. You can keep suppliers on the platform… We already have that.', note: 'Prospect matched the pitch with existing capability.' },
        { reference: 'C05 — "We have that too" (store-level payments)', passage: 'We also have store-level instant payments… We have that too.', note: 'Second feature already covered.' },
        { reference: 'C05 — "If we ever decide to change"', passage: 'What I suggest is that you send me your presentation. If we ever decide to change the providers we already have, we could consider it then.', note: 'Low-intent nurture signal; no active evaluation.' },
        { reference: 'C05 — "One is StoreHarbor"', passage: 'There are several. One is StoreHarbor, and we use others too.', note: 'Competitive intelligence: StoreHarbor named as incumbent.' },
      ],
      limitations: 'Does not establish the depth of the prospect\'s existing system or whether there are gaps. The prospect may never switch.',
      nextSteps: [
        { action: 'Send presentation to contact05@example.com (confirmed).', owner: 'Meera' },
        { action: 'Log StoreHarbor as a competitive mention; add to nurture, not active pipeline.', owner: 'Sales manager' },
      ],
      generated: 'pre-generated',
    },
  },

  '12216d5c-e254-52c6-b344-47de4c6e1ae5': { // C06 — Meera / Mr Nikhil (120+ stores)
    route: 'sales_coaching',
    routeReason: 'Large prospect (120+ stores) already satisfied. Rep continued pitching after "already in place." Account size worth tracking but no active need.',
    analysis: {
      summary: 'Meera cold-called Mr Nikhil (retail/distribution, 120+ stores). The prospect said their processes are already automated through a business management system with head-office visibility. They will reach out if a need arises. Meera continued describing cards/instant payments after the prospect said arrangements were in place.',
      significance: 'A large account (120+ stores) with no current need. The rep pushed features after a clear "already in place" signal. The account size makes it worth tracking, but there is no pipeline value today.',
      evidence: [
        { reference: 'C06 — "already have many of those things in place"', passage: 'We already have many of those things in place. If there is something we need from you in future, we can contact you.', note: 'Clear "no current need" delivered early.' },
        { reference: 'C06 — "more than a hundred and twenty stores"', passage: 'I understand you have more than a hundred and twenty stores.', note: 'Large account; rep tried to use size as a hook.' },
        { reference: 'C06 — "arrangements are already in place"', passage: 'That is why I said the arrangements are already in place. If a particular need comes up later, we will reach out.', note: 'Prospect repeated the disinterest after rep kept pitching.' },
      ],
      limitations: 'Does not establish whether the internal system has gaps the prospect is unaware of, or whether they will ever reach out.',
      nextSteps: [
        { action: 'Log as large-account nurture (120+ stores). No active follow-up unless prospect initiates.', owner: 'Sales manager' },
      ],
      generated: 'pre-generated',
    },
  },

  '428817fa-7e9e-5418-a7d4-bb396d28dfbf': { // C07 — Dev / Willowbank Advisory
    route: 'partnership',
    routeReason: 'Active partnership discussion with an advisory firm that already refers clients to digital account providers. Clear next steps agreed (send proposal, call Monday).',
    analysis: {
      summary: 'Dev called Aditya at Willowbank Advisory about a partnership. Willowbank helps clients with overseas incorporation and already refers clients to digital account providers. Aditya asked Dev to send a proposal via chat app and agreed to a Monday follow-up call.',
      significance: 'A warm partnership opportunity. The firm already does referrals (currently uncompensated), so a commission model is relevant. Clear, specific next steps were agreed.',
      evidence: [
        { reference: 'C07 — "We\'d like to partner with advisory firms"', passage: 'We\'d like to partner with advisory firms such as yours so your clients can access a virtual business account after incorporation.', note: 'Partnership value proposition stated.' },
        { reference: 'C07 — "Yes, that is something we normally do"', passage: 'Do you currently refer clients to providers for that part of the process? Yes, that is something we normally do.', note: 'Firm already refers; partnership is a natural fit.' },
        { reference: 'C07 — "message me on our chat app and send whatever proposal"', passage: 'Sorry, could you message me on our chat app and send whatever proposal you have?', note: 'Prospect initiated the ask for materials.' },
        { reference: 'C07 — "call on Monday"', passage: 'Once you\'ve received them, could I call on Monday to see whether you\'d like to discuss it further? Yes, that\'s fine.', note: 'Follow-up call agreed.' },
      ],
      limitations: 'Commission terms were not discussed on this call. Does not establish whether the partnership will close or what referral volume to expect.',
      nextSteps: [
        { action: 'Send proposal via chat app to the confirmed number.', owner: 'Dev' },
        { action: 'Call Monday to discuss partnership and commission structure.', owner: 'Dev' },
      ],
      generated: 'pre-generated',
    },
  },

  '129497b2-8e1d-5e01-919c-e8a852b5ff68': { // C08 — Meera / Mr Raghav (internal referral)
    route: 'deal_followup',
    routeReason: 'Prospect is not the decision-maker but offered an internal referral to a colleague who may be evaluating solutions. Email confirmed and read back.',
    analysis: {
      summary: 'Meera cold-called Mr Raghav. He is not the decision-maker but said a colleague handling people operations "deals with frontline processes and the locations" and "we may have been looking at a solution." He gave email contact08@example.com and asked Meera to send a proposal mentioning the conversation.',
      significance: 'An internal referral pathway — Raghav is routing the pitch to someone closer to the decision. The email was confirmed and read back to ensure accuracy. The colleague may or may not be actively evaluating.',
      evidence: [
        { reference: 'C08 — "colleague handling our people operations"', passage: 'The colleague handling our people operations also deals with frontline processes and the locations. I think we may have been looking at a solution, but I don\'t know the details.', note: 'Internal referral; colleague may be evaluating.' },
        { reference: 'C08 — "say you spoke with me"', passage: 'If you send him a proposal and say you spoke with me, he can take a look.', note: 'Raghav offered his name as a referral signal.' },
        { reference: 'C08 — "contact08@example.com" (confirmed)', passage: 'Let me read it back to make sure I have the right address: contact08@example.com? Yes, that\'s correct.', note: 'Email read-back confirms accuracy.' },
      ],
      limitations: 'Does not establish whether the colleague is actively evaluating or just curious, or whether Raghav\'s referral will carry weight.',
      nextSteps: [
        { action: 'Send proposal to contact08@example.com mentioning the conversation with Raghav.', owner: 'Meera' },
        { action: 'Follow up with the colleague directly after sending.', owner: 'Meera' },
      ],
      generated: 'pre-generated',
    },
  },

  '4a1de681-f884-55e8-b1ad-de22d17cd959': { // C09 — Meera / Mr Vedant (referral with constraint)
    route: 'deal_followup',
    routeReason: 'Prospect declined but pointed to a potential champion (business head Mr Rishabh). Critical constraint: prospect asked NOT to be named. Large account (130 locations).',
    analysis: {
      summary: 'Meera cold-called Mr Vedant (130 locations). They have internally developed software and are not looking outside. Vedant pointed to the business head Mr Rishabh on a professional networking site. Critically, Vedant said "No, please don\'t use my name" when asked if Meera could mention him.',
      significance: 'A referral pathway with a hard constraint: the prospect explicitly asked not to be named. The business head may be a champion, but the rep must respect the anonymity request. Large account (130 locations).',
      evidence: [
        { reference: 'C09 — "developed our own software internally"', passage: 'We have developed our own software internally, so at present we aren\'t looking for anything outside the organisation.', note: 'No current need; internal solution exists.' },
        { reference: 'C09 — "find our business head, Mr Rishabh"', passage: 'You can find our business head, Mr Rishabh, on a professional networking site. He would be able to explain our requirements and whether there are any gaps.', note: 'Referral to a potential champion.' },
        { reference: 'C09 — "No, please don\'t use my name"', passage: 'Would it be all right if I mentioned your name when contacting him? No, please don\'t use my name.', note: 'Hard constraint: must NOT name Vedant when contacting Rishabh.' },
      ],
      limitations: 'Does not establish whether Mr Rishabh would be receptive or whether the internal software has gaps.',
      nextSteps: [
        { action: 'Contact Mr Rishabh via professional networking — WITHOUT naming Vedant. Frame as independent outreach.', owner: 'Meera' },
        { action: 'Flag the anonymity constraint in the CRM so no other rep names Vedant.', owner: 'Sales manager' },
      ],
      generated: 'pre-generated',
    },
  },

  'b747f592-810e-583c-9b81-8db5ab035806': { // C10 — Meera / Mr Aniket (stale contact)
    route: 'sales_coaching',
    routeReason: 'Contact data is stale — prospect left the named company. New sector (manufacturing) may be relevant. Prospect declined scheduled follow-up. CRM data-quality action needed.',
    analysis: {
      summary: 'Meera called about Meadowbrick, but the contact (Mr Aniket) said he no longer works there. He is now in manufacturing (a different sector). He asked for a brief on a messaging app and said he will contact Meera if interested. He explicitly declined a follow-up call.',
      significance: 'Stale CRM data — the contact left the target account. The new sector (manufacturing) is still in SpendNest\'s scope. The prospect set a boundary: he will initiate, not the rep. A CRM data-quality update is needed.',
      evidence: [
        { reference: 'C10 — "I don\'t work there anymore"', passage: 'Are you calling about Meadowbrick? Yes, that\'s right. I don\'t work there anymore.', note: 'Contact is stale; target account needs a new contact.' },
        { reference: 'C10 — "Manufacturing"', passage: 'Is it in the same sector, or have you moved into a different area? It is different. Manufacturing.', note: 'New sector may still be relevant.' },
        { reference: 'C10 — "I will contact you if there is anything to discuss"', passage: 'Would a follow-up call on Monday or Tuesday next week be okay? No. I said I will contact you if there is anything to discuss.', note: 'Prospect declined scheduled follow-up; respect the boundary.' },
      ],
      limitations: 'Does not establish who the new contact at Meadowbrick is, or whether Aniket\'s new company is a fit.',
      nextSteps: [
        { action: 'Update CRM: Aniket no longer at Meadowbrick. Identify the new contact at Meadowbrick.', owner: 'Sales manager' },
        { action: 'Send brief to Aniket for the manufacturing context. Do NOT schedule a follow-up call (he declined).', owner: 'Meera' },
      ],
      generated: 'pre-generated',
    },
  },

  // ---- MEETINGS (8) -------------------------------------------------------

  'cb5cecac-e68d-52b7-b10b-b0c748efc467': { // M01 — Harborpath Advisory partnership
    route: 'partnership',
    routeReason: 'Partnership discussion with commission terms, referral-link setup, and onboarding requirements. Ready to launch with clear deliverables.',
    analysis: {
      summary: 'Partner A (Harborpath Advisory) wants to offer SpendNest virtual accounts to clients after incorporation. Commission structure was discussed: USD 260 activation per approved referral, card interchange share, and volume bonuses. The partner needs a scalable referral link (not manual emails). Onboarding requires incorporation/tax docs, identity docs, ownership chart, website, and evidence of US operations. The partner also wants a podcast and partner-page feature.',
      significance: 'An active partnership ready to launch. The key constraint is scalability — the partner explicitly rejected manual email introductions and needs a self-service referral link. Product limitations were disclosed: no direct card-payment acceptance, and the account needs a funding source before outgoing payments.',
      evidence: [
        { reference: 'M01, Turn 12', passage: 'No, let us get the partner onboarding started.', note: 'Partner is ready to proceed.' },
        { reference: 'M01, Turn 20', passage: 'It cannot depend on me manually writing every email. This needs to scale when people discover the offer through us.', note: 'Scalability constraint — referral link required, not manual emails.' },
        { reference: 'M01, Turn 9', passage: 'The activation payment is USD 260 when a referred company gets its account approved by our compliance partners.', note: 'Commission terms stated.' },
        { reference: 'M01, Turn 23', passage: 'receiving funds here means bank transfers, not directly taking card payments from customers… It also needs a way to fund the account.', note: 'Product limitation disclosed to partner.' },
        { reference: 'M01, Turn 26', passage: 'perhaps we could record a podcast with someone who can explain the product well.', note: 'Marketing co-opportunity raised by partner.' },
      ],
      limitations: 'Does not establish whether referred businesses will pass compliance, or what referral volume to expect.',
      nextSteps: [
        { action: 'Send documents, unique referral link, and tracking sheet to the partner.', owner: 'team06@example.com (organizer)' },
        { action: 'Set up partner page featuring Harborpath Advisory; connect with marketing re: podcast.', owner: 'Marketing / team06' },
      ],
      generated: 'pre-generated',
    },
  },

  '1a21c409-c050-5787-90af-2667e057e1b6': { // M02 — LedgerBridge vendor evaluation
    route: 'vendor_evaluation',
    routeReason: 'SpendNest is evaluating a supplier (LedgerBridge) for compliant e-invoicing as a strategic product extension. Build/buy decision with commercial terms pending volume data.',
    analysis: {
      summary: 'SpendNest is evaluating LedgerBridge for compliant electronic invoicing to extend its receivables module. Target markets: Singapore, Australia, India (Q4, possibly slipping to early next year). LedgerBridge sent a volume template for pricing. Commercial models: country licences + transaction usage, or per-customer licences. Setup: EUR 2,600–6,500 one-time. A tension exists: the supplier prefers a walkthrough call, but the SpendNest team needs written pricing first for their internal evaluation process.',
      significance: 'A strategic vendor evaluation, not a sales conversation. The timeline is flexible ("not an immovable deadline"). Issued vs received invoice volumes should not be treated as equally certain because the receivables product is still being built. The supplier wants to control the narrative via a walkthrough; the buyer wants numbers.',
      evidence: [
        { reference: 'M02, Turn 11', passage: 'Has management decided to invest in this, or are you still deciding whether the project should exist at all?', note: 'Supplier probing commitment level.' },
        { reference: 'M02, Turn 15', passage: 'Early next year is possible if the work moves. We intend to build the capability, but I would not describe the quarter as an immovable deadline.', note: 'Timeline is flexible.' },
        { reference: 'M02, Turn 18', passage: 'Received invoice volumes can be based on current accounts-payable usage. Issued volumes will be estimates because the receivables product is still being built. We should not present those two columns as equally certain.', note: 'Data confidence differs by column.' },
        { reference: 'M02, Turn 33', passage: 'I prefer walking through the proposal. If people only receive a pricing page, they may miss the value.', note: 'Supplier wants to control pricing delivery.' },
        { reference: 'M02, Turn 34', passage: 'Written pricing helps us follow that process internally. I understand your concern, but we still need to take the numbers back.', note: 'Buyer insists on written pricing first.' },
      ],
      limitations: 'Does not establish whether SpendNest will commit, or final pricing (needs the volume template). Does not confirm which customers require e-invoicing.',
      nextSteps: [
        { action: 'Complete the volume template (countries, customer sizes, issued/received invoice volumes).', owner: 'team07@example.com (organizer)' },
        { action: 'Brief management with written pricing; schedule the short explanation call after the template.', owner: 'team07' },
      ],
      generated: 'pre-generated',
    },
  },

  '398672e7-62dd-5afd-846d-0237d49792fb': { // M03 — Asterloom Systems (cards demo)
    route: 'deal_followup',
    routeReason: 'Active deal with price sensitivity and a credit-card gap. Price transparency issue (INR 26k → 39k). Customer wants to pilot small and needs CFO approval. Customer asked for details before more calls.',
    analysis: {
      summary: 'Asterloom Systems (existing relationship, ~65 employees) wants domestic cards for employee expenses, replacing personal-spend-then-reimburse. Key issue: cards are prepaid, not credit — the customer wanted corporate credit cards. A price discrepancy arose: the customer recalled INR 26,000 but was quoted INR 39,000 (which included INR 13,000 setup). Customer wants to start with 4–5 employees. CFO approval is the gate. The customer explicitly asked for details first before scheduling another call.',
      significance: 'An active deal with two friction points: (1) the prepaid-vs-credit gap may be a deal-breaker, and (2) a price-transparency issue where the customer caught an unexplained increase. The customer wants to decide internally before more sales contact — pushing for another call would be counterproductive.',
      evidence: [
        { reference: 'M03, Turn 6', passage: 'Wait, these are prepaid? I had thought about a corporate credit card. So we put money in before anyone spends, and there is no credit facility on these domestic cards?', note: 'Credit-card gap discovered mid-demo.' },
        { reference: 'M03, Turn 23', passage: 'But you previously told me INR 26,000. Why has that become INR 39,000?', note: 'Price transparency issue — customer caught the increase.' },
        { reference: 'M03, Turn 24', passage: 'I included the integration setup in that number. To separate it: INR 26,000 plus tax is the recurring annual subscription, and INR 13,000 is the one-time accounting integration setup.', note: 'Rep clarified — but the initial conflation eroded trust.' },
        { reference: 'M03, Turn 25', passage: 'We have been discussing this for a long time and still need to decide whether it is the right tool.', note: 'Customer is not yet convinced.' },
        { reference: 'M03, Turn 36', passage: 'Send the details first. We need time with the CFO and will tell you if another call is needed. Let us make that decision internally before scheduling more.', note: 'Customer set the process — do not push for a call.' },
      ],
      limitations: 'Does not establish whether the CFO will approve, or whether a credit-card option will become available in the near term.',
      nextSteps: [
        { action: 'Send proposal with clear, itemised price breakdown (subscription vs setup) — no bundled numbers.', owner: 'team08@example.com (organizer)' },
        { action: 'Do NOT push for a follow-up call. Wait for the customer to confirm they want one.', owner: 'team08' },
        { action: 'Explore whether the bank-credit-card route (discussed in M04) could address the credit gap for this prospect.', owner: 'Sales manager' },
      ],
      generated: 'pre-generated',
    },
  },

  'b0f79b3d-37ba-52f9-b2bc-58b159dd6d91': { // M04 — Cedarwave Distribution (existing customer)
    route: 'customer_success',
    routeReason: 'Existing customer discussing card migration. Credit-card need is the main issue. Bank-card transaction-feed eligibility and accounting integration are open questions. Customer not ready to decide.',
    analysis: {
      summary: 'Cedarwave Distribution (existing customer) is being migrated from one prepaid card programme to another. The customer\'s main issue is that they want credit cards, not prepaid. A bank partnership for corporate credit cards exists but needs bank assessment. The transaction feed for bank-issued cards would show settled transactions (not real-time, and not available credit limit) — its value-add over the bank portal is receipts, review, and accounting reconciliation. Accounting integration for bank cards is unconfirmed. The customer also has a department-setup issue. They are not deciding the migration on this call.',
      significance: 'An existing customer at potential risk if the credit-card need goes unmet. Two open technical questions need engineering confirmation before the customer can decide: (1) can existing bank cards join the transaction-feed programme, and (2) will accounting integration work for bank-card transactions. The value proposition over the bank portal needs to be articulated clearly.',
      evidence: [
        { reference: 'M04, Turn 11', passage: 'moving from prepaid to credit is the main issue for us. At some stage we will have to consider another option for that.', note: 'Credit gap is the primary customer concern.' },
        { reference: 'M04, Turn 21', passage: 'source-balance reconciliation is a question in this setup. I need the team to confirm feasibility for your bank-card transactions rather than say the existing prepaid integration automatically covers it.', note: 'Accounting integration unconfirmed for bank cards.' },
        { reference: 'M04, Turn 25', passage: 'No, the proposed feed shows transaction details after settlement. The bank retains that control, so the available limit would not be shown here.', note: 'Feed limitation vs bank portal.' },
        { reference: 'M04, Turn 26', passage: 'Then what do we gain by adding SpendNest? We can already see transactions in the bank portal.', note: 'Customer challenged the value-add.' },
        { reference: 'M04, Turn 29', passage: 'We are not deciding the whole migration on this call.', note: 'Customer is not ready to commit.' },
      ],
      limitations: 'Does not confirm whether existing bank cards can join the transaction feed, or whether accounting integration will work for bank-card transactions.',
      nextSteps: [
        { action: 'Confirm bank-card transaction-feed eligibility and accounting integration feasibility with the programme team.', owner: 'team09@example.com (organizer)' },
        { action: 'Arrange a guided session for the department user-move issue.', owner: 'team09' },
        { action: 'Prepare a clear value-add statement (receipts, review, reconciliation) vs the bank portal.', owner: 'CS team' },
      ],
      generated: 'pre-generated',
    },
  },

  '657b9e9d-9472-5b01-a127-a648ad7e8cf7': { // M06 — Mapletrail Services (AR automation prospect)
    route: 'deal_followup',
    routeReason: 'Discovery call with a strong fit for receivables automation. High invoice volume, specific pain (outstanding invoice), security concern to address. Customer agreed to receive information.',
    analysis: {
      summary: 'Mapletrail Services\' finance contact (one branch, ~65-person central finance team, 65–78 customers) handles ~260–520 invoices/month, many in foreign currency. Their AR process is manual: check contract, confirm with delivery, send invoice, follow up. One expense-recovery invoice has been outstanding for months despite the same client paying normal invoices. SpendNest proposed AR/collection automation. The customer raised a confidentiality/security concern. They agreed to receive information.',
      significance: 'A strong fit for receivables automation — high volume, manual process, and a specific unresolved collection. The security question must be answered before this advances. The central team handles much of the work today, so adoption depends on their buy-in.',
      evidence: [
        { reference: 'M06, Turn 10', passage: 'One expense-recovery invoice has been outstanding for months even though the same client pays the normal service invoices. We still need the delivery manager to establish why that particular item is held up.', note: 'Specific, unresolved collection pain point.' },
        { reference: 'M06, Turn 22', passage: 'if an invoice is INR 1.3 lakh and the payment is INR 1.17 lakh, the difference could be withholding, bank fees or an unresolved dispute. Matching the receipt is not enough.', note: 'Cash-application complexity — automation target.' },
        { reference: 'M06, Turn 31', passage: 'Confidentiality is important. Payment information is sensitive. How is that protected, and is there a risk of somebody interfering with it?', note: 'Security concern — must be addressed before advancing.' },
        { reference: 'M06, Turn 33', passage: 'It has been useful hearing a different perspective. Please send the information and we can stay in touch.', note: 'Customer open to receiving materials.' },
      ],
      limitations: 'Does not establish whether the central finance team will adopt, or whether automation will resolve the outstanding invoice issue.',
      nextSteps: [
        { action: 'Send information including security/compliance certifications to address the confidentiality concern.', owner: 'team10@example.com (organizer)' },
        { action: 'Follow up on fit for AR automation, referencing the outstanding-invoice pain point.', owner: 'team10' },
      ],
      generated: 'pre-generated',
    },
  },

  '4f304fff-fd40-5cfc-a366-0a134c445c2a': { // M07 — Willowfield Trust (customer support)
    route: 'customer_success',
    routeReason: 'Existing customer support session with four bugs. One (payments stuck in Processing) needs urgent resolution. Workarounds found for others but root causes need engineering.',
    analysis: {
      summary: 'A customer support session with Willowfield Trust covering four issues: (1) editing an event-payment description does not save the change; (2) uploading an attachment from "Recreate payment" fails (workaround: save, go to invoice inbox, Review, upload there); (3) a group of reimbursement payments are stuck showing "Processing" after release; (4) "Mark as paid" carries the previous payment\'s amount into the next item. The team member captured screenshots and will raise all with engineering.',
      significance: 'Multiple bugs affecting a customer\'s daily workflow. The Processing-stuck issue is most urgent (payments released but not reflecting). The attachment workaround adds extra steps. The Mark-as-paid bug causes double work for every payment. The rep handled this well — confirmed each issue by asking the customer to reproduce it.',
      evidence: [
        { reference: 'M07, Turn 4', passage: 'it is still the old description. That is why I sent it across.', note: 'Bug 1: description edit not saving.' },
        { reference: 'M07, Turn 8', passage: 'Next is Recreate payment. Can we look at that here? When I go through this route, I cannot upload a document.', note: 'Bug 2: attachment upload fails from Recreate payment.' },
        { reference: 'M07, Turn 19', passage: 'The payments appear to have been released but are stuck showing Processing. I have asked the team to look at these. I expect an update or resolution in an hour or two, and I will inform you when they confirm.', note: 'Bug 3: urgent — payments stuck in Processing. Rep committed to 1–2 hour update.' },
        { reference: 'M07, Turn 22', passage: 'The amount from the previous item appears in the next one. Each time I have to cancel, leave it and open Mark as paid again before it shows the right information.', note: 'Bug 4: Mark-as-paid carries previous amount — causes double work.' },
        { reference: 'M07, Turn 15', passage: 'Yes. I will still raise the original behaviour with the team. The workaround does not mean the direct upload issue has been resolved.', note: 'Rep correctly noted workaround ≠ fix.' },
      ],
      limitations: 'Root causes and fix timelines are not established. The 1–2 hour expectation for the Processing issue is the rep\'s estimate, not an engineering commitment.',
      nextSteps: [
        { action: 'Engineering to investigate all four bugs; prioritise the Processing-stuck issue.', owner: 'Engineering' },
        { action: 'Update customer on the Processing issue within 1–2 hours as committed.', owner: 'team09@example.com (organizer)' },
        { action: 'Send details to the team with screenshots and reproduction steps.', owner: 'team09' },
      ],
      generated: 'pre-generated',
    },
  },

  '4b5b9192-f3fc-505a-8e77-4d2ffaa54594': { // M09 — Account setup (Brookmint/Northkite)
    route: 'customer_success',
    routeReason: 'Customer onboarding session. Login blocker (token expired twice) for Brookmint Holdings. Permission-design concern is valid and unresolved. Customer needs training refresher.',
    analysis: {
      summary: 'An onboarding session for two company accounts: Brookmint Holdings (invitation expired, can\'t log in) and Northkite Equipment (active). The customer corrected the rep: only Northkite used the trial, not Brookmint. A permission concern arose: using a shared accounts mailbox as admin would give the AP officer admin rights, which the customer does not want. A new reset invitation was sent but the token expired again. The customer self-corrected a tax issue in Northkite and needs a training refresher before Brookmint goes live.',
      significance: 'Two blockers: (1) the login token keeps expiring (twice now) — engineering needs to investigate; (2) the permission design concern is valid and unresolved. The customer is thinking about continuity (what happens when they leave) — a separate admin email or narrower role is the path. The rep should not have assumed both companies used the trial.',
      evidence: [
        { reference: 'M09, Turn 7', passage: 'No, only Northkite Equipment used the trial. There was no Brookmint Holdings spending in that period.', note: 'Customer corrected the rep\'s assumption.' },
        { reference: 'M09, Turn 17', passage: 'I do not want this to depend on trusting someone not to use access that is available. That does not solve the permission problem.', note: 'Permission concern is valid; trust is not a control.' },
        { reference: 'M09, Turn 21', passage: 'It says the token has expired. This is the fresh message we just received.', note: 'Token expired again — second failure.' },
        { reference: 'M09, Turn 31', passage: 'I will check the expired-token problem for Brookmint Holdings with the team and aim to return with an update today, otherwise Monday.', note: 'Rep committed to an update timeline.' },
      ],
      limitations: 'Does not establish why tokens keep expiring, or what the final permission design will be.',
      nextSteps: [
        { action: 'Engineering to investigate the recurring token-expiry issue for Brookmint Holdings.', owner: 'Engineering' },
        { action: 'Customer to discuss separate email identities with their IT team; follow up on the permission design.', owner: 'team11@example.com (organizer)' },
        { action: 'Send training material; arrange a refresher session before Brookmint goes live.', owner: 'team11' },
      ],
      generated: 'pre-generated',
    },
  },

  '337f297d-9385-5b82-9e54-5019c1ed912c': { // M10 — Billing workflow walkthrough
    route: 'internal',
    routeReason: 'Internal training session on billing workflow. Not customer-facing. Key operational knowledge captured for the team.',
    analysis: {
      summary: 'An internal training session covering the billing workflow: invoice generation (fixed, variable, one-time, usage components), due-date exceptions (displayed due date vs allowed collection period can differ), zero-value invoices (not necessarily missing payments), automated wallet-deduction retry schedule (3 attempts over 10 days, then account freeze), and the manual recovery flow. The trainer needs back-office super-admin access for the next session.',
      significance: 'Internal training, not a customer conversation. The key takeaways are operational knowledge: due dates and collection periods are not the same, zero invoices are not missing payments, and topping up a frozen account does not complete recovery — operations must clear the invoice and adjust the billing date manually.',
      evidence: [
        { reference: 'M10, Turn 8', passage: 'The displayed due date and the allowed collection period are not always the same thing.', note: 'Key operational distinction.' },
        { reference: 'M10, Turn 13', passage: 'If a periodic invoice has no subscription charge due and no extra usage component, its value can be zero. That is not automatically a missing payment.', note: 'Zero-value invoice explanation.' },
        { reference: 'M10, Turn 17', passage: 'if it still fails, payments and cards can be blocked, and the billing date stays stuck. Simply topping up a frozen account does not complete the whole recovery flow.', note: 'Recovery requires manual ops action.' },
        { reference: 'M10, Turn 20', passage: 'I will request the back-office access separately for the next training session.', note: 'Action item: trainer needs super-admin access.' },
      ],
      limitations: 'N/A — internal training. No customer relationship or pipeline impact.',
      nextSteps: [
        { action: 'Request back-office super-admin access for the next training session.', owner: 'team12@example.com (organizer)' },
        { action: 'Review billing examples; send questions via email.', owner: 'Training attendees' },
      ],
      generated: 'pre-generated',
    },
  },
};
