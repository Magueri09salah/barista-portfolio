"use client";

import { useId, useState } from "react";
import type { SiteContent } from "@/lib/site-content";
import { Icon, SectionHead } from "./ui/Primitives";
import { Reveal } from "./ui/Reveal";
import s from "./sections.module.css";

export function Faq({ faqs }: { faqs: SiteContent["faqs"] }) {
  const [open, setOpen] = useState<number | null>(null);
  const baseId = useId();

  return (
    <section className="section" id="faq">
      <div className="shell">
        <Reveal>
          <SectionHead eyebrow="Questions" title="Before you write." />
        </Reveal>

        <div className={s.faq}>
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            const panelId = `${baseId}-panel-${i}`;
            const buttonId = `${baseId}-button-${i}`;
            return (
              <Reveal key={faq.question} className={`${s.qa} ${isOpen ? s.qaOpen : ""}`} delay={i * 40}>
                <button
                  id={buttonId}
                  className={s.qaQ}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  {faq.question}
                  <Icon name="plus" />
                </button>
                <div className={s.qaA} id={panelId} role="region" aria-labelledby={buttonId}>
                  <div>
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
