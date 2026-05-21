type LeadKind = "inquiry" | "quote";

export type LeadEmailPayload = {
  kind: LeadKind;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  country?: string;
  product?: string;
  quantity?: string;
  message?: string;
  sourceUrl?: string;
  timestamp?: string;
};

const DEFAULT_ADMIN_EMAIL = "admin@gopuexports.com";
const DEFAULT_FROM_EMAIL = "GOPU Exports <onboarding@resend.dev>";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function rows(payload: LeadEmailPayload): Array<[string, string | undefined]> {
  return [
    ["Full Name", payload.name],
    ["Company Name", payload.company],
    ["Email", payload.email],
    ["Phone Number", payload.phone],
    ["Country", payload.country],
    ["Product Interested", payload.product],
    ["Quantity", payload.quantity],
    ["Message", payload.message],
    ["Timestamp", payload.timestamp],
    ["Page URL Source", payload.sourceUrl],
  ];
}

function leadText(payload: LeadEmailPayload) {
  return rows(payload)
    .map(([label, value]) => `${label}: ${value || "-"}`)
    .join("\n");
}

function leadHtml(payload: LeadEmailPayload) {
  const tableRows = rows(payload)
    .map(([label, value]) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;font-weight:700;color:#0f172a;width:190px">${escapeHtml(label)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#334155">${escapeHtml(value || "-")}</td>
      </tr>
    `)
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#334155">
      <h2 style="color:#0f172a;margin:0 0 12px">New ${payload.kind === "quote" ? "Quote Request" : "Export Inquiry"}</h2>
      <p style="margin:0 0 18px">A new GOPU Exports lead was submitted from the website.</p>
      <table style="border-collapse:collapse;width:100%;max-width:720px;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden">${tableRows}</table>
    </div>
  `;
}

function autoReplyText(payload: LeadEmailPayload) {
  return `Dear ${payload.name},

Thank you for contacting GOPU Exports.

We have received your ${payload.kind === "quote" ? "quote request" : "inquiry"} and our team will respond within 24-48 hours.

Contact:
Email: admin@gopuexports.com
Phone: +91 87128 16876

Regards,
GOPU Exports`;
}

function autoReplyHtml(payload: LeadEmailPayload) {
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.7;color:#334155">
      <h2 style="color:#0f172a">Thank you for contacting GOPU Exports</h2>
      <p>Dear ${escapeHtml(payload.name)},</p>
      <p>We have received your ${payload.kind === "quote" ? "quote request" : "inquiry"} and our team will respond within <strong>24-48 hours</strong>.</p>
      <p style="margin-top:22px"><strong>GOPU Exports</strong><br/>Email: admin@gopuexports.com<br/>Phone: +91 87128 16876</p>
    </div>
  `;
}

async function sendResendEmail(input: {
  to: string | string[];
  subject: string;
  text: string;
  html: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not configured. Lead email was not sent.");
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL || DEFAULT_FROM_EMAIL,
      ...input,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`Resend email failed: ${response.status} ${errorText}`);
  }
}

export async function sendLeadEmails(payload: LeadEmailPayload) {
  const adminEmail = process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL;
  const subjectPrefix = payload.kind === "quote" ? "New quote request" : "New export inquiry";

  await Promise.allSettled([
    sendResendEmail({
      to: adminEmail,
      subject: `${subjectPrefix}: ${payload.product || "Website lead"}`,
      text: leadText(payload),
      html: leadHtml(payload),
    }),
    sendResendEmail({
      to: payload.email,
      subject: "Thank you for contacting GOPU Exports",
      text: autoReplyText(payload),
      html: autoReplyHtml(payload),
    }),
  ]).then((results) => {
    results.forEach((result) => {
      if (result.status === "rejected") {
        console.error("Lead email delivery failed", result.reason);
      }
    });
  });
}
