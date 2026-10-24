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
import { and, eq, desc, asc } from "drizzle-orm";
import {
  db,
  jobPostings,
  applications,
  admins,
  hashPassword,
  ensureDb,
  type JobPosting,
  type Application,
  type Admin,
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
        status: z.enum(["new", "reviewed", "shortlisted", "rejected"]),
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
