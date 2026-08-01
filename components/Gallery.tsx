import { gallery } from "@/lib/content";
import { photo } from "@/lib/photos";
import { Photo, SectionHead } from "./ui/Primitives";
import { Reveal } from "./ui/Reveal";
import s from "./sections.module.css";

export function Gallery() {
  return (
    <section className="section" id="gallery">
      <div className="shell">
        <Reveal>
          <SectionHead
            split
            eyebrow="Gallery"
            title="The bar, up close."
            description="Hover for context. Otherwise, just look."
          />
        </Reveal>

        <div className={s.gallery}>
          {gallery.map((tile, i) => (
            <Reveal key={tile.title} as="figure" className={s.tile} delay={(i % 3) * 60}>
              <div className={s.tileInner} style={{ paddingBottom: `${tile.ratio}%` }} tabIndex={0}>
                <Photo
                  tone={tile.tone}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  {...photo(tile.title)}
                />
                <figcaption className={s.tileCap}>
                  <b className="bodySm">{tile.title}</b>
                  <p className="cap">{tile.caption}</p>
                </figcaption>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
