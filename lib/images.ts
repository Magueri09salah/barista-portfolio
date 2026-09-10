/**
 * UPLOADED IMAGES — server only.
 *
 * Photographs live in Postgres as bytes. That is an unusual choice and a
 * deliberate one: it adds no third-party service, which was the requirement.
 * Two things stop it being a bad one.
 *
 *   SIZE      uploads are capped at MAX_UPLOAD_BYTES and the admin screen
 *             shows total usage, so the free tier cannot be filled by
 *             accident. Twenty-nine photos at the cap is still ~58 MB.
 *
 *   READS     the serving URL carries a content hash and the route sets an
 *             immutable cache header, so a CDN or browser never asks twice for
 *             the same bytes. In practice the database is read about once per
 *             edge node per image, not once per page view.
 *
 * The blob column is never selected unless the bytes are actually being
 * served — every listing uses METADATA, or a `findMany` reading it would drag
 * every photograph into memory.
 */

import { createHash } from "node:crypto";
import { unstable_cache, revalidateTag } from "next/cache";
import { photos as defaultPhotos, type PhotoMap } from "./photos";
import { prisma } from "./prisma";

export const IMAGES_TAG = "site-images";

/** 5 MB. Large enough for a good web photograph, small enough to stay sane. */
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"] as const;

/** Everything except the blob. */
const METADATA = { slot: true, alt: true, mimeType: true, size: true, hash: true, updatedAt: true };

export type ImageMeta = {
  slot: string;
  alt: string;
  mimeType: string;
  size: number;
  hash: string;
  updatedAt: Date;
};

/** The hash makes the URL change whenever the bytes do, so it can be cached forever. */
export function imageUrl(slot: string, hash: string): string {
  return `/api/images/${encodeURIComponent(slot)}?v=${hash}`;
}

/* ------------------------------------------------------------------ Reads */

const readAllMeta = unstable_cache(
  async (): Promise<ImageMeta[]> => prisma.image.findMany({ select: METADATA }),
  ["site-images-meta"],
  { tags: [IMAGES_TAG] },
);

/** Bytes for one slot. The only place the blob column is read. */
export async function getImageBytes(slot: string) {
  return prisma.image.findUnique({
    where: { slot },
    select: { bytes: true, mimeType: true, hash: true },
  });
}

export async function listImageMeta(): Promise<ImageMeta[]> {
  return prisma.image.findMany({ select: METADATA, orderBy: { slot: "asc" } });
}

/**
 * The photo map the public site renders: uploads laid over the files shipped
 * in public/images.
 *
 * An uploaded image keeps the shipped alt text unless the uploader wrote their
 * own, so replacing a photo never silently blanks its description.
 */
export async function getPhotoMap(): Promise<PhotoMap> {
  let uploaded: ImageMeta[] = [];
  try {
    uploaded = await readAllMeta();
  } catch (error) {
    // A missing photo is a placeholder; a thrown error is a broken page.
    console.error("[images] falling back to shipped photos:", error);
    return defaultPhotos;
  }

  const merged: PhotoMap = { ...defaultPhotos };
  for (const image of uploaded) {
    merged[image.slot] = {
      src: imageUrl(image.slot, image.hash),
      alt: image.alt || defaultPhotos[image.slot]?.alt || "",
    };
  }
  return merged;
}

/* ----------------------------------------------------------------- Writes */

export type UploadResult = { ok: true; hash: string } | { ok: false; error: string };

export async function putImage(
  slot: string,
  /* Uint8Array rather than Node's Buffer: that is what Prisma 7 types a Bytes
     column as, and converting at the boundary keeps the cast out of here. */
  file: { bytes: Uint8Array<ArrayBuffer>; mimeType: string },
  alt: string,
): Promise<UploadResult> {
  if (!(ALLOWED_TYPES as readonly string[]).includes(file.mimeType)) {
    return { ok: false, error: "Use a JPEG, PNG, WebP or AVIF image." };
  }
  if (file.bytes.byteLength === 0) {
    return { ok: false, error: "That file is empty." };
  }
  if (file.bytes.byteLength > MAX_UPLOAD_BYTES) {
    const mb = (file.bytes.byteLength / 1024 / 1024).toFixed(1);
    return {
      ok: false,
      error: `That image is ${mb} MB. The limit is ${MAX_UPLOAD_BYTES / 1024 / 1024} MB — resize it and try again.`,
    };
  }

  const hash = createHash("sha256").update(file.bytes).digest("hex").slice(0, 12);

  await prisma.image.upsert({
    where: { slot },
    create: {
      slot,
      alt,
      mimeType: file.mimeType,
      bytes: file.bytes,
      size: file.bytes.byteLength,
      hash,
    },
    update: { alt, mimeType: file.mimeType, bytes: file.bytes, size: file.bytes.byteLength, hash },
  });

  revalidateTag(IMAGES_TAG);
  return { ok: true, hash };
}

/** Alt text alone, without re-uploading the file. */
export async function updateAlt(slot: string, alt: string): Promise<boolean> {
  const { count } = await prisma.image.updateMany({ where: { slot }, data: { alt } });
  if (count > 0) revalidateTag(IMAGES_TAG);
  return count > 0;
}

/** Removes the upload, so the slot falls back to the file shipped in public/images. */
export async function deleteImage(slot: string): Promise<boolean> {
  const { count } = await prisma.image.deleteMany({ where: { slot } });
  if (count > 0) revalidateTag(IMAGES_TAG);
  return count > 0;
}
