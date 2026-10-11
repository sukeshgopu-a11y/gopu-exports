import {
  getLeadEmailConfigurationError,
  sendAdminLeadEmail,
  sendCustomerAutoReply,
  type EmailAttemptResult,
  type LeadEmailPayload,
} from "@/lib/email";

export { getLeadEmailConfigurationError, type EmailAttemptResult, type LeadEmailPayload };

export type LeadEmailDeliveryResult = {
  admin: EmailAttemptResult;
  customer: EmailAttemptResult;
};

export async function sendLeadEmails(payload: LeadEmailPayload, previous?: LeadEmailDeliveryResult): Promise<LeadEmailDeliveryResult> {
  const admin = previous?.admin.sent ? previous.admin : await sendAdminLeadEmail(payload);

  if (admin.sent) {
    console.log("Admin email sent successfully", { leadId: payload.id, kind: payload.kind });
  } else {
    console.error("Admin email failed", admin.error, admin.resendResponse);
  }

  const customer = previous?.customer.sent ? previous.customer : await sendCustomerAutoReply(payload);

  if (customer.sent) {
    console.log("Customer auto-reply sent successfully", { leadId: payload.id, kind: payload.kind });
  } else {
    console.error("Customer auto-reply failed", customer.error, customer.resendResponse);
  }

  return { admin, customer };
}
