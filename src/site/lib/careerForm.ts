/**
 * careerForm.ts — Handles job application submissions.
 *
 * On every submission:
 *   1. Validates all fields with Zod
 *   2. Saves the application to the `applications` table in Postgres
 *   3. Emails HR only (CAREERS_HR_EMAIL, resume attached) — the rest of the
 *      team reviews applications in the careers portal at /careers/admin
 *   4. Sends a confirmation auto-reply to the applicant (replies go to HR)
 */

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { Resend } from "resend";
import { eq } from "drizzle-orm";
import { db, applications, jobPostings, ensureDb } from "./db";
import { buildApplicantEmail, buildStaffEmail, senderWithName } from "./careerEmails";
import { CAREERS_HR_EMAIL } from "../data/careers";
import { EMAIL_LOGO_ATTACHMENT } from "./emailLogo";

// ─── Validation schema ───────────────────────────────────────────────────────

const PREFERRED_LOCATION_LABELS = {
  coimbatore: "Coimbatore",
  bangalore: "Bangalore",
  either: "Either location",
} as const;

const applySchema = z.object({
  /** Omitted for a general application ("Send your CV") not tied to a posting */
  jobId: z.string().uuid().optional(),
  /** General applications only — the role the candidate feels suits them */
  desiredRole: z.string().trim().max(200).optional(),
  preferredLocation: z.enum(["coimbatore", "bangalore", "either"]).optional(),
  fullName: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
  phone: z.string().trim().min(1).max(50),
  yearsExperience: z.enum(["<1 year", "1–3 years", "3–5 years", "5+ years"]),
  currentLocation: z.string().trim().min(1).max(200),
  coverLetter: z.string().trim().max(3000).default(""),
  resumeFilename: z.string().trim().min(1).max(255),
  resumeData: z.string().min(1), // base64 encoded file
  // Honeypot — real visitors never fill this hidden field
  websiteField: z.string().optional(),
});

// ─── Server function ─────────────────────────────────────────────────────────

export const submitApplication = createServerFn({ method: "POST" })
  .validator((data: unknown) => applySchema.parse(data))
  .handler(async ({ data }) => {
    // Silently drop bot submissions
    if (data.websiteField) {
      return { ok: true as const };
    }

    await ensureDb();

    // Verify the job exists and is active
    let positionTitle: string;
    if (data.jobId) {
      const jobResult = await db()
        .select()
        .from(jobPostings)
        .where(eq(jobPostings.id, data.jobId))
        .limit(1);

      const job = jobResult[0];
      if (!job || !job.active) {
        throw new Error("This position is no longer accepting applications.");
      }
      positionTitle = job.title;
    } else {
      if (!data.desiredRole || !data.preferredLocation) {
        throw new Error("Please choose a role and a preferred location.");
      }
      positionTitle = `General Application — ${data.desiredRole}`;
    }
    const preferredLocationLabel = data.preferredLocation
      ? PREFERRED_LOCATION_LABELS[data.preferredLocation]
      : null;

    // Save application to DB first — data is never lost even if email fails
    await db().insert(applications).values({
      jobId: data.jobId ?? null,
      jobTitle: positionTitle,
      preferredLocation: data.preferredLocation ?? null,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      yearsExperience: data.yearsExperience,
      currentLocation: data.currentLocation,
      coverLetter: data.coverLetter,
      resumeFilename: data.resumeFilename,
      resumeData: data.resumeData,
      status: "new",
    });

    // Send emails
    const apiKey = process.env["RESEND_API_KEY"];
    const fromAddress = process.env["CONTACT_FROM_EMAIL"];
    if (!apiKey || !fromAddress) {
      console.error(
        "submitApplication: RESEND_API_KEY / CONTACT_FROM_EMAIL not set — email skipped.",
      );
      return { ok: true as const };
    }

    // Only HR is emailed; everyone else reviews applications in the careers portal
    const allRecipients = [CAREERS_HR_EMAIL];

    const emailData = {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      yearsExperience: data.yearsExperience,
      currentLocation: data.currentLocation,
      coverLetter: data.coverLetter,
      resumeFilename: data.resumeFilename,
      positionTitle,
      desiredRole: data.desiredRole,
      preferredLocationLabel,
      isGeneral: !data.jobId,
      appliedAt: new Date(),
    };
    const staffEmail = buildStaffEmail(emailData);
    const applicantEmail = buildApplicantEmail(emailData);

    const resend = new Resend(apiKey);

    // The application is already saved, so an email problem (Resend rejecting
    // it, or the request itself crashing) must never turn into an error for
    // the applicant — that would make them apply twice. Log it and carry on.
    async function send(label: string, payload: Parameters<typeof resend.emails.send>[0]) {
      try {
        const { error } = await resend.emails.send(payload);
        if (error) {
          console.error(`submitApplication: ${label} email error`, error);
          return false;
        }
        return true;
      } catch (err) {
        console.error(`submitApplication: ${label} email failed`, err);
        return false;
      }
    }

    // Notify HR, with the resume attached
    const staffSent = await send("HR", {
      from: senderWithName(fromAddress),
      to: allRecipients,
      replyTo: data.email,
      subject: `New Application — ${positionTitle} from ${data.fullName}`,
      html: staffEmail.html,
      text: staffEmail.text,
      attachments: [
        {
          filename: data.resumeFilename,
          content: data.resumeData,
        },
        EMAIL_LOGO_ATTACHMENT,
      ],
    });

    // Confirmation auto-reply to the applicant
    const replySent = await send("applicant confirmation", {
      from: senderWithName(fromAddress),
      to: data.email,
      // Replies from candidates reach HR instead of a no-reply inbox
      replyTo: CAREERS_HR_EMAIL,
      subject: `We received your application — ${positionTitle} | Cosmic Compliance Test Lab`,
      html: applicantEmail.html,
      text: applicantEmail.text,
      attachments: [EMAIL_LOGO_ATTACHMENT],
    });

    console.log(
      `submitApplication: saved "${positionTitle}" — ${data.fullName} <${data.email}> ` +
        `(HR email ${staffSent ? "sent" : "FAILED"}, confirmation ${replySent ? "sent" : "FAILED"})`,
    );

    return { ok: true as const };
  });
