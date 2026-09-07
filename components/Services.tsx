import Link from "next/link";
import type { SiteContent } from "@/lib/site-content";
import { totalServiceCount } from "@/lib/catalogue";
import { Icon, SectionHead } from "./ui/Primitives";
import { Reveal } from "./ui/Reveal";
import s from "./sections.module.css";

export function Services({ services }: { services: SiteContent["services"] }) {
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

        {/* The other half of the offer: not being hired onto a bar, but
            building one. Sits here because it is the same evidence. */}
        <Reveal className={s.setupBand}>
          <div>
            <p className={s.setupKicker}>Opening your own place?</p>
            <h3 className="h3">I set coffee shops up from nothing.</h3>
            <p className={`bodyLg ${s.setupBody}`}>
              Branding, equipment specification, menu and costing, bar layout, POS and staff
              training — {totalServiceCount} pieces of work across five phases. Choose the parts you
              need and send it through.
            </p>
          </div>
          <Link className={s.setupLink} href="/services">
            See the setup service
            <Icon name="arrowRight" size={20} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
