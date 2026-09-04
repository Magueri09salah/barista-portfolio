/**
 * REQUEST STORE — server only.
 *
 * The only module that knows requests live in Postgres. Everything above it
 * works in the application's own `SetupRequest` shape from lib/requests.ts,
 * which is why the two differ: Prisma hands back `Date` and `JsonValue`, and
 * `toRequest` maps those to the plain strings and records the components and
 * route handlers expect.
 *
 * Keeping that boundary here means the schema can change — a column renamed, a
 * database swapped — without touching a single page.
 *
 * Connection details and migrations: see prisma7.config.ts and README.
 */

import type { Prisma } from "./generated/prisma/client";
import type { SetupRequestModel as StoredRequest } from "./generated/prisma/models";
import { prisma } from "./prisma";
import type { SetupRequest } from "./requests";

/** Prisma row → the shape the rest of the application uses. */
function toRequest(row: StoredRequest): SetupRequest {
  return {
    id: row.id,
    createdAt: row.createdAt.toISOString(),
    status: row.status,
    unread: row.unread,
    name: row.name,
    email: row.email,
    phone: row.phone,
    city: row.city,
    timeline: row.timeline,
    budget: row.budget,
    services: row.services,
    /* Json is `unknown` as far as the type system is concerned. It is only ever
       written by parseSubmission, which guarantees a flat string map, but a
       hand-edited row should degrade to "no notes" rather than crash a page. */
    categoryNotes: isNoteMap(row.categoryNotes) ? row.categoryNotes : {},
    message: row.message,
    adminNotes: row.adminNotes,
  };
}

function isNoteMap(value: Prisma.JsonValue): value is Record<string, string> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.values(value).every((entry) => typeof entry === "string")
  );
}

/* ------------------------------------------------------------------- Reads */

/** Newest first — the order the back-office inbox wants. */
export async function listRequests(): Promise<SetupRequest[]> {
  const rows = await prisma.setupRequest.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map(toRequest);
}

export async function getRequest(id: string): Promise<SetupRequest | null> {
  const row = await prisma.setupRequest.findUnique({ where: { id } });
  return row ? toRequest(row) : null;
}

export async function unreadCount(): Promise<number> {
  return prisma.setupRequest.count({ where: { unread: true } });
}

/* ------------------------------------------------------------------ Writes */

type NewRequest = Omit<SetupRequest, "id" | "createdAt" | "status" | "unread" | "adminNotes">;

export async function createRequest(input: NewRequest): Promise<SetupRequest> {
  const row = await prisma.setupRequest.create({
    data: {
      name: input.name,
      email: input.email,
      phone: input.phone,
      city: input.city,
      timeline: input.timeline,
      budget: input.budget,
      services: input.services,
      categoryNotes: input.categoryNotes,
      message: input.message,
    },
  });
  return toRequest(row);
}

type Patch = Partial<Pick<SetupRequest, "status" | "adminNotes" | "unread">>;

/** Null when there is no such request, so callers can 404 rather than throw. */
export async function updateRequest(id: string, patch: Patch): Promise<SetupRequest | null> {
  const rows = await prisma.setupRequest.updateManyAndReturn({ where: { id }, data: patch });
  return rows.length > 0 ? toRequest(rows[0]) : null;
}

/** False when there was nothing to delete. */
export async function deleteRequest(id: string): Promise<boolean> {
  const { count } = await prisma.setupRequest.deleteMany({ where: { id } });
  return count > 0;
}
