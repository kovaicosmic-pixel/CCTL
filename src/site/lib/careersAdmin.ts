/**
 * careersAdmin.ts — All admin CRUD server functions for the careers system.
 *
 * Covers:
 *   Jobs       — list, get, create, update, delete, toggle active
 *   Applications — list, get, update status
 *   Admins     — list, create, remove (superadmin only)
 *   Public     — listActiveJobs (used by the public /careers page)
 */

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { and, eq, desc, asc, isNull, isNotNull, sql } from "drizzle-orm";
import {
  db,
  jobPostings,
  applications,
  admins,
  applicationNotes,
  hashPassword,
  ensureDb,
  type JobPosting,
  type Application,
  type Admin,
  type ApplicationNote,
} from "./db";
import { requireAdminSession, requireSuperAdmin } from "./careersSession";
import { Resend } from "resend";
import { buildAdminInviteEmail, senderWithName } from "./careerEmails";
import { EMAIL_LOGO_ATTACHMENT } from "./emailLogo";

// ─── Shared validators ────────────────────────────────────────────────────────

const jobSchema = z.object({
  title: z.string().trim().min(1).max(200),
  department: z.string().trim().min(1).max(100).default("Engineering"),
  experienceBand: z.string().trim().min(1).max(100),
  employmentType: z.enum(["Onsite", "Hybrid", "Remote"]).default("Onsite"),
  locations: z.array(z.enum(["coimbatore", "bangalore"])).min(1),
  responsibilities: z.array(z.string().trim().min(1)).min(1),
  requirements: z.array(z.string().trim().min(1)).min(1),
  active: z.boolean().default(true),
});

// ─── Public — used by /careers page (no auth needed) ─────────────────────────

export const listActiveJobs = createServerFn({ method: "GET" }).handler(async () => {
  await ensureDb();

  const jobs = await db()
    .select()
    .from(jobPostings)
    .where(eq(jobPostings.active, true))
    .orderBy(asc(jobPostings.createdAt));

  return {
    jobs: jobs.map((j) => ({
      ...j,
      locations: JSON.parse(j.locations) as string[],
      responsibilities: JSON.parse(j.responsibilities) as string[],
      requirements: JSON.parse(j.requirements) as string[],
    })),
  };
});

/** One live job for its public detail page — null if hidden, deleted or unknown. */
export const getPublicJob = createServerFn({ method: "GET" })
  .validator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    await ensureDb();

    const [j] = await db()
      .select()
      .from(jobPostings)
      .where(and(eq(jobPostings.id, data.id), eq(jobPostings.active, true)))
      .limit(1);

    return {
      job: j
        ? {
            ...j,
            locations: JSON.parse(j.locations) as string[],
            responsibilities: JSON.parse(j.responsibilities) as string[],
            requirements: JSON.parse(j.requirements) as string[],
          }
        : null,
    };
  });

// ─── Jobs — admin ─────────────────────────────────────────────────────────────

export const listAllJobs = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdminSession();

  const jobs = await db()
    .select()
    .from(jobPostings)
    .orderBy(desc(jobPostings.createdAt));

  return {
    jobs: jobs.map((j) => ({
      ...j,
      locations: JSON.parse(j.locations) as string[],
      responsibilities: JSON.parse(j.responsibilities) as string[],
      requirements: JSON.parse(j.requirements) as string[],
    })),
  };
});

export const createJob = createServerFn({ method: "POST" })
  .validator((data: unknown) => jobSchema.parse(data))
  .handler(async ({ data }) => {
    await requireAdminSession();

    const [job] = await db()
      .insert(jobPostings)
      .values({
        title: data.title,
        department: data.department,
        experienceBand: data.experienceBand,
        employmentType: data.employmentType,
        locations: JSON.stringify(data.locations),
        responsibilities: JSON.stringify(data.responsibilities),
        requirements: JSON.stringify(data.requirements),
        active: data.active,
      })
      .returning();

    return { ok: true as const, job };
  });

