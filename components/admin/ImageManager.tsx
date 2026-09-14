"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { MAX_SOURCE_BYTES, formatBytes, prepareImage } from "@/lib/image-resize";
import s from "@/app/admin/admin.module.css";

export type SlotView = {
  slot: string;
  label: string;
  group: string;
  /** What the site currently renders for this slot. */
  src: string;
  alt: string;
  /** True when an upload is overriding the file shipped in public/images. */
  uploaded: boolean;
  size: number;
};

const MAX_SOURCE_MB = MAX_SOURCE_BYTES / 1024 / 1024;

function SlotCard({ view }: { view: SlotView }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [alt, setAlt] = useState(view.alt);
  const [preview, setPreview] = useState<string | null>(null);
  const [chosen, setChosen] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const dirty = chosen !== null || alt !== view.alt;

  async function choose(file: File | null) {
    setError("");
    setNote("");

    if (!file) {
      setChosen(null);
      setPreview(null);
      return;
    }

    /* Refused here rather than after a long upload that the server would
       reject anyway. */
    if (file.size > MAX_SOURCE_BYTES) {
      setError(`That image is ${formatBytes(file.size)}. The limit is ${MAX_SOURCE_MB} MB.`);
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    /* Shrink before uploading: a camera file is far larger than anything this
       site displays, and Vercel rejects a request body over 4.5 MB before it
       reaches the server. An already-optimised image comes back untouched. */
    setPreparing(true);
    const { file: ready, changed } = await prepareImage(file);
    setPreparing(false);

    setChosen(ready);
    setPreview(URL.createObjectURL(ready));

    if (changed) {
      setNote(
        `Resized to ${changed.width}×${changed.height} — ${formatBytes(changed.fromBytes)} down to ${formatBytes(changed.toBytes)}.`,
      );
    }
  }

  async function save() {
    setBusy(true);
    setError("");

    const body = new FormData();
    body.set("slot", view.slot);
    body.set("alt", alt);
    if (chosen) body.set("file", chosen);

    const response = await fetch("/api/admin/images", { method: "POST", body });
    const payload = await response.json().catch(() => ({}));
    setBusy(false);

    if (!response.ok) {
      setError(payload.error ?? "Could not save.");
      return;
    }

    setChosen(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
    setNote(`Saved — ${formatBytes(chosen?.size ?? 0)} stored.`);
    router.refresh();
  }

  async function remove() {
    if (!window.confirm("Remove this upload and go back to the original photo?")) return;
    setBusy(true);
    const response = await fetch(`/api/admin/images?slot=${encodeURIComponent(view.slot)}`, {
      method: "DELETE",
    });
    setBusy(false);

    if (!response.ok) {
      setError("Could not remove.");
      return;
    }
    setNote("Removed.");
    router.refresh();
  }

  return (
    <li className={s.slot}>
      <div className={s.slotThumb}>
        {/* Deliberately a plain <img>: previews are blob: URLs and the stored
            images are already served at their final size. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={preview ?? view.src} alt="" />
        {view.uploaded ? <span className={s.slotBadge}>Uploaded</span> : null}
      </div>

      <div className={s.slotBody}>
        <p className={s.slotLabel}>{view.label}</p>
        <p className={s.slotKey}>
          {view.slot}
          {view.uploaded && view.size ? ` · ${formatBytes(view.size)}` : ""}
        </p>

        <label className={s.slotAlt}>
          <span>Description (alt text)</span>
          <input
            value={alt}
            onChange={(e) => {
              setAlt(e.target.value);
              setNote("");
            }}
            placeholder="What is in the photo"
          />
        </label>

        <input
          ref={fileRef}
          className={s.slotFile}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          onChange={(e) => void choose(e.target.files?.[0] ?? null)}
          aria-label={`Choose a new image for ${view.label}`}
        />

        {error ? <p className={s.slotError}>{error}</p> : null}
        {!error && note ? <p className={s.slotNote}>{note}</p> : null}

        <div className={s.slotActions}>
          <button
            type="button"
            className={s.save}
            onClick={save}
            disabled={busy || preparing || !dirty}
          >
            {preparing ? "Resizing…" : busy ? "Saving…" : dirty ? "Save" : "Saved"}
          </button>
          {view.uploaded ? (
            <button type="button" className={s.delete} onClick={remove} disabled={busy}>
              Use original
            </button>
          ) : null}
        </div>
      </div>
    </li>
  );
}

export function ImageManager({ slots }: { slots: SlotView[] }) {
  const groups = [...new Set(slots.map((slot) => slot.group))];

  return (
    <>
      {groups.map((group) => (
        <section key={group} className={s.slotGroup}>
          <h2 className={s.slotGroupTitle}>{group}</h2>
          <ul className={s.slotGrid}>
            {slots
              .filter((slot) => slot.group === group)
              .map((slot) => (
                <SlotCard key={slot.slot} view={slot} />
              ))}
          </ul>
        </section>
      ))}
    </>
  );
}
