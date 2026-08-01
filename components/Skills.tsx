import { skillGroups } from "@/lib/content";
import { Badge, SectionHead } from "./ui/Primitives";
import { Reveal } from "./ui/Reveal";
import s from "./sections.module.css";

export function Skills() {
  return (
    <section className="section bgSubtle" id="skills">
      <div className="shell">
        <Reveal>
          <SectionHead
            split
            eyebrow="Skills"
            title="What I bring to a bar."
            description="Grouped the way I would explain it in an interview — the methods, the systems and the parts of the job that happen after the guests leave."
          />
        </Reveal>

        <div className={s.skills}>
          {skillGroups.map((group, i) => (
            <Reveal key={group.title} className={s.skillCard} delay={(i % 3) * 60}>
              <h3 className="h4">{group.title}</h3>
              <ul className={s.skillTags}>
                {group.items.map((item) => (
                  <li key={item}>
                    <Badge variant="outline">{item}</Badge>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
