# Shot list

Everything the site needs, in the order it matters. **The first eight cover the
whole page** — the rest of the slots fall back to gradient placeholders and still
look deliberate, so shoot the priority set first and add the others over time.

All of this is one shift's work with a phone. Do not hire a photographer yet.

## How to add a photo

1. Save the file to `public/images/` with the filename below
2. Open `lib/photos.ts` and set that slot's `src` to `"/images/<filename>"`
3. Done — `next/image` handles sizing, lazy loading and modern formats

---

## Shooting rules

The whole site is warm ivory, espresso brown and gold. Photos that fight that
palette will look wrong no matter how sharp they are.

- **Light:** daylight from a window, side-on. Never overhead fluorescents, never flash.
- **Time:** early morning or late afternoon. Hard midday light kills the warmth.
- **Background:** wood, concrete, ceramic, brushed steel. Keep it uncluttered.
- **Avoid:** anything with a competing brand logo, colourful plastic, a messy bar back.
- **Format:** JPEG, longest edge 2400px, quality ~80. Under 500 KB each.
- **Orientation:** matters — it is listed per shot below.

Shoot every frame **three times**: one wide, one medium, one close. You will want
the options later, and it costs nothing.

---

## Priority — shoot these eight first

| # | File | Slot key | Orientation | What to shoot |
|---|---|---|---|---|
| 1 | `hero-portrait.jpg` | `hero` | **Portrait 3:4** | You at the machine, mid-task, looking at the coffee — not at the camera. Waist up. This is the first thing anyone sees. |
| 2 | `about-portrait.jpg` | `about` | **Portrait 3:4** | You looking at the camera, arms relaxed, bar behind you. Calm and direct. |
| 3 | `contact-bar.jpg` | `contact` | **Portrait 4:5** | The bar at the end of service — clean surfaces, one cup left out. |
| 4 | `espresso-extraction.jpg` | `ESP` | Portrait 4:5 | Espresso running from a naked portafilter. Get low, shoot the stream. |
| 5 | `latte-art.jpg` | `ART` | Portrait 4:5 | Top-down, a finished rosetta. Fill the frame with the cup. |
| 6 | `v60-pour.jpg` | `V60` | Portrait 4:5 | Kettle mid-pour over the V60, steam visible against a dark background. |
| 7 | `black-top-bar.jpg` | `Jun 2025 – present` | Landscape 4:3 | The bar where you work now, lights on, before opening. |
| 8 | `portafilter-locked.jpg` | `Portafilter, locked` | Portrait 13:10 | Close on the group head with the portafilter locked in. |

---

## Craft — the remaining four methods

Landscape or portrait 4:5, each mid-action rather than a static object.

| File | Slot key | What to shoot |
|---|---|---|
| `chemex.jpg` | `CHX` | A full Chemex on wood, two cups beside it |
| `aeropress.jpg` | `AER` | Hands pressing an AeroPress into a cup |
| `french-press.jpg` | `FRP` | The crust broken, coffee settling, spoon resting |
| `cold-brew.jpg` | `CLD` | Cold brew poured over ice, condensation on the glass |

---

## Journey — one per role

Landscape 4:3. These sit small on the page, so atmosphere beats detail. If a
venue is closed to you now, shoot something that stands for the work instead —
a dining room, a port, a breakfast service.

| File | Slot key | Subject |
|---|---|---|
| `journey-dubai.jpg` | `Dec 2015 – Jan 2018` | Hotel restaurant service, Dubai |
| `journey-breakfast.jpg` | `Apr 2018 – Dec 2018` | Breakfast service laid out |
| `journey-fine-dining.jpg` | `Dec 2018 – Nov 2021` | Dining room set for evening |
| `journey-first-bar.jpg` | `Dec 2021 – Jun 2022` | An espresso machine and grinder |
| `journey-rooftop.jpg` | `Jun 2022 – Oct 2022` | A rooftop bar in service |
| `journey-floor.jpg` | `Nov 2022 – May 2023` | A restaurant floor set for lunch |
| `journey-brew-bar.jpg` | `May 2023 – May 2024` | A manual brew bar setup |
| `journey-volume.jpg` | `May 2024 – Jul 2024` | A double espresso extracting |
| `journey-port.jpg` | `Oct 2024 – Jun 2025` | The port at Safi |

---

## Gallery — texture and detail

Mixed orientation; the masonry layout handles any ratio. This is where the site
earns its atmosphere, so favour close, tactile frames over wide ones.

| File | Slot key |
|---|---|
| `gallery-rosetta.jpg` | `Rosetta, free-poured` |
| `gallery-v60.jpg` | `V60, fourth pour` |
| `gallery-steam-wand.jpg` | `Steam wand, wiped` |
| `gallery-chemex.jpg` | `Chemex, for the table` |
| `gallery-hands.jpg` | `Hands, ten years in` |
| `gallery-group-head.jpg` | `Group head, stripped` |
| `gallery-cold-brew.jpg` | `Cold brew, filtered` |
| `gallery-bar-open.jpg` | `The bar, opening` |

---

## A note on sourcing

These should be **your** photographs, of **your** bar and **your** work.

The site says "Rosetta, free-poured — never etched" and "Hands, ten years in".
A stock photo or an AI-generated image under those captions is a claim about
your craft that is not true, and it is exactly the kind of thing a manager
notices in an interview. Real photos taken on a phone in good window light will
serve you better than perfect images of someone else's coffee.

Stock is defensible for the Journey venues you can no longer access — a hotel
dining room standing in for Dubai in 2016 is a location, not a claim about your
skill. Use [Unsplash](https://unsplash.com) or [Pexels](https://pexels.com) for
those, and only those.
