"use client";

import { useState } from "react";

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
  const [feedback, setFeedback] = useState("");

  async function handleCopy() {
    try {
      await copyText(text);
      setFeedback("Content copied.");
    } catch {
      setFeedback("Copy is unavailable. Select and copy the content manually.");
    }
  }

  return (
    <div className="copy-control">
      <button className="copy-button" type="button" onClick={handleCopy}>
        <span aria-hidden="true">{feedback === "Content copied." ? "✓" : "▢"}</span>
        {feedback === "Content copied." ? "Copied" : "Copy content"}
      </button>
      {feedback && <span className="copy-feedback" role="status">{feedback}</span>}
    </div>
  );
}
