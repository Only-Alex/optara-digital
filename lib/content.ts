export type HeadingWord = { text: string; italic?: boolean };

export type NavItem = { label: string; href: string };

export type Service = {
  index: string;
  name: string;
  description: string;
  tags: string[];
};

export type CaseStudy = {
  index: string;
  client: string;
  sector: string;
  result: string;
  detail: string;
  image: string;
  alt: string;
};

export type ProofStat = {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
};

export type ProcessStep = {
  index: string;
  name: string;
  description: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

export const site = {
  name: "Opti Reach",
  tagline: "Performance media, brand and content for challenger DTC brands",
  description:
    "Opti Reach is a performance media, brand strategy and content agency for DTC brands doing £5M to £50M. We measure work against contribution margin, not impressions.",
  url: "https://optireach.com",
  email: "hello@optireach.com",
  founded: "2016",
} as const;

export const nav: NavItem[] = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Studio", href: "#studio" },
  { label: "Contact", href: "#contact" },
];

export const hero = {
  lines: [
    [{ text: "We make brands" }],
    [{ text: "impossible", italic: true }],
    [{ text: "to scroll past." }],
  ] as HeadingWord[][],
  standfirst:
    "We run paid media, brand strategy and content as one system for DTC brands doing £5M to £50M, and we report on margin instead of impressions.",
  meta: [
    `Est. ${site.founded}`,
    "London · New York",
    "Performance · Brand · Content",
    "Scroll ↓",
  ],
};

export const manifesto = {
  eyebrow: "01 — Why us",
  lead: [
    { text: "Most agencies sell you reach. Reach is cheap. What costs money is " },
    { text: "attention", accent: true },
    {
      text: " that converts, and the discipline to keep buying it profitably at scale. We run media, brand and content as one system, measured against contribution margin. Nine years in, our average client relationship runs 31 months. That number is the whole pitch.",
    },
  ] as { text: string; accent?: boolean }[],
  refusalsTitle: "What we refuse to do",
  refusals: [
    "Take a retainer we cannot beat with a spreadsheet.",
    "Report on impressions, reach or engagement rate.",
    "Ship creative we would not put our own name against.",
    "Work with more than twelve clients at a time.",
  ],
};

export const services: Service[] = [
  {
    index: "01",
    name: "Performance media",
    description:
      "We buy attention across Meta, Google, TikTok and retail media, and hold every pound against a contribution margin target you set.",
    tags: ["Paid social", "Search & shopping", "Retail media"],
  },
  {
    index: "02",
    name: "Brand strategy",
    description:
      "Positioning, messaging and identity built to survive a crowded shelf and a sceptical buyer who already has four other options.",
    tags: ["Positioning", "Messaging", "Identity"],
  },
  {
    index: "03",
    name: "Content & production",
    description:
      "Studio and creator production built for volume, so the media team never runs out of new work to put into test.",
    tags: ["Studio", "Creator & UGC", "Motion"],
  },
  {
    index: "04",
    name: "Lifecycle & CRM",
    description:
      "Email, SMS and retention flows that turn a first order into a third one without discounting your margin away to nothing.",
    tags: ["Email", "SMS", "Retention"],
  },
];

