export type NavItem = { label: string; href: string };

export type NavChild = { label: string; href: string; blurb: string };

export type NavEntry = {
  label: string;
  href: string;
  children?: NavChild[];
};

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

export const serviceNav: NavChild[] = [
  {
    label: "Branding",
    href: "/services/branding",
    blurb: "Positioning, identity and messaging that hold up on a crowded shelf.",
  },
  {
    label: "SEO & GEO",
    href: "/services/seo-geo",
    blurb: "Rank in Google and get cited by AI search at the same time.",
  },
  {
    label: "Google Ads",
    href: "/services/google-ads",
    blurb: "Search, shopping and performance campaigns run against cost per lead.",
  },
  {
    label: "Social Media",
    href: "/services/social-media",
    blurb: "Paid social and organic content that earns attention worth paying for.",
  },
  {
    label: "Website Design & App Development",
    href: "/services/website-design-app-development",
    blurb: "Fast, accessible builds that convert the traffic you already buy.",
  },
];

export const nav: NavEntry[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services", children: serviceNav },
  { label: "Case Studies", href: "/case-studies" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
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
    { label: "See our results", href: "/case-studies", primary: true },
    { label: "Book a strategy call", href: "/contact", primary: false },
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
      links: serviceNav.map((item) => ({ label: item.label, href: item.href })),
    },
    {
      title: "Company",
      links: [
        { label: "Case Studies", href: "/case-studies" },
        { label: "About", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Contact", href: "/contact" },
      ] as NavItem[],
    },
  ],
  legal: [
    { label: "Privacy policy", href: "#" },
    { label: "Terms", href: "#" },
  ] as NavItem[],
};

export const intro = {
  eyebrow: "UK digital marketing agency",
  wordmark: "Opti Reach.",
  body: [
    "We are Opti Reach, a UK digital marketing agency working with businesses that need enquiries rather than exposure. Our clients are construction firms, property groups, financial and professional services companies, and B2B specialists competing in crowded search results.",
    "We break growth down into manageable phases and work closely with you at every stage. From technical SEO and content through to paid search, conversion rate optimisation and the website itself, we handle the detail so the channels reinforce each other instead of pulling apart.",
    "Every engagement is measured against cost per qualified lead. If a channel cannot be shown to produce enquiries at a price that works for your business, we recommend stopping it.",
  ],
  cta: { label: "How we work", href: "/about" },
};

export const sectors = {
  eyebrow: "Who we work with",
  title: { lead: "Sectors where search", accent: "decides the shortlist." },
  standfirst:
    "We specialise in considered, high-value purchases, where a buyer researches for weeks and only ever contacts three or four suppliers.",
  items: [
    {
      name: "Construction & trades",
      body: "Commercial and domestic contractors competing for tenders and high-value private work.",
    },
    {
      name: "Property & lettings",
      body: "Developers, agents and property service firms where enquiry volume drives the pipeline.",
    },
    {
      name: "Financial services",
      body: "Advisers, brokers and finance providers who need compliant, high-intent lead generation.",
    },
    {
      name: "Legal & professional",
      body: "Solicitors, accountants and consultants bidding for competitive local and national terms.",
    },
    {
      name: "B2B & industrial",
      body: "Manufacturers, suppliers and specialists with long sales cycles and technical buyers.",
    },
    {
      name: "Multi-site & franchise",
      body: "Groups that need consistent national visibility alongside local performance per branch.",
    },
  ],
};

