/**
 * THE SETUP SERVICE CATALOGUE
 *
 * The five phases of opening a coffee shop, and what Mohammed can take on
 * inside each one. This is the single source of truth for three things:
 *
 *   1. the checkboxes on /services
 *   2. server-side validation of a submitted request
 *   3. how a request is rendered back in the back-office
 *
 * Because all three read from here, an id that is not in this file can never
 * be stored, and a stored id always has a label to render. Add a service by
 * adding it here — nothing else needs to change.
 *
 * IDS ARE PERMANENT. They are written into stored requests. Renaming an id
 * orphans every request that referenced it; changing a `label` is safe.
 */

export type ServiceItem = {
  /** Stable, stored on the request. Never rename. */
  id: string;
  label: string;
  /** The concrete deliverables, shown under the label on the card. */
  detail: string;
};

export type ServiceCategory = {
  id: string;
  /** Two-digit numeral shown on the step rail. */
  index: string;
  title: string;
  /** One line under the step title explaining what this phase decides. */
  blurb: string;
  items: ServiceItem[];
};

export const categories: ServiceCategory[] = [
  {
    id: "branding",
    index: "01",
    title: "Concept & Branding",
    blurb:
      "What the place is called, what it looks like, and how someone finds it before they have ever walked in.",
    items: [
      {
        id: "logo-identity",
        label: "Logo & brand identity",
        detail: "Name treatment, colour palette, typography, and the rules for using them",
      },
      {
        id: "packaging",
        label: "Packaging & cup design",
        detail: "Labels, printed cups, sleeves, takeaway bags",
      },
      {
        id: "print",
        label: "Flyers & print materials",
        detail: "Opening flyers, printed menu boards, business cards",
      },
      {
        id: "digital",
        label: "Website & digital presence",
        detail: "Website with ordering, social media setup, Google Maps listing",
      },
    ],
  },
  {
    id: "equipment",
    index: "02",
    title: "Bar Equipment & Tools",
    blurb:
      "Specifying the machines before you buy them. The wrong grinder costs more over a year than the right espresso machine.",
    items: [
      {
        id: "espresso-machine",
        label: "Espresso machine",
        detail: "Commercial 2-group or 3-group, sized to your expected covers",
      },
      {
        id: "grinders",
        label: "Espresso & filter grinders",
        detail: "On-demand grinders, separate burrs for espresso and filter",
      },
      {
        id: "water",
        label: "Water filtration system",
        detail: "Reverse osmosis or softener, specified to your local water",
      },
      {
        id: "manual-gear",
        label: "Manual brewing gear",
        detail: "V60 drip station, Chemex, AeroPress, scales, gooseneck kettle",
      },
      {
        id: "refrigeration",
        label: "Refrigeration & freezers",
        detail: "Under-counter fridges, ice machine, blender",
      },
      {
        id: "small-tools",
        label: "Small barista tools",
        detail: "Tampers, milk pitchers, knock-box, cleaning kit",
      },
    ],
  },
  {
    id: "menu",
    index: "03",
    title: "Menu & Recipe Standardization",
    blurb:
      "Turning good coffee into repeatable coffee — the same cup on a Tuesday morning as in a Saturday rush.",
    items: [
      {
        id: "espresso-menu",
        label: "Core espresso menu setup",
        detail: "Machine calibration, dialling-in recipes, the full espresso-based list",
      },
      {
        id: "filter-menu",
        label: "Manual brew & filter menu",
        detail: "Bean sourcing, brew ratios, method-by-method specs",
      },
      {
        id: "signature-drinks",
        label: "Signature & cold beverage development",
        detail: "Mocktails, cold brew, specialty matcha, seasonal drinks",
      },
      {
        id: "costing",
        label: "Costing & standardization",
        detail: "Recipe cards, doses, yields, cost per cup",
      },
    ],
  },
  {
    id: "space",
    index: "04",
    title: "Space, Layout & Fit-out",
    blurb:
      "Where everything physically goes. A bar layout is decided once and then lived with every shift for years.",
    items: [
      {
        id: "layout-3d",
        label: "3D layout & aesthetics",
        detail: "Floor plan, lighting scheme, colour and material direction",
      },
      {
        id: "ergonomics",
        label: "Bar ergonomics & workflow",
        detail: "Station design so one barista can work a rush without turning twice",
      },
      {
        id: "infrastructure",
        label: "Plumbing & electrical infrastructure",
        detail: "Water in and out, drainage, power outlet specification and loads",
      },
      {
        id: "furniture",
        label: "Seating & furniture selection",
        detail: "Tables, chairs, counter tops, covers per square metre",
      },
    ],
  },
  {
    id: "operations",
    index: "05",
    title: "Operations & Systems",
    blurb: "What keeps the place running on the days you are not standing in it.",
    items: [
      {
        id: "pos-hardware",
        label: "POS system setup",
        detail: "Till, receipt printer, card reader",
      },
      {
        id: "pos-software",
        label: "POS software configuration",
        detail: "Inventory management, menu upload, sales reporting",
      },
      {
        id: "hiring",
        label: "Barista hiring & staffing",
        detail: "Recruitment guidelines, job descriptions, trial shift structure",
      },
      {
        id: "training",
        label: "Staff training program",
        detail: "Extraction, milk texturing, customer service, station workflow",
      },
      {
        id: "maintenance",
        label: "Maintenance & hygiene protocols",
        detail: "Daily cleaning checklists, equipment care schedules",
      },
    ],
  },
];

/* ------------------------------------------------------- Qualification sets
   Stored as ids too, so the back-office can filter and sort on them.
   -------------------------------------------------------------------------- */

export const timelines = [
  { id: "3-months", label: "Within 3 months", detail: "Site secured, moving now" },
  { id: "6-months", label: "Within 6 months", detail: "Planning, not yet building" },
  { id: "12-months", label: "6 to 12 months", detail: "Early, but committed" },
  { id: "exploring", label: "Still an idea", detail: "Exploring whether to do it at all" },
];

export const budgets = [
  { id: "under-100k", label: "Under 100,000 MAD", detail: "Small bar, tight fit-out" },
  { id: "100-300k", label: "100,000 - 300,000 MAD", detail: "Standard independent cafe" },
  { id: "300-600k", label: "300,000 - 600,000 MAD", detail: "Full fit-out, quality equipment" },
  { id: "over-600k", label: "Over 600,000 MAD", detail: "Large site, or more than one" },
  { id: "unsure", label: "Not decided yet", detail: "Would like guidance on what it costs" },
];

/* ------------------------------------------------------------------ Lookups
   Built once at module load. The back-office renders stored ids through
   these, so a request always shows labels rather than raw ids.
   -------------------------------------------------------------------------- */

export const allItems: ServiceItem[] = categories.flatMap((category) => category.items);

export const itemById = new Map(allItems.map((item) => [item.id, item] as const));

export const categoryOfItem = new Map(
  categories.flatMap((category) => category.items.map((item) => [item.id, category] as const)),
);

export const categoryById = new Map(
  categories.map((category) => [category.id, category] as const),
);

export const timelineById = new Map(timelines.map((option) => [option.id, option] as const));

export const budgetById = new Map(budgets.map((option) => [option.id, option] as const));

export const totalServiceCount = allItems.length;
