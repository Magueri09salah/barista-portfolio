/**
 * EDITABLE SITE CONTENT — server only.
 *
 * Every word on the public site comes through here. The shape is defined once,
 * in `defaultSiteContent`, assembled from the constants in lib/content.ts —
 * which remain the shipped defaults and the thing to read when you want to know
 * what the site says out of the box.
 *
 * The database stores only what has been changed. `getSiteContent()` merges the
 * stored document over the defaults, so:
 *
 *   - an empty table renders the site exactly as written in lib/content.ts
 *   - a new field added to the defaults appears immediately, without a migration
 *   - "reset to default" is a delete, not a re-seed
 *
 * Reads are cached under the `site-content` tag. Saving revalidates that tag,
 * so the public pages update on the next request without being dynamic.
 */

import { revalidateTag, unstable_cache } from "next/cache";
import {
  aboutClosing,
  aboutParagraphs,
  aboutQuote,
  credentials,
  enquiryTypes,
  faqs,
  gallery,
  methods,
  milestones,
  navLinks,
  principles,
  profile,
  services,
  skillGroups,
  stats,
  type Credential,
  type Faq,
  type Method,
  type Milestone,
  type NavLink,
  type Principle,
  type Service,
  type SkillGroup,
  type Stat,
  type Tile,
} from "./content";
import { prisma } from "./prisma";

const CACHE_TAG = "site-content";
const ROW_ID = "singleton";

/* ------------------------------------------------------------------ Shape */

export type SiteProfile = {
  firstName: string;
  lastName: string;
  role: string;
  city: string;
  country: string;
  email: string;
  phone: string;
  phoneHref: string;
  whatsapp: string;
  whatsappHref: string;
  linkedin: string;
  linkedinLabel: string;
  availability: string;
  houseRecipe: { value: string; unit: string }[];
};

export type SiteContent = {
  profile: SiteProfile;
  navLinks: NavLink[];
  about: {
    paragraphs: string[];
    closing: string;
    quote: { text: string; source: string };
  };
  stats: Stat[];
  principles: Principle[];
  milestones: Milestone[];
  methods: Method[];
  skillGroups: SkillGroup[];
  credentials: Credential[];
  gallery: Tile[];
  services: Service[];
  faqs: Faq[];
  enquiryTypes: string[];
};

/* --------------------------------------------------------------- Defaults */

export const defaultSiteContent: SiteContent = {
  profile: {
    ...profile,
    houseRecipe: profile.houseRecipe.map((item) => ({ ...item })),
  },
  navLinks: navLinks.map((link) => ({ ...link })),
  about: {
    paragraphs: [...aboutParagraphs],
    closing: aboutClosing,
    quote: { ...aboutQuote },
  },
  stats: stats.map((item) => ({ ...item })),
  principles: principles.map((item) => ({ ...item })),
  milestones: milestones.map((item) => ({ ...item })),
  methods: methods.map((item) => ({ ...item, spec: item.spec.map((s) => ({ ...s })), notes: [...item.notes] })),
  skillGroups: skillGroups.map((item) => ({ ...item, items: [...item.items] })),
  credentials: credentials.map((item) => ({ ...item })),
  gallery: gallery.map((item) => ({ ...item })),
  services: services.map((item) => ({ ...item })),
  faqs: faqs.map((item) => ({ ...item })),
  enquiryTypes: [...enquiryTypes],
};

/* ------------------------------------------------------------------ Merge */

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Overlays a stored document on the defaults.
 *
 * Arrays are replaced wholesale rather than merged element-by-element: the
 * editor sends the complete list every time, and merging by index would make
 * deleting the last item of a list impossible.
 */
function merge<T>(base: T, override: unknown): T {
  if (override === undefined || override === null) return base;

  if (Array.isArray(base)) {
    return (Array.isArray(override) ? override : base) as T;
  }

  if (isPlainObject(base) && isPlainObject(override)) {
    const result: Record<string, unknown> = { ...base };
    for (const key of Object.keys(base)) {
      if (key in override) result[key] = merge((base as Record<string, unknown>)[key], override[key]);
    }
    return result as T;
  }

  // Primitives: take the override only if it is the same kind of thing.
  return (typeof override === typeof base ? override : base) as T;
}

/* ------------------------------------------------------------------ Reads */

const readStored = unstable_cache(
  async (): Promise<unknown> => {
    const row = await prisma.siteContent.findUnique({ where: { id: ROW_ID } });
    return row?.data ?? {};
  },
  ["site-content-row"],
  { tags: [CACHE_TAG] },
);

/**
 * The content the public site renders.
 *
 * If the database is unreachable the site falls back to the shipped defaults
 * rather than failing: a portfolio that renders slightly stale copy is far
 * better than one that returns a 500 because Neon was asleep.
 */
export async function getSiteContent(): Promise<SiteContent> {
  try {
    const stored = await readStored();
    return merge(defaultSiteContent, stored);
  } catch (error) {
    console.error("[site-content] falling back to defaults:", error);
    return defaultSiteContent;
  }
}

/** Raw stored overrides, for the editor to show what has actually been changed. */
export async function getStoredOverrides(): Promise<Record<string, unknown>> {
  const row = await prisma.siteContent.findUnique({ where: { id: ROW_ID } });
  return isPlainObject(row?.data) ? (row.data as Record<string, unknown>) : {};
}

/* ----------------------------------------------------------------- Writes */

/** Replaces one top-level section and revalidates the public pages. */
export async function saveSection(section: keyof SiteContent, value: unknown): Promise<void> {
  const current = await getStoredOverrides();
  const next = { ...current, [section]: value };

  await prisma.siteContent.upsert({
    where: { id: ROW_ID },
    create: { id: ROW_ID, data: next as never },
    update: { data: next as never },
  });

  revalidateTag(CACHE_TAG);
}

/** Drops one section's overrides, returning it to the shipped defaults. */
export async function resetSection(section: keyof SiteContent): Promise<void> {
  const current = await getStoredOverrides();
  delete current[section];

  await prisma.siteContent.upsert({
    where: { id: ROW_ID },
    create: { id: ROW_ID, data: current as never },
    update: { data: current as never },
  });

  revalidateTag(CACHE_TAG);
}
