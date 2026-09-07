import { imageUrl, listImageMeta, MAX_UPLOAD_BYTES } from "@/lib/images";
import { photos as defaultPhotos } from "@/lib/photos";
import { ImageManager, type SlotView } from "@/components/admin/ImageManager";
import s from "../../admin.module.css";

export const dynamic = "force-dynamic";

/**
 * Slot keys carry their own meaning — "hero", a method's three-letter code, a
 * milestone's date range, a gallery tile's title — so the grouping is derived
 * from the key rather than kept in a second list that could drift.
 */
function classify(slot: string): { group: string; label: string } {
  if (slot === "hero") return { group: "Headline", label: "Hero — the opening image" };
  if (slot === "about") return { group: "Headline", label: "About — beside the story" };
  if (slot === "contact") return { group: "Headline", label: "Contact — beside the form" };

  // Journey slots are keyed by their date range, e.g. "Dec 2015 – Jan 2018".
  if (/\d{4}/.test(slot) && slot.includes("–")) return { group: "Journey", label: slot };

  // Method codes are three upper-case letters: ESP, V60, CHX…
  if (/^[A-Z0-9]{3}$/.test(slot)) return { group: "Craft — methods", label: slot };

  return { group: "Gallery", label: slot };
}

export default async function ImagesPage() {
  const uploaded = await listImageMeta();
  const bySlot = new Map(uploaded.map((image) => [image.slot, image]));

  const slots: SlotView[] = Object.entries(defaultPhotos).map(([slot, fallback]) => {
    const upload = bySlot.get(slot);
    const { group, label } = classify(slot);

    return {
      slot,
      group,
      label,
      src: upload ? imageUrl(slot, upload.hash) : fallback.src,
      alt: upload?.alt || fallback.alt,
      uploaded: Boolean(upload),
      size: upload?.size ?? 0,
    };
  });

  const usedBytes = uploaded.reduce((total, image) => total + image.size, 0);
  const usedMb = (usedBytes / 1024 / 1024).toFixed(1);

  return (
    <>
      <div className={s.pageHead}>
        <div>
          <p className={s.kicker}>Images</p>
          <h1 className="h2">Photographs</h1>
        </div>
      </div>

      <p className={`bodySm muted ${s.contentIntro}`}>
        Every photo slot on the site. Upload one to replace what is there; remove the upload and the
        original comes back. Maximum {MAX_UPLOAD_BYTES / 1024 / 1024} MB each — resize large camera
        files before uploading.
        {uploaded.length > 0
          ? ` ${uploaded.length} replaced, using ${usedMb} MB of database storage.`
          : " Nothing replaced yet — all slots show the shipped photos."}
      </p>

      <ImageManager slots={slots} />
    </>
  );
}
