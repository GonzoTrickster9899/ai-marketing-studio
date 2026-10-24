# AI Marketing Studio — Learning Wrap-up Reference

## What the app does

One editable small-business brief produces tailored social captions for the selected platform or platforms and one coordinated seven-day campaign plan. The app uses Next.js and TypeScript, validates its brief and result with Zod, and calls OpenRouter from a server-only route. It does not save campaign history.

## Trace one request

1. `components/marketing-studio.tsx`: `MarketingStudio` owns the brief; `loadSample`, `updateBrief`, and `handleSubmit` control the form and request.
2. `lib/marketing-schema.ts` and `app/api/generate/route.ts`: the shared schema checks the brief, and `POST` validates it again before calling the provider.
3. `lib/openrouter-marketing.ts`: `generateMarketingResult` calls OpenRouter, parses the structured result, and checks the seven ordered days and selected platforms.
4. `components/campaign-results.tsx` and `components/copy-button.tsx`: validated results become caption and campaign cards; each copy control manages its own temporary confirmation.

The detailed, source-checked route is `devpost/app-map.html`. The learner reviewed its three code stops against the source paths. Refresh the map if those files or responsibilities change.

## A practice to reuse

Turn one acceptance criterion into a bounded implementation task: state the expected behavior, name the relevant files, and define the check that proves it. In this project, the result contract in `lib/marketing-schema.ts`, its tests in `lib/marketing-result.test.ts`, and the rendering in `components/campaign-results.tsx` connect one requirement to validation, evidence, and UI.

Mock provider responses in routine tests to check success and failure paths without API usage. Use a deliberate real request to check credentials, model access, and the live response format.

## Verification record

At final shipping review, 31 tests, lint, and production build passed. A flaky assertion that queried an initially empty copy live region was changed to wait for the announcement text. A production browser run used a mocked generation response to check result cards at 1440 px, 820 px, and 390 px; no horizontal overflow appeared. The long campaign title wrapped, and the two copy controls showed independent two-second confirmation timers. The learner reports a successful live OpenRouter generation and edited-brief regeneration. The browser layout run itself used a mock.

A focused UI simulation covers success, failed regeneration, and successful retry, asserting the edited brief and previous result remain visible after failure and that a successful retry replaces the old campaign. The learner approved the final technical review based on the reported live generation and screenshot evidence.

## Walkthrough status

The app map is source-checked, shown, and the learner reports completing its three-stop walkthrough. The learner's takeaway was: define the data contract first, keep external API calls in a server-side module, and test success and failure separately. The checklist records completion and the verification sources.

The learner's personal takeaway is recorded in the ignored learner profile; this reference keeps the public planning files free of personal profile details.
