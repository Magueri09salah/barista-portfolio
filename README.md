# Mohammed Qasbili — Barista Portfolio & Setup Service

A premium editorial portfolio for a working barista, built from his CV, plus a
lead-generation flow for his coffee shop setup consultancy and the back office
that receives it.

Next.js 15 (App Router) + TypeScript + CSS Modules. No UI or CSS framework, and
no runtime dependencies beyond React and Next itself.

```bash
npm install                # also runs `prisma generate`
cp .env.example .env       # then fill in DATABASE_URL and ADMIN_PASSWORD
npm run db:deploy          # create the tables
npm run dev                # http://localhost:3000
npm run build
```

| Route | What it is |
|---|---|
| `/` | The portfolio — the barista, for hire |
| `/services` | The setup service, and the request form |
| `/admin` | Back office inbox (password) |
| `/admin/requests/[id]` | One request, with status and private notes |
| `/admin/content` | Edit every section of the public site |
| `/admin/images` | Replace any photograph on the site |

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
manager willing to be named — add them at `/admin/content`, or to `lib/content.ts`
if they should be part of the shipped defaults. Either way they render in the
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
  content.ts          the default copy, typed — see "Editing the site" below
```

Sections are server components; only those needing browser APIs (`Nav`, `Hero`,
`Journey`, `Faq`, `Contact`) are client components.

Every section takes its copy as props. The page loads the content once and hands
it down, rather than each section fetching for itself — five of them are client
components and could not fetch anyway, and one load per page keeps the whole
render on a single cached read.

---

## The setup service and its back office

Two halves of one feature: a public request form at `/services`, and a private
inbox at `/admin` that receives what it sends.

```
prisma/
  schema.prisma       the SetupRequest model
  migrations/         generated SQL, committed — the schema's history
prisma7.config.ts     where Prisma reads the connection string
lib/
  content.ts          default site copy — the shipped text, under version control
  site-content.ts     merges stored edits over those defaults (server only)
  content-schema.ts   what the content editor renders for each section
  photos.ts           the shipped photo slots, keyed by content value
  images.ts           uploaded photographs, stored in Postgres (server only)
  catalogue.ts        the 5 phases and 23 services — single source of truth
  requests.ts         request shape, server-side validation, derived views
  prisma.ts           the Prisma client singleton (server only)
  store.ts            every setup-request query (server only)
  generated/prisma/   generated client — gitignored, rebuilt by db:generate
  auth.ts             password check and signed session cookie
middleware.ts         gates /admin and /api/admin
app/
  services/           the public page + form
  admin/
    login/            password screen
    (dash)/           inbox, request detail and content editor, behind the chrome
  api/
    requests/         POST — the public endpoint the form submits to
    admin/            login, and PATCH/DELETE on a single request
components/
  setup/RequestForm   7-step wizard, client component
  admin/              login form, status controls, content editor, sign out
