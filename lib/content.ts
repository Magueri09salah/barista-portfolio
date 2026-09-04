/**
 * All portfolio copy and data.
 *
 * SOURCE OF TRUTH: Mohammed Qasbili's CV. Every claim below is traceable to it.
 * Do not add awards, certifications, competition placings, published articles or
 * testimonials unless they are real and verifiable — this is a working portfolio
 * for a real person, and inventing credentials is worse than having fewer of them.
 *
 * The home street address from the CV is deliberately omitted: a public portfolio
 * should carry a city, an email and a phone number, not someone's front door.
 */

export const profile = {
  firstName: "Mohammed",
  lastName: "Qasbili",
  role: "Barista & Hospitality Professional",
  city: "Safi",
  country: "Morocco",
  email: "qasbilimohamed95@outlook.fr",
  phone: "+212 675 398 987",
  phoneHref: "+212675398987",
  /** WhatsApp business line — the number people actually reach him on. */
  whatsapp: "+212 617 805 866",
  /** wa.me wants digits only, no plus, no spaces. */
  whatsappHref: "212617805866",
  linkedin: "https://linkedin.com/in/qasbili-mohamed",
  linkedinLabel: "linkedin.com/in/qasbili-mohamed",
  availability: "Open to opportunities",
  /** Standard espresso recipe — the signature spec line repeated across the site. */
  houseRecipe: [
    { value: "18", unit: "g in" },
    { value: "36", unit: "g out" },
    { value: "27", unit: "s" },
    { value: "93", unit: "°C" },
  ],
} as const;

/**
 * Hrefs are rooted at "/" rather than bare hashes so the nav also works from
 * /services, where "#about" would resolve to nothing.
 */
export type NavLink = { href: string; label: string; highlight?: boolean };

export const navLinks: NavLink[] = [
  { href: "/#about", label: "About" },
  { href: "/#philosophy", label: "Approach" },
  { href: "/#journey", label: "Journey" },
  { href: "/#craft", label: "Craft" },
  { href: "/#skills", label: "Skills" },
  { href: "/#credentials", label: "Credentials" },
  { href: "/services", label: "Open a café", highlight: true },
  { href: "/#contact", label: "Contact" },
];

/* ---------------------------------------------------------------- About */

export const aboutParagraphs = [
  "I started in hospitality at the end of 2015, carrying plates at the Ramee Royal in Dubai. Fifty guests a shift, a POS I had to learn on the floor, and no interest yet in what was coming out of the coffee machine behind me. The bar came later, and it came from the service side — which I think is the right order.",
  "I came home to Safi in 2018, and by 2021 I had moved fully behind the coffee bar — first at Tifaouine, then through Le Rooftop, Ocean and Korten. Those years were about volume: a hundred drinks a day, peak hours that do not forgive a slow hand, and machines that only stay accurate if somebody cleans them properly every single night.",
];

export const aboutClosing =
  "Today I am at Black Top in Safi, working on espresso extraction, latte art and manual brewing — V60, Chemex, cold brew — and building seasonal drinks for the menu. Ten years in, my ambition is simple and unglamorous: make the good cup repeatable, and leave every bar I work in running better than I found it.";

export const aboutQuote = {
  text: "Anyone can pull one good shot. The job is pulling the hundredth one of the day to the same standard, with the same welcome at the counter.",
  source: "What eight years of high-volume service taught me",
};

export type Stat = { value: number; suffix?: string; label: string };

/** Every figure below comes directly from the CV. */
export const stats: Stat[] = [
  { value: 10, label: "Years in hospitality, since 2015" },
  { value: 9, label: "Venues worked, Dubai and Safi" },
  { value: 100, suffix: "+", label: "Drinks prepared daily" },
  { value: 9, suffix: "+", label: "Colleagues trained" },
  { value: 16, suffix: "%", label: "Beverage sales increase at La Trattoria" },
  { value: 3, label: "Languages spoken" },
];

/* ------------------------------------------------------------- Approach */

export type Principle = { index: string; title: string; body: string };

