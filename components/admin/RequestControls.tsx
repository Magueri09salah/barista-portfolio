"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { statusLabels, statuses, type RequestStatus } from "@/lib/requests";
import s from "@/app/admin/admin.module.css";

export function RequestControls({
  id,
  status,
  adminNotes,
}: {
  id: string;
  status: RequestStatus;
  adminNotes: string;
}) {
  const router = useRouter();

  const [currentStatus, setCurrentStatus] = useState(status);
  const [notes, setNotes] = useState(adminNotes);
  const [savedNotes, setSavedNotes] = useState(adminNotes);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const dirty = notes !== savedNotes;

  async function patch(body: Record<string, unknown>) {
    setError("");
    const response = await fetch(`/api/admin/requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.error ?? "Could not save.");
    }
  }

  async function changeStatus(next: RequestStatus) {
    const previous = currentStatus;
    setCurrentStatus(next); // optimistic — the row colour should move instantly
    try {
      await patch({ status: next });
      router.refresh();
    } catch (problem) {
      setCurrentStatus(previous);
      setError(problem instanceof Error ? problem.message : "Could not save.");
    }
  }

  async function saveNotes() {
    setSaving(true);
    try {
      await patch({ adminNotes: notes });
      setSavedNotes(notes);
      router.refresh();
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!window.confirm("Delete this request permanently? This cannot be undone.")) return;
    try {
      const response = await fetch(`/api/admin/requests/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Could not delete.");
      router.replace("/admin");
      router.refresh();
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : "Could not delete.");
    }
  }

  return (
    <div className={s.controls}>
      <div className={s.controlBlock}>
        <p className={s.controlLabel}>Status</p>
        <div className={s.statusRow}>
          {statuses.map((option) => (
            <button
              key={option}
              type="button"
              className={s.statusPick}
              data-status={option}
              data-on={currentStatus === option}
              aria-pressed={currentStatus === option}
              onClick={() => changeStatus(option)}
            >
              {statusLabels[option]}
            </button>
          ))}
        </div>
      </div>

      <div className={s.controlBlock}>
        <label className={s.controlLabel} htmlFor="admin-notes">
          Your notes
        </label>
        <textarea
          id="admin-notes"
          className={s.notes}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="What you quoted, what was agreed, when to follow up. Only you see this."
        />
        <div className={s.notesActions}>
          <button type="button" className={s.save} onClick={saveNotes} disabled={!dirty || saving}>
            {saving ? "Saving…" : dirty ? "Save notes" : "Saved"}
          </button>
          <button type="button" className={s.delete} onClick={remove}>
            Delete request
          </button>
        </div>
      </div>

      {error ? (
        <p className={`bodySm ${s.controlError}`} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
