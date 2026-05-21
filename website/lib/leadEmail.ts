import { Resend } from "resend";

type LeadKind = "inquiry" | "quote";

type PhoneDetails = {
  country_name: string;
  country_code: string;
  dial_code: string;
  local_phone: string;
  full_phone_e164: string;
  whatsapp_number_e164: string;
  formatted_international: string;
};

export type LeadEmailPayload = {
  id?: string;
  kind: LeadKind;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  phoneDetails?: PhoneDetails;
  country?: string;
  product?: string;
  quantity?: string;
  message?: string;
  sourceUrl?: string;
  timestamp?: string;
};

export type EmailAttemptResult = {
  sent: boolean;
  sentAt?: string;
  error?: string;
};

export type LeadEmailDeliveryResult = {
  admin: EmailAttemptResult;
  customer: EmailAttemptResult;
};

const DEFAULT_ADMIN_EMAIL = "admin@gopuexports.com";
const DEFAULT_FROM_EMAIL = "GOPU Exports <onboarding@resend.dev>";
const DEFAULT_SITE_URL = "https://gopuexports.com";

let resendClient: Resend | null = null;

export function getLeadEmailConfigurationError() {
  return process.env.RESEND_API_KEY ? null : "RESEND_API_KEY is not configured";
}

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  if (!resendClient) resendClient = new Resend(apiKey);
  return resendClient;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function stringifyError(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  try {
    return JSON.stringify(error);
  } catch {
    return "Unknown email delivery error";
  }
}

function leadLabel(kind: LeadKind) {
  return kind === "quote" ? "Quote Request" : "Export Inquiry";
}

function displayPhone(payload: LeadEmailPayload) {
  return payload.phoneDetails?.formatted_international || payload.phone || "";
}

function displayWhatsapp(payload: LeadEmailPayload) {
  return payload.phoneDetails?.formatted_international || payload.phone || "";
}

function phoneWithoutPlus(payload: LeadEmailPayload) {
  const value = payload.phoneDetails?.whatsapp_number_e164 || payload.phoneDetails?.full_phone_e164 || payload.phone || "";
  return value.replace(/\D/g, "");
}

function getOrigin(payload: LeadEmailPayload) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
  if (configured) return configured.replace(/\/$/, "");
  if (payload.sourceUrl) {
    try {
      return new URL(payload.sourceUrl).origin;
    } catch {
      return DEFAULT_SITE_URL;
    }
  }
  return DEFAULT_SITE_URL;
}

function dashboardLink(payload: LeadEmailPayload) {
  const origin = getOrigin(payload);
  if (payload.kind === "quote") {
    return payload.id ? `${origin}/dashboard/quotes/${payload.id}` : `${origin}/dashboard/quotes`;
  }
  return payload.id ? `${origin}/dashboard/inquiries?lead=${payload.id}` : `${origin}/dashboard/inquiries`;
}

function rows(payload: LeadEmailPayload): Array<[string, string | undefined]> {
  return [
    ["Lead Type", leadLabel(payload.kind)],
    ["Full Name", payload.name],
    ["Company Name", payload.company],
    ["Email", payload.email],
    ["Phone / WhatsApp", displayPhone(payload)],
    ["WhatsApp", displayWhatsapp(payload)],
    ["Phone Country", payload.phoneDetails?.country_name],
    ["Dial Code", payload.phoneDetails?.dial_code],
    ["Local Phone", payload.phoneDetails?.local_phone],
    ["Country", payload.country],
    ["Product Interested", payload.product],
    ["Quantity", payload.quantity],
    ["Message", payload.message],
    ["Source Page URL", payload.sourceUrl],
    ["Created At", payload.timestamp],
    ["Dashboard Link", dashboardLink(payload)],
  ];
}

function leadText(payload: LeadEmailPayload) {
  const callLink = displayPhone(payload) ? `tel:${payload.phoneDetails?.full_phone_e164 || payload.phone}` : "";
  const whatsapp = phoneWithoutPlus(payload);
  const whatsappLink = whatsapp ? `https://wa.me/${whatsapp}` : "";
  const emailLink = payload.email ? `mailto:${payload.email}` : "";
  return [
    ...rows(payload).map(([label, value]) => `${label}: ${value || "-"}`),
    "",
    "Quick Actions",
    `Call customer: ${callLink || "-"}`,
    `WhatsApp customer: ${whatsappLink || "-"}`,
    `Email customer: ${emailLink || "-"}`,
    `Open dashboard lead: ${dashboardLink(payload)}`,
  ].join("\n");
}

function actionLink(label: string, href: string, color = "#0E7490") {
  if (!href) return "";
  return `<a href="${escapeHtml(href)}" style="display:inline-block;margin:0 8px 8px 0;padding:10px 14px;border-radius:10px;background:${color};color:#ffffff;text-decoration:none;font-weight:700">${escapeHtml(label)}</a>`;
}

