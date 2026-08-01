import { aboutClosing, aboutParagraphs, aboutQuote, stats } from "@/lib/content";
import { Eyebrow, Photo } from "./ui/Primitives";
import { Counter } from "./ui/Counter";
import { photo } from "@/lib/photos";
import { Reveal } from "./ui/Reveal";
import s from "./sections.module.css";

export function About() {
  return (
    <section className="section" id="about">
      <div className="shell">
        <div className={s.aboutGrid}>
          <Reveal className={s.aboutPortrait}>
            <Photo
              tone="light"
              label="The craft, up close"
              sizes="(max-width: 1024px) 100vw, 40vw"
              {...photo("about")}
            />
          </Reveal>

          <div className={s.aboutBody}>
            <Reveal>
              <Eyebrow>About</Eyebrow>
            </Reveal>

            <Reveal delay={80}>
              <h2 className="h1">
                I came to coffee from the restaurant floor, and I think that was the right order.
              </h2>
            </Reveal>

            {aboutParagraphs.map((text, i) => (
              <Reveal key={i} delay={160 + i * 40}>
                <p className="bodyLg">{text}</p>
              </Reveal>
            ))}

            <Reveal delay={240}>
              <blockquote className={`${s.pull} quoteBase`}>
                {aboutQuote.text}
                <cite>{aboutQuote.source}</cite>
              </blockquote>
            </Reveal>

            <Reveal delay={280}>
              <p className="bodyLg">{aboutClosing}</p>
            </Reveal>
          </div>
        </div>

        <dl className={s.stats}>
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 60} className={s.statItem}>
              {/* dt precedes dd for valid markup; column-reverse puts the number on top */}
              <dt className={s.statLabel}>{stat.label}</dt>
              <dd className={s.statNum}>
                <Counter value={stat.value} suffix={stat.suffix} />
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
