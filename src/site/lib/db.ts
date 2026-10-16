/**
 * db.ts — Drizzle ORM client + full schema for the careers system.
 *
 * Tables:
 *   job_postings   — managed by admin, shown on /careers
 *   applications   — submitted by candidates via /careers apply modal
 *   admins         — admin panel users (superadmin + admin roles)
 *
 * On first boot the `initDb()` call creates all tables if they don't exist.
 * No separate migration runner needed — just deploy and go.
 */

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import {
  pgTable,
  text,
  boolean,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

// ─── Schema ─────────────────────────────────────────────────────────────────

export const jobPostings = pgTable("job_postings", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  department: text("department").notNull().default("Engineering"),
  experienceBand: text("experience_band").notNull(),
  employmentType: text("employment_type").notNull().default("Onsite"),
  /** JSON-encoded string[]: ["coimbatore","bangalore"] */
  locations: text("locations").notNull().default('["coimbatore","bangalore"]'),
  /** JSON-encoded string[]: list of bullet points */
  responsibilities: text("responsibilities").notNull().default("[]"),
  /** JSON-encoded string[]: list of bullet points */
  requirements: text("requirements").notNull().default("[]"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const applications = pgTable("applications", {
  id: uuid("id").primaryKey().defaultRandom(),
  /** null for general (speculative) applications not tied to a posting */
  jobId: uuid("job_id"),
  jobTitle: text("job_title").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  yearsExperience: text("years_experience").notNull(),
  currentLocation: text("current_location").notNull(),
  /** "coimbatore" | "bangalore" | "either" — set on general applications */
  preferredLocation: text("preferred_location"),
  coverLetter: text("cover_letter").notNull().default(""),
  resumeFilename: text("resume_filename").notNull(),
  resumeData: text("resume_data").notNull(), // base64 encoded
  /** "new" | "reviewed" | "shortlisted" | "rejected" */
  status: text("status").notNull().default("new"),
  appliedAt: timestamp("applied_at", { withTimezone: true }).notNull().defaultNow(),
});

export const admins = pgTable("admins", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  /** "superadmin" | "admin" */
  role: text("role").notNull().default("admin"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  createdBy: uuid("created_by"), // nullable — null for the seeded superadmin
  /** true for invited admins until they replace their temporary password */
  mustChangePassword: boolean("must_change_password").notNull().default(false),
});

// ─── Type exports ────────────────────────────────────────────────────────────

export type JobPosting = typeof jobPostings.$inferSelect;
export type NewJobPosting = typeof jobPostings.$inferInsert;
export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;
export type Admin = typeof admins.$inferSelect;
export type NewAdmin = typeof admins.$inferInsert;

// ─── Connection + Drizzle client (singleton) ─────────────────────────────────

let _db: ReturnType<typeof drizzle> | null = null;

function getDb() {
  if (_db) return _db;

  const url = process.env["DATABASE_URL"];
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Add it to your .env file.\n" +
        "Example: DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres",
    );
  }

  const client = postgres(url, {
    max: 10,
    ssl: url.includes("supabase.co") ? "require" : false,
    idle_timeout: 20,
    connect_timeout: 10,
  });

  _db = drizzle(client);
  return _db;
}

export function db() {
  return getDb();
}

// ─── Password hashing (Web Crypto — no extra package) ────────────────────────

const PBKDF2_ITERATIONS = 310_000;
const HASH_LENGTH = 32;

async function deriveKey(password: string, salt: Uint8Array): Promise<ArrayBuffer> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  return crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    keyMaterial,
    HASH_LENGTH * 8,
  );
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Hash a plaintext password — store the result in the DB. */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await deriveKey(password, salt);
  return `${toHex(salt)}:${toHex(hash)}`;
}

/** Verify a plaintext password against a stored hash. */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;
  const salt = Uint8Array.from(saltHex.match(/.{2}/g)!.map((b) => parseInt(b, 16)));
  const hash = await deriveKey(password, salt);
  return toHex(hash) === hashHex;
}

// ─── DB initialisation (creates tables + seeds superadmin on first boot) ─────

export async function initDb(): Promise<void> {
  const client = postgres(process.env["DATABASE_URL"]!, {
    ssl: process.env["DATABASE_URL"]!.includes("supabase.co") ? "require" : false,
    max: 1,
  });

  try {
    // Create tables in order (no FK enforcement needed for uuid refs in Supabase)
    await client`
      CREATE TABLE IF NOT EXISTS job_postings (
        id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title             TEXT NOT NULL,
        department        TEXT NOT NULL DEFAULT 'Engineering',
        experience_band   TEXT NOT NULL,
        employment_type   TEXT NOT NULL DEFAULT 'Onsite',
        locations         TEXT NOT NULL DEFAULT '["coimbatore","bangalore"]',
        responsibilities  TEXT NOT NULL DEFAULT '[]',
        requirements      TEXT NOT NULL DEFAULT '[]',
        active            BOOLEAN NOT NULL DEFAULT TRUE,
        created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    await client`
      CREATE TABLE IF NOT EXISTS applications (
        id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        job_id            UUID NOT NULL,
        job_title         TEXT NOT NULL,
        full_name         TEXT NOT NULL,
        email             TEXT NOT NULL,
        phone             TEXT NOT NULL,
        years_experience  TEXT NOT NULL,
        current_location  TEXT NOT NULL,
        cover_letter      TEXT NOT NULL DEFAULT '',
        resume_filename   TEXT NOT NULL,
        resume_data       TEXT NOT NULL,
        status            TEXT NOT NULL DEFAULT 'new',
        applied_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    // General (speculative) applications: no linked job, preferred lab location.
    // Idempotent so it upgrades tables created before these columns existed.
    await client`ALTER TABLE applications ALTER COLUMN job_id DROP NOT NULL`;
    await client`ALTER TABLE applications ADD COLUMN IF NOT EXISTS preferred_location TEXT`;

    await client`
      CREATE TABLE IF NOT EXISTS admins (
        id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name           TEXT NOT NULL,
        email          TEXT NOT NULL UNIQUE,
        password_hash  TEXT NOT NULL,
        role           TEXT NOT NULL DEFAULT 'admin',
        created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        created_by     UUID
      )
    `;
    await client`
      ALTER TABLE admins ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN NOT NULL DEFAULT FALSE
    `;

    // Seed superadmin if not already present
    const superEmail = process.env["CAREERS_SUPERADMIN_EMAIL"];
    const superPassword = process.env["CAREERS_SUPERADMIN_PASSWORD"];

    if (superEmail && superPassword) {
      const existing = await client`
        SELECT id FROM admins WHERE email = ${superEmail} LIMIT 1
      `;
      if (existing.length === 0) {
        const passwordHash = await hashPassword(superPassword);
        await client`
          INSERT INTO admins (name, email, password_hash, role)
          VALUES ('Super Admin', ${superEmail}, ${passwordHash}, 'superadmin')
        `;
        console.log(`[careers] Superadmin seeded: ${superEmail}`);
      }
    }

    console.log("[careers] DB initialised successfully");
  } finally {
    await client.end();
  }
}

let _initPromise: Promise<void> | null = null;

/**
 * Runs initDb() once per server process. Admin requests call this before
 * querying, so a session cookie issued before a deploy can't hit a column the
 * new code expects but the database doesn't have yet.
 */
export function ensureDb(): Promise<void> {
  if (!_initPromise) {
    _initPromise = initDb().catch((err) => {
      _initPromise = null; // allow a retry on the next request
      throw err;
    });
  }
  return _initPromise;
}
