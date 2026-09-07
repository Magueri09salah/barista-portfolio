"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SiteContent } from "@/lib/site-content";
import { pick, type PhotoMap } from "@/lib/photos";
import { Photo, SectionHead, Spec } from "./ui/Primitives";
import { Reveal } from "./ui/Reveal";
import s from "./sections.module.css";

export function Journey({ milestones, photos }: { milestones: SiteContent["milestones"]; photos: PhotoMap }) {
  const railRef = useRef<HTMLDivElement | null>(null);
  const [thumb, setThumb] = useState({ width: 20, left: 0 });
  const [activeIndex, setActiveIndex] = useState(0);

  const update = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;

    const max = rail.scrollWidth - rail.clientWidth;
    const ratio = rail.clientWidth / rail.scrollWidth;
    const widthPct = ratio * 100;
    setThumb({
      width: widthPct,
      left: max > 0 ? (rail.scrollLeft / max) * (100 - widthPct) : 0,
    });

    // Whichever milestone straddles the rail's centre is "active".
    const mid = rail.scrollLeft + rail.clientWidth / 2;
    const cards = Array.from(rail.children) as HTMLElement[];
    let closest = 0;
    let bestDistance = Infinity;
    cards.forEach((card, i) => {
      const centre = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(centre - mid);
      if (distance < bestDistance) {
        bestDistance = distance;
        closest = i;
      }
    });
    setActiveIndex(closest);
  }, []);

  useEffect(() => {
    update();
    const rail = railRef.current;
    if (!rail) return;
    rail.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      rail.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  return (
    <section className="section bgInverse" id="journey">
      <div className="shell">
        <Reveal>
          <SectionHead
            split
            eyebrow="Professional journey"
            title="Ten years, nine venues, two countries."
            description="Drag sideways. From hotel service in Dubai in 2015 to the espresso bar in Safi today."
          />
        </Reveal>
      </div>

      <div className={s.rail} ref={railRef}>
        {milestones.map((milestone, i) => (
          <article
            key={milestone.range}
            className={`${s.milestone} ${i === activeIndex ? s.milestoneActive : ""}`}
          >
            <div className={s.milestoneYear}>{milestone.year}</div>
            <div className={s.milestonePhoto}>
              <Photo
                tone={milestone.tone}
                label={milestone.caption}
                sizes="(max-width: 640px) 78vw, 420px"
                {...pick(photos, milestone.range)}
              />
            </div>
            <Spec
              variant="inverse"
              items={[{ text: milestone.place }, { text: milestone.role }]}
            />
            <div>
              <p className={s.milestoneRange}>{milestone.range}</p>
              <h3 className="h4">{milestone.title}</h3>
              <p className="bodySm secondary" style={{ marginTop: "var(--s2)" }}>
                {milestone.body}
              </p>
            </div>
          </article>
        ))}
      </div>

      <div className="shell">
        <div className={s.track}>
          <div
            className={s.thumb}
            style={{ width: `${thumb.width}%`, left: `${thumb.left}%` }}
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}
