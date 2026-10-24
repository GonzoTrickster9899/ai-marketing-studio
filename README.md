# AI Marketing Studio

AI Marketing Studio helps small businesses and beginner marketers turn one business brief into platform-specific social content and a coordinated seven-day campaign plan.

The proof of concept supports Instagram and Facebook. It does not require an account and does not save campaign history.

## Features

- Enter business details, audience, goal, optional promotion, platforms, and brand tone.
- Load and edit a coffee-shop example.
- Generate a separate caption for each selected platform and one shared seven-day campaign plan.
- Review daily content ideas, platform captions, calls to action, and suggested metrics.
- Copy captions, edit the brief, regenerate, and recover from failed requests without losing prior results.

## Technology

- Next.js App Router, React, and TypeScript
- Tailwind CSS
- OpenRouter through the OpenAI JavaScript SDK and Responses API with structured output
- Zod for request and response validation
- Vitest and Testing Library for automated tests

## Run locally

Requirements: Node.js 20.9 or later and npm.

```bash
git clone https://github.com/GonzoTrickster9899/ai-marketing-studio.git
cd ai-marketing-studio
npm install
```

Create a local environment file:

```powershell
Copy-Item .env.example .env.local
```

On macOS or Linux, use `cp .env.example .env.local` instead. Edit `.env.local` and set `OPENROUTER_API_KEY` to your own OpenRouter key. The example file uses a placeholder; never commit a real key. The key is read by the server and must not use a `NEXT_PUBLIC_` prefix.

```env
OPENROUTER_API_KEY=your-openrouter-api-key-here
OPENROUTER_MODEL=openai/gpt-6-luna
GENERATION_ENABLED=true
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Live generation requires a valid OpenRouter key and a model that supports the structured response format used by the app.

## Checks

```bash
npm run test
npm run lint
npm run build
```

The tests mock AI responses, so routine test runs do not require a provider key or consume API credits.

## Privacy and secrets

The app sends the business brief to OpenRouter and the selected AI model when the user generates a plan. The app does not save the brief. Provider processing and retention are governed by their terms. Do not enter confidential business information or customer personal data. `.env.local` is ignored by Git; keep API keys server-side and out of source control.

## Project documents

- [Scope](devpost/scope.md)
- [Product requirements](devpost/prd.md)
- [Technical specification](devpost/spec.md)
- [Build and shipping checklist](devpost/checklist.md)
- [Interactive app map](devpost/app-map.html)

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).