export const updateJob = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z.object({ id: z.string().uuid(), ...jobSchema.shape }).parse(data),
  )
  .handler(async ({ data }) => {
    await requireAdminSession();

    const { id, ...fields } = data;

    await db()
      .update(jobPostings)
      .set({
        title: fields.title,
        department: fields.department,
        experienceBand: fields.experienceBand,
        employmentType: fields.employmentType,
        locations: JSON.stringify(fields.locations),
        responsibilities: JSON.stringify(fields.responsibilities),
        requirements: JSON.stringify(fields.requirements),
        active: fields.active,
        updatedAt: new Date(),
      })
      .where(eq(jobPostings.id, id));

    return { ok: true as const };
  });

export const toggleJobActive = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z.object({ id: z.string().uuid(), active: z.boolean() }).parse(data),
  )
  .handler(async ({ data }) => {
    await requireAdminSession();

    await db()
      .update(jobPostings)
      .set({ active: data.active, updatedAt: new Date() })
      .where(eq(jobPostings.id, data.id));

    return { ok: true as const };
  });

export const deleteJob = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    await requireAdminSession();

    await db().delete(jobPostings).where(eq(jobPostings.id, data.id));

    return { ok: true as const };
  });

// ─── Applications — admin ─────────────────────────────────────────────────────

export const listApplications = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdminSession();

  const apps = await db()
    .select()
    .from(applications)
    .orderBy(desc(applications.appliedAt));

  // Strip resume binary data from list view — only load it on detail view
  return {
    applications: apps.map(({ resumeData: _, ...app }) => app),
  };
});

export const getApplication = createServerFn({ method: "GET" })
  .validator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    await requireAdminSession();

    const result = await db()
      .select()
      .from(applications)
      .where(eq(applications.id, data.id))
      .limit(1);

    if (!result[0]) throw new Error("Application not found");
    return { application: result[0] };
  });

export const updateApplicationStatus = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum([
          "new",
          "shortlisted",
          "interview_scheduled",
          "selected",
          "rejected",
          "old",
        ]),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    await requireAdminSession();

    await db()
      .update(applications)
      .set({ status: data.status })
      .where(eq(applications.id, data.id));

    return { ok: true as const };
  });

// ─── Application notes (collaborative, append-only) ──────────────────────────

export const listNotes = createServerFn({ method: "GET" })
  .validator((data: unknown) => z.object({ applicationId: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    await requireAdminSession();

    const notes = await db()
      .select()
      .from(applicationNotes)
      .where(eq(applicationNotes.applicationId, data.applicationId))
      .orderBy(asc(applicationNotes.createdAt));

    return { notes };
  });

export const addNote = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        applicationId: z.string().uuid(),
        note: z.string().trim().min(1).max(5000),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const session = await requireAdminSession();

    await db().insert(applicationNotes).values({
      applicationId: data.applicationId,
      adminId: session.id,
      adminName: session.name,
      note: data.note,
    });

    return { ok: true as const };
  });

/**
 * Delete a note. A note can be removed by its author, or by any super admin.
 * A regular admin cannot delete someone else's note.
 */
export const deleteNote = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    const session = await requireAdminSession();

    const [note] = await db()
      .select()
      .from(applicationNotes)
      .where(eq(applicationNotes.id, data.id))
      .limit(1);

    if (!note) {
      // Already gone — treat as success so the UI just refreshes.
      return { ok: true as const };
    }

    const isAuthor = note.adminId === session.id;
    const isSuperAdmin = session.role === "superadmin";
    if (!isAuthor && !isSuperAdmin) {
      throw new Error("You can only delete your own notes.");
    }

    await db().delete(applicationNotes).where(eq(applicationNotes.id, data.id));

    return { ok: true as const };
  });

