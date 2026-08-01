import type { ReactNode, AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import Image from "next/image";
import s from "./ui.module.css";

type Tone = "dark" | "light" | "gold" | "base";

/* ------------------------------------------------------------------
   Photo

   Give it a `src` and it renders a real photograph via next/image.
   Leave `src` off and it falls back to a warm gradient placeholder,
   so the layout is complete before the shoot happens.

   Always absolutely positioned — the parent must be sized and
   `position: relative`. Every call site already is.
   ------------------------------------------------------------------ */
export function Photo({
  tone = "base",
  label,
  src,
  alt,
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
}: {
  tone?: Tone;
  label?: string;
  /** Path under /public, e.g. "/images/hero-portrait.jpg". */
  src?: string;
  /** Required whenever `src` is set — describes the photo for screen readers. */
  alt?: string;
  /** Set on the hero image only, so it is not lazy-loaded. */
  priority?: boolean;
  sizes?: string;
}) {
  const toneClass =
    tone === "light"
      ? s.photoLight
      : tone === "dark"
        ? s.photoDark
        : tone === "gold"
          ? s.photoGold
          : "";

  if (src) {
    return (
      <div className={s.photoFrame}>
        <Image
          src={src}
          alt={alt ?? ""}
          fill
          sizes={sizes}
          priority={priority}
          className={s.photoImg}
        />
        {label ? <span className={s.photoLabel}>{label}</span> : null}
      </div>
    );
  }

  return (
    <div className={`${s.photo} ${toneClass}`} aria-hidden="true">
      {label ? <span className={s.photoLabel}>{label}</span> : null}
    </div>
  );
}

/* ------------------------------------------------------------------
   Spec — the signature device. Renders "18g in · 36g out · 27s".
   ------------------------------------------------------------------ */
export type SpecItem = {
  /** Emphasised measurement, e.g. "18". Rendered bold. */
  value?: ReactNode;
  /** Trailing unit, e.g. "g in". */
  unit?: string;
  /** Plain segment with no value/unit split, e.g. "Belief 01". */
  text?: ReactNode;
};

export function Spec({
  items,
  variant = "default",
  className = "",
}: {
  items: SpecItem[];
  variant?: "default" | "gold" | "inverse";
  className?: string;
}) {
  const variantClass = variant === "gold" ? s.specGold : variant === "inverse" ? s.specInverse : "";
  return (
    <div className={`${s.spec} ${variantClass} ${className}`}>
      {items.map((item, i) => (
        <span key={i}>
          {item.text ?? (
            <>
              <b>{item.value}</b>
              {item.unit ? ` ${item.unit}` : ""}
            </>
          )}
        </span>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ Eyebrow */
export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className={s.eyebrow}>{children}</p>;
}

/* ------------------------------------------------------------------ Button */
type ButtonVariant = "primary" | "gold" | "secondary" | "inverse" | "ghost";

const variantClass: Record<ButtonVariant, string> = {
  primary: s.btnPrimary,
  gold: s.btnGold,
  secondary: s.btnSecondary,
  inverse: s.btnInverse,
  ghost: s.btnGhost,
};

export function ButtonLink({
  variant = "primary",
  size = "lg",
  children,
  className = "",
  ...rest
}: {
  variant?: ButtonVariant;
  size?: "lg" | "sm";
  children: ReactNode;
} & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={`${s.btn} ${variantClass[variant]} ${size === "sm" ? s.btnSm : ""} ${className}`}
      {...rest}
    >
      {children}
    </a>
  );
}

export function Button({
  variant = "primary",
  size = "lg",
  children,
  className = "",
  ...rest
}: {
  variant?: ButtonVariant;
  size?: "lg" | "sm";
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`${s.btn} ${variantClass[variant]} ${size === "sm" ? s.btnSm : ""} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------- Badge */
type BadgeVariant = "gold" | "soft" | "outline" | "success" | "glass";

const badgeClass: Record<BadgeVariant, string> = {
  gold: s.badgeGold,
  soft: s.badgeSoft,
  outline: s.badgeOutline,
  success: s.badgeSuccess,
  glass: s.badgeGlass,
};

export function Badge({
  variant = "soft",
  dot = false,
  children,
}: {
  variant?: BadgeVariant;
  dot?: boolean;
  children: ReactNode;
}) {
  return (
    <span className={`${s.badge} ${badgeClass[variant]} ${dot ? s.badgeDot : ""}`}>{children}</span>
  );
}

/* ------------------------------------------------------------- SectionHead */
export function SectionHead({
  eyebrow,
  title,
  description,
  split = false,
  titleClass = "h1",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  split?: boolean;
  titleClass?: string;
}) {
  if (split) {
    return (
      <div className={s.headSplit}>
        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className={`${titleClass} ${s.headTitle}`} style={{ marginTop: "var(--s5)" }}>
            {title}
          </h2>
        </div>
        {description ? <p className={`bodyLg ${s.headDesc}`}>{description}</p> : null}
      </div>
    );
  }
  return (
    <div className={s.head}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className={`${titleClass} ${s.headTitle}`}>{title}</h2>
      {description ? <p className={`bodyLg ${s.headDesc}`}>{description}</p> : null}
    </div>
  );
}

/* -------------------------------------------------------------------- Icons
   Mirrors the 24px icon components published in the Figma library.
   ------------------------------------------------------------------------ */
const iconPaths: Record<string, ReactNode> = {
  arrowRight: <path d="M4 12h16M13 5l7 7-7 7" />,
  arrowLeft: <path d="M20 12H4M11 5l-7 7 7 7" />,
  arrowUpRight: <path d="M7 17 17 7M8 7h9v9" />,
  plus: <path d="M12 4v16M4 12h16" />,
  menu: <path d="M3 7h18M3 12h18M3 17h18" />,
  close: <path d="M18 6 6 18M6 6l12 12" />,
  award: (
    <>
      <circle cx="12" cy="9" r="5.5" />
      <path d="M8.4 13.6 7 21.5l5-2.6 5 2.6-1.4-7.9" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
      <path d="m3.6 6.6 8.4 6 8.4-6" />
    </>
  ),
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  linkedin: (
    <>
      <path d="M6 9.5v11M11 20.5v-11M11 13.6c0-2.3 1.7-4.1 3.9-4.1s3.6 1.6 3.6 4.4v6.6" />
      <circle cx="6" cy="5" r="1.6" fill="currentColor" stroke="none" />
    </>
  ),
};

export function Icon({
  name,
  size = 24,
  className = "",
}: {
  name: keyof typeof iconPaths | string;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {iconPaths[name] ?? null}
    </svg>
  );
}
