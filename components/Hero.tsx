"use client";

import { useEffect, useState } from "react";
import type { SiteContent } from "@/lib/site-content";
import { pick, type PhotoMap } from "@/lib/photos";
import { ButtonLink, Eyebrow, Icon, Photo, Spec } from "./ui/Primitives";
import { Reveal } from "./ui/Reveal";
import s from "./Hero.module.css";

const beans = [
  { left: "8%", top: "26%", rot: "14deg", dur: "9s", delay: "0s" },
  { left: "19%", top: "62%", rot: "-22deg", dur: "11s", delay: "-3s" },
  { left: "31%", top: "18%", rot: "40deg", dur: "8s", delay: "-1.5s" },
  { left: "44%", top: "74%", rot: "-8deg", dur: "12s", delay: "-5s" },
  { left: "58%", top: "36%", rot: "28deg", dur: "10s", delay: "-2s" },
  { left: "12%", top: "84%", rot: "-34deg", dur: "13s", delay: "-6s" },
];

/**
 * The hero's thesis: the house recipe, counting up to its 27-second
 * extraction on load. The number the whole portfolio is organised around.
 */
function ShotTimer() {
  const [t, setT] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setT(27);
      return;
    }
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / 2400);
      setT(27 * (1 - Math.pow(1 - k, 3)));
      if (k < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return <>{t.toFixed(1)}</>;
}

export function Hero({ profile, photos }: { profile: SiteContent["profile"]; photos: PhotoMap }) {
  return (
    <section className={s.hero} id="top">
      <div className={s.bg} aria-hidden="true" />

      <div className={s.beans} aria-hidden="true">
        {beans.map((b, i) => (
          <span
            key={i}
            className={s.bean}
            style={
              {
                left: b.left,
                top: b.top,
                "--rot": b.rot,
                animationDuration: b.dur,
                animationDelay: b.delay,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div className={`shell ${s.inner}`}>
        <div className={s.content}>
          <Reveal>
            <Eyebrow>
              {profile.role} · {profile.city}, {profile.country}
            </Eyebrow>
          </Reveal>

          <Reveal delay={120}>
            <h1 className={`d2 ${s.title}`}>
              Crafting moments through <em>coffee.</em>
            </h1>
          </Reveal>

          <Reveal delay={240}>
            <p className={`lead ${s.lead}`}>
              Ten years across nine venues in Dubai and Safi, split between the restaurant floor
              and the espresso bar. Specialty coffee is precision, hospitality and repetition — and
              the third one is what makes the first two matter.
            </p>
          </Reveal>

          <Reveal delay={340} className={s.actions}>
            <ButtonLink href="#journey" variant="primary">
              View my journey
              <Icon name="arrowRight" size={20} />
            </ButtonLink>
            <ButtonLink href="#craft" variant="secondary">
              See how I brew
              <Icon name="arrowUpRight" size={20} />
            </ButtonLink>
          </Reveal>

          <Reveal delay={440} className={s.specRow}>
            <Spec
              variant="gold"
              items={[
                { value: "18.0", unit: "g in" },
                { value: "36.0", unit: "g out" },
                { value: <ShotTimer />, unit: "s" },
                { value: "93", unit: "°C" },
              ]}
            />
            <p className={s.specNote}>The house recipe I dial to every morning</p>
          </Reveal>
        </div>

        <div className={s.portrait}>
          <Photo
            tone="gold"
            label="Specialty bar · in service"
            priority
            sizes="(max-width: 900px) 100vw, 38vw"
            {...pick(photos, "hero")}
          />
          <div className={s.steam} aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    </section>
  );
}