function leadHtml(payload: LeadEmailPayload) {
  const callHref = displayPhone(payload) ? `tel:${payload.phoneDetails?.full_phone_e164 || payload.phone}` : "";
  const whatsapp = phoneWithoutPlus(payload);
  const whatsappHref = whatsapp ? `https://wa.me/${whatsapp}` : "";
  const emailHref = payload.email ? `mailto:${payload.email}` : "";
  const tableRows = rows(payload)
    .map(([label, value]) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;font-weight:700;color:#0f172a;width:190px">${escapeHtml(label)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#334155">${escapeHtml(value || "-")}</td>
      </tr>
    `)
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#334155;background:#f8fafc;padding:24px">
      <div style="max-width:760px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden">
        <div style="background:#082033;color:#ffffff;padding:22px 24px">
          <p style="margin:0 0 6px;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:#67c9d8">GOPU Exports Lead</p>
          <h2 style="margin:0;font-size:24px">New GOPU Exports Lead - ${escapeHtml(leadLabel(payload.kind))}</h2>
        </div>
        <div style="padding:22px 24px">
          <p style="margin:0 0 18px">A new lead was submitted from the GOPU Exports website.</p>
          <div style="margin-bottom:16px">
            ${actionLink("Call customer", callHref)}
            ${actionLink("WhatsApp customer", whatsappHref, "#16a34a")}
            ${actionLink("Email customer", emailHref, "#334155")}
            ${actionLink("Open dashboard lead", dashboardLink(payload), "#0f172a")}
          </div>
          <table style="border-collapse:collapse;width:100%;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden">${tableRows}</table>
        </div>
      </div>
    </div>
  `;
}

function autoReplyProduct(payload: LeadEmailPayload) {
  return payload.product?.trim() || "your export requirement";
}

function autoReplyText(payload: LeadEmailPayload) {
  return `Hi ${payload.name},

Thank you for reaching out to GOPU Exports.

We've received your enquiry regarding ${autoReplyProduct(payload)} and our team will review the details shortly. If we need any additional information about quantity, destination port, packaging, or documentation requirements, we'll contact you directly.

We usually respond within 24-48 business hours.

For urgent requirements, you can also reach us directly:

Email: admin@gopuexports.com
Phone / WhatsApp: +91 87128 16876

Thank you again for considering GOPU Exports. We look forward to assisting you with your sourcing and export requirements.

Regards,
GOPU Exports Team`;
}

function autoReplyHtml(payload: LeadEmailPayload) {
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.7;color:#334155;background:#f8fafc;padding:24px">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;padding:24px">
        <h2 style="color:#0f172a;margin:0 0 16px">Thank you for contacting GOPU Exports</h2>
        <p>Hi ${escapeHtml(payload.name)},</p>
        <p>Thank you for reaching out to GOPU Exports.</p>
        <p>We've received your enquiry regarding <strong>${escapeHtml(autoReplyProduct(payload))}</strong> and our team will review the details shortly. If we need any additional information about quantity, destination port, packaging, or documentation requirements, we'll contact you directly.</p>
        <p>We usually respond within <strong>24-48 business hours</strong>.</p>
        <p>For urgent requirements, you can also reach us directly:</p>
        <p><strong>Email:</strong> admin@gopuexports.com<br/><strong>Phone / WhatsApp:</strong> +91 87128 16876</p>
        <p>Thank you again for considering GOPU Exports. We look forward to assisting you with your sourcing and export requirements.</p>
        <p style="margin-top:24px">Regards,<br/><strong>GOPU Exports Team</strong></p>
      </div>
    </div>
  `;
}

async function sendResendEmail(input: {
  to: string | string[];
  subject: string;
  text: string;
  html: string;
  idempotencyKey: string;
}): Promise<EmailAttemptResult> {
  const resend = getResendClient();
  if (!resend) {
    const error = "RESEND_API_KEY is not configured";
    return { sent: false, error };
  }

  try {
    const { error } = await resend.emails.send(
      {
        from: process.env.EMAIL_FROM || process.env.RESEND_FROM_EMAIL || DEFAULT_FROM_EMAIL,
        to: input.to,
        subject: input.subject,
        text: input.text,
        html: input.html,
      },
      { idempotencyKey: input.idempotencyKey }
    );

    if (error) {
      return { sent: false, error: stringifyError(error) };
    }

    return { sent: true, sentAt: new Date().toISOString() };
  } catch (error) {
    return { sent: false, error: stringifyError(error) };
  }
}

export async function sendLeadEmails(payload: LeadEmailPayload): Promise<LeadEmailDeliveryResult> {
  const adminEmail = process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL;
  const safeId = payload.id || `${payload.kind}-${Date.now()}`;

  const admin = await sendResendEmail({
    to: adminEmail,
    subject: `New GOPU Exports Lead - ${leadLabel(payload.kind)}`,
    text: leadText(payload),
    html: leadHtml(payload),
    idempotencyKey: `gopu-admin-${safeId}`,
  });

  if (admin.sent) {
    console.log("Admin email sent successfully", { leadId: payload.id, kind: payload.kind });
  } else {
    console.error("Admin email failed", admin.error);
  }

  let customer: EmailAttemptResult = { sent: false };
  if (payload.email) {
    customer = await sendResendEmail({
      to: payload.email,
      subject: "Thank you for contacting GOPU Exports",
      text: autoReplyText(payload),
      html: autoReplyHtml(payload),
      idempotencyKey: `gopu-customer-${safeId}`,
    });

    if (customer.sent) {
      console.log("Customer auto-reply sent successfully", { leadId: payload.id, kind: payload.kind });
    } else {
      console.error("Customer auto-reply failed", customer.error);
    }
  }

  return { admin, customer };
}