```

### The catalogue is the contract

`lib/catalogue.ts` defines every service that can be requested. The form renders
from it, the API validates against it, and the back office renders stored ids
back through it. A service id that is not in the file cannot be stored, and a
stored id always has a label to display.

Add a service by adding it there — nothing else changes. **Never rename an
existing `id`**: ids are written into stored requests, so renaming one orphans
every request that referenced it. Changing a `label` or `detail` is always safe.

### Where requests are stored

Postgres, through Prisma 7. Neon's free tier is enough — the only thing to know
about it is that an idle branch auto-suspends, so the first query after a quiet
period takes about half a second.

**Two URLs.** `DATABASE_URL` is Neon's pooled string, used by the running app.
`DIRECT_URL` is used by the Prisma CLI, because a migration issues session-level
statements that PgBouncer in transaction mode cannot carry.

Build `DIRECT_URL` by deleting the six characters `-pooler` from `DATABASE_URL`
and changing nothing else — not the region, not the `c-N` cluster prefix, not the
query string:

```
pooled   ...@ep-cool-name-a1b2c3-pooler.c-4.us-east-2.aws.neon.tech/neondb?...
direct   ...@ep-cool-name-a1b2c3.c-4.us-east-2.aws.neon.tech/neondb?...
```

Get this wrong and Prisma reports `P1000: Authentication failed`, which reads
like a bad password but is really a host that exists and does not know you. On a
plain Postgres with one endpoint, set `DATABASE_URL` alone.

> **If `next start` behaves strangely** — middleware firing on every route,
> stale pages — check for a leftover `next dev` process. Dev and build share
> `.next`, so a dev server running in the background will overwrite a production
> build underneath you. `rm -rf .next && npm run build` fixes it.

| Command | What it does |
|---|---|
| `npm run db:migrate` | Create a migration after editing the schema — **development only** |
| `npm run db:deploy` | Apply existing migrations — the only one to run against live data |
| `npm run db:generate` | Regenerate the client (also runs on `npm install`) |
| `npm run db:studio` | Browse and edit the data in a GUI |

> **Never run `db:migrate` against the database holding real leads.**
> `prisma migrate dev` is a development command: when it finds drift between the
> schema and the migration history it resets the database, and the prompt is
> easy to miss in scrolled output. Point it at a Neon *development branch*, and
> use `db:deploy` — which only applies migrations that already exist — against
> anything with data in it. Neon keeps point-in-time history, so a branch can be
> restored, but only within its retention window.

**`lib/store.ts` is the only module that touches the database.** Everything above
it works in the application's own `SetupRequest` type from `lib/requests.ts`, and
the store maps Prisma's rows onto it — `Date` becomes an ISO string, `Json`
becomes a checked `Record<string, string>`. That boundary is deliberate: the
schema can change, or the database be swapped, without touching a page.

Prisma 7 talks to Postgres through the `pg` driver adapter rather than its own
engine, so the pool is `pg`'s and lives in `lib/prisma.ts`. It is cached on
`globalThis` in development, because otherwise every file save would open a new
pool and exhaust the connection limit within minutes.

The generated client is written to `lib/generated/prisma` as TypeScript and is
gitignored — `npm install` regenerates it via `postinstall`. Two consequences
worth knowing: a fresh clone needs no `.env` to install, and plain `node` cannot
import that client, because its internal imports are extensionless and only a
bundler resolves them. Any standalone script that needs the database should use
`pg` and raw SQL rather than Prisma Client.

### Editing the site from the back office

`/admin/content` edits every word on the public site — thirteen sections, from
the profile and navigation through to the FAQ. Changes go live on save.

The mechanism is a layered read, and it is worth understanding before adding to
it:

- **`lib/content.ts` is still the defaults.** It is what the site says out of
  the box, and it stays in the repo under version control.
- **The database stores only what has been changed** — a single JSON document,
  one row, holding just the edited sections.
- **`getSiteContent()` merges the two.** An empty table renders the site exactly
  as shipped; "Restore original" is a delete, not a re-seed; and a field added
  to the defaults appears immediately without a migration.

Arrays are replaced wholesale rather than merged element-by-element — the editor
sends the complete list every time, because merging by index would make deleting
the last item of a list impossible.

**`lib/content-schema.ts` decides what the editor shows.** Thirteen shapes would
otherwise mean thirteen bespoke forms, so each section is *described* there and
one generic editor renders all of them. The trade is that **a field added to
`lib/content.ts` must also be described in the schema**, or it will not be
editable — it will still render, using its default.

Reads are cached under the `site-content` tag, so the public pages stay static
and are regenerated when a save revalidates that tag. If the database is
unreachable the site falls back to the shipped defaults rather than erroring: a
portfolio showing slightly stale copy beats one returning a 500 because Neon was
asleep.

Two content fields double as photo keys — a milestone's date `range` and a
gallery tile's `title`. The editor flags both. Change one without updating the
matching image slot and that photo falls back to its gradient placeholder.

### Replacing photographs

`/admin/images` lists all 29 photo slots grouped by where they appear. Upload
one to replace it; remove the upload and the file shipped in `public/images`
comes back. Alt text is editable on its own, without re-uploading.

Images are stored **in Postgres, as bytes**. That is an unusual choice, made
because it adds no third-party service. Two things keep it viable:

- **Photos are downscaled in the browser before they are uploaded**
  (`lib/image-resize.ts`). You may pick a file up to 10 MB — straight off a
  phone or camera — and anything wider than 2560px is scaled to it and
  re-encoded as WebP, typically landing a few hundred KB. An image that is
  already small and correctly sized is passed through untouched, so nothing is
  re-encoded twice. `MAX_UPLOAD_BYTES` in `lib/images.ts` is a 10 MB
  server-side backstop for a request that skipped the browser.

  This is not only about storage. **Vercel rejects a request body over 4.5 MB
  at the platform edge**, before any of this code runs — so without shrinking
  first, a large photo could not be uploaded on the deployed site at all. That
  rejection arrives as the platform's own error page rather than our JSON, so
  the back office cannot explain it; `MAX_SEND_BYTES` (3.5 MB) is therefore a
  hard ceiling on what is put on the wire at all. If an image cannot be reduced
  below it, the upload is refused in the browser with a reason.

  Two things the encoder has to work around, both of which silently corrupted
  uploads before they were handled: `canvas.toBlob` **returns PNG when asked
  for a type it cannot write**, and a PNG of a 2560px photograph is several
  megabytes — larger than the original it was meant to shrink — so WebP support
  is probed on a 1x1 canvas first and JPEG used when it is absent. And
  `createImageBitmap` needs `imageOrientation: "from-image"`, or a phone's
  portrait photo decodes sideways and re-encoding drops the EXIF tag that would
  have corrected it, making the rotation permanent.
- **The serving URL carries a content hash** (`/api/images/hero?v=<hash>`) and
  that response is `immutable`, so the bytes at a URL can never change —
  replacing an image produces a new URL. Repeat views are answered by the CDN
  and the browser, so the database is read roughly once per edge node per image
  rather than once per page view. A bare URL without the hash stays
  revalidatable, so it can never pin a stale photo in a cache.

The blob column is never selected when listing — only when the bytes are
actually being served. A `findMany` that read it would pull every photograph
into memory.

If this outgrows the free tier, the swap is contained: `lib/images.ts` is the
only module that touches the bytes, and `getPhotoMap()` is the only thing the
pages call.

### Access

Set `ADMIN_PASSWORD` in `.env`. Without it the back office refuses every
request rather than opening itself to the internet — it does not fall back to
"no password". Optionally set `ADMIN_SECRET` so that changing the password does
not sign you out.

The session is a signed cookie with a fourteen-day expiry; there is no session
table and nothing to clean up. `middleware.ts` is the front door, and the route
handlers under `/api/admin` check the session again themselves.

> **Dev-mode note.** In `next dev`, Next inlines server-side values into the RSC
> payload for its DevTools, which means the raw contents of the store appear in
> the HTML of admin pages. This does not happen in a production build — verified
> against `next build && next start`. Do not run the back office in dev mode on a
> public address.

---

## Photography

29 images are wired and rendering through `next/image`. They are **licensed stock
photos from Unsplash** — see `public/images/CREDITS.md` — not photographs of Mohammed
or of the bars in his history.

Every slot lives in `lib/photos.ts`. To replace one, drop the new file into
`public/images/` and point that slot's `src` at it. No component or layout changes.
`SHOTLIST.md` lists what to shoot, at what crop, in priority order.

Two deliberate constraints while the photos are stock:

- **No identifiable faces in the hero or About slots.** A stranger's portrait next to
  his name reads as "this is me". Anonymous bars, hands and equipment do not.
- **Alt text describes the subject generically** — "a barista", "an espresso machine" —
  and never claims the person shown is him.

Both should change when real photos go in.

## Before this goes live

1. **Replace the stock photos** with real ones, starting with the eight priority
   shots in `SHOTLIST.md`. This is the single biggest upgrade available.

2. **Contact form.** `components/Contact.tsx` — the enquiry form on the home page —
   still validates and then tells the visitor to email directly. The setup form at
   `/services` is fully wired; this one is not. Point its `onSubmit` at a route
   handler under `app/api/` before launch, or drop it in favour of `/services`.

   **Set `ADMIN_PASSWORD` to something long** before the site is public. The value
   currently in `.env` is a development placeholder.

3. **Domain and OG image.** Set `metadataBase` in `app/layout.tsx` once there is a
   domain, and add an OG image.

---

## Accessibility and motion

Scroll reveals, the hero shot timer, the stat counters and the journey rail all respect
`prefers-reduced-motion: reduce`. Keyboard focus is visible throughout, the mobile nav
traps scroll and closes on `Escape`, and there is a skip link to `#main`.