/**
 * Summarise all interview notes for an application using Groq (gpt-oss-120b).
 *
 * The model is not trained on our data — we send the notes with a clear
 * instruction prompt and get a concise, neutral HR summary back. Returns a
 * friendly message (not an error) when the key is missing or there are too
 * few notes, so the UI can guide the recruiter instead of showing a crash.
 */
export const summariseNotes = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ applicationId: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    await requireAdminSession();

    const apiKey = process.env["GROQ_API_KEY"];
    if (!apiKey) {
      return {
        ok: false as const,
        reason: "not_configured" as const,
        message: "AI summary isn't configured yet. Add GROQ_API_KEY to the server's .env file.",
      };
    }

    const notes = await db()
      .select()
      .from(applicationNotes)
      .where(eq(applicationNotes.applicationId, data.applicationId))
      .orderBy(asc(applicationNotes.createdAt));

    if (notes.length < 2) {
      return {
        ok: false as const,
        reason: "too_few" as const,
        message: "Add at least two notes before generating a summary.",
      };
    }

    // Build the transcript of who said what.
    const transcript = notes
      .map((n, i) => `Note ${i + 1} — ${n.adminName}:\n${n.note}`)
      .join("\n\n");

    const systemPrompt = [
      "You are an HR assistant for an EMC/EMI testing laboratory.",
      "Several interviewers have left comments about ONE job candidate.",
      "Write a concise, neutral summary for the hiring team.",
      "",
      "Return the summary in EXACTLY this format, using these three headings on their own lines (no markdown asterisks, no bullet symbols):",
      "",
      "Strengths",
      "<one or two short sentences, or write 'None noted' if the interviewers raised none>",
      "",
      "Concerns",
      "<one or two short sentences, or write 'None noted' if none>",
      "",
      "Recommendation",
      "<the overall leaning in plain words — e.g. 'Lean hire', 'Mixed', 'Lean no-hire' — followed by one short sentence of reasoning. State explicitly if interviewers disagree.>",
      "",
      "Rules:",
      "- Do NOT use markdown formatting (no **bold**, no # headings, no - bullets). Plain text only.",
      "- Keep the whole summary under 120 words.",
      "- Base everything strictly on the notes. Do not invent qualifications, experience, or opinions not present.",
      "- If the notes contain only placeholder or test text with no real feedback, say so plainly under each heading instead of guessing.",
      "- No greeting, no sign-off.",
    ].join("\n");

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b",
          temperature: 0.3,
          max_tokens: 400,
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: `Here are the interview notes for the candidate:\n\n${transcript}`,
            },
          ],
        }),
      });

      if (!response.ok) {
        const body = await response.text();
        console.error("summariseNotes: Groq error", response.status, body);
        return {
          ok: false as const,
          reason: "ai_error" as const,
          message: "The AI service couldn't generate a summary right now. Please try again.",
        };
      }

      const result = (await response.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const summary = result.choices?.[0]?.message?.content?.trim();

      if (!summary) {
        return {
          ok: false as const,
          reason: "ai_error" as const,
          message: "The AI returned an empty summary. Please try again.",
        };
      }

      const generatedAt = new Date();
      // Persist so it survives navigation / is shared across recruiters.
      await db()
        .update(applications)
        .set({ aiSummary: summary, aiSummaryAt: generatedAt })
        .where(eq(applications.id, data.applicationId));

      return {
        ok: true as const,
        summary,
        noteCount: notes.length,
        generatedAt: generatedAt.toISOString(),
      };
    } catch (err) {
      console.error("summariseNotes: request failed", err);
      return {
        ok: false as const,
        reason: "ai_error" as const,
        message: "Couldn't reach the AI service. Check the server's connection and try again.",
      };
    }
  });

// ─── Resume ↔ Job match (ATS-style) ──────────────────────────────────────────

