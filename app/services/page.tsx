import type { Metadata } from "next";
import { categories, totalServiceCount } from "@/lib/catalogue";
import { getSiteContent } from "@/lib/site-content";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { RequestForm } from "@/components/setup/RequestForm";
import { Eyebrow, Spec } from "@/components/ui/Primitives";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { Reveal } from "@/components/ui/Reveal";
import s from "./services.module.css";

export const metadata: Metadata = {
  title: "Open a coffee shop — setup service | Mohammed Qasbili",
  description:
    "Concept and branding, equipment specification, menu and recipe standardisation, bar layout, and the operating systems behind it. Tell me which parts you need and I will come back with a plan.",
  openGraph: {
    title: "Open a coffee shop — setup service",
    description:
      "Five phases, from branding to daily cleaning checklists. Choose what you need and send it through.",
    type: "website",
  },
};

export default async function ServicesPage() {
  const content = await getSiteContent();
  const { profile } = content;

  return (
    <>
      <Nav profile={profile} navLinks={content.navLinks} />
      <main id="main">
        {/* ------------------------------------------------------- Opening */}
        <section className={`section ${s.intro}`}>
          <div className="shell">
            <Reveal>
              <Eyebrow>Setup service</Eyebrow>
              <h1 className={`d3 ${s.title}`}>
                Opening a coffee shop is about forty decisions. I have made most of them before.
              </h1>
            </Reveal>

            <Reveal delay={120}>
              <p className={`lead ${s.lead}`}>
                Ten years behind bars in Dubai and Safi, most of it fixing places that were already
                open — the grinder nobody dialled in, the layout that costs a barista three steps a
                drink, the menu with no costing behind it. It is cheaper to decide these things
                before the fit-out than after.
              </p>
              <p className={`lead ${s.lead}`}>
                Below are the five phases and the {totalServiceCount} pieces of work inside them.
                Take all of it or take one part. Tick what you need, tell me about the project, and
                I will come back with what it involves and what it costs.
              </p>
            </Reveal>

            <Reveal delay={200}>
              <Spec className={s.introSpec} items={[...profile.houseRecipe]} />
            </Reveal>
          </div>
        </section>

        {/* -------------------------------------------------- Phase summary */}
        <section className={`section bgSubtle ${s.phases}`}>
          <div className="shell">
            <Reveal>
              <Eyebrow>What is covered</Eyebrow>
              <h2 className={`h1 ${s.phasesTitle}`}>Five phases, in the order they happen.</h2>
            </Reveal>

            <ol className={s.phaseList}>
              {categories.map((category, i) => (
                <Reveal key={category.id} as="li" className={s.phase} delay={(i % 3) * 90}>
                  <span className={s.phaseIndex}>{category.index}</span>
                  <div>
                    <h3 className="h4">{category.title}</h3>
                    <p className={`bodySm ${s.phaseBlurb}`}>{category.blurb}</p>
                    <ul className={s.phaseItems}>
                      {category.items.map((item) => (
                        <li key={item.id}>{item.label}</li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* ------------------------------------------------------ The form */}
        <section className="section" id="request">
          <div className="shell">
            <Reveal>
              <Eyebrow>Your project</Eyebrow>
              <h2 className={`h1 ${s.formTitle}`}>Tell me what you need.</h2>
              <p className={`bodyLg ${s.formLead}`}>
                Seven steps, two minutes. Nothing here commits you to anything — it is how I work
                out whether I am the right person for the project before either of us spends time
                on a meeting.
              </p>
            </Reveal>

            <RequestForm profile={profile} />
          </div>
        </section>
      </main>
      <Footer profile={profile} />
      <WhatsAppButton profile={profile} />
    </>
  );
}
