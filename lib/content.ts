export type NavItem = { label: string; href: string };

export type Service = {
  index: string;
  name: string;
  description: string;
  tags: string[];
};

export type CaseResult = {
  client: string;
  sector: string;
  headline: string;
  detail: string;
  services: string[];
};

export type Stat = {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
  client: string;
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
  shortName: "optireach",
  tagline: "UK digital marketing agency",
  description:
    "Opti Reach is a UK digital marketing agency combining SEO, paid advertising and conversion-focused web design to generate qualified leads for ambitious businesses.",
  url: "https://optireach.co.uk",
  email: "hello@optireach.co.uk",
  phone: "+44 20 7946 0412",
  founded: "2016",
} as const;

export const nav: NavItem[] = [
  { label: "Services", href: "#services" },
  { label: "Results", href: "#results" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

export const hero = {
  eyebrow: "UK digital marketing agency",
  headline: {
    accent: "Measurable growth,",
    rest: "not vanity metrics.",
  },
  standfirst:
    "We combine SEO, paid advertising and conversion-focused web design to generate qualified leads for businesses that need to see a return on every pound.",
  actions: [
    { label: "See our results", href: "#results", primary: true },
    { label: "Book a strategy call", href: "#contact", primary: false },
  ],
  clientsLabel: "Trusted by",
  clients: [
    "Carter Construction Group",
    "Urban Living Group",
    "Elevate Financial",
    "Morgan & Co Solicitors",
    "Hughes Property Services",
  ],
};

export const stats: Stat[] = [
  {
    value: 247,
    suffix: "%",
    label: "More qualified leads in six months",
    client: "Carter Construction Group",
  },
  {
    value: 312,
    suffix: "%",
    label: "Organic traffic growth in year one",
    client: "Elevate Financial",
  },
  {
    value: 189,
    suffix: "%",
    label: "Increase in online revenue",
    client: "Urban Living Group",
  },
  {
    value: 173,
    suffix: "%",
    label: "Increase in conversions",
    client: "Hughes Property Services",
  },
];

export const approach = {
  eyebrow: "Our approach",
  title: {
    lead: "We are judged on enquiries,",
    accent: "not impressions.",
  },
  body: [
    "Most agencies report on traffic, reach and engagement because those numbers always go up. We report on qualified enquiries and what each one cost you, because that is the number that decides whether we were worth hiring.",
    "Every engagement starts with an audit of where your budget is currently leaking, and a written plan with the lead volume each channel should produce. You keep that plan whether or not you work with us.",
  ],
  points: [
    {
      title: "One team, three levers",
      body: "Search, paid media and the website are managed together, so improvements compound instead of cancelling out.",
    },
    {
      title: "Tracking you can trust",
      body: "We rebuild analytics and call tracking first. Without it, every other number on the report is a guess.",
    },
    {
      title: "Senior people on the account",
      body: "The person who audits your account is the person who runs it. No handover to a junior after signing.",
    },
    {
      title: "Plain monthly reporting",
      body: "Cost per qualified lead, month on month, in language you can take straight to your board.",
    },
  ],
};

export const services: Service[] = [
  {
    index: "01",
    name: "SEO",
    description:
      "Technical fixes, content and authority building that move you onto page one for the terms your buyers actually search for.",
    tags: ["Technical SEO", "Content strategy", "Local SEO"],
  },
  {
    index: "02",
    name: "Paid advertising",
    description:
      "Google, Meta and LinkedIn campaigns managed against cost per qualified lead rather than clicks or impressions.",
    tags: ["Google Ads", "Paid social", "Remarketing"],
  },
  {
    index: "03",
    name: "Web design & development",
    description:
      "Fast, accessible websites built to convert the traffic you are already paying to attract.",
    tags: ["Web design", "Development", "Core Web Vitals"],
  },
  {
    index: "04",
    name: "Conversion & analytics",
    description:
      "Analytics and call tracking you can rely on, then a testing programme that lifts conversion rate month after month.",
    tags: ["CRO", "GA4 & tracking", "Reporting"],
  },
];

export const work = {
  eyebrow: "Selected results",
  title: {
    lead: "Five clients,",
    accent: "five numbers.",
  },
  cases: [
    {
      client: "Carter Construction Group",
      sector: "Construction",
      headline: "247% more qualified leads",
      detail:
        "A complete SEO overhaul and paid advertising strategy delivered a 247% increase in qualified leads within six months.",
      services: ["SEO", "Paid advertising"],
    },
    {
      client: "Elevate Financial",
      sector: "Financial services",
      headline: "312% organic traffic growth",
      detail:
        "Within the first year organic traffic grew 312%, generating consistent, high-value enquiries from businesses across the UK.",
      services: ["SEO", "Content"],
    },
    {
      client: "Urban Living Group",
      sector: "Property",
      headline: "189% more online revenue",
      detail:
        "A data-driven strategy and continuous campaign optimisation increased online revenue by 189%.",
      services: ["Paid advertising", "Analytics"],
    },
    {
      client: "Morgan & Co Solicitors",
      sector: "Legal",
      headline: "Page one for competitive terms",
      detail:
        "A website redesign and SEO campaign reached the first page of Google for their most competitive keywords.",
      services: ["Web design", "SEO"],
    },
    {
      client: "Hughes Property Services",
      sector: "Property services",
      headline: "173% more conversions",
      detail:
        "A rebuilt digital strategy delivered a 173% increase in conversions and measurable return month after month.",
      services: ["CRO", "Paid advertising"],
    },
  ] as CaseResult[],
};

export const process = {
  eyebrow: "How we work",
  title: {
    lead: "Four steps,",
    accent: "no mystery.",
  },
  steps: [
    {
      index: "01",
      name: "Audit",
      description:
        "We review your website, search visibility, ad accounts and tracking, then show you exactly where budget is currently being wasted.",
    },
    {
      index: "02",
      name: "Strategy",
      description:
        "A written plan covering target keywords, channels, budget split and the lead volume each channel should realistically produce.",
    },
    {
      index: "03",
      name: "Build & launch",
      description:
        "Fixes shipped, pages written, campaigns restructured and tracking rebuilt so every enquiry can be attributed to a source.",
    },
    {
      index: "04",
      name: "Optimise & report",
      description:
        "Monthly reporting against cost per qualified lead, with a testing backlog that compounds results across the year.",
    },
  ] as ProcessStep[],
};

export const testimonials = {
  eyebrow: "What clients say",
  title: {
    lead: "In their",
    accent: "own words.",
  },
  items: [
    {
      quote:
        "A complete SEO overhaul and paid advertising strategy resulted in a 247% increase in qualified leads within six months.",
      name: "Daniel Carter",
      role: "Managing Director · Carter Construction Group",
    },
    {
      quote:
        "Our online revenue increased by 189% thanks to a data-driven marketing strategy and continuous campaign optimisation.",
      name: "James Richardson",
      role: "Director · Urban Living Group",
    },
    {
      quote:
        "Within the first year, organic traffic grew by 312%, generating consistent, high-value enquiries from businesses across the UK.",
      name: "Sarah Bennett",
      role: "Marketing Director · Elevate Financial",
    },
    {
      quote:
        "The website redesign and SEO campaign elevated us to the first page of Google for our most competitive keywords, dramatically increasing new business.",
      name: "Charlotte Morgan",
      role: "Director · Morgan & Co Solicitors",
    },
    {
      quote:
        "Their team completely transformed our digital strategy, delivering a 173% increase in conversions and measurable ROI month after month.",
      name: "Oliver Hughes",
      role: "Managing Director · Hughes Property Services",
    },
  ] as Testimonial[],
};

export const contact = {
  eyebrow: "Get in touch",
  title: {
    lead: "Tell us where you want to be",
    accent: "in twelve months.",
  },
  standfirst:
    "Send us a short brief and we will tell you honestly whether we can get you there, roughly what it would cost, and what we would do first.",
  reassurances: [
    "Reply within two working days",
    "No obligation, no hard sell",
    "You keep the audit findings",
  ],
  budgets: [
    "Under £2,000 / month",
    "£2,000 — £5,000 / month",
    "£5,000 — £10,000 / month",
    "£10,000+ / month",
    "Not sure yet",
  ],
  services: [
    "SEO",
    "Paid advertising",
    "Web design & development",
    "Conversion & analytics",
    "Not sure yet",
  ],
};

export const footer = {
  blurb:
    "A UK digital marketing agency generating qualified leads through search, paid media and websites built to convert.",
  columns: [
    {
      title: "Services",
      links: services.map((service) => ({
        label: service.name,
        href: "#services",
      })),
    },
    {
      title: "Company",
      links: nav,
    },
  ],
  legal: [
    { label: "Privacy policy", href: "#" },
    { label: "Terms", href: "#" },
  ] as NavItem[],
};
