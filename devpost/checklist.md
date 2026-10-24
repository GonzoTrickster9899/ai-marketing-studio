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
  Learner check: Exercised the result UI with a mocked generation response, including two tailored platform cards and seven campaign days. The local API safely identified missing configuration. A later live smoke attempt reached OpenAI, but the provider rejected the configured credential, so no campaign was returned.
  Commit: `Generate structured marketing campaigns`

- [x] **3. Copy, recover, and protect public generation**
  Becomes usable: Users can copy captions, retry safely after failure, retain earlier results and brief values, and see the privacy notice; generation can be paused if public usage is unexpected.
  Why now: Once the core output exists, complete the PRD’s recovery and copy behavior and add the modest safeguards needed before a public demo.
  PRD ref: `prd.md > Editing, Regeneration, and Copying`, `Generation and Loading`, `States and Boundaries`, `What We're Building`
  Spec ref: `spec.md > Components > Clipboard and user feedback`, `Components > Abuse safeguard`, `Server Validation and Secret Handling`, `Failure Handling`, `Testing and Verification`, `Where It Runs and How Someone Tries It`
  Build: Add copy confirmation and clipboard fallback, failure UI with Retry/Edit, previous-result preservation and labeling, request de-duplication, the short privacy notice, mocked retry/error tests, and the `GENERATION_ENABLED` emergency switch. Document the Vercel WAF rule and environment setup for the later deployment step; the WAF setting itself is configured in Vercel during `6-ship`.
  Verify (mechanical): `npm run lint`, `npm test` (28 tests), and `npm run build` pass. Mocked client/route tests verify 429 guidance, disabled generation, development-specific and production-generic missing-key messages, failure preservation, successful replacement, clipboard success/fallback/failure, and duplicate-submit prevention. Rechecked that `.env.local` and the learner profile are ignored.
  Learner check: Final screenshots and learner report confirm a successful OpenRouter generation and edited-brief regeneration. A focused UI test simulates success, failed regeneration, and successful retry; it verifies the edited brief and prior result persist through failure. The learner reports responsive/copy checks complete. Vercel deployment and WAF configuration remain for optional live hosting; no public deployment has been made.
  Commit: `Add campaign recovery and copy safeguards`

## Hands-on Checkpoints

- [x] Early usable behavior explored — after slice 1, reviewed the brief form and visual direction; fresh-load, sample/edit, and incomplete-submit/focus behavior checked in a local browser before wiring the AI response.
- [x] Final kick-the-tires exploration and feedback completed — learner reviewed successful live generation and edited-brief regeneration; reported responsive layouts and independent copy timers; the failed-regeneration path is covered by the focused UI simulation below. No Vercel deployment or WAF dashboard rule was performed.

## Final Review

- [x] Final review complete — learner approved final technical review and readiness to proceed with shipping on 2026-10-24.

## Code Tour and App Map

- [x] Learning activity complete — learner inspected the app map and reports completing the three code stops using the map content and verified source paths.
- [x] Optional edit and transfer reflection addressed — learner shared a transferable takeaway; personal wording is recorded only in the ignored learner profile.
- [x] `devpost/app-map.html` generated from finished code, checked, and shown, including project-grounded practices to reuse.

Activity and evidence: On the final shipping review, `npm.cmd test` passed all 31 tests, `npm.cmd run lint` passed, and `npm.cmd run build` passed. The first full test run exposed a timing assumption in a copy-announcement test; `components/copy-button.test.tsx` now waits for the live-region text, and the full suite passes. Earlier production-browser checks used mocked generation and confirmed no horizontal overflow at 1440 px, 820 px, and 390 px, title wrapping, and independent two-second copy resets. Learner reports final live OpenRouter generation, edited-brief regeneration, and responsive/copy review. Failed regeneration was simulated in `components/marketing-studio.test.tsx`: successful result → edited brief → 503 failure (prior result and edited brief retained) → successful retry replaces result. Keyboard focus was not independently rechecked in this final pass.
Route and stops: Learner reports completing the three-stop route in `devpost/app-map.html`: `components/marketing-studio.tsx` and `lib/marketing-schema.ts` → `app/api/generate/route.ts` and `lib/openrouter-marketing.ts` → `components/campaign-results.tsx` and `components/copy-button.tsx`.
Edit outcome: Updated the asynchronous copy-announcement test to wait for its changing live-region text; all 31 tests, lint, and production build pass.
Reflection: Learner's transfer takeaway is recorded in the ignored learner profile, not in public planning documents.
Activity mode: Learner completed the map walkthrough and approved the final technical review; no optional code-edit exercise was requested.

## Revisions

- Scaffold in a temporary subfolder, then merge only new application files into the project root — `create-next-app` refuses to scaffold directly in this non-empty folder because it contains the existing Devpost skill pack and approved planning documents. This preserves those files while keeping the app architecture and root layout from the approved spec.
- Final review and learning wrap-up recorded after the learner's approval; the code-tour evidence and local verification are documented above.

## 6-ship Status

- [x] Current official event requirements checked: public licensed repository, project description, and a public YouTube/Vimeo demo under three minutes that shows the app running. See the [official rules](https://learn-ai-basics.devpost.com/rules).
- [x] Local release review: MIT license present with learner-selected attribution; `.env.example` contains a placeholder only; `.env.local` and `devpost/learner-profile.md` are ignored and absent from tracked history; the credential-pattern scan found no matches in Git history.
- [x] Skill-pack install directories and lockfile are ignored. The untracked root skill-pack README and alternate reviewed map are not included in the application checkpoint.
- [x] Current local checks: 31 tests, lint, and production build pass.
- [ ] Public repository: no remote is configured and no repository has been created or published.
- [ ] Public demo video: record and upload to YouTube or Vimeo; confirm public access and duration under three minutes.
- [ ] Optional public app: no Vercel deployment or WAF rule is configured. If deploying, set the provider key server-side, configure the documented IP rule, review current pricing/terms, monitor OpenRouter usage, and retain the generation kill switch.
- [ ] Learner writes the submission fields and completes the exit survey in Devpost.
