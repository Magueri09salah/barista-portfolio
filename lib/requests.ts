/**
 * SETUP REQUESTS — shape, validation, and the small derived helpers the
 * back-office reads.
 *
 * Everything a visitor sends is untrusted. `parseSubmission` is the only way a
 * request is allowed to become a stored record: it rejects unknown service ids,
 * caps every string, and normalises whitespace. The client-side form does its
 * own checks for a decent experience, but nothing there is relied on here.
 */

import { budgetById, categoryById, itemById, timelineById } from "./catalogue";

export const statuses = ["new", "contacted", "quoted", "won", "lost"] as const;

export type RequestStatus = (typeof statuses)[number];

export const statusLabels: Record<RequestStatus, string> = {
  new: "New",
  contacted: "Contacted",
  quoted: "Quoted",
  won: "Won",
  lost: "Lost",
};

export type SetupRequest = {
  id: string;
  /** ISO 8601, UTC. */
  createdAt: string;
  status: RequestStatus;
  /** Cleared the first time the request is opened in the back-office. */
  unread: boolean;

  name: string;
  email: string;
  phone: string;
  city: string;

  /** Ids from `timelines` / `budgets`. Empty string when not answered. */
  timeline: string;
  budget: string;

  /** Service item ids, validated against the catalogue. */
  services: string[];
  /** Per-category free text, keyed by category id. Only non-empty entries kept. */
  categoryNotes: Record<string, string>;
  /** The single "anything else" box on the last step. */
  message: string;

  /** Private, written in the back-office. Never exposed publicly. */
  adminNotes: string;
};

/* ----------------------------------------------------------------- Limits
   Generous enough that a real person never hits them, tight enough that the
   store cannot be filled by a single POST.
   ---------------------------------------------------------------------- */
const LIMITS = {
  name: 120,
  email: 160,
  phone: 40,
  city: 120,
  note: 2000,
  message: 4000,
} as const;

function clean(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  // Collapse runs of whitespace but keep paragraph breaks in the long fields.
  return value.replace(/\r\n/g, "\n").replace(/[ \t]+/g, " ").trim().slice(0, max);
}

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/**
 * Accepts a phone number from anywhere in the world.
 *
 * Deliberately counts digits rather than matching a pattern: numbers are
 * written differently in every country — +212 6 17 80 58 66, (555) 010-9999,
 * 07700 900123 — and a regex tight enough to look rigorous ends up rejecting
 * real customers. E.164 caps a number at 15 digits; 7 is the shortest a
 * national number gets. Everything in between is somebody's real phone.
 *
 * Formatting characters are ignored, so the visitor can type it however they
 * like and it is stored exactly as they wrote it.
 */
export function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

export type ParseResult =
  | { ok: true; value: Omit<SetupRequest, "id" | "createdAt" | "status" | "unread" | "adminNotes"> }
  | { ok: false; errors: string[] };

/**
 * Validates a raw JSON body into the storable half of a request. The store
 * adds id, timestamp, status and the empty admin fields.
 */
export function parseSubmission(body: unknown): ParseResult {
  const errors: string[] = [];

  if (typeof body !== "object" || body === null) {
    return { ok: false, errors: ["Malformed request body."] };
  }

  const raw = body as Record<string, unknown>;

  const name = clean(raw.name, LIMITS.name);
  const email = clean(raw.email, LIMITS.email);
  const phone = clean(raw.phone, LIMITS.phone);
  const city = clean(raw.city, LIMITS.city);
  const message = clean(raw.message, LIMITS.message);

  if (!name) errors.push("A name is required.");
  if (!EMAIL.test(email)) errors.push("A valid email address is required.");
  if (!isValidPhone(phone)) {
    errors.push(
      phone
        ? "That phone number does not look complete. Include the country code."
        : "A phone number is required.",
    );
  }

  /* Service ids — anything not in the catalogue is dropped rather than stored,
     and duplicates are collapsed. */
  const services = Array.isArray(raw.services)
    ? [...new Set(raw.services.filter((id): id is string => typeof id === "string" && itemById.has(id)))]
    : [];

  if (services.length === 0) {
    errors.push("Choose at least one service so I know what the project needs.");
  }

  /* Timeline and budget are optional, but must be real ids if present. */
  const timelineRaw = clean(raw.timeline, 40);
  const timeline = timelineById.has(timelineRaw) ? timelineRaw : "";

  const budgetRaw = clean(raw.budget, 40);
  const budget = budgetById.has(budgetRaw) ? budgetRaw : "";

  /* Per-category notes, keyed by a real category id, empty ones discarded. */
  const categoryNotes: Record<string, string> = {};
  if (typeof raw.categoryNotes === "object" && raw.categoryNotes !== null) {
    for (const [key, value] of Object.entries(raw.categoryNotes as Record<string, unknown>)) {
      if (!categoryById.has(key)) continue;
      const note = clean(value, LIMITS.note);
      if (note) categoryNotes[key] = note;
    }
  }

  if (errors.length > 0) return { ok: false, errors };

  return {
    ok: true,
    value: { name, email, phone, city, timeline, budget, services, categoryNotes, message },
  };
}

/* ------------------------------------------------------------- Derived views
   Used by the back-office list and detail screens.
   ---------------------------------------------------------------------- */

/** Groups a request's selected services under their category, in catalogue order. */
export function servicesByCategory(request: SetupRequest) {
  const grouped = new Map<string, { category: NonNullable<ReturnType<typeof categoryById.get>>; items: string[] }>();

  for (const id of request.services) {
    const item = itemById.get(id);
    if (!item) continue; // catalogue entry removed since the request came in
    const category = [...categoryById.values()].find((c) => c.items.some((i) => i.id === id));
    if (!category) continue;

    const bucket = grouped.get(category.id);
    if (bucket) bucket.items.push(item.label);
    else grouped.set(category.id, { category, items: [item.label] });
  }

  // Catalogue order, not selection order.
  return [...categoryById.values()]
    .map((category) => grouped.get(category.id))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));
}

export function timelineLabel(id: string): string {
  return timelineById.get(id)?.label ?? "Not specified";
}

export function budgetLabel(id: string): string {
  return budgetById.get(id)?.label ?? "Not specified";
}

/** "4 September 2026, 14:32" — stable across server and client rendering. */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(date);
}
