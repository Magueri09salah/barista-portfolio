import type { SiteContent } from "@/lib/site-content";
import { Icon, SectionHead } from "./ui/Primitives";
import { Reveal } from "./ui/Reveal";
import s from "./sections.module.css";

export function Credentials({ credentials }: { credentials: SiteContent["credentials"] }) {
  return (
    <section className="section bgInverse" id="credentials">
      <div className="shell">
        <Reveal>
          <SectionHead
            split
            eyebrow="Credentials"
            title="Education, languages and the kit I know."
            description="No competition placings and no specialty certifications yet — SCA Barista Skills is the next one. What follows is what I actually hold and what I have actually run."
          />
        </Reveal>

        <div className={s.awards}>
          {credentials.map((credential, i) => (
            <Reveal key={credential.title} className={s.award} delay={i * 40}>
              <div className={s.awardYear}>{credential.kind}</div>
              <h3 className="h4">{credential.title}</h3>
              <p className={s.awardOrg}>{credential.detail}</p>
              <Icon name="award" className={s.awardIcon} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
