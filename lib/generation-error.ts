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
