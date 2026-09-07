"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";
import { sectionById } from "@/lib/content-schema";
import { resetSection, saveSection, type SiteContent } from "@/lib/site-content";

/**
 * Middleware already gates every path under /admin, and a server action posts
 * to the page it came from — so it is covered. This checks anyway: an action is
 * a public endpoint with a guessable name, and content edits are not something
 * to leave resting on a matcher.
 */
async function assertAuthorised() {
  const store = await cookies();
  if (!(await verifySession(store.get(SESSION_COOKIE)?.value))) {
    throw new Error("Not authenticated.");
  }
}

/** Refreshes the public pages and the editor's own view of the data. */
function revalidatePublic() {
  revalidatePath("/", "layout");
}

export async function saveSectionAction(section: string, json: string) {
  await assertAuthorised();

  if (!sectionById.has(section)) {
    return { ok: false as const, error: "Unknown section." };
  }

  let value: unknown;
  try {
    value = JSON.parse(json);
  } catch {
    return { ok: false as const, error: "Could not read the submitted content." };
  }

  try {
    await saveSection(section as keyof SiteContent, value);
    revalidatePublic();
    return { ok: true as const };
  } catch (error) {
    console.error("[content] save failed:", error);
    return { ok: false as const, error: "Could not save. Check the server logs." };
  }
}

export async function resetSectionAction(section: string) {
  await assertAuthorised();

  if (!sectionById.has(section)) {
    return { ok: false as const, error: "Unknown section." };
  }

  try {
    await resetSection(section as keyof SiteContent);
    revalidatePublic();
    return { ok: true as const };
  } catch (error) {
    console.error("[content] reset failed:", error);
    return { ok: false as const, error: "Could not reset. Check the server logs." };
  }
}
