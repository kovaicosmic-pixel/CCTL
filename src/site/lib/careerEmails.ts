/**
 * careerEmails.ts — HTML + plain-text bodies for careers application emails.
 *
 * Email clients (Outlook desktop especially) ignore most modern CSS, so these
 * are table-based with inline styles and bgcolor attributes. Every value that
 * came from the applicant is HTML-escaped before it is placed in markup.
 */
import { SITE_URL } from "../data/seo";
import { EMAIL_LOGO_CID } from "./emailLogo";

const BRAND_BLUE = "#1a6cf5";
const NAVY = "#0b1424";
const FONT = "'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const ADMIN_URL = `${SITE_URL}/careers/admin`;
// Inline attachment (see emailLogo.ts) — Outlook blocks remote images by default
const LOGO_URL = `cid:${EMAIL_LOGO_CID}`;

export interface ApplicationEmailData {
  fullName: string;
  email: string;
  phone: string;
  yearsExperience: string;
  currentLocation: string;
  coverLetter: string;
  resumeFilename: string;
  positionTitle: string;
  /** Present only for general ("Send your CV") applications */
  desiredRole?: string;
  preferredLocationLabel: string | null;
  isGeneral: boolean;
  appliedAt: Date;
}

/** Lab inboxes that should receive replies to emails sent to candidates. */
export const LAB_REPLY_TO = ["emc@cosmictestlab.com", "kovaiemc@cosmictestlab.com"];

/**
 * "Cosmic Compliance Test Lab <noreply@…>" instead of a bare address, unless
 * CONTACT_FROM_EMAIL already includes a display name.
 */
export function senderWithName(address: string) {
  return address.includes("<") ? address : `Cosmic Compliance Test Lab <${address}>`;
}

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function istDate(d: Date) {
  return `${d.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })} IST`;
}

// ─── Shared pieces ───────────────────────────────────────────────────────────

function shell(preheader: string, inner: string) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<title>Cosmic Compliance Test Lab</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f1f5f9" style="background:#f1f5f9;">
<tr><td align="center" style="padding:32px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;">
${inner}
</table>
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">
<tr><td align="center" style="padding:20px 12px 0;font-family:${FONT};font-size:12px;line-height:18px;color:#94a3b8;">
Cosmic Compliance Test Lab &middot; Coimbatore &amp; Bangalore, India<br>
<a href="${SITE_URL}" style="color:#64748b;text-decoration:underline;">cosmictestlab.com</a>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

function header(rightLabel: string) {
  return `<tr><td style="padding:20px 28px;border-bottom:1px solid #e2e8f0;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td valign="middle"><a href="${SITE_URL}"><img src="${LOGO_URL}" width="110" height="77" alt="Cosmic Compliance Test Lab" style="display:block;border:0;height:77px;width:110px;font-family:${FONT};font-size:14px;font-weight:bold;color:${NAVY};"></a></td>
<td valign="middle" align="right" style="font-family:${FONT};font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#64748b;">${esc(rightLabel)}</td>
</tr></table>
</td></tr>`;
}

function banner(eyebrow: string, title: string, sub: string, badge?: string) {
  return `<tr><td bgcolor="${NAVY}" style="background:${NAVY};padding:28px;">
<div style="font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#5b9bff;">${esc(eyebrow)}</div>
<div style="font-family:${FONT};font-size:24px;line-height:32px;font-weight:700;color:#ffffff;margin-top:8px;">${esc(title)}</div>
<div style="font-family:${FONT};font-size:13px;line-height:20px;color:#94a3b8;margin-top:6px;">${esc(sub)}${
    badge
      ? ` &nbsp;<span style="display:inline-block;padding:2px 10px;border-radius:999px;background:#2a2366;color:#c4b5fd;font-size:11px;font-weight:700;">${esc(badge)}</span>`
      : ""
  }</div>
</td></tr>`;
}

interface EmailButton {
  href: string;
  label: string;
  primary?: boolean;
}

/**
 * A row of buttons. Built as sibling table cells with the padding on the <td>
 * and the colour on both <a> and an inner <span>: Outlook desktop ignores
 * inline-table, drops padding on links and repaints link text in its own colour.
 */
