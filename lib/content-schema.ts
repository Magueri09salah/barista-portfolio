/**
 * WHAT THE CONTENT EDITOR RENDERS.
 *
 * Thirteen sections with thirteen different shapes would mean thirteen bespoke
 * forms to write and maintain. Instead each section is described here, and one
 * generic editor renders every one of them.
 *
 * The cost of that trade is this file: when a field is added to lib/content.ts
 * it must be described here too, or it will not be editable. The benefit is
 * that adding a field is one entry rather than a new form.
 */

import type { SiteContent } from "./site-content";

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "select"
  | "checkbox"
  | "stringList"
  | "objectList";

export type Field = {
  /** Key on the item being edited. */
  key: string;
  label: string;
  type: FieldType;
  /** For `select`. */
  options?: string[];
  /** For `objectList` — the shape of each entry. */
  fields?: Field[];
  /** Shown under the input. */
  help?: string;
  /** Renders the field at full width in the two-column grid. */
  wide?: boolean;
};

export type SectionSchema = {
  id: keyof SiteContent;
  title: string;
  /** What this section is, in one line, for the editor's index. */
  blurb: string;
  /** Where it appears on the public site. */
  where: string;
} & (
  | { kind: "object"; fields: Field[] }
  | { kind: "list"; itemLabel: string; titleKey: string; fields: Field[] }
  | { kind: "stringList"; itemLabel: string }
);

const TONES = ["dark", "light", "gold", "base"];

/** Tone drives the gradient placeholder behind a photo, not the photo itself. */
const toneField = (): Field => ({
  key: "tone",
  label: "Tone",
  type: "select",
  options: TONES,
  help: "Colour of the fallback gradient behind the photo.",
});

