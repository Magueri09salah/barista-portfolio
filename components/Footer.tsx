import { profile } from "@/lib/content";
import { Spec } from "./ui/Primitives";
import s from "./sections.module.css";

const columns = [
  {
    title: "Portfolio",
    links: [
      { href: "#about", label: "About" },
      { href: "#journey", label: "Journey" },
      { href: "#craft", label: "Craft" },
      { href: "#skills", label: "Skills" },
    ],
  },
  {
    title: "Detail",
    links: [
      { href: "#credentials", label: "Credentials" },
      { href: "#gallery", label: "Gallery" },
      { href: "#services", label: "What I do" },
      { href: "#faq", label: "Questions" },
    ],
  },
  {
    title: "Reach me",
    links: [
      { href: `mailto:${profile.email}`, label: "Email" },
      { href: `tel:${profile.phoneHref}`, label: profile.phone },
      { href: profile.linkedin, label: "LinkedIn" },
    ],
  },
];

export function Footer() {
  return (
    <footer className={s.footer}>
      <div className="shell">
        <div className={s.footerTop}>
          <div>
            <div className={s.footerSig}>
              {profile.firstName} {profile.lastName}
            </div>
            <p className={`bodySm ${s.footerBlurb}`}>
              {profile.role} in {profile.city}, {profile.country}. Ten years on the floor and behind
              the bar.
            </p>
            <Spec
              variant="inverse"
              className={s.footerSpec}
              items={profile.houseRecipe.map((item) => ({ value: item.value, unit: item.unit }))}
            />
          </div>

          <nav className={s.footerNav} aria-label="Footer">
            {columns.map((column) => (
              <div key={column.title}>
                <h3>{column.title}</h3>
                <ul>
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href}>{link.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className={s.footerBase}>
          <p>
            © {new Date().getFullYear()} {profile.firstName} {profile.lastName}. All rights reserved.
          </p>
          <p>Warm ivory, espresso black, golden caramel.</p>
        </div>
      </div>
    </footer>
  );
}