export const work = {
  eyebrow: "02 — Selected work",
  title: "Four brands, four numbers.",
  cases: [
    {
      index: "01",
      client: "Halden",
      sector: "Performance footwear",
      result: "+312% ROAS in 90 days",
      detail:
        "Cut spend by half in week two, rebuilt the creative pipeline, then scaled back up against a fixed margin floor.",
      image: "/work/case-01.png",
      alt: "Halden campaign photography, a runner mid-stride on wet asphalt",
    },
    {
      index: "02",
      client: "Bower & Vale",
      sector: "Home fragrance",
      result: "£4.1M net new revenue",
      detail:
        "Repositioned from gifting to everyday ritual, then built a lifecycle programme around the second and third purchase.",
      image: "/work/case-02.png",
      alt: "Bower & Vale product photography, a candle on a linen surface",
    },
    {
      index: "03",
      client: "Otter Labs",
      sector: "Consumer tech",
      result: "CAC down 41% at 2x spend",
      detail:
        "Moved budget out of branded search, rebuilt attribution against contribution margin, and doubled creative volume.",
      image: "/work/case-03.png",
      alt: "Otter Labs product photography, a hardware device on a plain field",
    },
    {
      index: "04",
      client: "Sable",
      sector: "Skincare",
      result: "Repeat rate 18% to 34%",
      detail:
        "One year of retention work: replenishment flows, a subscription rebuild, and creative aimed only at existing buyers.",
      image: "/work/case-04.png",
      alt: "Sable campaign photography, a serum bottle held in one hand",
    },
  ] as CaseStudy[],
};

export const proof = {
  eyebrow: "03 — Proof",
  title: "The numbers we are judged on.",
  stats: [
    { value: 82, prefix: "£", suffix: "M", label: `Media managed since ${site.founded}` },
    { value: 31, suffix: "", label: "Average client months" },
    { value: 4.2, suffix: "x", decimals: 1, label: "Blended ROAS, trailing 12 months" },
    { value: 12, suffix: "", label: "Clients at any one time" },
  ] as ProofStat[],
};

export const process = {
  eyebrow: "04 — Process",
  title: "How the work runs.",
  steps: [
    {
      index: "01",
      name: "Audit",
      description:
        "Two weeks inside your accounts, your data and your P&L. You keep the findings whether or not you go on to hire us.",
    },
    {
      index: "02",
      name: "Plan",
      description:
        "A media, creative and lifecycle plan with a contribution margin target attached to every single line of spend.",
    },
    {
      index: "03",
      name: "Build",
      description:
        "Creative into production, tracking rebuilt, flows written. Most accounts are live within 30 days of signing.",
    },
    {
      index: "04",
      name: "Compound",
      description:
        "Weekly testing against the target, monthly against the P&L, and every quarter we re-cut the whole plan from scratch.",
    },
  ] as ProcessStep[],
};

export const testimonials = {
  eyebrow: "05 — Clients",
  items: [
    {
      quote:
        "They killed half our spend in week two and revenue went up. No other agency we spoke to would have made that call.",
      name: "Priya Raghunathan",
      role: "Founder, Halden",
    },
    {
      quote:
        "The first team we have worked with that opens the conversation with margin instead of a dashboard full of impressions.",
      name: "Tom Ellery",
      role: "CMO, Bower & Vale",
    },
    {
      quote:
        "We have been through four agencies in six years. This is the only one that read the P&L before it read the ad account.",
      name: "Marisol Vega",
      role: "CEO, Sable",
    },
  ] as Testimonial[],
};

export const contact = {
  eyebrow: "06 — Contact",
  title: [
    { text: "Tell us what" },
    { text: "isn't working." },
  ] as HeadingWord[],
  standfirst:
    "We take on four new clients a year. If the fit is wrong we will say so in the first call rather than the third month.",
  email: site.email,
  budgets: [
    "£10k — £25k / month",
    "£25k — £50k / month",
    "£50k — £100k / month",
    "£100k+ / month",
    "Not sure yet",
  ],
};

export const footer = {
  columns: [
    {
      title: "Site",
      links: nav,
    },
    {
      title: "Social",
      links: [
        { label: "LinkedIn", href: "https://www.linkedin.com" },
        { label: "Instagram", href: "https://www.instagram.com" },
        { label: "X", href: "https://x.com" },
      ] as NavItem[],
    },
  ],
  offices: [
    { city: "London", lines: ["12 Charlotte Road", "London EC2A 3PB"] },
    { city: "New York", lines: ["55 Washington Street", "Brooklyn, NY 11201"] },
  ],
};