/** Pull plain text out of a base64 PDF or DOCX. Returns { text, error }. */
async function extractResumeText(
  base64: string,
  filename: string,
): Promise<{ text: string; error?: string }> {
  const ext = filename.split(".").pop()?.toLowerCase();
  // Strip any accidental data-URI prefix (e.g. "data:application/pdf;base64,")
  const clean = base64.includes(",") ? base64.slice(base64.indexOf(",") + 1) : base64;
  const buffer = Buffer.from(clean, "base64");

  try {
    if (ext === "pdf") {
      const { extractText, getDocumentProxy } = await import("unpdf");
      const pdf = await getDocumentProxy(new Uint8Array(buffer));
      const { text } = await extractText(pdf, { mergePages: true });
      return { text: (Array.isArray(text) ? text.join("\n") : text).trim() };
    }
    if (ext === "docx") {
      const mammoth = await import("mammoth");
      const { value } = await mammoth.extractRawText({ buffer });
      return { text: value.trim() };
    }
    if (ext === "doc") {
      return { text: "", error: "Old .doc files can't be read automatically — review manually." };
    }
    return { text: "", error: `Unsupported file type: .${ext}` };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("extractResumeText: failed", msg, err);
    return { text: "", error: `Extraction failed: ${msg}` };
  }
}

type MatchOutcome =
  | { ok: true; jobTitle: string; score: number; verdict: string; matched: string[]; missing: string[]; summary: string; generatedAt: string }
  | { ok: false; reason: "not_configured" | "no_job" | "unreadable" | "ai_error"; message: string };

/**
 * Core scorer — reusable by the single-run server fn and the bulk scorer.
 * Loads the application + job, extracts resume text, calls Groq, saves the
 * result to the DB, and returns the outcome. No auth check here — callers
 * (server functions) handle auth.
 */
