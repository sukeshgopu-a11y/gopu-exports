import { getEmailRuntimeConfig, sendTestEmail } from "@/lib/email";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const config = getEmailRuntimeConfig();
  const result = await sendTestEmail();

  if (!result.sent) {
    console.error("Test email failed", result.error, result.resendResponse);
  }

  return NextResponse.json({
    ok: result.sent,
    hasResendKey: config.hasResendKey,
    resendKeyPrefix: config.resendKeyPrefix,
    adminEmail: config.adminEmail,
    emailFrom: config.emailFrom,
    resendResponse: result.resendResponse ?? "",
    error: result.error ?? "",
  });
}
