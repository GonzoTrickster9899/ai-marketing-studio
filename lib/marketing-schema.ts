import { z } from "zod";

export const marketingGoals = [
  { value: "brand_awareness", label: "Increase brand awareness", detail: "Help new people discover your business." },
  { value: "increase_sales", label: "Increase sales", detail: "Encourage purchases of a product or service." },
  { value: "special_offer", label: "Promote a special offer", detail: "Highlight a discount or limited-time deal." },
  { value: "engagement", label: "Increase engagement", detail: "Start conversations and earn shares or saves." },
  { value: "leads", label: "Generate leads or inquiries", detail: "Encourage messages, questions, or quote requests." },
  { value: "retention", label: "Retain existing customers", detail: "Encourage repeat visits and loyalty." },
] as const;

export const platformOptions = [
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
] as const;

export const brandTones = ["friendly", "professional", "playful", "persuasive"] as const;
const goalValues = marketingGoals.map((goal) => goal.value) as [typeof marketingGoals[number]["value"], ...typeof marketingGoals[number]["value"][]];
const platformValues = ["instagram", "facebook"] as const;
const marketingGoalSchema = z.enum(goalValues, { error: "Choose a marketing goal." });
const socialPlatformSchema = z.enum(platformValues);

export const marketingBriefSchema = z.object({
  businessName: z.string().trim().min(1, "Please enter a business name.").max(120, "Use 120 characters or fewer."),
  productOrService: z.string().trim().min(1, "Please describe your product or service.").max(300, "Use 300 characters or fewer."),
  offer: z.string().trim().max(300, "Use 300 characters or fewer.").optional().default(""),
  targetAudience: z.string().trim().min(1, "Please describe your target audience.").max(300, "Use 300 characters or fewer."),
  marketingGoal: marketingGoalSchema,
  platforms: z.array(socialPlatformSchema).min(1, "Choose at least one social platform.").max(2).refine((items) => new Set(items).size === items.length, "Choose each platform only once."),
  brandTone: z.enum(brandTones).default("friendly"),
}).superRefine((brief, context) => {
  if (brief.marketingGoal === "special_offer" && !brief.offer?.trim()) {
    context.addIssue({ code: "custom", path: ["offer"], message: "Describe the offer you want to promote." });
  }
});

export type MarketingBrief = z.infer<typeof marketingBriefSchema>;
export type MarketingBriefFormState = Omit<MarketingBrief, "marketingGoal"> & { marketingGoal: MarketingBrief["marketingGoal"] | "" };

const nonEmptyText = (limit: number) => z.string().trim().min(1).max(limit);
const outputPlatformSchema = socialPlatformSchema;
const socialPostSchema = z.object({
  platform: outputPlatformSchema,
  headline: nonEmptyText(120),
  caption: nonEmptyText(900),
  hashtags: z.array(nonEmptyText(40)).max(15),
  callToAction: nonEmptyText(180),
});
const campaignCaptionSchema = z.object({
  platform: outputPlatformSchema,
  caption: nonEmptyText(900),
});
const campaignDaySchema = z.object({
  day: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5), z.literal(6), z.literal(7)]),
  contentIdea: nonEmptyText(240),
  format: z.enum(["reel", "story", "carousel", "photo", "video", "text"]),
  captions: z.array(campaignCaptionSchema).min(1).max(2),
  callToAction: nonEmptyText(180),
  suggestedMetric: nonEmptyText(160),
});

export const marketingResultSchema = z.object({
  campaignSummary: nonEmptyText(400),
  socialContent: z.array(socialPostSchema).min(1).max(2),
  campaignPlan: z.array(campaignDaySchema).length(7),
});

export type MarketingResult = z.infer<typeof marketingResultSchema>;

export function validateMarketingResultForBrief(value: unknown, brief: MarketingBrief): MarketingResult {
  const result = marketingResultSchema.parse(value);
  const expectedPlatforms = [...brief.platforms].sort();
  const actualSocialPlatforms = result.socialContent.map((item) => item.platform).sort();
  if (actualSocialPlatforms.length !== expectedPlatforms.length || actualSocialPlatforms.some((platform, index) => platform !== expectedPlatforms[index])) {
    throw new Error("Generated social content platforms do not match the brief.");
  }

  for (const [index, day] of result.campaignPlan.entries()) {
    if (day.day !== index + 1) throw new Error("Campaign days must be ordered from day 1 through day 7.");
    const dayPlatforms = day.captions.map((item) => item.platform).sort();
    if (dayPlatforms.length !== expectedPlatforms.length || dayPlatforms.some((platform, platformIndex) => platform !== expectedPlatforms[platformIndex])) {
      throw new Error(`Campaign day ${day.day} platforms do not match the brief.`);
    }
  }
  return result;
}

export const blankMarketingBrief: MarketingBriefFormState = {
  businessName: "",
  productOrService: "",
  offer: "",
  targetAudience: "",
  marketingGoal: "" as MarketingBrief["marketingGoal"] | "",
  platforms: [],
  brandTone: "friendly",
};
