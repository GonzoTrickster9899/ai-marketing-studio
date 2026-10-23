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
const goalValues = ["brand_awareness", "increase_sales", "special_offer", "engagement", "leads", "retention"] as const;

export const marketingBriefSchema = z.object({
  businessName: z.string().trim().min(1, "Please enter a business name.").max(80, "Use 80 characters or fewer."),
  productOrService: z.string().trim().min(1, "Please describe your product or service.").max(160, "Use 160 characters or fewer."),
  offer: z.string().trim().max(180, "Use 180 characters or fewer.").optional().default(""),
  targetAudience: z.string().trim().min(1, "Please describe your target audience.").max(160, "Use 160 characters or fewer."),
  marketingGoal: z.enum(goalValues, { error: "Choose a marketing goal." }),
  platforms: z.array(z.enum(["instagram", "facebook"])).min(1, "Choose at least one social platform.").max(2),
  brandTone: z.enum(brandTones).default("friendly"),
}).superRefine((brief, context) => {
  if (brief.marketingGoal === "special_offer" && !brief.offer?.trim()) {
    context.addIssue({ code: "custom", path: ["offer"], message: "Describe the offer you want to promote." });
  }
});

export type MarketingBrief = z.infer<typeof marketingBriefSchema>;
export type MarketingBriefFormState = Omit<MarketingBrief, "marketingGoal"> & { marketingGoal: MarketingBrief["marketingGoal"] | "" };

export const blankMarketingBrief: MarketingBriefFormState = {
  businessName: "",
  productOrService: "",
  offer: "",
  targetAudience: "",
  marketingGoal: "" as MarketingBrief["marketingGoal"] | "",
  platforms: [],
  brandTone: "friendly",
};