export const capabilities = {
  eyebrow: "What we do best",
  title: { lead: "Four disciplines,", accent: "run as one." },
  groups: [
    {
      name: "Search engine optimisation",
      body: [
        "We start with the technical foundations, because content and links rarely perform on a site search engines struggle to crawl. Once the base is sound we build topical authority around the terms your buyers actually use at the point of enquiry.",
        "Reporting covers rankings, but it leads on the enquiries those rankings produced and what each one cost.",
      ],
      features: [
        "Technical audit & fixes",
        "Keyword & intent mapping",
        "Content strategy",
        "Local & multi-location SEO",
        "Link acquisition",
        "Monthly rank & lead reporting",
      ],
    },
    {
      name: "Paid advertising",
      body: [
        "Search, shopping and paid social campaigns structured around what a qualified lead is worth to you, not around impression share. Wasted spend is cut in the first fortnight, which usually funds the rest of the work.",
        "We manage Google Ads, Microsoft Ads, Meta and LinkedIn in house, with weekly optimisation against cost per lead.",
      ],
      features: [
        "Google & Microsoft Ads",
        "Paid social",
        "Remarketing",
        "Landing page testing",
        "Bid & budget management",
        "Call & form tracking",
      ],
    },
    {
      name: "Web design & development",
      body: [
        "Most sites lose more revenue in the gap between click and enquiry than they ever lose in the ad auction. We design and build fast, accessible sites that make the next step obvious.",
        "Built to be edited by your team, measured properly from day one, and quick enough to pass Core Web Vitals on a mid-range phone.",
      ],
      features: [
        "Bespoke design",
        "Accessible build",
        "CMS & content editing",
        "Core Web Vitals",
        "Ecommerce",
        "Hosting & support",
      ],
    },
    {
      name: "Conversion & analytics",
      body: [
        "Before optimising anything we make the numbers trustworthy: analytics rebuilt, goals defined, calls and forms attributed to source. Without that, every other report is guesswork.",
        "Then a continuous testing programme on the pages that carry the most commercial weight.",
      ],
      features: [
        "GA4 & tracking rebuild",
        "Call tracking",
        "Conversion rate testing",
        "Heatmaps & session review",
        "Dashboard reporting",
        "Lead quality scoring",
      ],
    },
  ],
};

export const difference = {
  eyebrow: "What makes us different",
  title: { lead: "Four reasons clients", accent: "stay with us." },
  items: [
    {
      title: "Measured on enquiries",
      body: "Every report leads with qualified enquiries and cost per lead. Traffic and impressions are context, never the headline. If the enquiries are not there, we say so before you have to ask.",
    },
    {
      title: "Senior people on your account",
      body: "The person who audits your account is the person who runs it. There is no handover to a junior team once the contract is signed, and you always know who is doing the work.",
    },
    {
      title: "Search, ads and site together",
      body: "One team runs all three, so improvements compound. No arguing between an SEO agency, a PPC agency and a web developer about whose change broke the numbers.",
    },
    {
      title: "No long lock-ins",
      body: "We work to rolling agreements after the initial term. Staying should be your choice each month, based on results, rather than a clause in a contract.",
    },
  ],
};

export const phases = {
  eyebrow: "Our process",
  title: { lead: "Four phases,", accent: "no mystery." },
  items: [
    {
      phase: "Phase 1 / 4",
      name: "Discovery & audit",
      steps: ["Data review", "Competitor analysis", "Technical audit"],
      body: "We pull everything together first: analytics, search console, ad accounts, call records and your own view of which enquiries are actually worth having. Then a technical audit of the site and a competitor analysis of who is currently winning the terms you want. You receive the findings in writing, and they are yours whether or not you continue with us.",
    },
    {
      phase: "Phase 2 / 4",
      name: "Strategy & plan",
      steps: ["Channel plan", "Forecasting", "Budget split"],
      body: "A written plan setting out target keywords, channels, budget split and the enquiry volume each channel should realistically produce, with the assumptions behind every forecast made explicit. We walk you through it, you challenge it, and we adjust before any money is spent.",
    },
    {
      phase: "Phase 3 / 4",
      name: "Build & launch",
      steps: ["Tracking", "Fixes & content", "Campaigns"],
      body: "Tracking is rebuilt first so nothing that follows is guesswork. Then technical fixes ship, priority pages are written, and campaigns are restructured around the plan. Most accounts are live within thirty days of signing, with a clear record of what changed and when.",
    },
    {
      phase: "Phase 4 / 4",
      name: "Optimise & report",
      steps: ["Weekly testing", "Monthly reporting", "Quarterly review"],
      body: "Weekly optimisation against cost per qualified lead, monthly reporting in language you can take straight to a board, and a quarterly session where we re-cut the plan based on what the year has actually shown. The testing backlog is shared, so you can always see what is queued and why.",
    },
  ],
};

