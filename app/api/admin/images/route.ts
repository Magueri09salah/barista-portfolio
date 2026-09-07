import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";
import { MAX_UPLOAD_BYTES, deleteImage, putImage, updateAlt } from "@/lib/images";
import { photos as defaultPhotos } from "@/lib/photos";

export const runtime = "nodejs";

/** Guards against a body far larger than the cap before it is read into memory. */
const MAX_BODY_BYTES = MAX_UPLOAD_BYTES + 64 * 1024;

async function authorised(request: NextRequest): Promise<boolean> {
  return verifySession(request.cookies.get(SESSION_COOKIE)?.value);
}

/** Only slots the site actually renders — an arbitrary key would be dead weight. */
function isKnownSlot(slot: string): boolean {
  return Object.prototype.hasOwnProperty.call(defaultPhotos, slot);
}

export async function POST(request: NextRequest) {
  if (!(await authorised(request))) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) {
    return NextResponse.json(
      { error: `That image is too large. The limit is ${MAX_UPLOAD_BYTES / 1024 / 1024} MB.` },
      { status: 413 },
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Could not read the upload." }, { status: 400 });
  }

  const slot = String(form.get("slot") ?? "");
  const alt = String(form.get("alt") ?? "").slice(0, 300);
  const file = form.get("file");

  if (!isKnownSlot(slot)) {
    return NextResponse.json({ error: "Unknown image slot." }, { status: 400 });
  }

  /* Alt text can be edited on its own, without re-uploading the photograph. */
  if (!(file instanceof File) || file.size === 0) {
    const updated = await updateAlt(slot, alt);
    if (!updated) {
      return NextResponse.json(
        { error: "There is no uploaded image here yet — choose a file." },
        { status: 400 },
      );
    }
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true, altOnly: true });
  }

  const result = await putImage(
    slot,
    { bytes: new Uint8Array(await file.arrayBuffer()), mimeType: file.type },
    alt,
  );

  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });

  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, hash: result.hash });
}

/** Removes an upload so the slot falls back to the file shipped in public/images. */
export async function DELETE(request: NextRequest) {
  if (!(await authorised(request))) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const slot = request.nextUrl.searchParams.get("slot") ?? "";
  if (!(await deleteImage(slot))) {
    return NextResponse.json({ error: "Nothing uploaded for that slot." }, { status: 404 });
  }

  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
