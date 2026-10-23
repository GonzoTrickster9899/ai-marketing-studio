---
doc: prd
status: approved
---

# AI Marketing Studio — Product Requirements

A simple marketing workspace for small-business owners and beginner marketers to turn one business brief into platform-tailored social content and a coordinated seven-day campaign plan.

Source: `scope.md > The Unique Kernel`, `Who It's For`, `The Core Loop`, `What "Working" Looks Like`, and `The POC Boundary`.

## The Core Journey

1. The user opens AI Marketing Studio without an account. They see a short explanation of the tool, a blank business-brief form, a prominent **Try sample business** action, and an empty results area.
2. The user enters business details, chooses one or more supported social platforms, selects one marketing goal, and sets a brand tone. The form starts blank. **Try sample business** fills it with the coffee-shop example; the user may edit those values.
3. The user selects **Generate Marketing Plan**. The app validates required fields before sending a request. If the brief is complete, it shows a loading state and prevents duplicate submissions.
4. After successful generation, the results area shows platform-specific social content and one shared seven-day campaign plan, both based on the same brief.
5. The user copies a platform caption, reviews the plan, or edits the brief and generates again. A successful new generation replaces the previous results.
6. If generation fails, the form remains intact. The user can retry or edit the brief. Any earlier successful results remain visible and are labeled as previous results until a new generation succeeds.

Source: `scope.md > The Core Loop` and `What "Working" Looks Like`.

## Screens and Layout

The MVP is one responsive **AI Marketing Studio** workspace; it does not require sign-in or separate analytics screens.

- **Header:** App name, simple navigation, a headline such as “Turn your business idea into a marketing campaign,” and a short explanation that one brief powers platform-specific content and a coordinated seven-day plan.
- **Desktop:** Two columns. Place the business brief form on the left and results on the right. Before the first successful generation, results show an empty state inviting the user to complete the brief and generate a plan.
- **Mobile:** Stack the form first and results directly below it. Controls are easy to tap; the campaign plan does not require horizontal scrolling.
- **Campaign plan:** Present seven compact daily sections that can be expanded or collapsed to keep the details scannable, especially on mobile.

Source: `scope.md > The Core Loop` and `The POC Boundary`.

## Look and Feel

Use a light, modern, approachable SaaS workspace rather than the dark illustrative wireframe. Use a soft off-white canvas, white cards, charcoal text, subtle borders, and violet or indigo accents for primary actions and selected states. Use a modern, highly readable sans-serif, restrained corner rounding, and shadows only where they clarify hierarchy. Generated results should have enough space to read and scan comfortably.

The learner shared these visual references as inspiration, not as exact page designs:

- [AI Dashboard — Minimal, Context-Aware UI by Talentica Software](https://images.openai.com/static-rsc-4/krL7IJOZiqFavf5y_mmJLEo5X8H8oIBL6ozOrF4kxuriyYTQ-jFgdxskEWmXlLTNL6SklZ1EgIoHiEaCxJO2LqhSht7MnZ5qCwr4UbjXMuIMx5W2UFv-7v6DR1gpEhCqWtJLS8uq5U78pxDQ_l04mBgzgRfZLpD6DgPOpk19TRY?purpose=inline)
- [AI Performance & Analytics Dashboard UI by Gopal Chatterjee for Blend wrk](https://images.openai.com/static-rsc-4/rqFjybtBljIuX2MjEF5GGUKGtMlSdlBXAY43hsd3zoGJ_vggfW-f5fI4AaDvha29Uktz6eAXohV0BvY-eHgRFBXRREIQnr4zh3Oq-r3yJSDaGnIP5S0pheQ5CLoiWyKbm7uYPPQpsZ6O1Cb8nFqi4FIxrajkWzOekO3VRoTDfon0?purpose=inline)

The intended feel is a friendly marketing workspace, not a complex analytics dashboard.

## Features and Behavior

### Business Brief Form

The blank form contains:

- **Business name** — required.
- **Product or service** — required.
- **Target audience** — required.
- **Marketing goal** — required, single-select cards with a short explanation for each:
  1. **Increase brand awareness** — help more potential customers discover the business.
  2. **Increase sales** — encourage purchases of selected products or services.
  3. **Promote a special offer** — highlight a discount, bundle, limited-time deal, or seasonal promotion.
  4. **Increase engagement** — encourage comments, shares, saves, and conversation.
  5. **Generate leads or inquiries** — invite messages, quote requests, or service questions.
  6. **Retain existing customers** — encourage repeat purchases and ongoing relationships.
- **Social platforms** — at least one selection; MVP support is limited to Instagram and Facebook. Both may be selected.
- **Brand tone** — not required; defaults to **Friendly**. Other tone choices include professional, playful, and persuasive.
- **Offer or promotion** — optional except when **Promote a special offer** is selected, in which case it is required. If supplied for another goal, incorporate it where appropriate.

The **Try sample business** action fills the fields with a realistic example: Daily Grind Coffee; iced coffee and matcha latte; college students and young professionals; **Promote a special offer**; Instagram and Facebook; Friendly; 10% off selected drinks this weekend. The sample remains editable.

When the user submits an incomplete brief, do not call the AI service. Show a concise summary near the top, highlight each invalid field, and give a specific inline explanation. Move focus to the first missing field and scroll it into view if needed. Preserve completed values, remove each error as it is corrected, and do not rely on color alone to communicate errors.

Source: `scope.md > The Core Loop` and `The POC Boundary`.

### Generation and Loading

**Generate Marketing Plan** submits the validated brief once. While a request is running, show a clear loading indicator and prevent duplicate submissions. If the brief is edited and regenerated, a successful response replaces the prior outputs.

Source: `scope.md > What "Working" Looks Like` and `The POC Boundary`.

### Social Content

Show separate Instagram and Facebook content cards for the platforms selected in the brief. Each selected platform receives its own tailored caption, not a duplicated shared caption. Include a promotional headline and relevant hashtags where appropriate. Give each platform caption its own copy action and clear copied confirmation.

If an offer was supplied, reflect it accurately in the copy. Do not invent discounts, prices, business facts, or campaign performance.

Source: `scope.md > The Unique Kernel`, `What "Working" Looks Like`, and `The POC Boundary`.

### Seven-Day Campaign Plan

Show one shared campaign schedule across the selected platforms. Organize it into seven expandable daily sections. Each day contains:

- A content idea.
- A recommended content format.
- Caption text tailored to each selected platform.
- A call to action.
- A relevant suggested success metric, such as reach, engagement, link clicks, or offer redemptions.

Metrics are suggestions for the user to track; they are never presented as measured or predicted results. The plan is not connected to social accounts.

Source: `scope.md > The Unique Kernel`, `What "Working" Looks Like`, and `The POC Boundary`.

### Editing, Regeneration, and Copying

The user can return to the brief, change inputs, and select **Generate Marketing Plan** again. The app uses the updated brief for both outputs. Each platform caption has its own copy action. Copying provides a visible confirmation.

If a later generation fails, preserve the prior successful results and label them as previous results; do not imply they match the edited brief. Replace them only after a new generation succeeds.

Source: `scope.md > The Core Loop` and `What "Working" Looks Like`.

## States and Boundaries

- **First use:** Blank form, visible **Try sample business** action, and an empty results panel explaining that results will appear after generation.
- **Sample loaded:** Example values populate the form and remain editable; results remain empty until the user generates.
- **Validation errors:** Identify each missing or invalid required field with summary and inline text; preserve valid inputs and focus the first invalid field.
- **Loading:** Show that generation is in progress and prevent duplicate submissions.
- **Successful generation:** Show both result sections based on the same brief. A new successful generation replaces the previous result.
- **Copy success:** Confirm when the selected caption has been copied.
- **Request failure:** Preserve all brief inputs. Explain the issue in plain language and offer **Try again** and **Edit brief**. Never expose API keys, stack traces, or sensitive server details.
- **Previous result after failure:** If a prior generation succeeded, keep it visible and label it as a previous result. A successful retry replaces it.
- **Transient failures:** A network error, timeout, or temporary service error may receive one limited automatic retry before the manual error state. Avoid repeated automatic retries. For a rate limit, explain that requests are temporarily limited and allow retry after the suggested wait. For an invalid AI response, explain that the result could not be processed and offer retry. If required AI service configuration is unavailable, show a service-unavailable message without an endless retry loop.
- **No persistence:** The MVP has no account or saved campaign history. The brief is preserved through a failed request in the current session.

Source: `scope.md > The POC Boundary` and `Explicitly Cut`.

## Product Decisions

- The product is named **AI Marketing Studio** and uses one workspace rather than a complex analytics dashboard.
- The first screen has a blank form and a **Try sample business** action, not prefilled sample data.
- Business name, product or service, target audience, one marketing goal, and at least one supported platform are required. Brand tone defaults to Friendly. Promotion details are required only for the special-offer goal.
- Marketing goal is single-select with six clearly explained options.
- The MVP supports Instagram and Facebook only. Captions are tailored separately to each selected platform, while the seven-day schedule is shared.
- Each campaign day includes an idea, format, platform-tailored caption(s), call to action, and a suggested metric.
- Failed requests preserve the brief and prior successful results, and provide retry and edit actions. A successful retry replaces the previous result.
- The visual direction is light, modern, and approachable, with violet or indigo accents.

## What We're Building

The MVP is complete when a user can:

1. Open the workspace and see a blank form, sample-business action, and empty results state.
2. Load or enter a brief, select one or both platforms, and choose a single goal.
3. Submit a valid brief and receive both outputs from the same inputs.
4. Get a distinct platform-tailored caption for each selected platform.
5. Review a shared seven-day plan whose every day includes an idea, format, tailored caption(s), call to action, and suggested metric.
6. Copy a platform caption and see confirmation.
7. Edit an input and generate updated results.
8. See clear validation, loading, empty, and request-failure states.
9. Recover from a failed request without losing the brief or prior successful results; retry or edit, and replace results only after a successful generation.

## Deferred From the POC

- **Authentication and saved campaign history** — not needed to demonstrate the current-session generation loop.
- **Content calendar as a separate feature** — the campaign plan itself is enough to prove the idea.
- **AI marketing chat** — not needed for the selected content-and-campaign workflow.
- **Broader platform and content-type support** — first prove the workflow with Instagram and Facebook.

## Possible Later Enhancements

Consider a separate content calendar, marketing chat, additional social platforms and content types, and saved campaigns after the core workflow is proven.

## Non-Goals

- **Automated social publishing** — the prototype produces content for the user to copy and publish themselves.
- **Paid advertising integrations** — the proof of concept focuses on organic content and planning.
- **Live analytics or performance claims** — metrics are suggestions only; the app does not connect to platform data.

## Open Questions

No product-defining questions remain for scope approval. Technology, AI-service integration, data handling, and implementation details are reserved for `4-spec`.
