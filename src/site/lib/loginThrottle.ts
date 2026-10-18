/**
 * loginThrottle.ts — brute-force protection for the careers admin sign-in.
 *
 * Policy (counters live in the `login_attempts` table, so restarts don't reset them):
 *   • per account:  5 wrong passwords within 15 min → that email is locked 15 min
 *   • per network:  20 wrong attempts within 15 min → that IP is locked 15 min
 *   • while locked, the password is not even checked
 *
 * Server-only: import this solely from code that runs inside server-function
 * handlers (see careersSession.ts for why).
 */

import { and, eq, gt, inArray, lt, or, isNull, sql } from "drizzle-orm";
import { db, hashPassword, loginAttempts } from "./db";

export const MAX_ACCOUNT_FAILURES = 5;
export const MAX_IP_FAILURES = 20;
export const WINDOW_MINUTES = 15;
export const LOCK_MINUTES = 15;

export class LoginLockedError extends Error {}

export function lockedMessage(minutes: number) {
  return `Too many failed sign-in attempts. Please try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`;
}

/**
 * The visitor's IP as seen by Nginx. Nginx *appends* the real address to
 * X-Forwarded-For, so the last entry is the trustworthy one (earlier entries
 * can be forged by the client). Loopback / unknown → null, so a proxy that
 * doesn't forward the header can never lock every visitor out at once.
 */
export async function clientIp(): Promise<string | null> {
  const { getRequestHeader } = await import("@tanstack/react-start/server");
  const forwarded = getRequestHeader("x-forwarded-for");
  const ip =
    forwarded?.split(",").map((s) => s.trim()).filter(Boolean).at(-1) ??
    getRequestHeader("x-real-ip")?.trim();
  if (!ip || /^(127\.|::1$|::ffff:127\.|localhost$)/i.test(ip)) return null;
  return ip;
}

let _dummyHash: Promise<string> | null = null;
/** A real hash to verify against when the email doesn't exist (timing equaliser). */
export function dummyPasswordHash(): Promise<string> {
  _dummyHash ??= hashPassword(`not-a-real-password-${Math.random()}`);
  return _dummyHash;
}

/** Throws LoginLockedError if any of the keys is currently locked. */
export async function assertNotLocked(keys: string[]): Promise<void> {
  if (!keys.length) return;
  const rows = await db()
    .select({ lockedUntil: loginAttempts.lockedUntil })
    .from(loginAttempts)
    .where(and(inArray(loginAttempts.key, keys), gt(loginAttempts.lockedUntil, sql`now()`)));

  const until = rows.reduce<number>((max, r) => Math.max(max, r.lockedUntil?.getTime() ?? 0), 0);
  if (until) {
    const minutes = Math.max(1, Math.ceil((until - Date.now()) / 60_000));
    throw new LoginLockedError(lockedMessage(minutes));
  }
}

/**
 * Counts one failure for `key` atomically and locks it once `max` failures
 * happen inside the window. Returns the failure count in the current window.
 */
export async function recordFailure(key: string, max: number): Promise<number> {
  const windowExpired = sql`${loginAttempts.windowStart} < now() - make_interval(mins => ${WINDOW_MINUTES}::int)`;
  const nextFailures = sql`CASE WHEN ${windowExpired} THEN 1 ELSE ${loginAttempts.failures} + 1 END`;

  const [row] = await db()
    .insert(loginAttempts)
    .values({
      key,
      failures: 1,
      windowStart: sql`now()`,
      lockedUntil: max <= 1 ? sql`now() + make_interval(mins => ${LOCK_MINUTES}::int)` : null,
    })
    .onConflictDoUpdate({
      target: loginAttempts.key,
      set: {
        failures: nextFailures,
        windowStart: sql`CASE WHEN ${windowExpired} THEN now() ELSE ${loginAttempts.windowStart} END`,
        lockedUntil: sql`CASE WHEN (${nextFailures}) >= ${max}::int
          THEN now() + make_interval(mins => ${LOCK_MINUTES}::int) ELSE NULL END`,
      },
    })
    .returning({ failures: loginAttempts.failures });

  // Housekeeping: drop stale counters so the table stays tiny
  await db()
    .delete(loginAttempts)
    .where(
      and(
        lt(loginAttempts.windowStart, sql`now() - interval '1 day'`),
        or(isNull(loginAttempts.lockedUntil), lt(loginAttempts.lockedUntil, sql`now()`)),
      ),
    );

  return row?.failures ?? 1;
}

/** Forget failures after a successful sign-in. */
export async function clearFailures(key: string): Promise<void> {
  await db().delete(loginAttempts).where(eq(loginAttempts.key, key));
}
