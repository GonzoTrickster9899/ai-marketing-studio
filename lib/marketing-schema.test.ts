import { describe, expect, it } from "vitest";
import { marketingBriefSchema } from "./marketing-schema";
import { sampleBusiness } from "./sample-business";

describe("marketingBriefSchema", () => {
  it("accepts the coffee shop example", () => {
    expect(marketingBriefSchema.safeParse(sampleBusiness).success).toBe(true);
  });

  it("requires the core business details and one platform", () => {
    const result = marketingBriefSchema.safeParse({
      ...sampleBusiness,
      businessName: " ",
      targetAudience: "",
      platforms: [],
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const issuePaths = result.error.issues.map((issue) => issue.path[0]);
      expect(issuePaths).toContain("businessName");
      expect(issuePaths).toContain("targetAudience");
      expect(issuePaths).toContain("platforms");
    }
  });

  it("requires offer details only for the special offer goal", () => {
    expect(marketingBriefSchema.safeParse({ ...sampleBusiness, offer: "" }).success).toBe(false);
    expect(marketingBriefSchema.safeParse({ ...sampleBusiness, offer: "", marketingGoal: "increase_sales" }).success).toBe(true);
  });

  it("enforces field length limits", () => {
    const result = marketingBriefSchema.safeParse({ ...sampleBusiness, businessName: "a".repeat(121) });
    expect(result.success).toBe(false);
  });
});