export const faqs = {
  eyebrow: "Questions",
  title: { lead: "Frequently asked", accent: "questions." },
  items: [
    {
      question: "How long before we see results?",
      answer:
        "Paid advertising can produce enquiries in the first week, because you are buying visibility directly. SEO is slower: expect early technical gains within four to six weeks, meaningful ranking movement from three months, and compounding results from six months onwards. We set expectations per channel in the plan rather than promising a single blanket timescale.",
    },
    {
      question: "Do you work with businesses outside your usual sectors?",
      answer:
        "Often, yes. The common thread in our work is a considered, high-value purchase where the buyer researches before making contact. If your sales cycle looks like that, the approach transfers. If you sell low-value products at high volume, we will tell you honestly that a specialist ecommerce agency is a better fit.",
    },
    {
      question: "What do you need from us to get started?",
      answer:
        "Access to your analytics, search console and ad accounts, a conversation about which enquiries are genuinely valuable, and one person on your side who can approve content and sign off changes. Beyond that we try to keep the demands on your team light, because slow approvals are the most common cause of slow results.",
    },
    {
      question: "Do we own the work you produce?",
      answer:
        "Yes. Content, campaign structures, tracking configuration and any website we build belong to you. Accounts are set up in your name wherever possible, so if we ever part company you keep the assets and the history rather than starting again.",
    },
    {
      question: "How is reporting handled?",
      answer:
        "A monthly report covering qualified enquiries, cost per lead and channel performance, plus a live dashboard you can check whenever you want. Reports are written to be read by people who do not work in marketing, and we talk through them rather than emailing a PDF and disappearing.",
    },
    {
      question: "What happens if it is not working?",
      answer:
        "We raise it before you do. If a channel is not producing enquiries at a viable cost we recommend reducing or stopping it, even when that means a smaller budget under our management. Rolling agreements after the initial term mean you are never locked into something that is not performing.",
    },
  ],
  helpful: {
    prompt: "Did this answer your question?",
    yes: "Glad that helped.",
    no: "No problem — ask us directly and we will answer properly.",
    cta: { label: "Ask our team", href: "/contact" },
  },
};

export const speakBubble = {
  label: "Speak to us",
  href: "/contact",
};

export const scrollCue = "Scroll down";

export type ServicePage = {
  slug: string;
  label: string;
  eyebrow: string;
  title: { lead: string; accent: string };
  standfirst: string;
  intro: string[];
  offerings: { title: string; body: string }[];
  deliverables: string[];
  proof: { value: string; label: string; client: string };
  faqs: { question: string; answer: string }[];
};

