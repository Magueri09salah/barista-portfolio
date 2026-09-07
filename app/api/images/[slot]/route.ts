import { NextResponse, type NextRequest } from "next/server";
import { getImageBytes } from "@/lib/images";

export const runtime = "nodejs";

/**
 * Serves an uploaded photograph.
 *
 * Public, and deliberately so — these are the images on the public site.
 *
 * The URL carries the content hash (`?v=`), so the bytes at a given URL can
 * never change: replacing an image produces a different URL. That is what makes
 * `immutable` honest here, and it is what keeps images in Postgres viable —
 * the CDN and the browser answer repeat views, and the database sees roughly
 * one read per edge node per image.
 */
export async function GET(request: NextRequest, context: { params: Promise<{ slot: string }> }) {
  const { slot } = await context.params;
  const image = await getImageBytes(slot);

  if (!image) {
    return NextResponse.json({ error: "No such image." }, { status: 404 });
  }

  const etag = `"${image.hash}"`;

  // Nothing changed since the client last asked.
  if (request.headers.get("if-none-match") === etag) {
    return new NextResponse(null, { status: 304, headers: { ETag: etag } });
  }

  const hashed = request.nextUrl.searchParams.get("v") === image.hash;

  return new NextResponse(new Uint8Array(image.bytes), {
    headers: {
      "Content-Type": image.mimeType,
      "Content-Length": String(image.bytes.byteLength),
      ETag: etag,
      /* Only promise immutability when the caller asked for this exact
         version. A bare /api/images/hero must stay revalidatable, or it would
         pin the old photo in caches forever. */
      "Cache-Control": hashed
        ? "public, max-age=31536000, immutable"
        : "public, max-age=0, must-revalidate",
    },
  });
}
