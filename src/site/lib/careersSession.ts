/**
 * careersSession.ts — server-only admin session helpers (JWT cookie + DB lookup).
 *
 * Kept out of careersAuth.ts on purpose: that file is imported by browser code
 * for its server functions, and TanStack Start only strips code that lives
 * *inside* server-function handlers. Exported helpers that touch the database
 * would drag the Postgres driver (which needs Node's Buffer) into the browser
 * bundle. Only import this module from code that runs inside a handler.
 */

import { SignJWT, jwtVerify } from "jose";
import { eq } from "drizzle-orm";
import { db, admins, ensureDb } from "./db";

export const COOKIE_NAME = "careers_admin_session";
export const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 hours

export interface AdminSession {
  id: string;
  name: string;
  email: string;
  role: "superadmin" | "admin";
  /** Invited admins must replace their temporary password before anything else */
  mustChangePassword: boolean;
}

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

export async function signToken(session: AdminSession): Promise<string> {
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

export function toSession(admin: typeof admins.$inferSelect): AdminSession {
  return {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role as "superadmin" | "admin",
    mustChangePassword: admin.mustChangePassword,
  };
}

/**
 * The JWT only proves *who* is calling; role, name and the password-change flag
 * are re-read from the database so removals and role changes apply immediately.
 */
export async function getAdminSessionFromCookie(): Promise<AdminSession | null> {
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