export const servicePages: ServicePage[] = [
  {
    slug: "branding",
    label: "Branding",
    eyebrow: "Branding",
    title: { lead: "A brand that survives", accent: "a sceptical buyer." },
    standfirst:
      "Positioning, identity and messaging built for businesses whose buyers compare three or four suppliers before they ever make contact.",
    intro: [
      "Most branding work fails commercially because it is judged on whether the founder likes it rather than on whether it makes a buyer shortlist you. We start from the opposite end: what your buyer is comparing, what they are worried about, and what would make choosing you feel like the safe decision.",
      "The output is not a mood board. It is a written position, a messaging framework your sales team can actually repeat, and an identity system that works at the sizes your business really uses.",
    ],
    offerings: [
      {
        title: "Positioning",
        body: "Where you sit against the competitors your buyers already shortlist, and the one thing you want to be known for.",
      },
      {
        title: "Messaging framework",
        body: "Core proposition, proof points and objection handling, written so the whole team says the same thing.",
      },
      {
        title: "Visual identity",
        body: "Logo, type, colour and layout rules, tested at the sizes you use most rather than only on a presentation slide.",
      },
      {
        title: "Brand guidelines",
        body: "A short, usable document. Rules people follow beat a 90-page PDF nobody opens.",
      },
    ],
    deliverables: [
      "Competitor and category audit",
      "Positioning statement",
      "Messaging framework",
      "Logo and identity system",
      "Type and colour system",
      "Brand guidelines document",
    ],
    proof: {
      value: "Page one",
      label: "for their most competitive keywords after a rebrand and site rebuild",
      client: "Morgan & Co Solicitors",
    },
    faqs: [
      {
        question: "Do we have to rebrand everything at once?",
        answer:
          "No. Most clients start with positioning and messaging, because those change what every page and every ad says. Visual identity can follow once the words are settled, and often costs less when it does.",
      },
      {
        question: "Will this work if we already have a logo we like?",
        answer:
          "Often the logo is the part worth keeping. We will tell you if it is doing its job and focus the budget on the parts that are not, rather than redesigning something for the sake of it.",
      },
      {
        question: "How long does it take?",
        answer:
          "Positioning and messaging typically take three to four weeks including your review time. A full identity system adds another four to six.",
      },
    ],
  },
  {
    slug: "seo-geo",
    label: "SEO & GEO",
    eyebrow: "SEO & GEO",
    title: { lead: "Found in Google,", accent: "cited by AI." },
    standfirst:
      "Traditional search optimisation and generative engine optimisation run together, so you appear in the blue links and in the answer the assistant reads out.",
    intro: [
      "Search has split in two. Some of your buyers still scan a results page; a growing number ask ChatGPT, Gemini or Google's AI overview and act on whatever it summarises. The technical foundations overlap, but the content that earns a citation is not always the content that ranks.",
      "We work on both. Technical health and topical authority for classic SEO, plus the structure, sourcing and factual clarity that make a page quotable by a language model.",
    ],
    offerings: [
      {
        title: "Technical SEO",
        body: "Crawlability, indexation, Core Web Vitals and the structural fixes that unblock everything else.",
      },
      {
        title: "Content and topical authority",
        body: "Pages built around what your buyers actually search at the point of enquiry, not vanity head terms.",
      },
      {
        title: "Generative engine optimisation",
        body: "Structured data, clear sourcing and answer-shaped content so AI search can quote you accurately.",
      },
      {
        title: "Digital PR and links",
        body: "Earned coverage that builds the authority both search engines and language models weigh.",
      },
    ],
    deliverables: [
      "Technical audit and fix list",
      "Keyword and intent map",
      "Content plan and briefs",
      "Schema and structured data",
      "AI citation tracking",
      "Monthly rank and lead reporting",
    ],
    proof: {
      value: "312%",
      label: "organic traffic growth in year one",
      client: "Elevate Financial",
    },
    faqs: [
      {
        question: "What is GEO and is it actually different from SEO?",
        answer:
          "Generative engine optimisation is about being the source an AI assistant quotes rather than the link a person clicks. It shares the technical foundations with SEO, but rewards clearly structured, well-sourced, factually specific writing far more than keyword density ever did.",
      },
      {
        question: "How long until we see movement?",
        answer:
          "Technical gains often show within four to six weeks. Meaningful ranking movement usually starts around three months and compounds from six. Anyone promising page one in a fortnight is selling something else.",
      },
      {
        question: "Can you work alongside our in-house content team?",
        answer:
          "Yes, and it is usually cheaper that way. We provide the strategy, briefs and technical work, your team writes to the brief, and we edit for search and citation before publishing.",
      },
    ],
  },
  {
    slug: "google-ads",
    label: "Google Ads",
    eyebrow: "Google Ads",
    title: { lead: "Spend measured in leads,", accent: "not clicks." },
    standfirst:
      "Search, shopping and performance campaigns structured around what a qualified enquiry is worth to your business.",
    intro: [
      "Most underperforming accounts are not badly optimised, they are badly measured. If the conversion being bid towards is a page view or an unqualified form fill, Google will faithfully buy you more of exactly the wrong thing.",
      "We rebuild tracking first, define what a genuinely qualified lead looks like, then restructure campaigns around that. Wasted spend usually gets cut in the first fortnight, which tends to fund the rest of the work.",
    ],
    offerings: [
      {
        title: "Account restructure",
        body: "Campaigns and match types rebuilt around commercial intent, with the search term waste cut out.",
      },
      {
        title: "Conversion tracking",
        body: "Calls, forms and offline outcomes attributed properly, so bidding optimises towards revenue.",
      },
      {
        title: "Landing pages",
        body: "Pages built for the ad that sent the click, tested continuously against cost per lead.",
      },
      {
        title: "Shopping and Performance Max",
        body: "Feed quality and campaign structure for ecommerce, with sensible guard rails on automation.",
      },
    ],
    deliverables: [
      "Account and competitor audit",
      "Keyword and negative strategy",
      "Conversion and call tracking",
      "Ad copy testing programme",
      "Landing page testing",
      "Monthly cost per lead reporting",
    ],
    proof: {
      value: "247%",
      label: "more qualified leads within six months",
      client: "Carter Construction Group",
    },
    faqs: [
      {
        question: "What is the minimum sensible ad budget?",
        answer:
          "Below roughly £2,000 a month in media there is rarely enough data to optimise against, and management fees eat too much of the total. If you are under that, we will usually suggest SEO or lifecycle work first and say so honestly.",
      },
      {
        question: "Do you charge a percentage of ad spend?",
        answer:
          "We prefer a flat management fee. Charging a percentage of spend rewards us for spending more of your money, which is the wrong incentive when half the job is cutting waste.",
      },
      {
        question: "Who owns the account?",
        answer:
          "You do. Accounts are set up in your name, and if we ever part company you keep the account, its history and the learning inside it.",
      },
    ],
  },
  {
    slug: "social-media",
    label: "Social Media",
    eyebrow: "Social Media",
    title: { lead: "Attention worth", accent: "paying for." },
    standfirst:
      "Paid social and organic content for businesses with a considered sale, where the job is to build familiarity long before anyone fills in a form.",
    intro: [
      "For a high-value purchase, social rarely closes the deal on the click. It does something more useful: it makes you familiar, so that when the buyer finally searches, yours is the name they already half trust.",
      "That means measuring it honestly. We track assisted conversions and brand search lift alongside direct leads, rather than pretending a like is a business outcome.",
    ],
    offerings: [
      {
        title: "Paid social",
        body: "Meta and LinkedIn campaigns for demand capture and demand creation, with audiences built from real customer data.",
      },
      {
        title: "Organic content",
        body: "A sustainable posting rhythm your team can maintain after we hand it over.",
      },
      {
        title: "Creative production",
        body: "Static, motion and short-form video produced in volume so campaigns never run out of fresh work to test.",
      },
      {
        title: "Community and inbound",
        body: "Response handling that turns comments and DMs into actual enquiries rather than dead threads.",
      },
    ],
    deliverables: [
      "Channel and audience strategy",
      "Content calendar",
      "Creative production",
      "Paid campaign management",
      "Community management guidance",
      "Monthly performance reporting",
    ],
    proof: {
      value: "173%",
      label: "increase in conversions across a rebuilt digital strategy",
      client: "Hughes Property Services",
    },
    faqs: [
      {
        question: "Which platforms should we actually be on?",
        answer:
          "Usually fewer than you think. We would rather do two channels properly than five badly, and which two depends entirely on where your buyers already are. That comes out of the audit.",
      },
      {
        question: "Is organic social still worth it for B2B?",
        answer:
          "As a credibility layer, yes. As a primary lead source for most B2B firms, rarely. We are straight about which role it is playing so the budget matches the expectation.",
      },
      {
        question: "Do you produce the creative or do we?",
        answer:
          "Either. We have in-house production, but if you have a capable team we will provide the direction and briefs and let them execute, which usually costs less.",
      },
    ],
  },
  {
    slug: "website-design-app-development",
    label: "Website Design & App Development",
    eyebrow: "Website Design & App Development",
    title: { lead: "Built to convert", accent: "the traffic you buy." },
    standfirst:
      "Fast, accessible websites and product interfaces designed around the enquiry, not around the homepage carousel.",
    intro: [
      "Most sites lose more revenue between the click and the enquiry than they ever lose in the ad auction. A half-second of load time and an unclear next step will quietly undo a well-run campaign.",
      "We design and build for the commercial job: make the next step obvious, make the page fast on a mid-range phone, and make it something your team can edit without a developer.",
    ],
    offerings: [
      {
        title: "Website design",
        body: "Bespoke design built around your funnel, with the conversion path decided before the visuals.",
      },
      {
        title: "Development",
        body: "Accessible, standards-based builds that pass Core Web Vitals rather than merely looking fast.",
      },
      {
        title: "App and product interfaces",
        body: "Interface design for products and portals, with the same attention to speed and clarity.",
      },
      {
        title: "Hosting and support",
        body: "Ongoing maintenance, monitoring and iteration once the site is live.",
      },
    ],
    deliverables: [
      "UX and conversion audit",
      "Wireframes and prototypes",
      "Bespoke visual design",
      "Accessible front-end build",
      "CMS and content editing",
      "Hosting, support and iteration",
    ],
    proof: {
      value: "189%",
      label: "increase in online revenue after a rebuild and campaign overhaul",
      client: "Urban Living Group",
    },
    faqs: [
      {
        question: "Do we own the code and design files?",
        answer:
          "Yes, on completion and full payment everything transfers to you. We do not retain ownership or lock you into hosting to keep your own site.",
      },
      {
        question: "Can our team edit the site afterwards?",
        answer:
          "That is a design requirement, not an afterthought. Pages are built as editable blocks so your team can change content without needing us for every word.",
      },
      {
        question: "How long does a build take?",
        answer:
          "A focused marketing site is typically six to eight weeks. Larger builds with ecommerce or custom functionality run longer, and we phase those so something useful goes live early.",
      },
    ],
  },
];

