import "server-only";
import { createHash } from "node:crypto";
import { isIP } from "node:net";
import { createAdminClient } from "@/src/lib/supabase/admin";

/** Vercel overwrites this header. Other hosts require an explicitly trusted ingress. */
export async function consumeRateLimit(request: Request, scope: string, limit: number, seconds: number) {
  const header = process.env.TRUSTED_CLIENT_IP_HEADER?.trim()
    || (process.env.VERCEL === "1" ? "x-vercel-forwarded-for" : "");
  const candidate = header ? request.headers.get(header)?.split(",")[0]?.trim() || "" : "";
  const ip = isIP(candidate) ? candidate : "unknown";
  const key = createHash("sha256").update(`${scope}:${ip}`).digest("hex");
  const { data, error } = await createAdminClient().rpc("consume_request_limit", {
    p_key: key, p_limit: limit, p_window_seconds: seconds,
  });
  if (error) throw new Error("Submission protection unavailable");
  return data === true;
}