export const sections: SectionSchema[] = [
  {
    id: "profile",
    title: "Profile & contact",
    blurb: "Name, role, city and every way of reaching you.",
    where: "Nav, hero, contact, footer",
    kind: "object",
    fields: [
      { key: "firstName", label: "First name", type: "text" },
      { key: "lastName", label: "Last name", type: "text" },
      { key: "role", label: "Role", type: "text", wide: true },
      { key: "city", label: "City", type: "text" },
      { key: "country", label: "Country", type: "text" },
      { key: "email", label: "Email", type: "text" },
      { key: "availability", label: "Availability", type: "text" },
      { key: "phone", label: "Phone (displayed)", type: "text" },
      {
        key: "phoneHref",
        label: "Phone (link)",
        type: "text",
        help: "Digits and + only — this is what tel: dials.",
      },
      { key: "whatsapp", label: "WhatsApp (displayed)", type: "text" },
      {
        key: "whatsappHref",
        label: "WhatsApp (link)",
        type: "text",
        help: "Digits only, no + and no spaces — e.g. 212617805866.",
      },
      { key: "linkedin", label: "LinkedIn URL", type: "text", wide: true },
      { key: "linkedinLabel", label: "LinkedIn label", type: "text", wide: true },
      {
        key: "houseRecipe",
        label: "House recipe spec line",
        type: "objectList",
        wide: true,
        help: "The 18 g in · 36 g out · 27 s · 93 °C device repeated across the site.",
        fields: [
          { key: "value", label: "Value", type: "text" },
          { key: "unit", label: "Unit", type: "text" },
        ],
      },
    ],
  },
  {
    id: "navLinks",
    title: "Navigation",
    blurb: "The links in the top bar, in order.",
    where: "Every page",
    kind: "list",
    itemLabel: "Link",
    titleKey: "label",
    fields: [
      { key: "label", label: "Label", type: "text" },
      {
        key: "href",
        label: "Target",
        type: "text",
        help: "/#about for a section on the home page, /services for a page.",
      },
      {
        key: "highlight",
        label: "Show as a gold button",
        type: "checkbox",
        wide: true,
      },
    ],
  },
  {
    id: "about",
    title: "About",
    blurb: "The opening paragraphs and the pull-quote.",
    where: "Home → About",
    kind: "object",
    fields: [
      {
        key: "paragraphs",
        label: "Paragraphs",
        type: "stringList",
        wide: true,
        help: "One entry per paragraph.",
      },
      { key: "closing", label: "Closing paragraph", type: "textarea", wide: true },
      { key: "quote.text", label: "Pull-quote", type: "textarea", wide: true },
      { key: "quote.source", label: "Quote attribution", type: "text", wide: true },
    ],
  },
  {
    id: "stats",
    title: "Statistics",
    blurb: "The counted figures under About.",
    where: "Home → About",
    kind: "list",
    itemLabel: "Statistic",
    titleKey: "label",
    fields: [
      { key: "value", label: "Number", type: "number", help: "Counts up on scroll." },
      { key: "suffix", label: "Suffix", type: "text", help: "+ or % — optional." },
      { key: "label", label: "Label", type: "text", wide: true },
    ],
  },
  {
    id: "principles",
    title: "Approach",
    blurb: "The numbered beliefs.",
    where: "Home → Approach",
    kind: "list",
    itemLabel: "Belief",
    titleKey: "title",
    fields: [
      { key: "index", label: "Eyebrow", type: "text", help: "e.g. Belief 01" },
      { key: "title", label: "Title", type: "text" },
      { key: "body", label: "Body", type: "textarea", wide: true },
    ],
  },
  {
    id: "milestones",
    title: "Journey",
    blurb: "The career timeline, oldest first.",
    where: "Home → Journey",
    kind: "list",
    itemLabel: "Milestone",
    titleKey: "place",
    fields: [
      { key: "year", label: "Year", type: "text" },
      {
        key: "range",
        label: "Date range",
        type: "text",
        help: "Also the key for this milestone's photo in lib/photos.ts — change both together.",
      },
      { key: "place", label: "Venue and city", type: "text" },
      { key: "role", label: "Role", type: "text" },
      { key: "title", label: "Headline", type: "text", wide: true },
      { key: "body", label: "Body", type: "textarea", wide: true },
      { key: "caption", label: "Photo caption", type: "text", wide: true },
      toneField(),
    ],
  },
  {
    id: "methods",
    title: "Craft — brewing methods",
    blurb: "The method cards, each with its spec.",
    where: "Home → Craft",
    kind: "list",
    itemLabel: "Method",
    titleKey: "name",
    fields: [
      {
        key: "code",
        label: "Code",
        type: "text",
        help: "Three letters. Also the photo key in lib/photos.ts.",
      },
      { key: "name", label: "Name", type: "text" },
      { key: "level", label: "Badge", type: "text", help: "Core, Daily, Manual brew…" },
      { key: "ratio", label: "Ratio", type: "text" },
      { key: "grind", label: "Grind", type: "text" },
      { key: "time", label: "Time", type: "text" },
      { key: "bestFor", label: "Best for", type: "text", wide: true },
      {
        key: "spec",
        label: "Spec line",
        type: "objectList",
        wide: true,
        fields: [
          { key: "value", label: "Value", type: "text" },
          { key: "unit", label: "Unit", type: "text" },
        ],
      },
      { key: "notes", label: "Tasting notes", type: "stringList", wide: true },
      { key: "body", label: "Body", type: "textarea", wide: true },
      toneField(),
    ],
  },
  {
    id: "skillGroups",
    title: "Skills",
    blurb: "Grouped skill lists.",
    where: "Home → Skills",
    kind: "list",
    itemLabel: "Group",
    titleKey: "title",
    fields: [
      { key: "title", label: "Group name", type: "text", wide: true },
      { key: "items", label: "Skills", type: "stringList", wide: true },
    ],
  },
  {
    id: "credentials",
    title: "Credentials",
    blurb: "Education, languages, machines, systems.",
    where: "Home → Credentials",
    kind: "list",
    itemLabel: "Credential",
    titleKey: "title",
    fields: [
      { key: "kind", label: "Category", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "detail", label: "Detail", type: "text", wide: true },
    ],
  },
  {
    id: "gallery",
    title: "Gallery",
    blurb: "The photo grid and its captions.",
    where: "Home → Gallery",
    kind: "list",
    itemLabel: "Tile",
    titleKey: "title",
    fields: [
      {
        key: "title",
        label: "Title",
        type: "text",
        help: "Also the photo key in lib/photos.ts — change both together.",
      },
      { key: "caption", label: "Caption", type: "text" },
      {
        key: "ratio",
        label: "Height",
        type: "number",
        help: "Relative tile height. 70 is short, 140 is tall.",
      },
      toneField(),
    ],
  },
  {
    id: "services",
    title: "What I do",
    blurb: "The six parts of the job.",
    where: "Home → What I do",
    kind: "list",
    itemLabel: "Service",
    titleKey: "title",
    fields: [
      { key: "type", label: "Eyebrow", type: "text", help: "e.g. Bar · daily" },
      { key: "title", label: "Title", type: "text" },
      { key: "body", label: "Body", type: "textarea", wide: true },
    ],
  },
  {
    id: "faqs",
    title: "FAQ",
    blurb: "Questions and answers.",
    where: "Home → FAQ",
    kind: "list",
    itemLabel: "Question",
    titleKey: "question",
    fields: [
      { key: "question", label: "Question", type: "text", wide: true },
      { key: "answer", label: "Answer", type: "textarea", wide: true },
    ],
  },
  {
    id: "enquiryTypes",
    title: "Enquiry types",
    blurb: "Options in the contact form's dropdown.",
    where: "Home → Contact",
    kind: "stringList",
    itemLabel: "Option",
  },
];

export const sectionById = new Map(sections.map((section) => [section.id as string, section]));

/** A blank item for a list section, so "Add" produces something editable. */
export function blankItem(section: SectionSchema): Record<string, unknown> {
  if (section.kind !== "list") return {};

  const item: Record<string, unknown> = {};
  for (const field of section.fields) {
    if (field.type === "number") item[field.key] = 0;
    else if (field.type === "checkbox") item[field.key] = false;
    else if (field.type === "stringList" || field.type === "objectList") item[field.key] = [];
    else if (field.type === "select") item[field.key] = field.options?.[0] ?? "";
    else item[field.key] = "";
  }
  return item;
}
