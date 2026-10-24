/**
 * resend-application-emails.ts — re-send application emails that failed to go out
 * (e.g. while switching Resend accounts). Applications are always saved first,
 * so this only repeats the two emails: HR notification + applicant confirmation.
 *
 * Usage (from the project folder, on the server):
 *   Preview (sends nothing):
 *     node --env-file=.env node_modules/jiti/lib/jiti-cli.mjs scripts/resend-application-emails.ts --since 2026-10-24T13:00+05:30
 *   Send for exactly what the preview listed:
 *     node --env-file=.env node_modules/jiti/lib/jiti-cli.mjs scripts/resend-application-emails.ts --since 2026-10-24T13:00+05:30 --send
 *
 * Options:
 *   --since <ISO date/time>   only applications received at or after this time (required)
 *   --until <ISO date/time>   ...and before this time (optional)
 *   --send                    actually send; without it, nothing is sent
 */
import { Resend } from "resend";
import { and, asc, gte, lt } from "drizzle-orm";
import { db, applications, ensureDb } from "../src/site/lib/db";
import { buildApplicantEmail, buildStaffEmail, senderWithName } from "../src/site/lib/careerEmails";
import { EMAIL_LOGO_ATTACHMENT } from "../src/site/lib/emailLogo";
import { CAREERS_HR_EMAIL } from "../src/site/data/careers";

const PREFERRED_LOCATION_LABELS: Record<string, string> = {
  coimbatore: "Coimbatore",
  bangalore: "Bangalore",
  either: "Either location",
};
const GENERAL_PREFIX = "General Application — ";

function arg(name: string) {
  const i = process.argv.indexOf(name);
  return i > -1 ? process.argv[i + 1] : undefined;
}

const sinceRaw = arg("--since");
const untilRaw = arg("--until");
const send = process.argv.includes("--send");

if (!sinceRaw || Number.isNaN(Date.parse(sinceRaw))) {
  console.error("Please give a valid --since, e.g. --since 2026-10-24T13:00+05:30");
  process.exit(1);
}
const since = new Date(sinceRaw);
const until = untilRaw ? new Date(untilRaw) : undefined;

const apiKey = process.env["RESEND_API_KEY"];
const fromAddress = process.env["CONTACT_FROM_EMAIL"];
if (send && (!apiKey || !fromAddress)) {
  console.error("RESEND_API_KEY / CONTACT_FROM_EMAIL missing in .env");
  process.exit(1);
}

await ensureDb();
const rows = await db()
  .select()
  .from(applications)
  .where(until ? and(gte(applications.appliedAt, since), lt(applications.appliedAt, until)) : gte(applications.appliedAt, since))
  .orderBy(asc(applications.appliedAt));

const ist = (d: Date) => d.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
console.log(
  `${rows.length} application(s) received ${ist(since)}${until ? ` – ${ist(until)}` : " onwards"} (IST):`,
);
for (const a of rows) console.log(`  ${ist(a.appliedAt)}  ${a.fullName} <${a.email}>  —  ${a.jobTitle}`);

if (!send) {
  console.log("\nPreview only — nothing was sent. Re-run with --send to email exactly these.");
  process.exit(0);
}

const resend = new Resend(apiKey);
let ok = 0;
for (const a of rows) {
  const isGeneral = !a.jobId;
  const data = {
    fullName: a.fullName,
    email: a.email,
    phone: a.phone,
    yearsExperience: a.yearsExperience,
    currentLocation: a.currentLocation,
    coverLetter: a.coverLetter,
    resumeFilename: a.resumeFilename,
    positionTitle: a.jobTitle,
    desiredRole: isGeneral ? a.jobTitle.replace(GENERAL_PREFIX, "") : undefined,
    preferredLocationLabel: a.preferredLocation
      ? (PREFERRED_LOCATION_LABELS[a.preferredLocation] ?? a.preferredLocation)
      : null,
    isGeneral,
    appliedAt: a.appliedAt,
  };
  const staff = buildStaffEmail(data);
  const applicant = buildApplicantEmail(data);

  const hr = await resend.emails.send({
    from: senderWithName(fromAddress!),
    to: [CAREERS_HR_EMAIL],
    replyTo: a.email,
    subject: `[Delayed] New Application — ${a.jobTitle} from ${a.fullName}`,
    html: staff.html,
    text: staff.text,
    attachments: [{ filename: a.resumeFilename, content: a.resumeData }, EMAIL_LOGO_ATTACHMENT],
  });
  const conf = await resend.emails.send({
    from: senderWithName(fromAddress!),
    to: a.email,
    replyTo: CAREERS_HR_EMAIL,
    subject: `We received your application — ${a.jobTitle} | Cosmic Compliance Test Lab`,
    html: applicant.html,
    text: applicant.text,
    attachments: [EMAIL_LOGO_ATTACHMENT],
  });

  const hrOk = !hr.error;
  const confOk = !conf.error;
  if (hrOk && confOk) ok++;
  console.log(
    `  ${a.fullName}: HR ${hrOk ? "sent" : `FAILED (${hr.error?.message})`}, ` +
      `confirmation ${confOk ? "sent" : `FAILED (${conf.error?.message})`}`,
  );
}
console.log(`\nDone: ${ok}/${rows.length} fully sent.`);
process.exit(0);