function buttons(list: EmailButton[]) {
  const cells = list
    .map(({ href, label, primary = true }) => {
      const bg = primary ? BRAND_BLUE : "#ffffff";
      const fg = primary ? "#ffffff" : "#0f172a";
      const border = primary ? BRAND_BLUE : "#cbd5e1";
      return `<td align="center" valign="middle" bgcolor="${bg}" style="background:${bg};border:1px solid ${border};border-radius:8px;padding:12px 22px;mso-padding-alt:12px 22px;">
<a href="${href}" target="_blank" style="font-family:${FONT};font-size:14px;line-height:18px;font-weight:600;color:${fg};text-decoration:none;display:inline-block;"><span style="color:${fg};text-decoration:none;">${esc(label)}</span></a>
</td>`;
    })
    .join(`<td width="10" style="width:10px;font-size:0;line-height:0;">&nbsp;</td>`);
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>${cells}</tr></table>`;
}

/** Fixed-size coloured tile (badge / step number) — a table cell, since Outlook ignores sized divs. */
function tile(content: string, size: number, bg: string, fg: string, fontSize: number, radius: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
<td width="${size}" height="${size}" align="center" valign="middle" bgcolor="${bg}" style="width:${size}px;height:${size}px;background:${bg};border-radius:${radius};font-family:${FONT};font-size:${fontSize}px;line-height:${size}px;font-weight:800;color:${fg};mso-line-height-rule:exactly;">${content}</td>
</tr></table>`;
}

function detailRows(rows: [string, string][]) {
  return rows
    .map(
      ([k, v], i) => `<tr>
<td width="38%" valign="top" style="padding:11px 16px;${i ? "border-top:1px solid #f1f5f9;" : ""}font-family:${FONT};font-size:13px;color:#64748b;">${esc(k)}</td>
<td valign="top" style="padding:11px 16px;${i ? "border-top:1px solid #f1f5f9;" : ""}font-family:${FONT};font-size:14px;font-weight:600;color:#0f172a;">${v}</td>
</tr>`,
    )
    .join("");
}

function sectionTitle(t: string) {
  return `<div style="font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#64748b;margin:0 0 10px;">${esc(t)}</div>`;
}

// ─── Staff notification ──────────────────────────────────────────────────────

