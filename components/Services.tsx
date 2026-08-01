import { services } from "@/lib/content";
import { Icon, SectionHead } from "./ui/Primitives";
import { Reveal } from "./ui/Reveal";
import s from "./sections.module.css";

export function Services() {
  return (
    <section className="section bgSand" id="services">
      <div className="shell">
        <Reveal>
          <SectionHead
            split
            eyebrow="What I do"
            title="The job, in six parts."
            description="Ten years across nine venues in Dubai and Safi, split between the bar and the floor. This is what a shift with me actually covers."
          />
        </Reveal>

        <div className={s.projects}>
          {services.map((service, i) => (
            <Reveal key={service.title} as="article" className={s.project} delay={i * 40}>
              <div className={s.projectType}>{service.type}</div>
              <h3 className={`h3 ${s.projectTitle}`}>{service.title}</h3>
              <p>{service.body}</p>
              <Icon name="arrowUpRight" className={s.projectGo} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
