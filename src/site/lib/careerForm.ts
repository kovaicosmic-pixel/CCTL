/**
 * careerForm.ts — Handles job application submissions.
 *
 * On every submission:
 *   1. Validates all fields with Zod
 *   2. Saves the application to the `applications` table in Postgres
 *   3. Sends email (with resume attachment) to:
 *        - emc@cosmictestlab.com        (Bangalore branch)
 *        - kovaiemc@cosmictestlab.com   (Coimbatore branch)
 *        - anitha@cosmictest.com        (Super admin — always receives every application)
 *   4. Sends a confirmation auto-reply to the applicant
 */

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { Resend } from "resend";
import { eq } from "drizzle-orm";
import { db, applications, jobPostings, admins, initDb } from "./db";
import { buildApplicantEmail, buildStaffEmail } from "./careerEmails";

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

    await initDb();

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

    // Build recipient list: both branches + all superadmins
    const superAdmins = await db()
      .select({ email: admins.email })
      .from(admins)
      .where(eq(admins.role, "superadmin"));

    const branchEmails = ["emc@cosmictestlab.com", "kovaiemc@cosmictestlab.com"];
    const superAdminEmails = superAdmins.map((a) => a.email);
    const allRecipients = [...new Set([...branchEmails, ...superAdminEmails])];

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

    // Send to all staff recipients with resume attachment
    const { error: staffError } = await resend.emails.send({
      from: fromAddress,
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
      ],
    });

    if (staffError) {
      console.error("submitApplication: staff email error", staffError);
      // Don't throw — application is already saved to DB
    }

    // Send confirmation auto-reply to applicant
    const { error: replyError } = await resend.emails.send({
      from: fromAddress,
      to: data.email,
      subject: `We received your application — ${positionTitle} | Cosmic Compliance Test Lab`,
      html: applicantEmail.html,
      text: applicantEmail.text,
    });

    if (replyError) {
      console.error("submitApplication: applicant auto-reply error", replyError);
    }

    console.log(
      `submitApplication: saved + emailed for "${positionTitle}" — ${data.fullName} <${data.email}>`,
    );

    return { ok: true as const };
  });
