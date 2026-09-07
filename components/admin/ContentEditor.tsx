"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { blankItem, type Field, type SectionSchema } from "@/lib/content-schema";
import { resetSectionAction, saveSectionAction } from "@/app/admin/(dash)/content/actions";
import s from "@/app/admin/admin.module.css";

/* ------------------------------------------------------------ Dot paths
   The About section stores its quote nested, so fields address values as
   "quote.text". Everything else uses a plain key, which is just a path of
   length one.
   ---------------------------------------------------------------------- */

function readPath(source: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((value, key) => {
    if (value && typeof value === "object") return (value as Record<string, unknown>)[key];
    return undefined;
  }, source);
}

function writePath<T>(source: T, path: string, next: unknown): T {
  const [head, ...rest] = path.split(".");
  const base = (source ?? {}) as Record<string, unknown>;

  if (rest.length === 0) return { ...base, [head]: next } as T;
  return { ...base, [head]: writePath(base[head] ?? {}, rest.join("."), next) } as T;
}

/* --------------------------------------------------------------- Inputs */

function FieldInput({
  field,
  value,
  onChange,
  idPrefix,
}: {
  field: Field;
  value: unknown;
  onChange: (next: unknown) => void;
  idPrefix: string;
}) {
  const id = `${idPrefix}-${field.key.replace(/\./g, "-")}`;

  if (field.type === "stringList") {
    const list = Array.isArray(value) ? (value as string[]) : [];
    return (
      <div className={s.subList}>
        {list.map((entry, i) => (
          <div key={i} className={s.subRow}>
            <input
              value={entry}
              onChange={(e) => {
                const next = [...list];
                next[i] = e.target.value;
                onChange(next);
              }}
            />
            <button
              type="button"
              className={s.rowDrop}
              onClick={() => onChange(list.filter((_, index) => index !== i))}
              aria-label={`Remove item ${i + 1}`}
            >
              ×
            </button>
          </div>
        ))}
        <button type="button" className={s.subAdd} onClick={() => onChange([...list, ""])}>
          + Add
        </button>
      </div>
    );
  }

  if (field.type === "objectList") {
    const list = Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
    const sub = field.fields ?? [];
    return (
      <div className={s.subList}>
        {list.map((entry, i) => (
          <div key={i} className={s.subRow}>
            {sub.map((subField) => (
              <input
                key={subField.key}
                placeholder={subField.label}
                aria-label={`${subField.label} ${i + 1}`}
                value={String(entry?.[subField.key] ?? "")}
                onChange={(e) => {
                  const next = [...list];
                  next[i] = { ...entry, [subField.key]: e.target.value };
                  onChange(next);
                }}
              />
            ))}
            <button
              type="button"
              className={s.rowDrop}
              onClick={() => onChange(list.filter((_, index) => index !== i))}
              aria-label={`Remove entry ${i + 1}`}
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          className={s.subAdd}
          onClick={() =>
            onChange([...list, Object.fromEntries(sub.map((f) => [f.key, ""]))])
          }
        >
          + Add
        </button>
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <textarea
        id={id}
        className={s.editorArea}
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  if (field.type === "select") {
    return (
      <select id={id} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)}>
        {(field.options ?? []).map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "checkbox") {
    return (
      <label className={s.checkRow}>
        <input
          id={id}
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span>{field.label}</span>
      </label>
    );
  }

  if (field.type === "number") {
    return (
      <input
        id={id}
        type="number"
        value={Number(value ?? 0)}
        onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
      />
    );
  }

  return (
    <input id={id} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />
  );
}

function FieldRow({
  field,
  value,
  onChange,
  idPrefix,
}: {
  field: Field;
  value: unknown;
  onChange: (next: unknown) => void;
  idPrefix: string;
}) {
  const id = `${idPrefix}-${field.key.replace(/\./g, "-")}`;
  return (
    <div className={`${s.editorField} ${field.wide ? s.editorWide : ""}`}>
      {field.type === "checkbox" ? null : <label htmlFor={id}>{field.label}</label>}
      <FieldInput field={field} value={value} onChange={onChange} idPrefix={idPrefix} />
      {field.help ? <p className={s.editorHelp}>{field.help}</p> : null}
    </div>
  );
}

/* --------------------------------------------------------------- Editor */

export function ContentEditor({
  section,
  initial,
  isOverridden,
}: {
  section: SectionSchema;
  initial: unknown;
  isOverridden: boolean;
}) {
  const router = useRouter();

  const [value, setValue] = useState<unknown>(initial);
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [dirty, setDirty] = useState(false);

  function change(next: unknown) {
    setValue(next);
    setDirty(true);
    setNote("");
  }

  async function save() {
    setSaving(true);
    setError("");
    const result = await saveSectionAction(section.id as string, JSON.stringify(value));
    setSaving(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }
    setDirty(false);
    setNote("Saved. The site is updated.");
    router.refresh();
  }

  async function reset() {
    if (!window.confirm("Discard your changes to this section and restore the original text?")) {
      return;
    }
    setSaving(true);
    const result = await resetSectionAction(section.id as string);
    setSaving(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }
    setNote("Restored to the original.");
    router.refresh();
  }

  /* ------------------------------------------------------- Simple lists */
  if (section.kind === "stringList") {
    const list = Array.isArray(value) ? (value as string[]) : [];
    return (
      <Frame
        section={section}
        isOverridden={isOverridden}
        dirty={dirty}
        saving={saving}
        note={note}
        error={error}
        onSave={save}
        onReset={reset}
      >
        <div className={s.subList}>
          {list.map((entry, i) => (
            <div key={i} className={s.subRow}>
              <input
                value={entry}
                aria-label={`${section.itemLabel} ${i + 1}`}
                onChange={(e) => {
                  const next = [...list];
                  next[i] = e.target.value;
                  change(next);
                }}
              />
              <button
                type="button"
                className={s.rowDrop}
                onClick={() => change(list.filter((_, index) => index !== i))}
                aria-label={`Remove ${section.itemLabel} ${i + 1}`}
              >
                ×
              </button>
            </div>
          ))}
          <button type="button" className={s.subAdd} onClick={() => change([...list, ""])}>
            + Add {section.itemLabel.toLowerCase()}
          </button>
        </div>
      </Frame>
    );
  }

  /* ----------------------------------------------------- Single object */
  if (section.kind === "object") {
    const object = (value ?? {}) as Record<string, unknown>;
    return (
      <Frame
        section={section}
        isOverridden={isOverridden}
        dirty={dirty}
        saving={saving}
        note={note}
        error={error}
        onSave={save}
        onReset={reset}
      >
        <div className={s.editorGrid}>
          {section.fields.map((field) => (
            <FieldRow
              key={field.key}
              field={field}
              idPrefix={section.id as string}
              value={readPath(object, field.key)}
              onChange={(next) => change(writePath(object, field.key, next))}
            />
          ))}
        </div>
      </Frame>
    );
  }

  /* -------------------------------------------------- List of objects */
  const list = Array.isArray(value) ? (value as Record<string, unknown>[]) : [];

  function move(from: number, to: number) {
    if (to < 0 || to >= list.length) return;
    const next = [...list];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    change(next);
  }

  return (
    <Frame
      section={section}
      isOverridden={isOverridden}
      dirty={dirty}
      saving={saving}
      note={note}
      error={error}
      onSave={save}
      onReset={reset}
    >
      <ol className={s.itemList}>
        {list.map((item, i) => (
          <li key={i} className={s.item}>
            <div className={s.itemHead}>
              <span className={s.itemIndex}>{String(i + 1).padStart(2, "0")}</span>
              <span className={s.itemTitle}>
                {String(item?.[section.titleKey] ?? "") || `Untitled ${section.itemLabel}`}
              </span>
              <span className={s.itemTools}>
                <button type="button" onClick={() => move(i, i - 1)} aria-label="Move up" disabled={i === 0}>
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(i, i + 1)}
                  aria-label="Move down"
                  disabled={i === list.length - 1}
                >
                  ↓
                </button>
                <button
                  type="button"
                  className={s.rowDrop}
                  onClick={() => {
                    if (window.confirm(`Delete this ${section.itemLabel.toLowerCase()}?`)) {
                      change(list.filter((_, index) => index !== i));
                    }
                  }}
                  aria-label="Delete"
                >
                  ×
                </button>
              </span>
            </div>

            <div className={s.editorGrid}>
              {section.fields.map((field) => (
                <FieldRow
                  key={field.key}
                  field={field}
                  idPrefix={`${section.id as string}-${i}`}
                  value={readPath(item, field.key)}
                  onChange={(next) => {
                    const updated = [...list];
                    updated[i] = writePath(item, field.key, next) as Record<string, unknown>;
                    change(updated);
                  }}
                />
              ))}
            </div>
          </li>
        ))}
      </ol>

      <button
        type="button"
        className={s.subAdd}
        onClick={() => change([...list, blankItem(section)])}
      >
        + Add {section.itemLabel.toLowerCase()}
      </button>
    </Frame>
  );
}

/* Shared chrome: header, save bar, status. */
function Frame({
  section,
  isOverridden,
  dirty,
  saving,
  note,
  error,
  onSave,
  onReset,
  children,
}: {
  section: SectionSchema;
  isOverridden: boolean;
  dirty: boolean;
  saving: boolean;
  note: string;
  error: string;
  onSave: () => void;
  onReset: () => void;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className={s.editorHead}>
        <div>
          <p className={s.kicker}>{section.where}</p>
          <h1 className="h2">{section.title}</h1>
          <p className={`bodySm muted ${s.editorBlurb}`}>{section.blurb}</p>
        </div>
        {isOverridden ? <span className={s.status} data-status="contacted">Edited</span> : null}
      </div>

      {children}

      <div className={s.saveBar}>
        <div className={s.saveState} role="status">
          {error ? (
            <span className={s.controlError}>{error}</span>
          ) : dirty ? (
            "Unsaved changes"
          ) : (
            note
          )}
        </div>
        <div className={s.saveActions}>
          {isOverridden ? (
            <button type="button" className={s.delete} onClick={onReset} disabled={saving}>
              Restore original
            </button>
          ) : null}
          <button type="button" className={s.save} onClick={onSave} disabled={saving || !dirty}>
            {saving ? "Saving…" : dirty ? "Save changes" : "Saved"}
          </button>
        </div>
      </div>
    </>
  );
}
