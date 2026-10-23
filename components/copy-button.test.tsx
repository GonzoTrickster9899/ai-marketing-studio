// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CopyButton } from "./copy-button";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("CopyButton", () => {
  it("copies content and announces success", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    render(<CopyButton text={"Headline\n\nCaption"} />);

    fireEvent.click(screen.getByRole("button", { name: "Copy content" }));

    expect((await screen.findByRole("status")).textContent).toContain("Content copied.");
    expect(writeText).toHaveBeenCalledWith("Headline\n\nCaption");
  });

  it("uses the legacy clipboard fallback when the modern API is unavailable", async () => {
    vi.stubGlobal("navigator", {});
    Object.defineProperty(document, "execCommand", { configurable: true, value: vi.fn(() => true) });
    render(<CopyButton text="Caption" />);

    fireEvent.click(screen.getByRole("button", { name: "Copy content" }));

    expect((await screen.findByRole("status")).textContent).toContain("Content copied.");
    expect(document.execCommand).toHaveBeenCalledWith("copy");
  });

  it("tells the user to select and copy manually if clipboard access fails", async () => {
    vi.stubGlobal("navigator", {});
    Object.defineProperty(document, "execCommand", { configurable: true, value: vi.fn(() => false) });
    render(<CopyButton text="Caption" />);

    fireEvent.click(screen.getByRole("button", { name: "Copy content" }));

    expect((await screen.findByRole("status")).textContent).toContain("Select and copy the content manually.");
  });
});
