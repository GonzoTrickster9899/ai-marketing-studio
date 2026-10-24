"use client";

import { useEffect, useRef, useState } from "react";

type CopyButtonProps = { text: string };

async function copyText(text: string) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
  } catch {
    // Fall back for browsers that deny clipboard access.
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  let copied = false;
  try {
    textarea.select();
    copied = document.execCommand("copy");
  } finally {
    textarea.remove();
  }
  if (!copied) throw new Error("Clipboard copy was unavailable.");
}

export function CopyButton({ text }: CopyButtonProps) {
  const [feedback, setFeedback] = useState<"copied" | "error" | "">("");
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    };
  }, []);

  function showFeedback(nextFeedback: "copied" | "error") {
    if (!mounted.current) return;
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    setFeedback(nextFeedback);
    feedbackTimer.current = setTimeout(() => {
      setFeedback("");
      feedbackTimer.current = null;
    }, 2000);
  }

  async function handleCopy() {
    try {
      await copyText(text);
      showFeedback("copied");
    } catch {
      showFeedback("error");
    }
  }

  const announcement = feedback === "copied"
    ? "Content copied."
    : feedback === "error"
      ? "Copy is unavailable. Select and copy the content manually."
      : "";

  return (
    <div className="copy-control">
      <button className="copy-button" type="button" onClick={handleCopy}>
        <span aria-hidden="true">{feedback === "copied" ? "✓" : feedback === "error" ? "!" : "▢"}</span>
        {feedback === "copied" ? "Copied" : feedback === "error" ? "Copy failed" : "Copy caption"}
      </button>
      <span className="visually-hidden" role="status" aria-live="polite">{announcement}</span>
    </div>
  );
}