export const principles: Principle[] = [
  {
    index: "Belief 01",
    title: "Consistency beats brilliance",
    body: "A hundred drinks a day means a hundred chances to be inconsistent. I would rather be the barista whose tenth flat white tastes exactly like the first than the one who occasionally produces something spectacular and often does not. Repeatability is the actual skill, and it is the one that shows up on a busy Saturday.",
  },
  {
    index: "Belief 02",
    title: "The machine is half the recipe",
    body: "Backflushing, group gaskets, burr cleanliness, purge routines. I have maintained La Marzocco and Nuova Simonelli machines daily for years, and I have watched cafés blame their beans for problems that were really three weeks of skipped cleaning. Equipment care is not maintenance work sitting next to the craft — it is part of it.",
  },
  {
    index: "Belief 03",
    title: "Teach it or it leaves with you",
    body: "I have trained more than nine people on drink recipes and service standards, and the ones who learned properly kept the standard alive on shifts I was not working. A bar that depends on one person is fragile. Writing the recipe down and teaching it well is how quality survives a rota change.",
  },
  {
    index: "Belief 04",
    title: "I came from the floor, not the bar",
    body: "Seven of my ten years were spent waiting tables — hotel service at the Ramee Royal in Dubai, then fine dining at La Trattoria back in Safi. That background is why I read a room before I read a ticket. The extraction gets someone to the second cup; how they were treated decides whether there is a second visit.",
  },
];

/* ------------------------------------------------------------- Journey */

export type Milestone = {
  year: string;
  range: string;
  place: string;
  role: string;
  title: string;
  body: string;
  tone: "dark" | "light" | "gold" | "base";
  caption: string;
};

/** Chronological, straight from the CV's work history. */
export const milestones: Milestone[] = [
  {
    year: "2015",
    range: "Dec 2015 – Jan 2018",
    place: "Ramee Royal, Dubai",
    role: "Waiter",
    title: "Where hospitality started",
    body: "Two years of hotel service in Dubai, table service for more than fifty guests a shift. Learned the POS, learned cash and card handling, and learned that speed without accuracy is just a different kind of slow.",
    tone: "dark",
    caption: "Hotel service, Dubai",
  },
  {
    year: "2018",
    range: "Apr 2018 – Dec 2018",
    place: "Riyad Pêcheur, Safi",
    role: "Waiter",
    title: "Solo shifts",
    body: "Ran off-hours service alone while holding the same standard as a full team. Memorised more than twelve variations of the all-day breakfast so orders never waited on me checking a sheet.",
    tone: "base",
    caption: "Breakfast service",
  },
  {
    year: "2018",
    range: "Dec 2018 – Nov 2021",
    place: "La Trattoria, Safi",
    role: "Waiter · fine dining",
    title: "Three years in fine dining",
    body: "Nineteen tables a shift with attentive service throughout. Grew beverage sales by sixteen percent through wine and cocktail recommendations, and trained three new starters on the service standard.",
    tone: "gold",
    caption: "Fine dining floor",
  },
  {
    year: "2021",
    range: "Dec 2021 – Jun 2022",
    place: "Tifaouine, Safi",
    role: "Barista & waiter",
    title: "Crossing to the bar",
    body: "First coffee-focused role. Prepared and served the full beverage range with consistency, operated and maintained espresso machines and grinders, and kept running the till alongside it.",
    tone: "light",
    caption: "First bar",
  },
  {
    year: "2022",
    range: "Jun 2022 – Oct 2022",
    place: "Le Rooftop, Safi",
    role: "Barista",
    title: "Peak-hour volume",
    body: "Managed high-volume orders through the busiest hours of service. Trained new staff on preparation and customer service protocols, and grew sales by upselling bakery items and seasonal drinks.",
    tone: "dark",
    caption: "Rooftop service",
  },
  {
    year: "2022",
    range: "Nov 2022 – May 2023",
    place: "Calypso, Safi",
    role: "Waiter",
    title: "Back on the floor",
    body: "High-volume table service and guest engagement. Worked across Toast, Micros and Square, and held food safety standards through the whole shift rather than only at inspection time.",
    tone: "base",
    caption: "Front of house",
  },
  {
    year: "2023",
    range: "May 2023 – May 2024",
    place: "Ocean, Safi",
    role: "Barista",
    title: "The methods opened up",
    body: "A year of espresso, latte art and manual brewing — pour over, AeroPress and cold brew. Handled order management and cash on the POS, and contributed to menu development and seasonal specials.",
    tone: "gold",
    caption: "Manual brew bar",
  },
  {
    year: "2024",
    range: "May 2024 – Jul 2024",
    place: "Korten, Safi",
    role: "Barista",
    title: "A hundred drinks a day",
    body: "Prepared more than a hundred drinks daily at consistent quality. Trained over six new hires on recipes and service standards, maintained the La Marzocco and Nuova Simonelli machines every day, and built seasonal drinks that stayed on the menu.",
    tone: "dark",
    caption: "Espresso bar, service",
  },
  {
    year: "2024",
    range: "Oct 2024 – Jun 2025",
    place: "STE NJM Trading, Safi",
    role: "Security",
    title: "Eight months off the bar",
    body: "Maritime threat identification and emergency response coordination, incident reporting and security equipment operation. Not coffee — but a period that sharpened how I read a room and stay calm when something goes wrong in it.",
    tone: "base",
    caption: "Port operations",
  },
  {
    year: "2025",
    range: "Jun 2025 – present",
    place: "Black Top, Safi",
    role: "Barista",
    title: "Where I am now",
    body: "Focused on espresso extraction and latte art, working across V60, Chemex and cold brew, and developing seasonal signature drinks for the menu.",
    tone: "gold",
    caption: "Current bar, Safi",
  },
];

