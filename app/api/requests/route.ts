import { NextResponse, type NextRequest } from "next/server";
import { parseSubmission } from "@/lib/requests";
import { createRequest } from "@/lib/store";

/** Uses the filesystem store, so it must not run on the Edge runtime. */
export const runtime = "nodejs";

/* ------------------------------------------------------------ Rate limiting
   A public form on a small site does not need a service for this. One bucket
   per address, held in memory: enough to stop a script filling the store,
   cheap enough to be free, and it resets on deploy — which is fine, because
   nothing here is a security boundary.
   ------------------------------------------------------------------------ */
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(address: string): boolean {
  const now = Date.now();
  const recent = (hits.get(address) ?? []).filter((time) => now - time < WINDOW_MS);

  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(address, recent);
    return true;
  }

  recent.push(now);
  hits.set(address, recent);

  // Opportunistic sweep so the map cannot grow without bound.
  if (hits.size > 500) {
    for (const [key, times] of hits) {
      if (times.every((time) => now - time >= WINDOW_MS)) hits.delete(key);
    }
  }

  return false;
}

function clientAddress(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: NextRequest) {
  if (rateLimited(clientAddress(request))) {
    return NextResponse.json(
      { errors: ["Too many requests from this connection. Try again later, or email directly."] },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ errors: ["Malformed request body."] }, { status: 400 });
  }

  const parsed = parseSubmission(body);
  if (!parsed.ok) {
    return NextResponse.json({ errors: parsed.errors }, { status: 400 });
  }

  try {
    const created = await createRequest(parsed.value);
    return NextResponse.json({ ok: true, id: created.id }, { status: 201 });
  } catch (error) {
    // The visitor cannot act on a disk error — log it, tell them plainly.
    console.error("[requests] failed to store submission:", error);
    return NextResponse.json(
      { errors: ["Something went wrong saving your request. Please email me directly."] },
      { status: 500 },
    );
  }
}