export function buildStaffEmail(d: ApplicationEmailData) {
  const role = d.isGeneral ? (d.desiredRole ?? d.positionTitle) : d.positionTitle;
  const firstName = d.fullName.split(" ")[0] || d.fullName;

  const rows: [string, string][] = [
    [d.isGeneral ? "Role of interest" : "Position", esc(role)],
    ["Experience", esc(d.yearsExperience)],
    ["Current location", esc(d.currentLocation)],
    ...(d.preferredLocationLabel
      ? ([["Preferred lab", esc(d.preferredLocationLabel)]] as [string, string][])
      : []),
    ["Applied on", esc(istDate(d.appliedAt))],
  ];

  const cover = d.coverLetter.trim()
    ? `<div style="padding:14px 16px;background:#f8fafc;border-left:3px solid ${BRAND_BLUE};border-radius:6px;font-family:${FONT};font-size:14px;line-height:22px;color:#334155;white-space:pre-wrap;">${esc(d.coverLetter.trim())}</div>`
    : `<div style="font-family:${FONT};font-size:14px;color:#94a3b8;font-style:italic;">No cover letter provided.</div>`;

  const inner = `
${header("Careers Portal")}
${banner(
  d.isGeneral ? "New general application" : "New job application",
  role,
  `Received ${istDate(d.appliedAt)}`,
  d.isGeneral ? "General CV" : undefined,
)}
<tr><td style="padding:28px 28px 8px;">
${sectionTitle("Applicant")}
<div style="font-family:${FONT};font-size:20px;font-weight:700;color:#0f172a;">${esc(d.fullName)}</div>
<div style="font-family:${FONT};font-size:14px;line-height:22px;margin-top:6px;">
<a href="mailto:${esc(d.email)}" style="color:${BRAND_BLUE};text-decoration:none;">${esc(d.email)}</a>
<span style="color:#cbd5e1;">&nbsp;|&nbsp;</span>
<a href="tel:${esc(d.phone.replace(/\s/g, ""))}" style="color:#0f172a;text-decoration:none;">${esc(d.phone)}</a>
</div>
</td></tr>
<tr><td style="padding:16px 28px 8px;">
${sectionTitle("Details")}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e2e8f0;border-radius:10px;">
${detailRows(rows)}
</table>
</td></tr>
<tr><td style="padding:16px 28px 8px;">
${sectionTitle("Cover letter")}
${cover}
</td></tr>
<tr><td style="padding:16px 28px 8px;">
${sectionTitle("Resume")}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f8fafc" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;"><tr>
<td width="50" valign="middle" style="padding:12px 0 12px 14px;">${tile(esc((d.resumeFilename.split(".").pop() ?? "FILE").toUpperCase().slice(0, 4)), 36, "#fee2e2", "#dc2626", 10, "8px")}</td>
<td valign="middle" style="padding:12px 14px;font-family:${FONT};"><div style="font-size:14px;font-weight:600;color:#0f172a;">${esc(d.resumeFilename)}</div><div style="font-size:12px;color:#64748b;margin-top:2px;">Attached to this email</div></td>
</tr></table>
</td></tr>
<tr><td style="padding:20px 28px 28px;">
${buttons([
  {
    href: `mailto:${esc(d.email)}?subject=${encodeURIComponent(`Your application — ${role} | Cosmic Compliance Test Lab`)}`,
    label: `Reply to ${firstName}`,
  },
  { href: ADMIN_URL, label: "Open in admin panel", primary: false },
])}
</td></tr>
<tr><td bgcolor="#f8fafc" style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:16px 28px;font-family:${FONT};font-size:12px;line-height:18px;color:#64748b;">
This application is saved in the careers portal. Sent to the Bangalore &amp; Coimbatore teams and all Super Admins.<br>
View and manage every application at <a href="${ADMIN_URL}" style="color:${BRAND_BLUE};">${ADMIN_URL.replace(/^https?:\/\//, "")}</a>
</td></tr>`;

  const text = [
    d.isGeneral ? "New General Application Received" : "New Job Application Received",
    "─".repeat(40),
    `${d.isGeneral ? "Role of interest" : "Position"}:  ${role}`,
    `Applicant:         ${d.fullName}`,
    `Email:             ${d.email}`,
    `Phone:             ${d.phone}`,
    `Experience:        ${d.yearsExperience}`,
    `Current location:  ${d.currentLocation}`,
    ...(d.preferredLocationLabel ? [`Preferred lab:     ${d.preferredLocationLabel}`] : []),
    `Applied on:        ${istDate(d.appliedAt)}`,
    "",
    d.coverLetter.trim() ? `Cover letter:\n${d.coverLetter.trim()}` : "Cover letter: Not provided",
    "",
    `Resume attached: ${d.resumeFilename}`,
    "",
    "─".repeat(40),
    `View all applications: ${ADMIN_URL}`,
  ].join("\n");

  return { html: shell(`${d.fullName} applied for ${role}`, inner), text };
}

// ─── Applicant confirmation ──────────────────────────────────────────────────

