import type { SiteContent } from "@/lib/site-content";
import { pick, type PhotoMap } from "@/lib/photos";
import { Badge, Photo, SectionHead, Spec } from "./ui/Primitives";
import { Reveal } from "./ui/Reveal";
import s from "./sections.module.css";

export function Craft({ methods, photos }: { methods: SiteContent["methods"]; photos: PhotoMap }) {
  return (
    <section className="section" id="craft">
      <div className="shell">
        <Reveal>
          <SectionHead
            split
            eyebrow="Craft"
            title="Seven methods I work in."
            description="Ratios and temperatures are the standard specialty targets I dial to. Everything else — grind, dose, timing — gets adjusted to the coffee in front of me."
          />
        </Reveal>

        <div className={s.drinks}>
          {methods.map((method, i) => (
            <Reveal key={method.code} as="article" className={s.drink} delay={(i % 3) * 80}>
              <div className={s.drinkPhoto}>
                <Photo
                  tone={method.tone}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  {...pick(photos, method.code)}
                />
                <span className={s.drinkCode}>{method.code}</span>
                <span className={s.drinkDiff}>
                  <Badge
                    variant={
                      method.level === "Core" ? "gold" : method.level === "Daily" ? "soft" : "glass"
                    }
                  >
                    {method.level}
                  </Badge>
                </span>
              </div>

              <div className={s.drinkBody}>
                <h3 className="h4">{method.name}</h3>
                <Spec items={method.spec} />

                <div className={s.drinkNotes}>
                  {method.notes.map((note) => (
                    <Badge key={note} variant="soft">
                      {note}
                    </Badge>
                  ))}
                </div>

                <p className={`bodySm ${s.drinkStory}`}>{method.body}</p>

                <dl className={s.drinkMeta}>
                  <div>
                    <dt>Ratio</dt>
                    <dd>{method.ratio}</dd>
                  </div>
                  <div>
                    <dt>Grind</dt>
                    <dd>{method.grind}</dd>
                  </div>
                  <div>
                    <dt>Time</dt>
                    <dd>{method.time}</dd>
                  </div>
                  <div>
                    <dt>Best for</dt>
                    <dd>{method.bestFor}</dd>
                  </div>
                </dl>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