async function scoreApplicationById(applicationId: string): Promise<MatchOutcome> {
  const apiKey = process.env["GROQ_API_KEY"];
  if (!apiKey) {
    return {
      ok: false,
      reason: "not_configured",
      message: "AI match isn't configured yet. Add GROQ_API_KEY to the server's .env file.",
    };
  }

  const [app] = await db()
    .select()
    .from(applications)
    .where(eq(applications.id, applicationId))
    .limit(1);
  if (!app) throw new Error("Application not found");

  if (!app.jobId) {
    return {
      ok: false,
      reason: "no_job",
      message:
        "This is a general / speculative CV not tied to a specific job, so there's nothing to match against.",
    };
  }

  const [job] = await db().select().from(jobPostings).where(eq(jobPostings.id, app.jobId)).limit(1);
  if (!job) {
    return { ok: false, reason: "no_job", message: "The job this candidate applied to no longer exists." };
  }

  const extracted = await extractResumeText(app.resumeData, app.resumeFilename);
  const resumeText = extracted.text;
  if (!resumeText || resumeText.length < 50) {
    return {
      ok: false,
      reason: "unreadable",
      message: extracted.error
        ? `Couldn't read this resume. ${extracted.error}`
        : "Couldn't read text from this resume — it may be a scanned image or an old .doc file. Open it to review manually.",
    };
  }

  const requirements = (JSON.parse(job.requirements) as string[]).join("\n- ");
  const responsibilities = (JSON.parse(job.responsibilities) as string[]).join("\n- ");

  const systemPrompt = [
    "You are an ATS (Applicant Tracking System) screening assistant for an EMC/EMI testing laboratory.",
    "Compare ONE candidate's resume against ONE job posting and judge the fit.",
    "",
    "Return your answer as STRICT JSON with exactly these keys and nothing else:",
    "{",
    '  "score": <integer 0-100, overall match>,',
    '  "verdict": "<one short phrase: Strong match | Good match | Partial match | Weak match>",',
    '  "matched": [<skills/requirements from the job clearly evidenced in the resume, max 6 short strings>],',
    '  "missing": [<important job requirements NOT found in the resume, max 6 short strings>],',
    '  "summary": "<2-3 sentence plain-text assessment of the fit>"',
    "}",
    "",
    "Rules:",
    "- Judge ONLY on evidence in the resume text. Do not assume skills that aren't written.",
    "- Be objective and unbiased. Do not inflate or deflate the score.",
    "- Output valid JSON only. No markdown, no code fences, no extra text.",
  ].join("\n");

  const userPrompt = [
    `JOB TITLE: ${job.title}`,
    `EXPERIENCE REQUIRED: ${job.experienceBand}`,
    "",
    "RESPONSIBILITIES:",
    `- ${responsibilities}`,
    "",
    "REQUIREMENTS:",
    `- ${requirements}`,
    "",
    "CANDIDATE RESUME (extracted text):",
    resumeText.slice(0, 12000),
  ].join("\n");

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        temperature: 0.2,
        max_tokens: 700,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error("scoreApplicationById: Groq error", response.status, body);
      // Temporarily surface the real reason so we can diagnose.
      return {
        ok: false,
        reason: "ai_error",
        message: `Groq error ${response.status}: ${body.slice(0, 300)}`,
      };
    }

    const result = (await response.json()) as { choices?: { message?: { content?: string } }[] };
    const raw = result.choices?.[0]?.message?.content?.trim();
    if (!raw) {
      return { ok: false, reason: "ai_error", message: "The AI returned an empty result. Please try again." };
    }

    let parsed: { score: number; verdict: string; matched: string[]; missing: string[]; summary: string };
    try {
      parsed = JSON.parse(raw);
    } catch {
      console.error("scoreApplicationById: non-JSON response", raw);
      return { ok: false, reason: "ai_error", message: "Couldn't parse the AI result. Please try again." };
    }

    const generatedAt = new Date();
    const matchResult = {
      jobTitle: job.title,
      score: Math.max(0, Math.min(100, Math.round(parsed.score ?? 0))),
      verdict: String(parsed.verdict ?? "").slice(0, 60),
      matched: (parsed.matched ?? []).slice(0, 6).map((s) => String(s).slice(0, 80)),
      missing: (parsed.missing ?? []).slice(0, 6).map((s) => String(s).slice(0, 80)),
      summary: String(parsed.summary ?? "").slice(0, 600),
      generatedAt: generatedAt.toISOString(),
    };

    await db()
      .update(applications)
      .set({ aiMatch: JSON.stringify(matchResult), aiMatchAt: generatedAt })
      .where(eq(applications.id, applicationId));

    return { ok: true, ...matchResult };
  } catch (err) {
    console.error("scoreApplicationById: request failed", err);
    return { ok: false, reason: "ai_error", message: "Couldn't reach the AI service. Check the server's connection and try again." };
  }
}

/** Single match run triggered from the candidate detail UI. */
export const matchResumeToJob = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ applicationId: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    await requireAdminSession();
    return scoreApplicationById(data.applicationId);
  });

/**
 * Bulk-score every job application that doesn't have a score yet.
 * Processes in small sequential batches to stay within Groq rate limits.
 * General (no-job) applications are skipped. Returns how many were scored.
 */
export const scoreUnscoredApplications = createServerFn({ method: "POST" }).handler(async () => {
  await requireAdminSession();

  if (!process.env["GROQ_API_KEY"]) {
    return { ok: false as const, message: "Add GROQ_API_KEY to enable AI scoring.", scored: 0, failed: 0, remaining: 0 };
  }

  // Find job applications with a resume, a linked job, and no score yet.
  const pending = await db()
    .select({ id: applications.id })
    .from(applications)
    .where(and(isNull(applications.aiMatch), isNotNull(applications.jobId)))
    .limit(25); // cap per click so a single request can't run away

  let scored = 0;
  let failed = 0;
  for (const row of pending) {
    try {
      const res = await scoreApplicationById(row.id);
      if (res.ok) scored++;
      else failed++;
    } catch {
      failed++;
    }
  }

  // How many still have no score after this batch.
  const [{ count }] = await db()
    .select({ count: sql<number>`count(*)` })
    .from(applications)
    .where(and(isNull(applications.aiMatch), isNotNull(applications.jobId)));

  return { ok: true as const, scored, failed, remaining: Number(count) };
});