/* ----------------------------------------------------------------- Craft
   The methods actually listed on the CV. Ratios and temperatures are standard
   specialty practice, not claimed personal records.
   ------------------------------------------------------------------------ */

export type Method = {
  code: string;
  name: string;
  level: "Core" | "Daily" | "Manual brew";
  spec: { value: string; unit: string }[];
  notes: string[];
  body: string;
  ratio: string;
  grind: string;
  time: string;
  bestFor: string;
  tone: "dark" | "light" | "gold" | "base";
};

export const methods: Method[] = [
  {
    code: "ESP",
    name: "Espresso",
    level: "Core",
    spec: [
      { value: "18", unit: "g in" },
      { value: "36", unit: "g out" },
      { value: "27", unit: "s" },
    ],
    notes: ["Sweetness", "Body", "Balance"],
    body: "The reference every other drink on the bar is built from. A 1:2 ratio pulled to roughly twenty-seven seconds, dialled in at the start of every shift and checked again when the room warms up.",
    ratio: "1:2",
    grind: "Fine",
    time: "25–30 s",
    bestFor: "The base of the whole menu",
    tone: "dark",
  },
  {
    code: "ART",
    name: "Latte Art",
    level: "Daily",
    spec: [
      { value: "62", unit: "°C milk" },
      { value: "0.4", unit: "s wipe" },
      { value: "1", unit: "free pour" },
    ],
    notes: ["Rosetta", "Tulip", "Heart"],
    body: "Free-poured, never etched. Good art is really evidence of good milk — texture it correctly and the pattern follows. Steam wand wiped and purged between every single drink.",
    ratio: "1:3 milk",
    grind: "—",
    time: "Immediate",
    bestFor: "Flat white, cappuccino, latte",
    tone: "light",
  },
  {
    code: "V60",
    name: "Hario V60",
    level: "Manual brew",
    spec: [
      { value: "15", unit: "g" },
      { value: "250", unit: "ml" },
      { value: "2:45", unit: "" },
    ],
    notes: ["Clarity", "Aroma", "Light body"],
    body: "The cleanest cup on the bar. Multiple pours, a controlled bloom and an even bed — best suited to lighter roasts where the aromatics are the point.",
    ratio: "1:16",
    grind: "Medium-fine",
    time: "2:30–3:00",
    bestFor: "Light roasts, single origin",
    tone: "gold",
  },
  {
    code: "CHX",
    name: "Chemex",
    level: "Manual brew",
    spec: [
      { value: "42", unit: "g" },
      { value: "700", unit: "ml" },
      { value: "4:30", unit: "" },
    ],
    notes: ["Clean", "Sweet", "Generous"],
    body: "Built for a table rather than a tasting flight. The thicker filter strips out oils and gives a rounded, forgiving cup that still reads well as it cools.",
    ratio: "1:16",
    grind: "Medium-coarse",
    time: "4:00–5:00",
    bestFor: "Sharing, slower service",
    tone: "base",
  },
  {
    code: "AER",
    name: "AeroPress",
    level: "Manual brew",
    spec: [
      { value: "16", unit: "g" },
      { value: "220", unit: "ml" },
      { value: "1:30", unit: "" },
    ],
    notes: ["Concentrated", "Smooth", "Low acidity"],
    body: "Fast, consistent and almost impossible to ruin once the recipe is set. The method I reach for when a guest wants something strong without the bitterness a long espresso can bring.",
    ratio: "1:14",
    grind: "Medium-fine",
    time: "1:15–2:00",
    bestFor: "Single cups, quick turnaround",
    tone: "dark",
  },
  // {
  //   code: "FRP",
  //   name: "French Press",
  //   level: "Manual brew",
  //   spec: [
  //     { value: "30", unit: "g" },
  //     { value: "500", unit: "ml" },
  //     { value: "4:00", unit: "" },
  //   ],
  //   notes: ["Full body", "Rich", "Rounded"],
  //   body: "Full immersion, no paper, all the oils left in. Break the crust at four minutes, skim, then let it settle before pouring — most of the sediment complaints come from pressing too hard, too early.",
  //   ratio: "1:16",
  //   grind: "Coarse",
  //   time: "4:00",
  //   bestFor: "Darker roasts, groups",
  //   tone: "light",
  // },
  {
    code: "CLD",
    name: "Cold Brew",
    level: "Manual brew",
    spec: [
      { value: "1:12", unit: "" },
      { value: "18", unit: "h" },
      { value: "4", unit: "°C" },
    ],
    notes: ["Molasses", "Low acid", "Sweet"],
    body: "Steeped cold from the start rather than diluted down from hot. Prepared the night before, filtered in the morning and served over ice — a summer staple in Safi and the easiest sell on a hot afternoon.",
    ratio: "1:12",
    grind: "Coarse",
    time: "18 hours",
    bestFor: "Summer service, iced menu",
    tone: "gold",
  },
];

