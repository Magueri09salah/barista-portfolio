"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
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

const MAX_MB = 2;

function formatSize(bytes: number): string {
  if (bytes <= 0) return "";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function SlotCard({ view }: { view: SlotView }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [alt, setAlt] = useState(view.alt);
  const [preview, setPreview] = useState<string | null>(null);
  const [chosen, setChosen] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const dirty = chosen !== null || alt !== view.alt;

  function choose(file: File | null) {
    setError("");
    setNote("");

    if (!file) {
      setChosen(null);
      setPreview(null);
      return;
    }

    /* Checked here as well as on the server, so an oversized file is refused
       before it is uploaded rather than after. */
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`That image is ${(file.size / 1024 / 1024).toFixed(1)} MB. The limit is ${MAX_MB} MB.`);
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    setChosen(file);
    setPreview(URL.createObjectURL(file));
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
    setNote("Saved.");
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
          {view.uploaded && view.size ? ` · ${formatSize(view.size)}` : ""}
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
          onChange={(e) => choose(e.target.files?.[0] ?? null)}
          aria-label={`Choose a new image for ${view.label}`}
        />

        {error ? <p className={s.slotError}>{error}</p> : null}
        {!error && note ? <p className={s.slotNote}>{note}</p> : null}

        <div className={s.slotActions}>
          <button type="button" className={s.save} onClick={save} disabled={busy || !dirty}>
            {busy ? "Saving…" : dirty ? "Save" : "Saved"}
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
