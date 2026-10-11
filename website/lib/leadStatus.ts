import { createAdminClient } from "@/src/lib/supabase/admin";
import type { LeadEmailDeliveryResult } from "@/lib/leadEmail";

type LeadTable = "inquiries" | "quotes";

export function deliveryToStatusUpdate(delivery: LeadEmailDeliveryResult) {
  return {
    admin_email_sent: delivery.admin.sent,
    admin_email_sent_at: delivery.admin.sentAt ?? null,
    admin_email_error: delivery.admin.error ?? null,
    customer_auto_reply_sent: delivery.customer.sent,
    customer_auto_reply_sent_at: delivery.customer.sentAt ?? null,
    customer_auto_reply_error: delivery.customer.error ?? null,
  };
}

export async function updateLeadEmailStatus(table: LeadTable, id: string, delivery: LeadEmailDeliveryResult) {
  const { error } = await createAdminClient().from(table).update(deliveryToStatusUpdate(delivery)).eq("id", id);
  if (!error && delivery.admin.sent && delivery.customer.sent) {
    await createAdminClient().from("lead_email_jobs").update({ completed_at: new Date().toISOString() }).eq("lead_table", table).eq("lead_id", id);
  }
  if (error) console.error("Lead email status update failed", { table, id, error: error.message });
}
