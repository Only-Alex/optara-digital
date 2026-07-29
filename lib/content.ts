export type NavItem = { label: string; href: string };

export type ServiceIcon =
  | "branding"
  | "seo"
  | "ads"
  | "social"
  | "web"
  | "app";

export type NavChild = {
  label: string;
  href: string;
  blurb: string;
  icon: ServiceIcon;
};

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

/**
 * Illustrative work. These are demonstrations of approach, not delivered
 * engagements — every one carries a visible `label` saying so, and none may
 * carry a performance figure until a real, attributable result exists.
 */
export type ConceptProject = {
  label: string;
  title: string;
  sector: string;
  challenge: string;
  strategy: string;
  solution: string;
  services: string[];
};

export type Stat = {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

// `name` drives the header lockup, the oversized hero background wordmark and
// every metadata title, so renaming the business starts and ends here — no
// component hardcodes it, and the protected hero picks it up untouched.
export const site = {
  name: "Optara Digital",
  shortName: "optaradigital",
  tagline: "UK digital marketing agency",
  description:
    "Optara Digital is a UK digital marketing agency combining SEO, paid advertising and conversion-focused web design to generate qualified leads for ambitious businesses.",
  // Registered and owned, but not yet pointed at a deployment. Metadata,
  // sitemap and robots still read `siteOrigin` from lib/site-url.ts rather than
  // this value, so a build served from anywhere else canonicalises to itself.
  url: "https://optaradigital.com",
  // No mailbox behind this yet — mail routing is not set up, so anything sent
  // here bounces. Launch blocker until it receives.
  email: "hello@optaradigital.com",
  phone: "+44 20 7946 0412",
} as const;

export const serviceNav: NavChild[] = [
  {
    label: "Branding",
    href: "/services/branding",
    blurb:
      "Create a distinctive identity that builds recognition, trust and long-term value.",
    icon: "branding",
  },
  {
    label: "SEO & GEO",
    href: "/services/seo-geo",
    blurb:
      "Increase visibility across Google, traditional search and AI-powered discovery.",
    icon: "seo",
  },
  {
    label: "Google Ads",
    href: "/services/google-ads",
    blurb:
      "Generate qualified leads with strategically managed, data-driven campaigns.",
    icon: "ads",
  },
  {
    label: "Social Media",
    href: "/services/social-media",
    blurb:
      "Grow an engaged audience with compelling content and targeted campaigns.",
    icon: "social",
  },
  {
    label: "Website Design",
    href: "/services/website-design",
    blurb:
      "Design fast, conversion-focused websites that turn research into enquiries.",
    icon: "web",
  },
  {
    label: "App Development",
    href: "/services/app-development",
    blurb:
      "Build scalable web and mobile applications on modern, maintainable foundations.",
    icon: "app",
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
    { label: "See our work", href: "/case-studies", primary: true },
    { label: "Book a strategy call", href: "/contact", primary: false },
  ],
};

/**
 * Not rendered anywhere. The shape of the stats band is kept so it can be
 * dropped back in once genuine, attributable figures exist; the values are
 * zeroed so nothing unverified can reach a page by accident. Populate only
 * from real reporting, with the timeframe and scope stated alongside.
 */
export const stats: Stat[] = [
  { value: 0, suffix: "%", label: "Awaiting verified figure" },
  { value: 0, suffix: "%", label: "Awaiting verified figure" },
  { value: 0, suffix: "%", label: "Awaiting verified figure" },
  { value: 0, suffix: "%", label: "Awaiting verified figure" },
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
  eyebrow: "Illustrative work",
  title: {
    lead: "Three situations,",
    accent: "worked through.",
  },
  standfirst:
    "These are concept projects, not delivered engagements. They show how we read a commercial problem and what we would build in response. Published client work will replace them as it clears approval.",
  cases: [
    {
      label: "Concept project",
      title: "The contractor who was invisible before the tender",
      sector: "Construction",
      challenge:
        "Regional contractors are usually shortlisted long before an enquiry form is filled in. A buyer researches for weeks, forms a view, then contacts two or three firms. A contractor whose evidence lives in a PDF capability statement never enters that shortlist.",
      strategy:
        "Treat the research phase as the real sales funnel. Identify the questions a procurement lead asks between deciding to tender and choosing who to invite, then own the answers.",
      solution:
        "A rebuilt identity that reads as commercially serious rather than trade-generic, sector and accreditation pages written to be found and cited, and a project record structured so each completed job earns visibility for the next one.",
      services: ["Branding", "SEO & GEO", "Website Design"],
    },
    {
      label: "Concept project",
      title: "The professional firm running entirely on referral",
      sector: "Professional services",
      challenge:
        "A practice built on word of mouth has no way to grow beyond the reach of its existing network, and no way to influence which work comes in. Referral volume is stable until it suddenly is not.",
      strategy:
        "Build a second channel alongside referral rather than replacing it. Buy visibility on the terms that signal genuine intent, earn it on the terms that signal research, and make the difference measurable.",
      solution:
        "Paid search scoped tightly to high-intent enquiries so budget is not spent on browsers, service pages written for the questions asked before instructing a firm, and enquiry tracking rebuilt so referral and search can finally be told apart.",
      services: ["Google Ads", "SEO & GEO", "Website Design"],
    },
    {
      label: "Concept project",
      title: "The specialist supplier nobody could describe",
      sector: "B2B and manufacturing",
      challenge:
        "Technical businesses often sell something genuinely differentiated and describe it in language only their own engineers use. Buyers cannot search for it, and cannot repeat it internally when justifying the purchase.",
      strategy:
        "Fix the language first. Establish how buyers actually name the problem, then rebuild the positioning, the site and the content around those words instead of internal terminology.",
      solution:
        "A messaging framework that survives being repeated second-hand, a site architecture organised by application rather than product code, and a content programme that gives specifiers something worth sending to a colleague.",
      services: ["Branding", "Social Media", "Website Design"],
    },
  ] as ConceptProject[],
};

/**
 * Deliberately empty. The previous quotes were attributed to companies and
 * people that cannot be verified, so they have been removed rather than
 * anonymised — an unattributed quote is still a fabricated endorsement.
 * The section unmounts itself while this list is empty. Add entries only
 * with the client's written permission to be named.
 */
export const testimonials = {
  eyebrow: "What clients say",
  title: {
    lead: "In their",
    accent: "own words.",
  },
  items: [] as Testimonial[],
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
  // Deliberately empty until real Privacy and Terms pages exist. Dead "#"
  // links are worse than absent ones — they promise a policy and deliver a
  // scroll-to-top. Reinstate with real routes only. Launch blocker either
  // way: a public site still needs the actual pages (design system §15).
  legal: [] as NavItem[],
};

export const intro = {
  eyebrow: "UK digital marketing agency",
  wordmark: "Optara Digital.",
  body: [
    "We are Optara Digital, a UK digital marketing agency built for businesses that need enquiries rather than exposure: construction firms, property groups, financial and professional services companies, and B2B specialists competing in crowded search results.",
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

export const servicesIndex = {
  eyebrow: "Services",
  title: { lead: "Six disciplines,", accent: "one revenue target." },
  standfirst:
    "Engaged individually or as one programme. Whichever you pick, the reporting leads on qualified enquiries and what each one cost.",
};

export const aboutPage = {
  eyebrow: "About",
  title: { lead: "An agency judged on", accent: "enquiries." },
  standfirst:
    "Optara Digital is a UK digital marketing agency working with businesses where a single new client is worth having, and where search decides the shortlist.",
  body: [
    "Optara Digital exists to do one thing: make search work commercially for firms whose buyers research for weeks before making contact. The channels around that keep changing. The problem does not.",
    "The through line is measurement. We rebuild tracking before we touch a campaign, define what a qualified enquiry actually means for your business, and report against cost per lead in language you can take to a board.",
    "We keep the client list deliberately short, so the senior person who audits an account is the person who runs it.",
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
  eyebrow: "Illustrative work",
  title: { lead: "How we think,", accent: "worked through." },
  standfirst:
    "The projects below are concepts. They are written to show how we read a commercial problem and what we would build in response, and they carry no performance figures because none has been earned yet. Client work will be published here as it clears approval.",
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
  title: { lead: "Want this approach", accent: "applied to yours?" },
  body: "We would rather turn work down than take on a poor fit. If that is the case, we will say so on the first call.",
  action: { label: "Book a strategy call", href: "/contact" },
};

export type GrowthStage = {
  number: string;
  title: string;
  services: string[];
  description: string;
};

export const growthSystem = {
  eyebrow: "How growth compounds",
  heading: "Four stages.",
  accentText: "One connected growth system.",
  supportingParagraph:
    "Growth accelerates when brand, demand, conversion and optimisation move as one. Optara Digital connects every stage, so each decision strengthens the next and momentum builds faster over time.",
  stages: [
    {
      number: "01",
      title: "Build recognition",
      services: ["Branding"],
      description:
        "Build a distinctive brand that earns attention, inspires trust and stays memorable. Clear positioning and a consistent identity give customers a stronger reason to choose you.",
    },
    {
      number: "02",
      title: "Capture demand",
      services: ["SEO & GEO", "Google Ads"],
      description:
        "Reach the right people when intent is highest. Strategic SEO, AI search visibility and targeted Google Ads turn active demand into valuable opportunities for your business.",
    },
    {
      number: "03",
      title: "Convert attention",
      services: ["Website Design", "App Development"],
      description:
        "Turn attention into action with fast, intuitive websites and apps. Clear messaging and frictionless journeys make it easier for people to engage, enquire and convert.",
    },
    {
      number: "04",
      title: "Scale growth",
      services: ["Social Media", "Continuous optimisation"],
      description:
        "Improve what works through smart content, audience insight and ongoing optimisation. Find new opportunities, sharpen performance and build stronger momentum across every stage.",
    },
  ] as GrowthStage[],
};

export type Discipline = {
  id: string;
  title: string;
  /** Accessible name, where the visible label reads as an abbreviation. */
  spoken?: string;
  orbit: "back" | "mid" | "front";
  angle: number;
};

export const connectedSystem = {
  eyebrow: "The problem with channels",
  heading: {
    lead: "Most businesses do not need more marketing.",
    accent: "They need it connected.",
  },
  body: "Agencies are usually hired one channel at a time. A brand agency, then an SEO specialist, then someone for the ads. Each does their part, nobody owns the result, and the handovers are where the budget quietly disappears.",
  secondary:
    "We run all six as one system. Brand shapes the words people search for. Search shows us what is worth bidding on. The site turns both into enquiries. Social and continuous optimisation feed the next round.",
  caption: "One connected system",
  // Ordered as the system cycles, not as a price list. `orbit` and `angle`
  // place each discipline in the dimensional system: the orbit sets its depth
  // plane, the angle its seat on that plane, measured anticlockwise from the
  // right in the projection maths. One source for every viewport — desktop,
  // tablet and mobile read the same names from here and only the arrangement
  // differs. `spoken` is the accessible name where the short visible label
  // would read as an abbreviation.
  disciplines: [
    { id: "branding", title: "Branding", orbit: "mid", angle: 180 },
    {
      id: "search",
      title: "SEO & GEO",
      spoken: "Search and generative engine optimisation",
      orbit: "mid",
      angle: 0,
    },
    {
      id: "ads",
      title: "Google Ads",
      spoken: "Google Ads and paid search",
      orbit: "front",
      angle: 304,
    },
    { id: "web", title: "Website Design", orbit: "front", angle: 236 },
    { id: "app", title: "App Development", orbit: "back", angle: 52 },
    { id: "social", title: "Social Media", orbit: "back", angle: 128 },
  ] as Discipline[],
};

export const primaryCta = { label: "Get Started", href: "/contact" };

export const dropdownCta = {
  prompt: "Not sure which service is right for your business?",
  sub: "Let\u2019s identify the best route to growth.",
  label: "Book a strategy call",
  href: "/contact",
};

export const placeholderNotice = "Page in development";