export const servicesIndex = {
  eyebrow: "Services",
  title: { lead: "Five disciplines,", accent: "one revenue target." },
  standfirst:
    "Engaged individually or as one programme. Whichever you pick, the reporting leads on qualified enquiries and what each one cost.",
};

export const aboutPage = {
  eyebrow: "About",
  title: { lead: "An agency judged on", accent: "enquiries." },
  standfirst:
    "Opti Reach is a UK digital marketing agency working with businesses where a single new client is worth having, and where search decides the shortlist.",
  body: [
    "We started in 2016 doing one thing: making search work commercially for firms whose buyers research for weeks before making contact. That has not really changed, though the channels around it have.",
    "The through line is measurement. We rebuild tracking before we touch a campaign, define what a qualified enquiry actually means for your business, and report against cost per lead in language you can take to a board.",
    "We keep the client list deliberately short. Senior people run the accounts they audit, and there is no handover to a junior team once a contract is signed.",
  ],
  values: [
    {
      title: "Straight answers",
      body: "If a channel is not producing enquiries at a viable cost, we say so before you have to ask, even when that shrinks the budget we manage.",
    },
    {
      title: "Measured properly",
      body: "Analytics and call tracking are rebuilt first. Without that, every number that follows is a guess dressed up as a report.",
    },
    {
      title: "Senior attention",
      body: "The person who audits your account is the person who runs it. You always know exactly who is doing the work.",
    },
    {
      title: "No long lock-ins",
      body: "Rolling agreements after the initial term. Staying should be a monthly decision based on results, not a clause.",
    },
  ],
};

