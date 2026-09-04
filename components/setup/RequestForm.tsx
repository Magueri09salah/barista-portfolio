"use client";

import { useMemo, useRef, useState } from "react";
import { budgets, categories, timelines, totalServiceCount } from "@/lib/catalogue";
import { profile } from "@/lib/content";
import { Button, Icon, Spec } from "@/components/ui/Primitives";
import s from "./request-form.module.css";

/* The five catalogue steps, then the two that qualify the project. */
const PROJECT_STEP = categories.length;
const DETAILS_STEP = categories.length + 1;
const TOTAL_STEPS = categories.length + 2;

const stepLabels = [...categories.map((category) => category.title), "The project", "Your details"];

type Fields = {
  name: string;
  email: string;
  phone: string;
  city: string;
  message: string;
};

const emptyFields: Fields = { name: "", email: "", phone: "", city: "", message: "" };

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function RequestForm() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [fields, setFields] = useState<Fields>(emptyFields);
  const [timeline, setTimeline] = useState("");
  const [budget, setBudget] = useState("");

  const [errors, setErrors] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [reference, setReference] = useState<string | null>(null);

  /* Focus lands on the step heading after a move, so the form is followable
     without a mouse and screen readers announce where they now are. */
  const headingRef = useRef<HTMLHeadingElement>(null);

  const selectedCount = selected.size;

  const perCategoryCount = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const category of categories) {
      counts[category.id] = category.items.filter((item) => selected.has(item.id)).length;
    }
    return counts;
  }, [selected]);

  function toggle(id: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function goTo(target: number) {
    setErrors([]);
    setStep(target);
    // After paint, so the heading exists.
    requestAnimationFrame(() => {
      headingRef.current?.focus();
      headingRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
    });
  }

  function update<K extends keyof Fields>(key: K, value: string) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  async function submit() {
    const problems: string[] = [];

    if (selectedCount === 0) problems.push("Choose at least one service before sending.");
    if (!fields.name.trim()) problems.push("Add your name.");
    if (!EMAIL.test(fields.email.trim())) problems.push("Add an email address I can reply to.");
    if (!fields.phone.trim()) problems.push("Add a phone number — WhatsApp is easiest.");

    if (problems.length > 0) {
      setErrors(problems);
      return;
    }

    setErrors([]);
    setSending(true);

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...fields,
          timeline,
          budget,
          services: [...selected],
          categoryNotes: notes,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setErrors(payload.errors ?? ["Something went wrong. Please try again."]);
        setSending(false);
        return;
      }

      setReference(payload.id ?? null);
    } catch {
      setErrors([
        `Could not reach the server. Check your connection, or email me at ${profile.email}.`,
      ]);
      setSending(false);
    }
  }

  /* ------------------------------------------------------------- Sent state */
  if (reference) {
    return (
      <div className={s.done}>
        <span className={s.doneMark} aria-hidden="true">
          <Icon name="award" size={28} />
        </span>
        <h2 className="h2">Request received.</h2>
        <p className={`lead ${s.doneLead}`}>
          {selectedCount} {selectedCount === 1 ? "service" : "services"} across{" "}
          {Object.values(perCategoryCount).filter(Boolean).length} of the five phases. I read these
          myself and reply within two working days — usually sooner.
        </p>
        <Spec
          className={s.doneSpec}
          items={[
            { text: `Ref ${reference}` },
            { text: fields.city || "City not given" },
            { text: timelines.find((option) => option.id === timeline)?.label ?? "No date set" },
          ]}
        />
        <p className={`bodySm muted ${s.doneNote}`}>
          Nothing else is needed from you now. If it is urgent, {profile.phone} is the fastest way
          to reach me.
        </p>
      </div>
    );
  }

  const category = step < categories.length ? categories[step] : null;

  return (
    <div className={s.wrap}>
      {/* ------------------------------------------------------------ Rail */}
      <nav className={s.rail} aria-label="Form progress">
        <ol className={s.railList}>
          {stepLabels.map((label, index) => {
            const count = index < categories.length ? perCategoryCount[categories[index].id] : 0;
            const state = index === step ? "current" : index < step ? "done" : "todo";
            return (
              <li key={label}>
                <button
                  type="button"
                  className={s.railStep}
                  data-state={state}
                  onClick={() => goTo(index)}
                  aria-current={index === step ? "step" : undefined}
                >
                  <span className={s.railIndex}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className={s.railLabel}>{label}</span>
                  {count > 0 ? <span className={s.railCount}>{count}</span> : null}
                </button>
              </li>
            );
          })}
        </ol>
        <div className={s.railBar} aria-hidden="true">
          <span style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }} />
        </div>
      </nav>

      {/* ------------------------------------------------------------ Panel */}
      <div className={s.panel}>
        <Spec
          className={s.panelSpec}
          items={[
            { value: String(step + 1).padStart(2, "0"), unit: `of ${TOTAL_STEPS}` },
            { value: String(selectedCount), unit: `of ${totalServiceCount} selected` },
          ]}
        />

        {category ? (
          <>
            <h2 className={`h2 ${s.panelTitle}`} tabIndex={-1} ref={headingRef}>
              {category.title}
            </h2>
            <p className={`bodyLg ${s.panelBlurb}`}>{category.blurb}</p>

            <fieldset className={s.grid}>
              <legend className="srOnly">{category.title} — choose what you need</legend>
              {category.items.map((item) => {
                const checked = selected.has(item.id);
                return (
                  <label key={item.id} className={s.card} data-on={checked}>
                    <input
                      type="checkbox"
                      className={s.cardInput}
                      checked={checked}
                      onChange={() => toggle(item.id)}
                    />
                    <span className={s.cardBox} aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="m5 12.5 4.5 4.5L19 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className={s.cardText}>
                      <span className={s.cardLabel}>{item.label}</span>
                      <span className={s.cardDetail}>{item.detail}</span>
                    </span>
                  </label>
                );
              })}
            </fieldset>

            <div className={s.field}>
              <label htmlFor={`note-${category.id}`}>
                Notes or specific questions on {category.title.toLowerCase()}
              </label>
              <textarea
                id={`note-${category.id}`}
                value={notes[category.id] ?? ""}
                onChange={(event) =>
                  setNotes((current) => ({ ...current, [category.id]: event.target.value }))
                }
                placeholder="Anything particular about this part of the project — a machine you already own, a brand you like, a constraint I should know about."
              />
            </div>
          </>
        ) : step === PROJECT_STEP ? (
          <>
            <h2 className={`h2 ${s.panelTitle}`} tabIndex={-1} ref={headingRef}>
              The project
            </h2>
            <p className={`bodyLg ${s.panelBlurb}`}>
              Where it is and when it opens changes what I would advise. Neither answer is binding.
            </p>

            <div className={s.field}>
              <label htmlFor="f-city">City</label>
              <input
                id="f-city"
                type="text"
                value={fields.city}
                onChange={(event) => update("city", event.target.value)}
                placeholder="Safi, Marrakesh, Casablanca…"
              />
            </div>

            <fieldset className={s.choices}>
              <legend className={s.choiceLegend}>When do you want to open?</legend>
              {timelines.map((option) => (
                <label key={option.id} className={s.chip} data-on={timeline === option.id}>
                  <input
                    type="radio"
                    name="timeline"
                    className={s.cardInput}
                    checked={timeline === option.id}
                    onChange={() => setTimeline(option.id)}
                  />
                  <span className={s.chipLabel}>{option.label}</span>
                  <span className={s.chipDetail}>{option.detail}</span>
                </label>
              ))}
            </fieldset>

            <fieldset className={s.choices}>
              <legend className={s.choiceLegend}>Budget you are working to</legend>
              {budgets.map((option) => (
                <label key={option.id} className={s.chip} data-on={budget === option.id}>
                  <input
                    type="radio"
                    name="budget"
                    className={s.cardInput}
                    checked={budget === option.id}
                    onChange={() => setBudget(option.id)}
                  />
                  <span className={s.chipLabel}>{option.label}</span>
                  <span className={s.chipDetail}>{option.detail}</span>
                </label>
              ))}
            </fieldset>
          </>
        ) : (
          <>
            <h2 className={`h2 ${s.panelTitle}`} tabIndex={-1} ref={headingRef}>
              Your details
            </h2>
            <p className={`bodyLg ${s.panelBlurb}`}>
              Last step. I reply to every request myself, within two working days.
            </p>

            <div className={s.pairs}>
              <div className={s.field}>
                <label htmlFor="f-name">Name</label>
                <input
                  id="f-name"
                  type="text"
                  autoComplete="name"
                  value={fields.name}
                  onChange={(event) => update("name", event.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div className={s.field}>
                <label htmlFor="f-phone">Phone / WhatsApp</label>
                <input
                  id="f-phone"
                  type="tel"
                  autoComplete="tel"
                  value={fields.phone}
                  onChange={(event) => update("phone", event.target.value)}
                  placeholder="+212 6…"
                />
              </div>
            </div>

            <div className={s.field}>
              <label htmlFor="f-email">Email</label>
              <input
                id="f-email"
                type="email"
                autoComplete="email"
                value={fields.email}
                onChange={(event) => update("email", event.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <div className={s.field}>
              <label htmlFor="f-message">Anything else</label>
              <textarea
                id="f-message"
                value={fields.message}
                onChange={(event) => update("message", event.target.value)}
                placeholder="The space, the concept, who it is for, what worries you most about opening."
              />
            </div>

            {/* Review — what is actually about to be sent. */}
            <div className={s.review}>
              <h3 className="h5">What you are sending</h3>
              {selectedCount === 0 ? (
                <p className={`bodySm ${s.reviewEmpty}`}>
                  No services chosen yet. Go back and tick what you need — that is the part I work
                  from.
                </p>
              ) : (
                <ul className={s.reviewList}>
                  {categories.map((entry) => {
                    const chosen = entry.items.filter((item) => selected.has(item.id));
                    if (chosen.length === 0) return null;
                    return (
                      <li key={entry.id}>
                        <span className={s.reviewCat}>
                          {entry.index} · {entry.title}
                        </span>
                        <span className={s.reviewItems}>
                          {chosen.map((item) => item.label).join(" · ")}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </>
        )}

        {errors.length > 0 ? (
          <div className={s.errors} role="alert">
            {errors.map((error) => (
              <p key={error} className="bodySm">
                {error}
              </p>
            ))}
          </div>
        ) : null}

        {/* ---------------------------------------------------------- Actions */}
        <div className={s.actions}>
          {step > 0 ? (
            <Button type="button" variant="ghost" size="sm" onClick={() => goTo(step - 1)}>
              <Icon name="arrowLeft" size={16} />
              Back
            </Button>
          ) : (
            <span />
          )}

          {step < DETAILS_STEP ? (
            <Button type="button" variant="primary" onClick={() => goTo(step + 1)}>
              {category && perCategoryCount[category.id] === 0 ? "Skip this phase" : "Continue"}
              <Icon name="arrowRight" size={20} />
            </Button>
          ) : (
            <Button type="button" variant="gold" onClick={submit} disabled={sending}>
              {sending ? "Sending…" : "Send request"}
              <Icon name="arrowRight" size={20} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
