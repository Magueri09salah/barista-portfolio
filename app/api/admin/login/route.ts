import { NextResponse, type NextRequest } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_TTL_MS,
  createSession,
  isConfigured,
  passwordMatches,
} from "@/lib/auth";

export const runtime = "nodejs";

/* One failed attempt costs a second. Nothing sophisticated — it just makes
   guessing a password over the network pointless. */
const DELAY_ON_FAILURE_MS = 1000;

export async function POST(request: NextRequest) {
  if (!isConfigured()) {
    return NextResponse.json(
      { error: "The back-office has no password set. Set ADMIN_PASSWORD and restart the server." },
      { status: 503 },
    );
  }

  let password = "";
  try {
    const body = await request.json();
    password = typeof body?.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Malformed request body." }, { status: 400 });
  }

  if (!passwordMatches(password)) {
    await new Promise((resolve) => setTimeout(resolve, DELAY_ON_FAILURE_MS));
    return NextResponse.json({ error: "That password is not correct." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: SESSION_COOKIE,
    value: await createSession(),
    httpOnly: true,
    sameSite: "lax",
    // Set behind TLS in production; over plain http in development the cookie
    // would otherwise be dropped and the login would appear to silently fail.
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });
  return response;
}

/** Sign out. */
export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({ name: SESSION_COOKIE, value: "", path: "/", maxAge: 0 });
  return response;
}
