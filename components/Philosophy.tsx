import type { SiteContent } from "@/lib/site-content";
import { Eyebrow, Spec } from "./ui/Primitives";
import { Reveal } from "./ui/Reveal";
import s from "./sections.module.css";

export function Philosophy({ principles }: { principles: SiteContent["principles"] }) {
  return (
    <section className="section bgSubtle" id="philosophy">
      <div className="shell">
        <Reveal>
          <Eyebrow>Approach</Eyebrow>
        </Reveal>

        <Reveal delay={80}>
          <h2 className={`d3 ${s.philosophyLead}`}>Four things ten years taught me.</h2>
        </Reveal>

        <div>
          {principles.map((principle, i) => (
            <Reveal key={principle.title} as="article" className={s.principle} delay={i * 60}>
              <Spec variant="gold" items={[{ text: principle.index }]} />
              <h3 className={`h3 ${s.principleTitle}`}>{principle.title}</h3>
              <p className="bodyLg">{principle.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
