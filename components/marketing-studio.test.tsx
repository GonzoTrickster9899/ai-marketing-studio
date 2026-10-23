// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { MarketingStudio } from "./marketing-studio";

afterEach(cleanup);

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
    fireEvent.click(screen.getByRole("button", { name: /Check my brief/ }));

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
    fireEvent.click(screen.getByRole("button", { name: /Check my brief/ }));

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
    fireEvent.click(screen.getByRole("button", { name: /Check my brief/ }));

    expect(screen.getByText("Describe the offer you want to promote.")).toBeTruthy();
    fireEvent.change(screen.getByLabelText(/Offer or promotion/), { target: { value: "Free size upgrade this weekend" } });
    expect(screen.queryByText("Describe the offer you want to promote.")).toBeNull();
  });
});
