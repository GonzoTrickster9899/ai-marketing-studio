import { aiConfigurationMessage, GenerationError, errorPayload } from "@/lib/generation-error";
import { generateMarketingResult } from "@/lib/openai-marketing";
import { marketingBriefSchema } from "@/lib/marketing-schema";

const MAX_REQUEST_BYTES = 8 * 1024;
const invalidRequest = () => new GenerationError("INVALID_REQUEST", 400, "Check the business brief and try again.");

async function readRequestBody(request: Request): Promise<string | null> {
  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_REQUEST_BYTES) return null;
  if (!request.body) return null;

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    totalBytes += value.byteLength;
    if (totalBytes > MAX_REQUEST_BYTES) {
      await reader.cancel().catch(() => undefined);
      return null;
    }
    chunks.push(value);
  }

  const bytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(bytes);
}

function jsonError(error: GenerationError) {
  return Response.json(errorPayload(error), {
    status: error.status,
    headers: error.retryAfterSeconds ? { "Retry-After": String(error.retryAfterSeconds) } : undefined,
  });
}

export async function POST(request: Request) {
  try {
    if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
      throw invalidRequest();
    }

    const bodyText = await readRequestBody(request);
    if (bodyText === null) throw invalidRequest();

    let body: unknown;
    try {
      body = JSON.parse(bodyText);
    } catch {
      throw invalidRequest();
    }
    if (!body || typeof body !== "object" || Array.isArray(body) || !Object.hasOwn(body, "brief")) {
      throw invalidRequest();
    }

    const parsedBody = body as { brief?: unknown };
    const briefResult = marketingBriefSchema.safeParse(parsedBody.brief);
    if (!briefResult.success) throw invalidRequest();

    if (process.env.GENERATION_ENABLED?.toLowerCase() === "false") {
      throw new GenerationError("GENERATION_DISABLED", 503, "Campaign generation is temporarily paused. Please try again later.");
    }
    if (!process.env.OPENAI_API_KEY) {
      console.error("[marketing-api] OPENAI_API_KEY is missing.");
      throw new GenerationError("AI_NOT_CONFIGURED", 503, aiConfigurationMessage("missing"));
    }

    const result = await generateMarketingResult(briefResult.data);
    return Response.json({ result });
  } catch (error) {
    return jsonError(error instanceof GenerationError
      ? error
      : new GenerationError("INTERNAL_ERROR", 500, "Something went wrong while creating the campaign. Please try again.", true));
  }
}
