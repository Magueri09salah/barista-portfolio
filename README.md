# Mohammed Qasbili — Barista Portfolio

A premium editorial portfolio for a working barista, built from his CV.
Next.js 15 (App Router) + TypeScript + CSS Modules. No UI or CSS framework.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

---

## Content rule — read this before editing

**Everything on this site is traceable to the CV.** There are no invented awards,
certifications, competition placings, published articles or testimonials, and the
Credentials section says plainly that no specialty certification is held yet.

That is deliberate. A portfolio is read by people who will ask about it in an
interview, and an invented Q-grader certificate or a fabricated client quote is the
kind of detail that ends a conversation badly. Fewer real credentials, presented
confidently, is the stronger position.

If real ones arrive — an SCA certificate, a competition result, a reference from a
manager willing to be named — add them to `lib/content.ts` and they will render in the
existing layouts.

Figures currently used, and where they come from:

| Figure | Source in the CV |
|---|---|
| 10 years in hospitality | first role Dec 2015 → present |
| 9 venues, Dubai and Safi | Ramee Royal (Dubai), then Riyad Pêcheur, La Trattoria, Tifaouine, Le Rooftop, Calypso, Ocean, Korten, Black Top (all Safi) |
| 100+ drinks daily | Korten |
| 9+ colleagues trained | 6+ at Korten, 3 at La Trattoria |
| 16% beverage sales increase | La Trattoria |
| 3 languages | Arabic native, English and French professional |

The home street address on the CV is **deliberately not published** — the site carries
city, email, phone and LinkedIn only.

> **Note:** the CV lists the Ramee Royal under "Safi, Morocco", but it is in Dubai.
> The site is corrected; the CV still needs the same fix.

---

## Design system

The token layer in `app/globals.css` mirrors a Figma library 1:1:

**Figma file** — [Barista Portfolio — Design System](https://www.figma.com/design/vtXRQWsvREE3vRt6zZDLVV)

| Layer | Figma | Code |
|---|---|---|
| Primitives | `1 · Primitives` (26 vars) | `--ivory-*`, `--coffee-*`, `--espresso-*`, `--caramel-*`, `--forest-*` |
| Semantic | `2 · Semantic` (27 vars) | `--bg-*`, `--text-*`, `--border-*`, `--accent-*` |
| Spacing / radius | `3 · Spacing & Radius` (24 vars) | `--s1`…`--s15` (8px system), `--r-*` |
| Type styles | 36 text styles | `.d1`–`.d3`, `.h1`–`.h5`, `.quoteLg`, `.lead`, `.bodyLg`… |
| Effects | 9 effect styles | `--elev-1`…`--elev-4`, `--glow-gold` |
| Grids | 3 grid styles | `--gutter` / `--col-gap` per breakpoint |

Palette exactly as briefed: Warm Ivory `#F7F5F2`, Espresso Black `#201813`,
Coffee Brown `#6B4F3A`, Golden Caramel `#C7903C`, Light Beige `#E9DFD4`,
Text `#222222`, Forest Green `#4B7052`.

Breakpoints are `1440` → `1024` → `390`. Type and layout tokens are redeclared per
breakpoint at the top of `globals.css`, so components rarely need their own media
queries.

### The signature device

A barista's work is measured, so the recurring structural element is a real **spec
line** rather than generic `01 / 02 / 03` numbering:

```
18 G IN · 36 G OUT · 27 S · 93 °C
```

It appears in the hero — where the seconds count up to 27 on load — and on every
method card, journey milestone and in the footer. Set in **IBM Plex Mono**, a fourth
utility face alongside the three from the brief, because data wants a different voice
from body copy.

| Role | Face |
|---|---|
| Display, headings, numerals | Playfair Display |
| Pull-quotes and signature | Cormorant Garamond |
| Body and UI | Manrope |
| Spec lines and metadata | IBM Plex Mono |

---

## Structure

```
app/
  layout.tsx          fonts, metadata, grain overlay, skip link
  page.tsx            section composition
  globals.css         tokens + base + type ramp + layout primitives
  icon.svg
components/
  Nav / Hero / About / Philosophy / Journey / Craft / Skills /
  Credentials / Gallery / Services / Faq / Contact / Footer
  sections.module.css
  ui/
    Primitives.tsx      Photo, Spec, Eyebrow, Button, Badge, SectionHead, Icon
    Reveal.tsx          scroll-triggered fade-up
    Counter.tsx         count-up statistics
    ui.module.css
lib/
  content.ts          all copy and data, typed — single source of truth
```

Sections are server components; only those needing browser APIs (`Nav`, `Hero`,
`Journey`, `Faq`, `Contact`) are client components.

---

## Before this goes live

1. **Photography.** `<Photo>` renders a warm gradient stand-in with film grain in four
   tones. Swap its body for `next/image` — every call site already sits in a sized,
   `position: relative` parent, so `fill` works with no layout changes:

   ```tsx
   <Image src={src} alt={alt} fill sizes="(max-width: 900px) 100vw, 40vw"
          style={{ objectFit: "cover" }} />
   ```

   Worth shooting: a portrait, the bar at open, a pour in progress, latte art, the
   V60/Chemex setup, and a group-head clean.

2. **Contact form.** `components/Contact.tsx` validates then shows a message telling
   the visitor to email directly. Point `onSubmit` at a real endpoint (a route handler
   under `app/api/`, or Formspree/Resend) before launch.

3. **Domain and OG image.** Set `metadataBase` in `app/layout.tsx` once there is a
   domain, and add an OG image.

---

## Accessibility and motion

Scroll reveals, the hero shot timer, the stat counters and the journey rail all respect
`prefers-reduced-motion: reduce`. Keyboard focus is visible throughout, the mobile nav
traps scroll and closes on `Escape`, and there is a skip link to `#main`.