export function buildApplicantEmail(d: ApplicationEmailData) {
  const role = d.isGeneral ? (d.desiredRole ?? d.positionTitle) : d.positionTitle;
  const firstName = d.fullName.split(" ")[0] || d.fullName;
  const intro = d.isGeneral
    ? `Thank you for sending us your CV for a <strong>${esc(role)}</strong> role at Cosmic Compliance Test Lab (CCTL).`
    : `Thank you for applying for the <strong>${esc(role)}</strong> position at Cosmic Compliance Test Lab (CCTL).`;

  const rows: [string, string][] = [
    [d.isGeneral ? "Role of interest" : "Position", esc(role)],
    ...(d.preferredLocationLabel
      ? ([["Preferred lab", esc(d.preferredLocationLabel)]] as [string, string][])
      : []),
    ["Resume", esc(d.resumeFilename)],
    ["Submitted on", esc(istDate(d.appliedAt))],
  ];

  const steps = [
    ["Review", "Our engineering team reviews every application personally."],
    ["Conversation", "If your profile matches, we'll contact you for a technical discussion."],
    ["On file", "We keep your profile for future openings at both our labs."],
  ];

  const inner = `
${header("Careers")}
${banner("Application received", `Thank you, ${firstName}!`, "We've received your application and it's now with our team.")}
<tr><td style="padding:28px 28px 8px;font-family:${FONT};font-size:15px;line-height:24px;color:#334155;">
<p style="margin:0 0 14px;">Dear ${esc(d.fullName)},</p>
<p style="margin:0;">${intro} We have received your application and our team will review it shortly.</p>
</td></tr>
<tr><td style="padding:16px 28px 8px;">
${sectionTitle("Your application")}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e2e8f0;border-radius:10px;">
${detailRows(rows)}
</table>
</td></tr>
<tr><td style="padding:16px 28px 8px;">
${sectionTitle("What happens next")}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
${steps
  .map(
    ([t, b], i) => `<tr>
<td width="40" valign="top" style="padding:4px 0;">${tile(String(i + 1), 26, "#eff6ff", BRAND_BLUE, 12, "999px")}</td>
<td valign="top" style="padding:6px 0;font-family:${FONT};font-size:14px;line-height:21px;color:#334155;"><strong style="color:#0f172a;">${t}</strong> &mdash; ${b}</td>
</tr>`,
  )
  .join("")}
</table>
</td></tr>
<tr><td style="padding:20px 28px 28px;">
${buttons([
  { href: `${SITE_URL}/careers`, label: "View open positions" },
  { href: SITE_URL, label: "Visit our website", primary: false },
])}
</td></tr>
<tr><td bgcolor="#f8fafc" style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:18px 28px;font-family:${FONT};font-size:13px;line-height:20px;color:#475569;">
<strong style="color:#0f172a;">Best regards,</strong><br>
HR Team &middot; Cosmic Compliance Test Lab
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:12px;">
<tr>
<td width="50%" valign="top" style="padding:0 12px 0 0;font-family:${FONT};font-size:13px;line-height:20px;color:#475569;">
<strong style="color:#0f172a;">Coimbatore Lab</strong><br>
<a href="mailto:kovaiemc@cosmictestlab.com" style="color:${BRAND_BLUE};text-decoration:none;">kovaiemc@cosmictestlab.com</a><br>
<a href="tel:+919790901184" style="color:#64748b;text-decoration:none;">+91 97909 01184</a>
</td>
<td width="50%" valign="top" style="padding:0;font-family:${FONT};font-size:13px;line-height:20px;color:#475569;">
<strong style="color:#0f172a;">Bangalore Lab</strong><br>
<a href="mailto:emc@cosmictestlab.com" style="color:${BRAND_BLUE};text-decoration:none;">emc@cosmictestlab.com</a><br>
<a href="tel:+919444272009" style="color:#64748b;text-decoration:none;">+91 94442 72009</a>
</td>
</tr>
</table>
</td></tr>`;

  const text = [
    `Dear ${d.fullName},`,
    "",
    d.isGeneral
      ? `Thank you for sending us your CV for a ${role} role at Cosmic Compliance Test Lab (CCTL).`
      : `Thank you for applying for the ${role} position at Cosmic Compliance Test Lab (CCTL).`,
    "",
    "We have received your application and our team will review it shortly. If your profile matches our requirements, we will get in touch with you to discuss the next steps.",
    "",
    `View open positions: ${SITE_URL}/careers`,
    "",
    "Best regards,",
    "HR Team",
    "Cosmic Compliance Test Lab",
    "",
    "Coimbatore Lab: kovaiemc@cosmictestlab.com | +91 97909 01184",
    "Bangalore Lab:  emc@cosmictestlab.com | +91 94442 72009",
  ].join("\n");

  return {
    html: shell(`We've received your application for ${role}`, inner),
    text,
  };
}

// ─── Admin invitation ────────────────────────────────────────────────────────

export interface AdminInviteData {
  name: string;
  email: string;
  role: "superadmin" | "admin";
  temporaryPassword: string;
  invitedBy: string;
}