/* -------------------------------------------------------------- Skills
   Grouped exactly as the CV groups them. No invented proficiency scores.
   ---------------------------------------------------------------------- */

export type SkillGroup = { title: string; items: string[] };

export const skillGroups: SkillGroup[] = [
  {
    title: "Coffee preparation",
    items: ["Espresso", "V60", "Chemex", "Pour-over", "French press", "AeroPress", "Cold brew"],
  },
  {
    title: "Customer service",
    items: ["Latte art", "Beverage presentation", "Order management", "Menu knowledge", "Upselling"],
  },
  {
    title: "Operations",
    items: ["Toast", "Micros", "Square", "Inventory management", "Cash handling"],
  },
  {
    title: "Equipment maintenance",
    items: ["La Marzocco", "Nuova Simonelli", "Daily cleaning", "Grinder calibration"],
  },
  {
    title: "Collaboration",
    items: ["Staff training", "Teamwork", "Multitasking", "Peak-hour coordination"],
  },
  {
    title: "Languages",
    items: ["Arabic — native", "English — professional", "French — professional"],
  },
];

/* --------------------------------------------------------- Credentials */

export type Credential = { kind: string; title: string; detail: string };

export const credentials: Credential[] = [
  {
    kind: "Education",
    title: "High school diploma — Science Physics",
    detail: "Iben Khaldoun School · Safi · 2013",
  },
  {
    kind: "Languages",
    title: "Arabic · English · French",
    detail: "Native · Professional · Professional",
  },
  {
    kind: "Machines",
    title: "La Marzocco · Nuova Simonelli",
    detail: "Daily maintenance, cleaning and calibration",
  },
  {
    kind: "Brew bar",
    title: "V60 · Chemex · AeroPress · French press · Cold brew",
    detail: "Manual brewing across seven methods",
  },
  {
    kind: "Systems",
    title: "Toast · Micros · Square",
    detail: "Order management, cash handling, inventory",
  },
];

/* ------------------------------------------------------------- Gallery */

export type Tile = {
  title: string;
  caption: string;
  ratio: number;
  tone: "dark" | "light" | "gold" | "base";
};

