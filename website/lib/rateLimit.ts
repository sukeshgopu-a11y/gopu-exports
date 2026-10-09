import "server-only";
import { createHash } from "node:crypto";
import { createAdminClient } from "@/src/lib/supabase/admin";

/** Configure only an ingress-overwritten header. Unknown ingress shares a bucket. */
export async function consumeRateLimit(request: Request, scope: string, limit: number, seconds: number) {
  const header = process.env.TRUSTED_CLIENT_IP_HEADER;
  const ip = header ? request.headers.get(header)?.split(",")[0]?.trim() || "unknown" : "unknown";
  const key = createHash("sha256").update(`${scope}:${ip}`).digest("hex");
  const { data, error } = await createAdminClient().rpc("consume_request_limit", {
    p_key: key, p_limit: limit, p_window_seconds: seconds,
  });
  if (error) throw new Error("Submission protection unavailable");
  return data === true;
}
