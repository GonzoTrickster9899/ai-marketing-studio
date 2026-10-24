# AI Marketing Studio — Learning Wrap-up Reference

## What the app does

One editable small-business brief produces tailored social captions for the selected platform or platforms and one coordinated seven-day campaign plan. The app uses Next.js and TypeScript, validates its brief and result with Zod, and calls OpenRouter from a server-only route. It does not save campaign history.

## Trace one request

1. `components/marketing-studio.tsx`: `MarketingStudio` owns the brief; `loadSample`, `updateBrief`, and `handleSubmit` control the form and request.
2. `lib/marketing-schema.ts` and `app/api/generate/route.ts`: the shared schema checks the brief, and `POST` validates it again before calling the provider.
3. `lib/openrouter-marketing.ts`: `generateMarketingResult` calls OpenRouter, parses the structured result, and checks the seven ordered days and selected platforms.
4. `components/campaign-results.tsx` and `components/copy-button.tsx`: validated results become caption and campaign cards; each copy control manages its own temporary confirmation.

The detailed, source-checked route is `devpost/app-map.html`. It describes the source at commit `a4177d6`; refresh it if these files or responsibilities change.

## A practice to reuse

Turn one acceptance criterion into a bounded implementation task: state the expected behavior, name the relevant files, and define the check that proves it. In this project, the result contract in `lib/marketing-schema.ts`, its tests in `lib/marketing-result.test.ts`, and the rendering in `components/campaign-results.tsx` connect one requirement to validation, evidence, and UI.

Mock provider responses in routine tests to check success and failure paths without API usage. Use a deliberate real request to check credentials, model access, and the live response format.

## Verification record

At commit `a4177d6`, 31 tests, lint, and production build passed. A production browser run used a mocked generation response to check the result cards at 1440 px, 820 px, and 390 px; no horizontal overflow appeared. The long campaign title wrapped, and the two copy controls showed independent two-second confirmation timers. The browser run did not use OpenRouter.

A previous live OpenRouter smoke request returned HTTP 200 before the final UI polish. A live request against the final checkout, hands-on edit/regenerate behavior, and failed-regeneration recovery still need the learner's final review before shipping.

## Walkthrough status

The app map is source-checked and ready as a reference. The learner has not yet completed the final hands-on review or a walkthrough of the map. Do not mark the corresponding checklist items complete until those activities happen and the learner confirms the review is finished.

Optional reflection prompt: What would you do differently next time you turn a product requirement into a small Codex task? If recorded, a personal answer belongs in the ignored learner profile, not this public-safe reference.
