/**
 * careersAuth.ts — Admin authentication for the careers system.
 *
 * Flow:
 *   1. Admin submits email + password to `loginAdmin`
 *   2. Server verifies password, signs a JWT, sets it as an httpOnly cookie
 *   3. Every subsequent admin server function calls `requireAdminSession` to
 *      validate the cookie before doing anything
 *   4. `logoutAdmin` clears the cookie
 */

import { createServerFn } from "@tanstack/react-start";
import { SignJWT, jwtVerify } from "jose";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db, admins, verifyPassword, hashPassword, ensureDb } from "./db";

// ─── Constants ───────────────────────────────────────────────────────────────

const COOKIE_NAME = "careers_admin_session";
const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 hours

function getJwtSecret(): Uint8Array {
  const secret = process.env["CAREERS_JWT_SECRET"];
  if (!secret) {
    throw new Error(
      "CAREERS_JWT_SECRET is not set. Add it to your .env file.\n" +
        "Generate one with: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"",
    );
  }
  return new TextEncoder().encode(secret);
}

// ─── JWT helpers ─────────────────────────────────────────────────────────────

export interface AdminSession {
  id: string;
  name: string;
  email: string;
  role: "superadmin" | "admin";
  /** Invited admins must replace their temporary password before anything else */
  mustChangePassword: boolean;
}

async function signToken(session: AdminSession): Promise<string> {
  return new SignJWT({ ...session })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(getJwtSecret());
}

async function verifyToken(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload as unknown as AdminSession;
  } catch {
    return null;
  }
}

// ─── Read session from current request cookie ────────────────────────────────

function toSession(admin: typeof admins.$inferSelect): AdminSession {
  return {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role as "superadmin" | "admin",
    mustChangePassword: admin.mustChangePassword,
  };
}

// Internal helper — only called from within server function handlers.
// The JWT only proves *who* is calling; role, name and the password-change flag
// are re-read from the database so removals and role changes apply immediately.
async function getAdminSessionFromCookie(): Promise<AdminSession | null> {
  const { getCookie } = await import("@tanstack/react-start/server");
  let tokenSession: AdminSession | null;
  try {
    const token = getCookie(COOKIE_NAME);
    if (!token) return null;
    tokenSession = await verifyToken(token);
  } catch {
    return null;
  }
  if (!tokenSession?.id) return null;

  await ensureDb();
  const [admin] = await db().select().from(admins).where(eq(admins.id, tokenSession.id)).limit(1);
  return admin ? toSession(admin) : null;
}

/** Throws if no valid session. Use inside admin server functions. */
export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSessionFromCookie();
  if (!session) {
    throw new Error("Unauthorized: no valid admin session");
  }
  if (session.mustChangePassword) {
    throw new Error("Please set a new password before continuing.");
  }
  return session;
}

/** Throws if session exists but is not superadmin. */
export async function requireSuperAdmin(): Promise<AdminSession> {
  const session = await requireAdminSession();
  if (session.role !== "superadmin") {
    throw new Error("Forbidden: superadmin access required");
  }
  return session;
}

// ─── Server functions ─────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z.string().trim().email().max(320),
  password: z.string().min(1).max(200),
});

export const loginAdmin = createServerFn({ method: "POST" })
  .validator((data: unknown) => loginSchema.parse(data))
  .handler(async ({ data }) => {
    // Ensure DB + superadmin are initialised on first login attempt
    await ensureDb();

    const result = await db()
      .select()
      .from(admins)
      .where(eq(admins.email, data.email.toLowerCase()))
      .limit(1);

    const admin = result[0];
    if (!admin) {
      throw new Error("Invalid email or password");
    }

    const valid = await verifyPassword(data.password, admin.passwordHash);
    if (!valid) {
      throw new Error("Invalid email or password");
    }

    const session = toSession(admin);

    const token = await signToken(session);

    const { setCookie } = await import("@tanstack/react-start/server");
    setCookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env["NODE_ENV"] === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });

    return { ok: true as const, session };
  });

export const logoutAdmin = createServerFn({ method: "POST" }).handler(async () => {
  const { deleteCookie } = await import("@tanstack/react-start/server");
  deleteCookie(COOKIE_NAME, { path: "/" });
  return { ok: true as const };
});

export const getSession = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getAdminSessionFromCookie();
  return { session };
});

export const changePassword = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      z
        .object({
          currentPassword: z.string().min(1),
          newPassword: z.string().min(8).max(200),
        })
        .parse(data),
  )
  .handler(async ({ data }) => {
    // Not requireAdminSession(): admins on a temporary password must reach this
    const session = await getAdminSessionFromCookie();
    if (!session) throw new Error("Unauthorized: no valid admin session");

    const result = await db()
      .select()
      .from(admins)
      .where(eq(admins.id, session.id))
      .limit(1);

    const admin = result[0];
    if (!admin) throw new Error("Admin not found");

    const valid = await verifyPassword(data.currentPassword, admin.passwordHash);
    if (!valid) throw new Error("Current password is incorrect");

    if (data.newPassword === data.currentPassword) {
      throw new Error("Your new password must be different from the current one.");
    }

    const newHash = await hashPassword(data.newPassword);

    await db()
      .update(admins)
      .set({ passwordHash: newHash, mustChangePassword: false })
      .where(eq(admins.id, session.id));

    return { ok: true as const, session: { ...session, mustChangePassword: false } };
  });
