// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CopyButton } from "./copy-button";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("CopyButton", () => {
  it("keeps confirmation state independent between platform cards", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    render(<><CopyButton text="Instagram" /><CopyButton text="Facebook" /></>);
    const [instagramButton, facebookButton] = screen.getAllByRole("button", { name: "Copy caption" });

    await act(async () => { fireEvent.click(instagramButton); });

    expect(screen.getByRole("button", { name: "Copied" })).toBeTruthy();
    expect(facebookButton.textContent).toContain("Copy caption");
  });

  it("resets success after two seconds and restarts the timer on another copy", async () => {
    vi.useFakeTimers();
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    render(<CopyButton text="Caption" />);
    await act(async () => { fireEvent.click(screen.getByRole("button", { name: "Copy caption" })); });
    expect(screen.getByRole("button", { name: "Copied" })).toBeTruthy();

    await act(async () => { vi.advanceTimersByTime(1500); });
    await act(async () => { fireEvent.click(screen.getByRole("button", { name: "Copied" })); });
    await act(async () => { vi.advanceTimersByTime(1500); });
    expect(screen.getByRole("button", { name: "Copied" })).toBeTruthy();
    await act(async () => { vi.advanceTimersByTime(500); });
    expect(screen.getByRole("button", { name: "Copy caption" })).toBeTruthy();
    expect(writeText).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });

  it("cleans up the confirmation timer on unmount", async () => {
    vi.useFakeTimers();
    vi.stubGlobal("navigator", { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } });
    const { unmount } = render(<CopyButton text="Caption" />);
    await act(async () => { fireEvent.click(screen.getByRole("button", { name: "Copy caption" })); });
    expect(vi.getTimerCount()).toBe(1);

    unmount();

    expect(vi.getTimerCount()).toBe(0);
    vi.useRealTimers();
  });

  it("copies content and announces success", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    render(<CopyButton text={"Headline\n\nCaption"} />);

    fireEvent.click(screen.getByRole("button", { name: "Copy caption" }));

    expect((await screen.findByRole("status")).textContent).toContain("Content copied.");
    expect(writeText).toHaveBeenCalledWith("Headline\n\nCaption");
  });

  it("uses the legacy clipboard fallback when the modern API is unavailable", async () => {
    vi.stubGlobal("navigator", {});
    Object.defineProperty(document, "execCommand", { configurable: true, value: vi.fn(() => true) });
    render(<CopyButton text="Caption" />);

    fireEvent.click(screen.getByRole("button", { name: "Copy caption" }));

    expect((await screen.findByRole("status")).textContent).toContain("Content copied.");
    expect(document.execCommand).toHaveBeenCalledWith("copy");
  });

  it("tells the user to select and copy manually if clipboard access fails", async () => {
    vi.stubGlobal("navigator", {});
    Object.defineProperty(document, "execCommand", { configurable: true, value: vi.fn(() => false) });
    render(<CopyButton text="Caption" />);

    fireEvent.click(screen.getByRole("button", { name: "Copy caption" }));

    expect((await screen.findByRole("status")).textContent).toContain("Select and copy the content manually.");
  });
});
