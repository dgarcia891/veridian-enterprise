import { createClient } from "https://esm.sh/@supabase/supabase-js@2.98.0";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ─── HTML helpers ────────────────────────────────────────────────────────────
const BRAND_BLUE = "#2563eb";
const BRAND_ORANGE = "#f97316";
const BG_GRAY = "#f4f5f7";
const CARD_WHITE = "#ffffff";
const RED = "#dc2626";

function htmlWrapper(title: string, innerHtml: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${BG_GRAY};font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:${BG_GRAY};">
<tr><td align="center" style="padding:24px 0;">
  <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
    <tr><td style="background:${BRAND_BLUE};padding:20px 32px;border-radius:12px 12px 0 0;">
      <h1 style="margin:0;color:#fff;font-size:22px;">${title}</h1>
    </td></tr>
    <tr><td style="background:${CARD_WHITE};padding:28px 32px;border-radius:0 0 12px 12px;">
      ${innerHtml}
    </td></tr>
    <tr><td style="padding:16px 32px;text-align:center;color:#888;font-size:12px;">
      &copy; ${new Date().getFullYear()} AI Agents 3000 &bull; ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })}
    </td></tr>
  </table>
</td></tr></table></body></html>`;
}

const row = (label: string, value: string) =>
  `<tr><td style="padding:6px 0;color:#666;font-size:14px;width:40%;vertical-align:top;">${label}</td><td style="padding:6px 0;font-size:14px;font-weight:600;">${value || "—"}</td></tr>`;

const badge = (text: string, bg: string) =>
  `<span style="display:inline-block;padding:3px 10px;border-radius:999px;background:${bg};color:#fff;font-size:12px;font-weight:700;">${text}</span>`;

const ctaButton = (text: string, href: string) =>
  `<table cellpadding="0" cellspacing="0" style="margin:20px 0;"><tr><td style="background:${BRAND_ORANGE};border-radius:8px;"><a href="${href}" style="display:inline-block;padding:14px 28px;color:#fff;text-decoration:none;font-weight:700;font-size:16px;">${text}</a></td></tr></table>`;

const sectionTitle = (text: string) =>
  `<h2 style="margin:24px 0 10px;font-size:16px;color:#333;border-bottom:3px solid ${BRAND_BLUE};padding-bottom:6px;">${text}</h2>`;

// ─── Email builders ──────────────────────────────────────────────────────────
function buildNewLeadEmail(lead: Record<string, unknown>): { subject: string; html: string } {
  const rows = [
    row("Name", `${lead.first_name || lead.firstName || ""} ${lead.last_name || lead.lastName || ""}`),
    row("Email", String(lead.email || "")),
    row("Phone", String(lead.phone || "")),
    row("Company", String(lead.company_name || lead.companyName || "")),
    row("Industry", String(lead.industry || "")),
    row("Source", String(lead.entry_path || lead.source || "website")),
  ];

  const inner = `
    <p style="margin:0 0 16px;font-size:15px;">A new lead has been submitted:</p>
    ${sectionTitle("Lead Details")}
    <table width="100%" cellpadding="0" cellspacing="0">${rows.join("")}</table>
    ${lead.annual_loss ? `${sectionTitle("Estimated Impact")}${row("Annual Lost Revenue", "$" + Number(lead.annual_loss).toLocaleString())}` : ""}
  `;
  return { subject: `🔔 New Lead: ${lead.first_name || lead.firstName || "Unknown"} ${lead.last_name || lead.lastName || ""}`.trim(), html: htmlWrapper("New Lead Received", inner) };
}

function buildBuyerNotificationEmail(data: Record<string, unknown>): { subject: string; html: string } {
  const rows = [
    row("Customer Name", String(data.customerName || "")),
    row("Phone", data.phone ? `<a href="tel:${data.phone}" style="color:${BRAND_BLUE};">${data.phone}</a>` : "—"),
    row("Email", String(data.email || "")),
    row("City", String(data.city || "")),
    row("Service Type", String(data.serviceType || "")),
    row("Urgency", String(data.urgency || "")),
  ];
  const inner = `
    <p style="margin:0 0 16px;font-size:15px;">You've been assigned a new customer lead:</p>
    <table width="100%" cellpadding="0" cellspacing="0">${rows.join("")}</table>
    ${data.description ? `${sectionTitle("Description")}<p style="font-size:14px;color:#333;">${data.description}</p>` : ""}
  `;
  return { subject: `New Customer Lead: ${data.customerName || "Assigned"}`, html: htmlWrapper("New Customer Lead", inner) };
}

function buildBuyerInquiryEmail(inquiry: Record<string, unknown>): { subject: string; html: string } {
  const rows = [
    row("Business Name", String(inquiry.businessName || "")),
    row("Contact Name", String(inquiry.contactName || "")),
    row("Email", String(inquiry.email || "")),
    row("Phone", String(inquiry.phone || "")),
    row("Service Areas", String(inquiry.serviceAreas || "")),
  ];
  const inner = `
    <p style="margin:0 0 16px;font-size:15px;">A contractor has submitted an inquiry:</p>
    <table width="100%" cellpadding="0" cellspacing="0">${rows.join("")}</table>
    ${inquiry.message ? `${sectionTitle("Message")}<p style="font-size:14px;color:#333;">${inquiry.message}</p>` : ""}
  `;
  return { subject: `📋 Contractor Inquiry: ${inquiry.businessName || "New"}`, html: htmlWrapper("Contractor Inquiry", inner) };
}

function buildTestEmail(config: Record<string, unknown>): { subject: string; html: string } {
  const rows = [
    row("SMTP Host", String(config.smtpHost || "")),
    row("SMTP Port", String(config.smtpPort || "")),
    row("From Address", String(config.fromEmail || "")),
    row("Timestamp", new Date().toISOString()),
  ];
  const inner = `
    <p style="margin:0 0 16px;font-size:15px;">✅ Your SMTP configuration is working correctly!</p>
    <table width="100%" cellpadding="0" cellspacing="0">${rows.join("")}</table>
  `;
  return { subject: "✅ SMTP Test — Configuration Verified", html: htmlWrapper("SMTP Test Successful", inner) };
}

function buildNewSignupEmail(data: Record<string, unknown>): { subject: string; html: string } {
  const rows = [
    row("Business Name", String(data.businessName || "")),
    row("Industry", String(data.industry || "")),
    row("Services", String(data.services || "")),
    row("Voice Preference", String(data.voice || "")),
    row("FAQ Count", String(data.faqCount || "0")),
  ];
  const inner = `
    <p style="margin:0 0 16px;font-size:15px;">A new customer has completed onboarding setup:</p>
    ${sectionTitle("Onboarding Details")}
    <table width="100%" cellpadding="0" cellspacing="0">${rows.join("")}</table>
    ${data.greeting ? `${sectionTitle("Greeting Message")}<p style="font-size:14px;color:#333;font-style:italic;">"${data.greeting}"</p>` : ""}
    <p style="margin:16px 0 0;font-size:14px;color:#666;">⚡ Action needed: Provision a Twilio number and create a Retell agent for this customer.</p>
  `;
  return { subject: `🚀 New Signup: ${data.businessName || "Customer"}`, html: htmlWrapper("New Customer Onboarding", inner) };
}


Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { notificationType, leadData, eventData, buyerInquiry } = body;

    // Read SMTP config from admin_settings
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: settingsRow, error: settingsError } = await supabase
      .from("admin_settings")
      .select("setting_value")
      .eq("setting_key", "smtp_config")
      .maybeSingle();

    if (settingsError) throw new Error(`Failed to read SMTP settings: ${settingsError.message}`);
    if (!settingsRow) throw new Error("SMTP not configured. Go to Admin → Settings to set up email.");

    const config = settingsRow.setting_value as Record<string, unknown>;
    if (!config.enabled) throw new Error("SMTP is disabled in settings.");

    const port = Number(config.smtpPort);
    if ([993, 995].includes(port)) throw new Error(`Port ${port} is for receiving mail (IMAP/POP3). Use 587 or 465 for SMTP.`);

    // Build email based on type
    let subject: string;
    let html: string;
    let toEmail = String(config.adminNotificationEmail || config.fromEmail);

    switch (notificationType) {
      case "new_lead":
        ({ subject, html } = buildNewLeadEmail(leadData || {}));
        break;
      case "buyer_notification":
        ({ subject, html } = buildBuyerNotificationEmail(eventData || {}));
        toEmail = String(eventData?.buyerEmail || toEmail);
        break;
      case "buyer_inquiry":
        ({ subject, html } = buildBuyerInquiryEmail(buyerInquiry || {}));
        break;
      case "test":
        ({ subject, html } = buildTestEmail(config));
        break;
      case "new_signup":
        ({ subject, html } = buildNewSignupEmail(leadData || {}));
        break;
      default:
        throw new Error(`Unknown notification type: ${notificationType}`);
    }

    // Send via SMTP with timeout
    const useTls = port === 465;
    const client = new SMTPClient({
      connection: {
        hostname: String(config.smtpHost),
        port,
        tls: useTls,
        auth: {
          username: String(config.smtpUsername),
          password: String(config.smtpPassword),
        },
      },
    });

    const sendPromise = (async () => {
      await client.send({
        from: `${config.fromName || "AI Agents 3000"} <${config.fromEmail}>`,
        to: toEmail,
        subject,
        content: "auto",
        html,
      });
      await client.close();
    })();

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("SMTP send timed out after 10 seconds")), 10000)
    );

    await Promise.race([sendPromise, timeoutPromise]);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("notify-admin-email error:", message);
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
