export type GenerationErrorCode =
  | "INVALID_REQUEST"
  | "RATE_LIMITED"
  | "AI_NOT_CONFIGURED"
  | "GENERATION_DISABLED"
  | "AI_REFUSED"
  | "AI_INCOMPLETE"
  | "INVALID_AI_OUTPUT"
  | "AI_UNAVAILABLE"
  | "AI_TIMEOUT"
  | "INTERNAL_ERROR";

export class GenerationError extends Error {
  constructor(
    readonly code: GenerationErrorCode,
    readonly status: number,
    message: string,
    readonly retryable = false,
    readonly retryAfterSeconds?: number,
  ) {
    super(message);
    this.name = "GenerationError";
  }
}

export function aiConfigurationMessage(reason: "missing" | "rejected" = "missing") {
  if (process.env.NODE_ENV === "production") {
    return "AI generation is temporarily unavailable. Please try again later.";
  }

  return reason === "missing"
    ? "AI generation needs setup. Add OPENROUTER_API_KEY to the project-root .env.local, restart the development server, then try again."
    : "OpenRouter refused the request. Check that OPENROUTER_API_KEY is an enabled key at openrouter.ai/keys and that the account or key has request access. Then restart the development server and try again.";
}

export function aiModelMessage(reason: "unsupported" | "billing") {
  if (process.env.NODE_ENV === "production") {
    return "AI generation is temporarily unavailable. Please try again later.";
  }

  return reason === "unsupported"
    ? "OpenRouter could not use the configured model or response format. Check OPENROUTER_MODEL in .env.local; try openai/gpt-6-luna, recursive/flint-v1.0:free, or openrouter/free, then restart the development server."
    : "OpenRouter could not process this request with the current account. Check your OpenRouter credits or choose a free model in OPENROUTER_MODEL, then try again.";
}

export function errorPayload(error: GenerationError) {
  return {
    error: {
      code: error.code,
      message: error.message,
      retryable: error.retryable,
      ...(error.retryAfterSeconds ? { retryAfterSeconds: error.retryAfterSeconds } : {}),
    },
  };
}