export const caseStudiesPage = {
  eyebrow: "Case studies",
  title: { lead: "Five clients,", accent: "five numbers." },
  standfirst:
    "Every engagement is measured against qualified enquiries and what each one cost. These are the numbers those clients reported.",
};

export const blogPage = {
  eyebrow: "Blog",
  title: { lead: "Notes on search,", accent: "spend and growth." },
  standfirst:
    "Practical writing on SEO, generative search, paid media and the measurement that makes them accountable.",
  posts: [
    {
      slug: "geo-vs-seo",
      title: "GEO vs SEO: what changes when AI answers the question",
      category: "SEO & GEO",
      readingTime: "6 min read",
      excerpt:
        "Generative search rewards clear sourcing and answer-shaped structure far more than keyword density ever did. What that means for how you write pages.",
    },
    {
      slug: "cost-per-qualified-lead",
      title: "Why cost per qualified lead is the only number that matters",
      category: "Paid media",
      readingTime: "5 min read",
      excerpt:
        "Impressions and clicks always go up. Here is how to define a qualified lead for your business and build reporting that cannot flatter itself.",
    },
    {
      slug: "tracking-you-can-trust",
      title: "Rebuilding tracking before you spend another pound",
      category: "Analytics",
      readingTime: "7 min read",
      excerpt:
        "Most underperforming ad accounts are badly measured rather than badly optimised. A practical order of operations for fixing attribution first.",
    },
  ],
};

export const contactPage = {
  eyebrow: "Contact",
  title: { lead: "Tell us where you want to be", accent: "in twelve months." },
  standfirst:
    "Send a short brief and we will tell you honestly whether we can get you there, roughly what it would cost, and what we would do first.",
};

export const ctaBand = {
  title: { lead: "Want the same", accent: "measured properly?" },
  body: "We take on a small number of new clients each year. If the fit is wrong we will say so on the first call.",
  action: { label: "Book a strategy call", href: "/contact" },
};
