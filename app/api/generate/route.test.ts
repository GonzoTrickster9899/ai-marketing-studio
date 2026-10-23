import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GenerationError } from "@/lib/generation-error";
import type { MarketingResult } from "@/lib/marketing-schema";
import { sampleBusiness } from "@/lib/sample-business";
import { POST } from "./route";
import { generateMarketingResult } from "@/lib/openrouter-marketing";

vi.mock("@/lib/openrouter-marketing", () => ({ generateMarketingResult: vi.fn() }));

const mockGenerate = vi.mocked(generateMarketingResult);

const resultFixture: MarketingResult = {
  campaignSummary: "Introduce the weekend offer to local coffee fans.",
  socialContent: sampleBusiness.platforms.map((platform) => ({
    platform,
    headline: "A weekend coffee treat",
    caption: "Try an iced coffee or matcha this weekend.",
    hashtags: ["CoffeeBreak"],
    callToAction: "Visit this weekend.",
  })),
  campaignPlan: Array.from({ length: 7 }, (_, index) => ({
    day: (index + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7,
    contentIdea: `Show a featured drink on day ${index + 1}.`,
    format: "story" as const,
    captions: sampleBusiness.platforms.map((platform) => ({ platform, caption: `A tailored day ${index + 1} caption.` })),
    callToAction: "Visit this weekend.",
    suggestedMetric: "Track replies and saves.",
  })),
};

function makeRequest(body: unknown, headers: HeadersInit = { "content-type": "application/json" }) {
  return new Request("http://localhost:3000/api/generate", {
    method: "POST",
    headers,
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("POST /api/generate", () => {
  beforeEach(() => {
    process.env.OPENROUTER_API_KEY = "test-key-only";
    process.env.GENERATION_ENABLED = "true";
    mockGenerate.mockReset();
  });

  afterEach(() => {
    delete process.env.OPENROUTER_API_KEY;
    delete process.env.GENERATION_ENABLED;
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("returns a structured result for a valid brief", async () => {
    mockGenerate.mockResolvedValue(resultFixture);
    const response = await POST(makeRequest({ brief: sampleBusiness }));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ result: resultFixture });
    expect(mockGenerate).toHaveBeenCalledWith(sampleBusiness);
  });

  it("rejects invalid input before calling the provider", async () => {
    const response = await POST(makeRequest({ brief: { ...sampleBusiness, platforms: [] } }));
    expect(response.status).toBe(400);
    expect(mockGenerate).not.toHaveBeenCalled();
  });

  it("rejects requests over the 8 KB body limit", async () => {
    const response = await POST(makeRequest("x".repeat(9_000)));
    expect(response.status).toBe(400);
    expect(mockGenerate).not.toHaveBeenCalled();
  });

  it("returns a safe configuration error when the key is missing", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => undefined);
    delete process.env.OPENROUTER_API_KEY;
    const response = await POST(makeRequest({ brief: sampleBusiness }));
    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({
      error: {
        code: "AI_NOT_CONFIGURED",
        retryable: false,
        message: "AI generation needs setup. Add OPENROUTER_API_KEY to the project-root .env.local, restart the development server, then try again.",
      },
    });
    expect(log).toHaveBeenCalledWith("[marketing-api] OPENROUTER_API_KEY is missing.");
    expect(mockGenerate).not.toHaveBeenCalled();
  });

  it("keeps missing-configuration messages generic in production", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    vi.stubEnv("NODE_ENV", "production");
    delete process.env.OPENROUTER_API_KEY;
    const response = await POST(makeRequest({ brief: sampleBusiness }));
    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({
      error: {
        code: "AI_NOT_CONFIGURED",
        message: "AI generation is temporarily unavailable. Please try again later.",
      },
    });
  });

  it("honors the emergency generation switch", async () => {
    process.env.GENERATION_ENABLED = "false";
    const response = await POST(makeRequest({ brief: sampleBusiness }));
    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({ error: { code: "GENERATION_DISABLED" } });
    expect(mockGenerate).not.toHaveBeenCalled();
  });

  it("normalizes provider errors and preserves retry delay", async () => {
    mockGenerate.mockRejectedValue(new GenerationError("RATE_LIMITED", 429, "Wait before retrying.", true, 23));
    const response = await POST(makeRequest({ brief: sampleBusiness }));
    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("23");
    expect(await response.json()).toMatchObject({ error: { code: "RATE_LIMITED", retryable: true, retryAfterSeconds: 23 } });
  });
});
