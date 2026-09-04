/**
 * BACK-OFFICE AUTH
 *
 * One operator, one password, a signed cookie. There are no user accounts to
 * manage, so a session is just a timestamp this server has signed: nothing is
 * stored, and forging one requires the secret.
 *
 * Written against Web Crypto rather than node:crypto so the same functions run
 * in middleware (Edge runtime) and in route handlers (Node runtime).
 *
 * Configure two environment variables — see .env.example:
 *
 *   ADMIN_PASSWORD   what you type on /admin/login
 *   ADMIN_SECRET     a long random string used to sign the cookie
 *
 * With neither set, the back-office refuses every request rather than opening
 * itself to the internet.
 */

export const SESSION_COOKIE = "qsb_admin";

/** Fourteen days. Long enough not to be a nuisance, short enough to expire. */
export const SESSION_TTL_MS = 14 * 24 * 60 * 60 * 1000;

export function isConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

/**
 * Signing key. Falls back to the password so a single environment variable is
 * enough to get running — the cost is that changing the password signs out
 * existing sessions, which is the safer default anyway.
 */
function secretMaterial(): string {
  return process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "";
}

const encoder = new TextEncoder();

async function key(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secretMaterial()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sign(payload: string): Promise<string> {
  const signature = await crypto.subtle.sign("HMAC", await key(), encoder.encode(payload));
  return toBase64Url(new Uint8Array(signature));
}

/** Length-independent comparison, so a mismatch reveals nothing by timing. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function passwordMatches(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!expected) return false;
  return safeEqual(candidate, expected);
}

/** `<expiry>.<signature>` — no session table, nothing to clean up. */
export async function createSession(now = Date.now()): Promise<string> {
  const expiry = String(now + SESSION_TTL_MS);
  return `${expiry}.${await sign(expiry)}`;
}

export async function verifySession(token: string | undefined | null): Promise<boolean> {
  if (!token || !isConfigured()) return false;

  const separator = token.lastIndexOf(".");
  if (separator === -1) return false;

  const expiry = token.slice(0, separator);
  const signature = token.slice(separator + 1);

  if (!/^\d+$/.test(expiry)) return false;
  if (Number(expiry) < Date.now()) return false;

  return safeEqual(signature, await sign(expiry));
}