export const gallery: Tile[] = [
  { title: "Portafilter, locked", caption: "Morning dial-in before service", ratio: 130, tone: "dark" },
  { title: "Rosetta, free-poured", caption: "Never etched", ratio: 75, tone: "light" },
  { title: "V60, fourth pour", caption: "Even bed, controlled bloom", ratio: 100, tone: "gold" },
  { title: "Steam wand, wiped", caption: "Between every drink. No exceptions.", ratio: 120, tone: "base" },
  { title: "Chemex, for the table", caption: "700ml, four and a half minutes", ratio: 80, tone: "dark" },
  { title: "Hands, ten years in", caption: "Burns are part of the CV", ratio: 140, tone: "gold" },
  { title: "Group head, stripped", caption: "Gaskets checked, screens cleaned", ratio: 90, tone: "light" },
  { title: "Cold brew, filtered", caption: "Eighteen hours at 4°C", ratio: 110, tone: "base" },
  { title: "The bar, opening", caption: "Safi, before the first guest", ratio: 70, tone: "dark" },
];

/* ------------------------------------------------------------ Services */

export type Service = { type: string; title: string; body: string };

export const services: Service[] = [
  {
    type: "Bar · daily",
    title: "Service at volume",
    body: "More than a hundred drinks a day at consistent quality, through peak hours, without letting the standard slip as the queue grows.",
  },
  {
    type: "Team · ongoing",
    title: "Training new staff",
    body: "Trained over nine colleagues across four venues on drink recipes, machine handling and the service standard — so quality holds on shifts I am not working.",
  },
  {
    type: "Menu · seasonal",
    title: "Recipe and menu development",
    body: "Built seasonal signature drinks at Black Top, Korten and Ocean. Several stayed on as menu staples after the season ended.",
  },
  {
    type: "Equipment · daily",
    title: "Machine maintenance",
    body: "Daily cleaning, backflushing and upkeep of La Marzocco and Nuova Simonelli machines, plus grinder calibration and routine checks.",
  },
  {
    type: "Floor · seven years",
    title: "Front of house",
    body: "Nineteen tables a shift in fine dining in Safi, fifty-plus guests a shift in hotel service in Dubai. Table service, guest engagement and food safety held through the whole shift.",
  },
  {
    type: "Till · daily",
    title: "POS, cash and stock",
    body: "Toast, Micros and Square. Order management, cash and card handling, and inventory counts that reconcile at the end of the night.",
  },
];

/* ----------------------------------------------------------------- FAQ */

export type Faq = { question: string; answer: string };

export const faqs: Faq[] = [
  {
    question: "Are you available for work?",
    answer:
      "I am currently a barista at Black Top in Safi and open to the right opportunity — full-time bar work, an opening team, or a role with room to develop a menu. The fastest way to reach me is email or phone.",
  },
  {
    question: "Do you hold specialty coffee certifications?",
    answer:
      "Not yet. Everything on this site comes from ten years of paid work on the floor and behind the bar rather than a classroom, and I would rather say that plainly than imply otherwise. SCA Barista Skills certification is the next thing I want to complete.",
  },
  {
    question: "Which machines and systems have you worked on?",
    answer:
      "La Marzocco and Nuova Simonelli espresso machines, maintained and cleaned daily rather than weekly. On the till: Toast, Micros and Square, including cash handling and inventory.",
  },
  {
    question: "Can you train a team with no specialty experience?",
    answer:
      "Yes, and it is some of the work I enjoy most. I have trained more than nine people across four venues, starting from why the scale matters and finishing with staff who can dial in and hold the standard on their own.",
  },
  {
    question: "Which languages do you work in?",
    answer:
      "Arabic is my native language, and I work professionally in both English and French — useful on a bar in Safi, where a shift can move between all three in the same hour.",
  },
  {
    question: "What are you working on at the moment?",
    answer:
      "Sharpening espresso extraction and latte art at Black Top, and widening the manual brew offering — V60, Chemex and cold brew — alongside seasonal drinks for the menu.",
  },
];

export const enquiryTypes = [
  "A barista role",
  "Team training",
  "Menu or recipe development",
  "Event or private service",
  "Something else",
];