export function buildAdminInviteEmail(d: AdminInviteData) {
  const firstName = d.name.split(" ")[0] || d.name;
  const roleLabel = d.role === "superadmin" ? "Super Admin" : "Admin";
  const abilities =
    d.role === "superadmin"
      ? [
          "Post, edit, publish and delete job openings",
          "Review applications, download resumes and update status",
          "Add or remove admin accounts and manage settings",
        ]
      : [
          "Post, edit, publish and delete job openings",
          "Review applications and download resumes",
          "Move candidates through New → Reviewed → Shortlisted → Rejected",
        ];

  const rows: [string, string][] = [
    ["Login page", `<a href="${ADMIN_URL}" style="color:${BRAND_BLUE};text-decoration:none;">${ADMIN_URL.replace(/^https?:\/\//, "")}</a>`],
    ["Email", esc(d.email)],
    [
      "Temporary password",
      `<span style="font-family:Consolas,'Courier New',monospace;font-size:15px;letter-spacing:0.5px;background:#f1f5f9;border:1px solid #e2e8f0;border-radius:6px;padding:3px 8px;">${esc(d.temporaryPassword)}</span>`,
    ],
    ["Role", esc(roleLabel)],
  ];

  const inner = `
${header("Careers Portal")}
${banner("You're invited", `Welcome to the team, ${firstName}!`, `${d.invitedBy} added you as ${roleLabel === "Admin" ? "an" : "a"} ${roleLabel} on the CCTL careers portal.`)}
<tr><td style="padding:28px 28px 8px;font-family:${FONT};font-size:15px;line-height:24px;color:#334155;">
<p style="margin:0 0 14px;">Hi ${esc(firstName)},</p>
<p style="margin:0;">You now have access to the Cosmic Compliance Test Lab careers admin panel, where our team manages job openings and candidate applications. Use the details below to sign in.</p>
</td></tr>
<tr><td style="padding:16px 28px 8px;">
${sectionTitle("Your sign-in details")}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e2e8f0;border-radius:10px;">
${detailRows(rows)}
</table>
</td></tr>
<tr><td style="padding:12px 28px 8px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#fffbeb" style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;"><tr>
<td style="padding:12px 16px;font-family:${FONT};font-size:13px;line-height:20px;color:#92400e;">
<strong>You'll be asked to choose your own password</strong> the first time you sign in. The temporary password above stops working once you do.
</td></tr></table>
</td></tr>
<tr><td style="padding:16px 28px 8px;">
${sectionTitle(`As ${roleLabel === "Admin" ? "an" : "a"} ${roleLabel} you can`)}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
${abilities
  .map(
    (a) => `<tr>
<td width="28" valign="top" style="padding:5px 0;font-family:${FONT};font-size:14px;font-weight:700;color:${BRAND_BLUE};">&#10003;</td>
<td valign="top" style="padding:5px 0;font-family:${FONT};font-size:14px;line-height:21px;color:#334155;">${esc(a)}</td>
</tr>`,
  )
  .join("")}
</table>
</td></tr>
<tr><td style="padding:20px 28px 28px;">
${buttons([{ href: ADMIN_URL, label: "Sign in to the admin panel" }])}
</td></tr>
<tr><td bgcolor="#f8fafc" style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:16px 28px;font-family:${FONT};font-size:12px;line-height:18px;color:#64748b;">
Keep these details private. If you weren't expecting this invitation, you can ignore this email or let us know at
<a href="mailto:emc@cosmictestlab.com" style="color:${BRAND_BLUE};">emc@cosmictestlab.com</a>.
</td></tr>`;

  const text = [
    `Hi ${firstName},`,
    "",
    `${d.invitedBy} added you as ${roleLabel === "Admin" ? "an" : "a"} ${roleLabel} on the Cosmic Compliance Test Lab careers portal.`,
    "",
    `Login page:          ${ADMIN_URL}`,
    `Email:               ${d.email}`,
    `Temporary password:  ${d.temporaryPassword}`,
    `Role:                ${roleLabel}`,
    "",
    "You'll be asked to choose your own password the first time you sign in.",
    "The temporary password stops working once you do.",
    "",
    "Keep these details private.",
    "",
    "Cosmic Compliance Test Lab",
  ].join("\n");

  return {
    html: shell(`${d.invitedBy} invited you to the CCTL careers portal`, inner),
    text,
  };
}
