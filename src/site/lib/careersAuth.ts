/**
 * careersAuth.ts — Admin authentication for the careers system.
 *
 * Flow:
 *   1. Admin submits email + password to `loginAdmin`
 *   2. Server verifies password, signs a JWT, sets it as an httpOnly cookie
 *   3. Every subsequent admin server function calls `requireAdminSession`
 *      (careersSession.ts) to validate the cookie before doing anything
 *   4. `logoutAdmin` clears the cookie
 */

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db, admins, verifyPassword, hashPassword, ensureDb } from "./db";
import {
  COOKIE_MAX_AGE,
  COOKIE_NAME,
  getAdminSessionFromCookie,
  signToken,
  toSession,
} from "./careersSession";
import {
  LOCK_MINUTES,
  MAX_ACCOUNT_FAILURES,
  MAX_IP_FAILURES,
  assertNotLocked,
  clearFailures,
  clientIp,
  dummyPasswordHash,
  lockedMessage,
  recordFailure,
} from "./loginThrottle";

// Browser code imports the session *type* from here; the helpers themselves
// live in careersSession.ts so they never end up in the client bundle.
export type { AdminSession } from "./careersSession";

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

    const email = data.email.toLowerCase();
    const accountKey = `login:email:${email}`;
    const ip = await clientIp();
    const ipKey = ip ? `login:ip:${ip}` : null;

    // Locked accounts / networks don't even get a password check
    await assertNotLocked(ipKey ? [accountKey, ipKey] : [accountKey]);

    const [admin] = await db().select().from(admins).where(eq(admins.email, email)).limit(1);

    // Unknown emails still pay for a full hash check, so response time doesn't
    // reveal which addresses have accounts
    const valid = admin
      ? await verifyPassword(data.password, admin.passwordHash)
      : (await verifyPassword(data.password, await dummyPasswordHash()), false);

    if (!admin || !valid) {
      const [accountFailures] = await Promise.all([
        recordFailure(accountKey, MAX_ACCOUNT_FAILURES),
        ipKey ? recordFailure(ipKey, MAX_IP_FAILURES) : Promise.resolve(0),
      ]);
      const left = MAX_ACCOUNT_FAILURES - accountFailures;
      if (left <= 0) throw new Error(lockedMessage(LOCK_MINUTES));
      if (left <= 2) {
        throw new Error(
          `Invalid email or password. ${left} attempt${left === 1 ? "" : "s"} left before sign-in is locked for ${LOCK_MINUTES} minutes.`,
        );
      }
      throw new Error("Invalid email or password");
    }

    await clearFailures(accountKey);

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

    // Same brute-force protection for guessing the current password
    const pwKey = `pwchange:admin:${session.id}`;
    await assertNotLocked([pwKey]);
    const valid = await verifyPassword(data.currentPassword, admin.passwordHash);
    if (!valid) {
      const failures = await recordFailure(pwKey, MAX_ACCOUNT_FAILURES);
      if (failures >= MAX_ACCOUNT_FAILURES) throw new Error(lockedMessage(LOCK_MINUTES));
      throw new Error("Current password is incorrect");
    }
    await clearFailures(pwKey);

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
