// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MarketingStudio } from "./marketing-studio";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

const generatedResult = {
  campaignSummary: "Invite local coffee fans to try the weekend drinks offer.",
  socialContent: ["instagram", "facebook"].map((platform) => ({
    platform,
    headline: "A weekend coffee treat",
    caption: `Try a matcha latte at Daily Grind Coffee on ${platform}.`,
    hashtags: ["CoffeeTime"],
    callToAction: "Visit us this weekend.",
  })),
  campaignPlan: Array.from({ length: 7 }, (_, index) => ({
    day: index + 1,
    contentIdea: `Showcase a coffee moment ${index + 1}`,
    format: "photo",
    captions: ["instagram", "facebook"].map((platform) => ({
      platform,
      caption: `Enjoy a coffee moment on ${platform}.`,
    })),
    callToAction: "Visit this weekend.",
    suggestedMetric: "Track post engagement.",
  })),
};

describe("MarketingStudio business brief", () => {
  it("starts blank, loads the sample, and keeps sample fields editable", () => {
    render(<MarketingStudio />);
    expect((screen.getByLabelText(/Business name/) as HTMLInputElement).value).toBe("");
    expect((screen.getByLabelText(/Product or service/) as HTMLInputElement).value).toBe("");

    fireEvent.click(screen.getByRole("button", { name: /Try sample business/ }));
    expect(screen.getByText("Sample business loaded — edit any field to personalize your brief.")).toBeTruthy();
    expect((screen.getByLabelText(/Business name/) as HTMLInputElement).value).toBe("Daily Grind Coffee");

    fireEvent.change(screen.getByLabelText(/Business name/), { target: { value: "My Coffee Shop" } });
    expect((screen.getByLabelText(/Business name/) as HTMLInputElement).value).toBe("My Coffee Shop");
  });

  it("lists each required field when an empty brief is submitted", () => {
    render(<MarketingStudio />);
    fireEvent.click(screen.getByRole("button", { name: /Marketing Plan/ }));

    expect(screen.getByText("Please enter a business name.")).toBeTruthy();
    expect(screen.getByText("Please describe your product or service.")).toBeTruthy();
    expect(screen.getByText("Please describe your target audience.")).toBeTruthy();
    expect(screen.getByText("Choose a marketing goal.")).toBeTruthy();
    expect(screen.getByText("Choose at least one social platform.")).toBeTruthy();
  });

  it("shows every missing required field, preserves entered values, and focuses the first error", async () => {
    render(<MarketingStudio />);
    const businessName = screen.getByLabelText(/Business name/);
    fireEvent.change(businessName, { target: { value: "A saved business" } });
    fireEvent.click(screen.getByRole("button", { name: /Marketing Plan/ }));

    expect(await screen.findByText("Please describe your product or service.")).toBeTruthy();
    expect(screen.getByText("Please describe your target audience.")).toBeTruthy();
    expect(screen.getByText("Choose a marketing goal.")).toBeTruthy();
    expect(screen.getByText("Choose at least one social platform.")).toBeTruthy();
    expect((businessName as HTMLInputElement).value).toBe("A saved business");
    const productField = screen.getByLabelText(/Product or service/);
    await waitFor(() => expect(document.activeElement).toBe(productField));

    fireEvent.change(productField, { target: { value: "Coffee and pastries" } });
    expect(screen.queryByText("Please describe your product or service.")).toBeNull();
  });

  it("requires an offer for the special-offer goal and clears the error when corrected", () => {
    render(<MarketingStudio />);
    fireEvent.click(screen.getByRole("button", { name: /Try sample business/ }));
    fireEvent.change(screen.getByLabelText(/Offer or promotion/), { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: /Marketing Plan/ }));

    expect(screen.getByText("Describe the offer you want to promote.")).toBeTruthy();
    fireEvent.change(screen.getByLabelText(/Offer or promotion/), { target: { value: "Free size upgrade this weekend" } });
    expect(screen.queryByText("Describe the offer you want to promote.")).toBeNull();
  });

  it("generates and renders both coordinated outputs from the sample brief", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ result: generatedResult }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }));
    vi.stubGlobal("fetch", fetchMock);
    render(<MarketingStudio />);
    fireEvent.click(screen.getByRole("button", { name: /Try sample business/ }));
    fireEvent.click(screen.getByRole("button", { name: /Marketing Plan/ }));
    fireEvent.submit(screen.getByLabelText(/Business name/).closest("form")!);

    expect(screen.getByRole("status").textContent).toContain("Creating your marketing campaign");
    expect(await screen.findAllByRole("heading", { name: "A weekend coffee treat" })).toHaveLength(2);
    expect(screen.getByText("Your seven-day plan")).toBeTruthy();
    expect(screen.getAllByText(/Track post engagement/)).toHaveLength(7);
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).brief.businessName).toBe("Daily Grind Coffee");
  });

  it("preserves the brief and offers retry after a generation error", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      error: { message: "The AI service is temporarily unavailable. Please try again." },
    }), { status: 503, headers: { "Content-Type": "application/json" } }));
    vi.stubGlobal("fetch", fetchMock);
    render(<MarketingStudio />);
    fireEvent.click(screen.getByRole("button", { name: /Try sample business/ }));
    fireEvent.click(screen.getByRole("button", { name: /Marketing Plan/ }));

    expect(await screen.findByRole("alert")).toBeTruthy();
    expect((screen.getByLabelText(/Business name/) as HTMLInputElement).value).toBe("Daily Grind Coffee");
    expect(screen.getByRole("button", { name: /Try again/ })).toBeTruthy();
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("gives local developers actionable guidance for missing AI configuration", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      error: {
        code: "AI_NOT_CONFIGURED",
        message: "AI generation needs setup. Add OPENROUTER_API_KEY to the project-root .env.local, restart the development server, then try again.",
        retryable: false,
      },
    }), { status: 503, headers: { "Content-Type": "application/json" } }));
    vi.stubGlobal("fetch", fetchMock);
    render(<MarketingStudio />);
    fireEvent.click(screen.getByRole("button", { name: /Try sample business/ }));
    fireEvent.click(screen.getByRole("button", { name: /Marketing Plan/ }));

    expect(await screen.findByText("AI setup is needed")).toBeTruthy();
    expect(screen.getByText(/restart the development server/)).toBeTruthy();
    expect(screen.getByRole("button", { name: /Try again after setup/ })).toBeTruthy();
  });

  it("keeps previous results after a failed regeneration and replaces them after retry succeeds", async () => {
    const revisedResult = {
      ...generatedResult,
      socialContent: generatedResult.socialContent.map((content) => ({ ...content, headline: "A fresh campaign idea" })),
    };
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ result: generatedResult }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ error: { message: "The AI service is temporarily unavailable." } }), { status: 503 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ result: revisedResult }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    render(<MarketingStudio />);
    fireEvent.click(screen.getByRole("button", { name: /Try sample business/ }));
    fireEvent.click(screen.getByRole("button", { name: /Marketing Plan/ }));
    expect(await screen.findAllByRole("heading", { name: "A weekend coffee treat" })).toHaveLength(2);

    fireEvent.change(screen.getByLabelText(/Business name/), { target: { value: "Updated Coffee Shop" } });
    fireEvent.click(screen.getByRole("button", { name: /Regenerate Marketing Plan/ }));
    expect(await screen.findByText("Showing your last successful campaign until this request succeeds.")).toBeTruthy();
    expect(screen.getAllByRole("heading", { name: "A weekend coffee treat" })).toHaveLength(2);
    expect((screen.getByLabelText(/Business name/) as HTMLInputElement).value).toBe("Updated Coffee Shop");

    fireEvent.click(screen.getByRole("button", { name: /Try again/ }));
    expect(await screen.findAllByRole("heading", { name: "A fresh campaign idea" })).toHaveLength(2);
    expect(screen.queryByText("Showing your last successful campaign until this request succeeds.")).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("uses the retry-after delay in rate-limit feedback", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      error: { message: "Rate limited.", retryAfterSeconds: 23 },
    }), { status: 429, headers: { "Content-Type": "application/json", "Retry-After": "23" } }));
    vi.stubGlobal("fetch", fetchMock);
    render(<MarketingStudio />);
    fireEvent.click(screen.getByRole("button", { name: /Try sample business/ }));
    fireEvent.click(screen.getByRole("button", { name: /Marketing Plan/ }));

    expect(await screen.findByText("Requests are temporarily limited. Wait about 23 seconds, then try again.")).toBeTruthy();
  });
});
