---
doc: checklist
status: approved
---

# Build Checklist

Build mode: learn

## Slices

- [x] **1. Fill and validate a business brief**
  Becomes usable: A responsive AI Marketing Studio opens to a blank form; users can load/edit the coffee-shop sample, select a goal and platforms, and see clear validation before any request is sent.
  Why now: The brief is the source for both outputs, so establish the user’s input path and design before connecting the higher-risk AI service. Project setup and first runnable behavior stay together in this slice.
  PRD ref: `prd.md > The Core Journey`, `Screens and Layout`, `Business Brief Form`, `States and Boundaries`
  Spec ref: `spec.md > Stack`, `Look and Feel`, `Components > Marketing Studio page and brief form`, `Components > Validation and sample data`, `Data Model`, `File Structure`
  Build: Bootstrap Next.js with TypeScript, Tailwind, shadcn/ui, Zod, and Vitest. Build the responsive page and brief form; implement sample values, single-select goal cards, Instagram/Facebook toggles, Friendly default, conditional offer validation, field limits, and accessible inline errors. Keep form values in React memory.
  Verify (mechanical): Run `npm run lint`, `npm run test`, and `npm run build`; start `npm run dev` and confirm the page loads without console/runtime errors.
  Learner check: Open `http://localhost:3000`, load the sample, edit a value, submit an incomplete brief, and check that the sample stays editable and errors point to the missing field.
  Commit: `Build validated business brief form`

- [x] **2. Generate the coordinated campaign from the brief**
  Becomes usable: A valid brief goes through the server-side API to OpenAI and returns platform-tailored social content plus one structured seven-day plan.
  Why now: This proves the unique kernel early and tests the external API/schema assumption before adding more polish. The form, one protected route, and result UI become one working path.
  PRD ref: `prd.md > The Core Journey`, `Generation and Loading`, `Social Content`, `Seven-Day Campaign Plan`, `States and Boundaries`
  Spec ref: `spec.md > The Core Journey Through the System`, `Components > Generation route and provider adapter`, `Components > Social content and campaign results`, `Data Model`, `API contract: POST /api/generate`, `OpenAI Request and Response`, `Server Validation and Secret Handling`, `External Services and Dependencies`
  Build: Add the shared brief/result schemas and sample data, server-only OpenAI Responses integration with `zodTextFormat`, the JSON route contract and safe error mapping, and result cards for `campaignSummary`, selected-platform social cards, and seven expandable campaign days. Add field/body limits and bounded model settings (`gpt-6-luna`, low reasoning, 5,000 output tokens). Keep the API key in `.env.local`; never request or commit it.
  Verify (mechanical): `npm run lint`, `npm test` (21 tests), and `npm run build` pass. Mocked tests cover route success, validation, exact seven-day output, selected-platform matching, OpenAI JSON Schema conversion, provider failures, generation UI, and preserved inputs after an error. The production dependency audit could not reach the npm advisory endpoint in this environment.
  Learner check: Exercised the result UI with a mocked generation response, including two tailored platform cards and seven campaign days. Confirmed the local API returns a safe `AI_NOT_CONFIGURED` response when no key is set; no real provider smoke generation was run because `OPENAI_API_KEY` is not configured.
  Commit: `Generate structured marketing campaigns`

- [x] **3. Copy, recover, and protect public generation**
  Becomes usable: Users can copy captions, retry safely after failure, retain earlier results and brief values, and see the privacy notice; generation can be paused if public usage is unexpected.
  Why now: Once the core output exists, complete the PRD’s recovery and copy behavior and add the modest safeguards needed before a public demo.
  PRD ref: `prd.md > Editing, Regeneration, and Copying`, `Generation and Loading`, `States and Boundaries`, `What We're Building`
  Spec ref: `spec.md > Components > Clipboard and user feedback`, `Components > Abuse safeguard`, `Server Validation and Secret Handling`, `Failure Handling`, `Testing and Verification`, `Where It Runs and How Someone Tries It`
  Build: Add copy confirmation and clipboard fallback, failure UI with Retry/Edit, previous-result preservation and labeling, request de-duplication, the short privacy notice, mocked retry/error tests, and the `GENERATION_ENABLED` emergency switch. Document the Vercel WAF rule and environment setup for the later deployment step; the WAF setting itself is configured in Vercel during `6-ship`.
  Verify (mechanical): `npm run lint`, `npm test` (26 tests), and `npm run build` pass. Mocked client/route tests verify 429 guidance, disabled generation, failure preservation, successful replacement, clipboard success/fallback/failure, and duplicate-submit prevention. Rechecked that `.env.local` and the learner profile are ignored.
  Learner check: Component tests exercised copy feedback/fallback and a failed regeneration that preserved both the brief and old campaign, followed by successful replacement. The local safe configuration response was checked in Slice 2. The full manual browser pass, real AI generation, mobile review, and Vercel WAF setup remain for hands-on review and shipping because no private API key is configured.
  Commit: `Add campaign recovery and copy safeguards`

## Hands-on Checkpoints

- [x] Early usable behavior explored — after slice 1, reviewed the brief form and visual direction; fresh-load, sample/edit, and incomplete-submit/focus behavior checked in a local browser before wiring the AI response.
- [ ] Final kick-the-tires exploration and feedback completed — after slice 3, try the full generation, copy, edit, retry, and mobile flow.

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: Slice 1 browser interaction checks; Slice 2 route/schema/UI tests; Slice 3 copy, retry, failure-preservation, and replacement tests. Lint, 26 tests, and production build pass. A live OpenAI request remains unverified until a private key is configured locally; final hands-on browser/mobile review is still pending.
Route and stops: [actual paths and symbols; guided stops completed, or reference-only route]
Edit outcome: [tried/kept/reverted/declined/not applicable; verification if changed]
Reflection: [offered/answered/declined/already covered — personal answer belongs only in the ignored profile]
Activity mode: [live app and editor, explicit static fallback, focused alternative, prior practice, or recap]

## Revisions

- Scaffold in a temporary subfolder, then merge only new application files into the project root — `create-next-app` refuses to scaffold directly in this non-empty folder because it contains the existing Devpost skill pack and approved planning documents. This preserves those files while keeping the app architecture and root layout from the approved spec.
