/**
 * BROWSER-SIDE IMAGE PREPARATION — client only.
 *
 * Accepts the big file a phone or camera produces and hands back something
 * sized for a website. This exists for three reasons, in order of how much
 * they matter:
 *
 *   1. Vercel refuses a request body over 4.5 MB at the platform edge, before
 *      any of our code runs. Without shrinking first, a 10 MB photo could not
 *      be uploaded at all on the deployed site.
 *   2. The photos live in Postgres. Storing 10 MB originals would fill Neon's
 *      free tier after about fifty images.
 *   3. A 10 MB hero image is bad for visitors regardless of where it is
 *      stored. Nothing on this site is displayed wider than about 2560px.
 *
 * A file that is already small and correctly sized is passed through
 * untouched, so an image someone has already optimised is never re-encoded
 * and never loses quality twice.
 */

/** What the file picker will accept from disk. */
export const MAX_SOURCE_BYTES = 10 * 1024 * 1024;

/** Longest edge after downscaling — enough for a full-bleed retina hero. */
export const MAX_DIMENSION = 2560;

/** Aim to land under this. Quality steps down until it does. */
export const TARGET_BYTES = 1.5 * 1024 * 1024;

const QUALITY_STEPS = [0.86, 0.76, 0.66, 0.55];

export type Prepared = {
  file: File;
  /** Set when the image was re-encoded, for telling the user what happened. */
  changed?: { fromBytes: number; toBytes: number; width: number; height: number };
};

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

/**
 * Downscales and re-encodes when needed; otherwise returns the original.
 *
 * Never throws: if the browser cannot decode the file, the original is
 * returned and the server's own size and type checks decide its fate. A failed
 * optimisation should not block an upload that might have been fine.
 */
export async function prepareImage(file: File): Promise<Prepared> {
  if (typeof createImageBitmap !== "function") return { file };

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return { file };
  }

  const { width, height } = bitmap;
  const longest = Math.max(width, height);

  // Already web-sized and web-weight: leave it completely alone.
  if (longest <= MAX_DIMENSION && file.size <= TARGET_BYTES) {
    bitmap.close();
    return { file };
  }

  const scale = Math.min(1, MAX_DIMENSION / longest);
  const targetWidth = Math.round(width * scale);
  const targetHeight = Math.round(height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    return { file };
  }

  context.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
  bitmap.close();

  /* WebP rather than JPEG: smaller at the same quality, and it keeps an alpha
     channel, so a PNG logo with transparency survives the round trip. */
  let blob: Blob | null = null;
  for (const quality of QUALITY_STEPS) {
    blob = await canvasToBlob(canvas, "image/webp", quality);
    if (blob && blob.size <= TARGET_BYTES) break;
  }

  // No WebP encoder — fall back to JPEG, which every canvas can write.
  if (!blob) blob = await canvasToBlob(canvas, "image/jpeg", 0.82);
  if (!blob) return { file };

  // Re-encoding made it bigger — keep whichever is actually smaller.
  if (blob.size >= file.size && longest <= MAX_DIMENSION) return { file };

  const extension = blob.type === "image/webp" ? "webp" : "jpg";
  const name = file.name.replace(/\.[^.]+$/, "") || "image";

  return {
    file: new File([blob], `${name}.${extension}`, { type: blob.type }),
    changed: {
      fromBytes: file.size,
      toBytes: blob.size,
      width: targetWidth,
      height: targetHeight,
    },
  };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
