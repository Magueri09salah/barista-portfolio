"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { SiteContent } from "@/lib/site-content";
import { Icon } from "./ui/Primitives";
import s from "./Nav.module.css";

export function Nav({
  profile,
  navLinks,
}: {
  profile: SiteContent["profile"];
  navLinks: SiteContent["navLinks"];
}) {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      setStuck(y > 40);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (y / max) * 100 : 0);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock the page behind the mobile overlay.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Escape closes the overlay.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={`${s.nav} ${stuck ? s.stuck : ""}`}>
      <div className={`shell ${s.inner}`}>
        <Link className={s.mark} href="/">
          {profile.firstName} <span>{profile.lastName}</span>
        </Link>

        <nav
          id="primary-nav"
          className={`${s.links} ${open ? s.open : ""}`}
          aria-label="Primary"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={link.highlight ? s.cta : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          className={`${s.toggle} ${open ? s.toggleOpen : ""}`}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="primary-nav"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <Icon name={open ? "close" : "menu"} />
        </button>
      </div>

      <div className={s.progress} style={{ width: `${progress}%` }} aria-hidden="true" />
    </header>
  );
}
