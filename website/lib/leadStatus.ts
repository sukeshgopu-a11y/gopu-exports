import { createAdminClient } from "@/src/lib/supabase/admin";
import { createClient } from "@supabase/supabase-js";
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

function createTokenUpdateClient(deliveryToken: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return createClient(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { "x-lead-delivery-token": deliveryToken } },
  });
}

async function updateWithDeliveryToken(table: LeadTable, id: string, delivery: LeadEmailDeliveryResult, deliveryToken?: string) {
  if (!deliveryToken) return false;
  const supabase = createTokenUpdateClient(deliveryToken);
  if (!supabase) return false;

  const functionName = table === "quotes" ? "record_quote_email_delivery" : "record_inquiry_email_delivery";
  const { error } = await supabase.rpc(functionName, {
    p_id: id,
    p_delivery_token: deliveryToken,
    p_admin_email_sent: delivery.admin.sent,
    p_admin_email_sent_at: delivery.admin.sentAt ?? null,
    p_admin_email_error: delivery.admin.error ?? null,
    p_customer_auto_reply_sent: delivery.customer.sent,
    p_customer_auto_reply_sent_at: delivery.customer.sentAt ?? null,
    p_customer_auto_reply_error: delivery.customer.error ?? null,
  });

  if (error) {
    console.error("Lead email token status update failed", { table, id, error: error.message });
    return false;
  }

  return true;
}

export async function updateLeadEmailStatus(
  table: LeadTable,
  id: string,
  delivery: LeadEmailDeliveryResult,
  deliveryToken?: string
) {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from(table)
      .update(deliveryToStatusUpdate(delivery))
      .eq("id", id);

    if (error) {
      const tokenUpdated = await updateWithDeliveryToken(table, id, delivery, deliveryToken);
      if (tokenUpdated) {
        console.info("Lead email status updated with delivery token", { table, id });
      } else {
        console.error("Lead email status update failed", { table, id, error: error.message });
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const tokenUpdated = await updateWithDeliveryToken(table, id, delivery, deliveryToken);
    if (tokenUpdated) {
      console.info("Lead email status updated with delivery token", { table, id });
    } else {
      console.error("Lead email status update skipped", { table, id, error: message });
    }
  }
}
