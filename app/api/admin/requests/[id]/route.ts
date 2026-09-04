import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";
import { statuses, type RequestStatus } from "@/lib/requests";
import { deleteRequest, updateRequest } from "@/lib/store";

export const runtime = "nodejs";

/**
 * Middleware already gates /api/admin, but these handlers touch stored leads,
 * so they check the session themselves rather than trusting a matcher.
 */
async function authorised(request: NextRequest): Promise<boolean> {
  return verifySession(request.cookies.get(SESSION_COOKIE)?.value);
}

function isStatus(value: unknown): value is RequestStatus {
  return typeof value === "string" && (statuses as readonly string[]).includes(value);
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!(await authorised(request))) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { id } = await context.params;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Malformed request body." }, { status: 400 });
  }

  const patch: Parameters<typeof updateRequest>[1] = {};

  if ("status" in body) {
    if (!isStatus(body.status)) {
      return NextResponse.json({ error: "Unknown status." }, { status: 400 });
    }
    patch.status = body.status;
  }

  if ("adminNotes" in body) {
    if (typeof body.adminNotes !== "string") {
      return NextResponse.json({ error: "Notes must be text." }, { status: 400 });
    }
    patch.adminNotes = body.adminNotes.slice(0, 8000);
  }

  if ("unread" in body) {
    patch.unread = Boolean(body.unread);
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  const updated = await updateRequest(id, patch);
  if (!updated) return NextResponse.json({ error: "No such request." }, { status: 404 });

  return NextResponse.json({ ok: true, request: updated });
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!(await authorised(request))) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { id } = await context.params;
  const removed = await deleteRequest(id);
  if (!removed) return NextResponse.json({ error: "No such request." }, { status: 404 });

  return NextResponse.json({ ok: true });
}
