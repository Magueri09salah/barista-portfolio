/**
 * PHOTOGRAPHY SLOTS
 *
 * Currently filled with licensed stock photography from Unsplash
 * (see public/images/CREDITS.md). These are placeholders with a real
 * photographic feel — they are NOT photographs of Mohammed or of the
 * bars he has worked in.
 *
 * Because of that, the alt text below describes the subject generically
 * ("a barista", "an espresso machine") and never claims the person shown
 * is him. Keep it that way until the photos are replaced.
 *
 * REPLACING WITH REAL PHOTOS — see SHOTLIST.md:
 *   1. Save the photo to `public/images/` (overwrite the same filename)
 *   2. Update the `alt` here to describe what is actually in the frame
 *
 * No component or layout changes are needed either way. If a `src` is
 * blank, the site falls back to a warm gradient placeholder.
 */

export type PhotoSlot = { src: string; alt: string };

const slot = (src: string, alt: string): PhotoSlot => ({ src, alt });
const img = (file: string) => `/images/${file}`;

export const photos: Record<string, PhotoSlot> = {
  /* ---------------------------------------------------------- Headline
     Deliberately no identifiable faces: an anonymous bar reads as
     atmosphere, whereas a stranger's portrait would read as "this is me".
     ------------------------------------------------------------------ */
  hero: slot(img("hero-extraction.jpg"), "Espresso extracting into a glass on an espresso machine"),
  about: slot(img("about-craft.jpg"), "A barista's hands pouring latte art into a cup"),
  contact: slot(img("contact-bar.jpg"), "The counter of a specialty coffee bar"),

  /* ------------------------------------------ Journey — keyed by range */
  "Dec 2015 – Jan 2018": slot(img("journey-dubai.jpg"), "A hotel restaurant dining room"),
  "Apr 2018 – Dec 2018": slot(img("journey-breakfast.jpg"), "A bright dining room set for breakfast"),
  "Dec 2018 – Nov 2021": slot(img("journey-fine-dining.jpg"), "A fine dining room set for evening service"),
  "Dec 2021 – Jun 2022": slot(img("journey-first-bar.jpg"), "An espresso machine on a café bar"),
  "Jun 2022 – Oct 2022": slot(img("journey-rooftop.jpg"), "A café with large windows and daylight"),
  "Nov 2022 – May 2023": slot(img("journey-floor.jpg"), "A restaurant interior set for service"),
  "May 2023 – May 2024": slot(img("journey-brew-bar.jpg"), "A manual brew bar with pour-over equipment"),
  "May 2024 – Jul 2024": slot(img("journey-volume.jpg"), "Espresso extracting from a machine into a cup"),
  "Oct 2024 – Jun 2025": slot(img("journey-port.jpg"), "Fishing boats moored in a harbour"),
  "Jun 2025 – present": slot(img("journey-black-top.jpg"), "A dark, modern coffee bar with an espresso machine"),

  /* --------------------------------------------- Craft — keyed by code */
  ESP: slot(img("method-espresso.jpg"), "Two shots of espresso extracting into cups"),
  ART: slot(img("method-latte-art.jpg"), "Hands holding a cup with a rosetta poured into it"),
  V60: slot(img("method-v60-pour.jpg"), "Water being poured over coffee in a pour-over brewer"),
  CHX: slot(img("method-chemex.jpg"), "A Chemex brewer full of coffee on a table"),
  AER: slot(img("method-aeropress.jpg"), "Coffee being poured into a glass"),
  FRP: slot(img("method-french-press.jpg"), "Coffee brewing by immersion on a wooden surface"),
  CLD: slot(img("method-cold-brew.jpg"), "Iced cold brew coffee in a tall glass"),

  /* ------------------------------------- Gallery — keyed by tile title */
  "Portafilter, locked": slot(img("gallery-portafilter.jpg"), "A portafilter filled with ground coffee"),
  "Rosetta, free-poured": slot(img("gallery-rosetta.jpg"), "A rosetta poured into a cup, seen from above"),
  "V60, fourth pour": slot(img("gallery-v60.jpg"), "Water poured in a spiral over a pour-over brewer"),
  "Steam wand, wiped": slot(img("gallery-steam-wand.jpg"), "Steam rising from an espresso machine"),
  "Chemex, for the table": slot(img("gallery-chemex.jpg"), "Filter brewing equipment on a bar"),
  "Hands, ten years in": slot(img("gallery-hands.jpg"), "A barista's hands working with a portafilter"),
  "Group head, stripped": slot(img("gallery-group-head.jpg"), "The group head of an espresso machine"),
  "Cold brew, filtered": slot(img("gallery-cold-brew.jpg"), "A bottle of cold brew beside a filled glass"),
  "The bar, opening": slot(img("gallery-bar-open.jpg"), "An empty café bar before opening"),
};

/**
 * Returns the slot only once a real file has been set, so components fall
 * back to the gradient placeholder for any slot left blank.
 */
export function photo(key: string): PhotoSlot | undefined {
  const found = photos[key];
  return found && found.src ? found : undefined;
}
