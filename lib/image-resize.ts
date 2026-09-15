/**
 * BROWSER-SIDE IMAGE PREPARATION — client only.
 *
 * Accepts the big file a phone or camera produces and hands back something
 * sized for a website. This exists for three reasons, in order of how much
 * they matter:
 *
 *   1. Vercel refuses a request body over 4.5 MB at the platform edge, before
 *      any of our code runs, and answers with its own error page rather than
 *      our JSON — so the back office cannot even say what went wrong. Nothing
 *      above MAX_SEND_BYTES is ever put on the wire; if this module cannot get
 *      a file under that, it says so instead of letting the edge swallow it.
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

/**
 * Hard ceiling on what is uploaded, whatever the source was.
 *
 * Vercel's limit is 4.5 MB. This sits below it so that multipart overhead and
 * a slightly-over encode still arrive, and so the request fails here — with an
 * explanation — rather than at a platform edge that cannot give one.
 */
export const MAX_SEND_BYTES = 3.5 * 1024 * 1024;

/** Longest edge after downscaling — enough for a full-bleed retina hero. */
export const MAX_DIMENSION = 2560;

/** Aim to land under this. Quality, then size, steps down until it does. */
export const TARGET_BYTES = 1.5 * 1024 * 1024;

const QUALITY_STEPS = [0.86, 0.76, 0.66, 0.55];

/** Tried in order when quality alone will not get a dense image under target. */
const DIMENSION_STEPS = [1, 0.75, 0.5];

type Changed = { fromBytes: number; toBytes: number; width: number; height: number };

export type Prepared =
  | { ok: true; file: File; changed?: Changed }
  | { ok: false; error: string };

export function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

/**
 * Whether this browser can actually *encode* WebP.
 *
 * It matters because toBlob does not report failure: handed a type it cannot
 * write, the spec has it quietly return PNG instead. A PNG of a 2560px
 * photograph runs to several megabytes, so a browser without WebP encoding
 * would produce a file larger than the original it was asked to shrink. Ask a
 * 1x1 canvas once and pick a format we know will be honoured.
 */
let webpEncodes: boolean | null = null;
async function supportsWebp(): Promise<boolean> {
  if (webpEncodes !== null) return webpEncodes;
  const probe = document.createElement("canvas");
  probe.width = 1;
  probe.height = 1;
  const blob = await canvasToBlob(probe, "image/webp", 0.8);
  webpEncodes = blob?.type === "image/webp";
  return webpEncodes;
}

function render(
  bitmap: ImageBitmap,
  width: number,
  height: number,
  opaque: boolean,
): HTMLCanvasElement | null {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) return null;

  /* JPEG has no alpha channel: a transparent PNG would come out with black
     where it should be clear, so lay down white first. */
  if (opaque) {
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
  }

  context.drawImage(bitmap, 0, 0, width, height);
  return canvas;
}

type Encoded = { blob: Blob; width: number; height: number };

/** Smallest encode found, stopping as soon as one is under target. */
async function encodeSmallest(
  bitmap: ImageBitmap,
  fit: number,
  type: string,
): Promise<Encoded | null> {
  let best: Encoded | null = null;

  for (const step of DIMENSION_STEPS) {
    const width = Math.max(1, Math.round(bitmap.width * fit * step));
    const height = Math.max(1, Math.round(bitmap.height * fit * step));

    const canvas = render(bitmap, width, height, type === "image/jpeg");
    if (!canvas) return best;

    for (const quality of QUALITY_STEPS) {
      const blob = await canvasToBlob(canvas, type, quality);
      if (!blob) continue;
      if (!best || blob.size < best.blob.size) best = { blob, width, height };
      if (blob.size <= TARGET_BYTES) return best;
    }
  }

  return best;
}

/** Used when the browser could not decode or re-encode the file at all. */
function passthrough(file: File): Prepared {
  if (file.size <= MAX_SEND_BYTES) return { ok: true, file };
  return {
    ok: false,
    error: `This is ${formatBytes(file.size)} and your browser could not resize it. Save it as a JPEG under ${MAX_SEND_BYTES / 1024 / 1024} MB and try again.`,
  };
}

/**
 * Downscales and re-encodes when needed; otherwise returns the original.
 *
 * Never throws. If the browser cannot handle the file, the original is offered
 * instead — but only when it is small enough to actually reach the server.
 */
export async function prepareImage(file: File): Promise<Prepared> {
  if (typeof createImageBitmap !== "function") return passthrough(file);

  let bitmap: ImageBitmap;
  try {
    /* from-image applies the EXIF rotation a phone camera writes rather than
       physically rotating the pixels. Without it a portrait photo decodes on
       its side, and since re-encoding drops the EXIF tag that would have
       corrected it, the upload would be permanently sideways. */
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    return passthrough(file);
  }

  const longest = Math.max(bitmap.width, bitmap.height);

  // Already web-sized and web-weight: leave it completely alone.
  if (longest <= MAX_DIMENSION && file.size <= TARGET_BYTES) {
    bitmap.close();
    return { ok: true, file };
  }

  const type = (await supportsWebp()) ? "image/webp" : "image/jpeg";
  const best = await encodeSmallest(bitmap, Math.min(1, MAX_DIMENSION / longest), type);
  bitmap.close();

  if (!best) return passthrough(file);

  /* Re-encoding an already-efficient file can make it bigger. Prefer the
     original when it is smaller, provided it can actually be sent. */
  if (best.blob.size >= file.size && file.size <= MAX_SEND_BYTES) {
    return { ok: true, file };
  }

  if (best.blob.size > MAX_SEND_BYTES) {
    return {
      ok: false,
      error: `This image could not be reduced below ${MAX_SEND_BYTES / 1024 / 1024} MB (smallest was ${formatBytes(best.blob.size)}). Crop it or save it at a lower resolution first.`,
    };
  }

  const extension = best.blob.type === "image/webp" ? "webp" : "jpg";
  const name = file.name.replace(/\.[^.]+$/, "") || "image";

  return {
    ok: true,
    file: new File([best.blob], `${name}.${extension}`, { type: best.blob.type }),
    changed: {
      fromBytes: file.size,
      toBytes: best.blob.size,
      width: best.width,
      height: best.height,
    },
  };
}
