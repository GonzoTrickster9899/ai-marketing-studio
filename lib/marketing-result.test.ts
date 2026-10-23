import { describe, expect, it } from "vitest";
import { zodTextFormat } from "openai/helpers/zod";
import { marketingResultSchema, validateMarketingResultForBrief, type MarketingBrief } from "./marketing-schema";
import { sampleBusiness } from "./sample-business";

function makeResult(platforms: readonly ("instagram" | "facebook")[]) {
  return {
    campaignSummary: "Encourage local customers to try a weekend drink offer.",
    socialContent: platforms.map((platform) => ({
      platform,
      headline: platform === "instagram" ? "A weekend treat" : "Weekend drinks at Daily Grind",
      caption: "Enjoy an iced coffee or matcha latte this weekend.",
      hashtags: ["CoffeeBreak"],
      callToAction: "Stop by this weekend.",
    })),
    campaignPlan: Array.from({ length: 7 }, (_, index) => ({
      day: index + 1,
      contentIdea: `Share a drink moment for day ${index + 1}.`,
      format: "story" as const,
      captions: platforms.map((platform) => ({ platform, caption: `A platform-tailored caption for day ${index + 1}.` })),
      callToAction: "Visit this weekend.",
      suggestedMetric: "Track story replies.",
    })),
  };
}

describe("marketingResultSchema", () => {
  it("converts to an OpenAI strict JSON schema format", () => {
    const format = zodTextFormat(marketingResultSchema, "marketing_result");
    expect(format.type).toBe("json_schema");
    expect(format.name).toBe("marketing_result");
    expect(format.strict).toBe(true);
  });

  it("accepts seven ordered days with one item per selected platform", () => {
    const result = makeResult(sampleBusiness.platforms);
    expect(marketingResultSchema.safeParse(result).success).toBe(true);
    expect(validateMarketingResultForBrief(result, sampleBusiness).campaignPlan).toHaveLength(7);
  });

  it("rejects plans that do not contain exactly seven days", () => {
    const result = makeResult(sampleBusiness.platforms);
    expect(marketingResultSchema.safeParse({ ...result, campaignPlan: result.campaignPlan.slice(0, 6) }).success).toBe(false);
  });

  it("rejects days that are out of order", () => {
    const result = makeResult(sampleBusiness.platforms);
    const [first, second, ...rest] = result.campaignPlan;
    expect(() => validateMarketingResultForBrief({ ...result, campaignPlan: [second, first, ...rest] }, sampleBusiness)).toThrow(/ordered/);
  });

  it("rejects platform sets that differ from the user's brief", () => {
    const instagramOnly: MarketingBrief = { ...sampleBusiness, platforms: ["instagram"] };
    const result = makeResult(["instagram", "facebook"]);
    expect(() => validateMarketingResultForBrief(result, instagramOnly)).toThrow(/platforms do not match/);
  });
});
