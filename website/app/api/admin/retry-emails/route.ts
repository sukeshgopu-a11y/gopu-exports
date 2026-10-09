import { NextResponse } from "next/server";
import { requireAdminClient, unauthorized } from "@/lib/adminAuth";
import { createAdminClient } from "@/src/lib/supabase/admin";
import { sendLeadEmails, type LeadEmailPayload } from "@/lib/leadEmail";
import { updateLeadEmailStatus } from "@/lib/leadStatus";
export const maxDuration = 180;

async function retry() {
  const db = createAdminClient();
  const { data: jobs, error } = await db.rpc("claim_lead_email_jobs");
  if (error) return NextResponse.json({ error: "Unable to claim delivery jobs" }, { status: 503 });
  let processed = 0;
  for (const job of jobs ?? []) {
    const table = job.lead_table as "inquiries" | "quotes";
    const { data: lead, error } = await db.from(table).select("*").eq("id", job.lead_id).maybeSingle();
    if (error || !lead) continue;
    if (!lead.email_payload) continue;
    const delivery = await sendLeadEmails(lead.email_payload as LeadEmailPayload, {
      admin: { sent: lead.admin_email_sent === true, sentAt: lead.admin_email_sent_at },
      customer: { sent: lead.customer_auto_reply_sent === true, sentAt: lead.customer_auto_reply_sent_at },
    });
    await updateLeadEmailStatus(table, lead.id, delivery);
    processed++;
  }
  return NextResponse.json({ processed });
}
export async function POST() {
  if (!(await requireAdminClient())) return unauthorized();
  return retry();
}
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) return unauthorized();
  return retry();
}