// ─── Admin accounts (superadmin only) ────────────────────────────────────────

export const listAdmins = createServerFn({ method: "GET" }).handler(async () => {
  await requireSuperAdmin();

  const result = await db()
    .select({
      id: admins.id,
      name: admins.name,
      email: admins.email,
      role: admins.role,
      createdAt: admins.createdAt,
      createdBy: admins.createdBy,
      mustChangePassword: admins.mustChangePassword,
      lastLoginAt: admins.lastLoginAt,
      lastActiveAt: admins.lastActiveAt,
      loginCount: admins.loginCount,
    })
    .from(admins)
    .orderBy(asc(admins.createdAt));

  return { admins: result };
});

export const createAdminAccount = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        name: z.string().trim().min(1).max(100),
        email: z.string().trim().email().max(320),
        password: z.string().min(8).max(200),
        role: z.enum(["superadmin", "admin"]).default("admin"),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const session = await requireSuperAdmin();

    const email = data.email.toLowerCase();
    const [existing] = await db()
      .select({ id: admins.id })
      .from(admins)
      .where(eq(admins.email, email))
      .limit(1);
    if (existing) {
      throw new Error("An admin account with this email already exists.");
    }

    const passwordHash = await hashPassword(data.password);

    const [admin] = await db()
      .insert(admins)
      .values({
        name: data.name,
        email,
        passwordHash,
        role: data.role,
        createdBy: session.id,
        // The password was chosen by the inviter — the new admin must replace it
        mustChangePassword: true,
      })
      .returning({
        id: admins.id,
        name: admins.name,
        email: admins.email,
        role: admins.role,
      });

    // Email the invitation. The account exists either way, so a mail failure is
    // reported back to the inviter (who can share the details manually), not thrown.
    let inviteSent = false;
    const apiKey = process.env["RESEND_API_KEY"];
    const fromAddress = process.env["CONTACT_FROM_EMAIL"];
    if (apiKey && fromAddress) {
      const invite = buildAdminInviteEmail({
        name: data.name,
        email,
        role: data.role,
        temporaryPassword: data.password,
        invitedBy: session.name,
      });
      const { error } = await new Resend(apiKey).emails.send({
        from: senderWithName(fromAddress),
        to: email,
        replyTo: session.email,
        subject: "You've been invited to the CCTL Careers admin panel",
        html: invite.html,
        text: invite.text,
        attachments: [EMAIL_LOGO_ATTACHMENT],
      });
      if (error) console.error("createAdminAccount: invite email error", error);
      else inviteSent = true;
    } else {
      console.error("createAdminAccount: RESEND_API_KEY / CONTACT_FROM_EMAIL not set — invite skipped.");
    }

    return { ok: true as const, admin, inviteSent };
  });

export const removeAdminAccount = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    const session = await requireSuperAdmin();

    if (data.id === session.id) {
      throw new Error("You cannot remove your own account.");
    }

    await db().delete(admins).where(eq(admins.id, data.id));

    return { ok: true as const };
  });

// ─── Dashboard stats ──────────────────────────────────────────────────────────

export const getDashboardStats = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdminSession();

  const [allJobs, allApps] = await Promise.all([
    db().select().from(jobPostings),
    db().select({ status: applications.status, appliedAt: applications.appliedAt }).from(applications),
  ]);

  const activeJobs = allJobs.filter((j) => j.active).length;
  const totalApplications = allApps.length;

  // New applications in the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const newThisMonth = allApps.filter(
    (a) => a.status === "new" && new Date(a.appliedAt) > thirtyDaysAgo,
  ).length;

  return { activeJobs, totalApplications, newThisMonth };
});
