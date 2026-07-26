# Opti Reach — Immersive Design System

The permanent creative and technical direction for the Opti Reach website.
Read this before planning or implementing any significant visual, motion, 3D,
video or interaction work. `CLAUDE.md` is the short form and defers to this
document.

---

## 1. Core creative vision

Work on this project as a senior frontend engineer and art director. Never
produce generic, template-looking AI output. Favour quality over speed.

Opti Reach should be a premium, state-of-the-art agency website that
*demonstrates* the creative, strategic and technical work the agency sells.
The site is the portfolio piece.

It should feel: immersive · interactive · technologically advanced · visually
distinctive · premium and carefully art-directed · conversion-focused · fast
and accessible · original rather than templated · confident without being
excessive or gimmicky.

It should communicate that Opti Reach combines brand strategy, creative
direction, performance marketing, search visibility, conversion-focused
design, modern development and data-led growth.

### The central strategic story

> **Build recognition. Capture demand. Convert attention. Scale growth.**

Every service is a stage of one growth system:

| Stage | Service |
|---|---|
| Build recognition | Branding |
| Capture demand | SEO & GEO, Google Ads |
| Convert attention | Website Design & App Development |
| Scale growth | Social Media, and the system compounding |

Sections and pages should reinforce this narrative rather than presenting five
disconnected offerings.

---

## 2. Hero protection

The homepage hero is approved and protected. Do **not** redesign, replace or
substantially modify:

- Hero layout, copy, typography, buttons, spacing, background
- The cursor smoke effect (`components/ui/FluidCursor.tsx`)
- Existing hero animations
- The oversized background "opti reach" typography
- The overall hero composition

Change it only on explicit request.

The smoke cursor is the **signature interaction**. Do not introduce another
major effect that competes with it in the same viewport. Sections below the
hero must complement it — generally quieter, so the hero stays the peak.

---

## 3. Immersive design principles

Immersion comes from: strong visual storytelling · purposeful scroll
progression · layered depth · responsive motion · interactive graphics ·
strategic 3D · refined transitions · excellent typography · thoughtful
(soundless) visual feedback · high-quality imagery and video.

**Immersion is not "effects everywhere."** Every visual effect must serve at
least one of these:

1. Explain a service or process
2. Direct attention
3. Improve understanding
4. Demonstrate technical capability
5. Reinforce the brand
6. Increase emotional impact
7. Encourage meaningful interaction
8. Support conversion

If an effect serves none of these, remove it. The site should feel alive on
move, hover, scroll and interaction while staying easy to understand and
navigate.

---

## 4. 3D direction

Use 3D selectively, for memorable focal points.

**Candidate uses:** interactive service illustrations · abstract growth
representations · search and data visualisations · floating site/device
mockups · layered digital ecosystems · animated campaign dashboards · network
and connection visuals · interactive globes where geography matters ·
dimensional typography · particle systems · scroll-controlled interface scenes
· case-study storytelling · section transitions.

**Budget:** normally **no more than one dominant 3D or immersive concept per
page**, unless there is a strong creative reason. 3D supports content; it does
not become the content.

**Avoid:** generic floating spheres · meaningless blobs · overused glass
objects · chrome shapes · anything that delays access to important information ·
large scenes that exist only to look impressive.

Also avoid, named so they can actually be self-checked:

- **Gradient ramps between the blue and the purple.** The identity colours are
  correct; the ramp between them is the single most recognisable AI-design tell.
  Use the accent flat. Where depth is needed, get it from layering, hairlines or
  opacity rather than a hue ramp.
- Glassmorphism panels, aurora and mesh-gradient grounds, floating blurred orbs.
- Bento grids chosen as a default layout rather than because the content is
  genuinely modular.
- Decorative `01 / 02 / 03` numbering. Number real sequences only: a phased
  process qualifies, a sector grid does not.
- Counters on every figure on the page; logo marquees with no stated purpose;
  text that scrambles or typewriters on entry.
- The hero pattern of one big number, a small label, three supporting stats and
  a gradient accent.

If a proposed section would look at home on any other agency site, it is not
finished. Say what changed and why.

**Preferred style:** minimal, precise, editorial, technological,
brand-relevant, smooth, highly polished.

**Colour:** the existing white, black, blue and purple identity. Do not
introduce unrelated bright colours without a clear design purpose.

---

## 5. Motion direction

Cinematic but restrained.

**Use motion for:** smooth section reveals · scroll-led storytelling · layered
parallax · masked text and image transitions · subtle perspective shifts ·
responsive hover states · animated data and metrics · interface
demonstrations · progress-driven transformations · seamless page transitions
where appropriate.

**Avoid:** excessive bouncing · constant movement · large unmotivated
rotations · aggressive scaling · animating every heading identically · long
animations that make people wait · scroll hijacking · motion that hampers
reading · multiple competing effects in one viewport.

Animation should feel smooth and controlled, not playful or cartoon-like.

### Motion levels

| Level | Scope | Frequency |
|---|---|---|
| **L1 — Micro-interactions** | Buttons, links, icons, cards, nav feedback | Everywhere |
| **L2 — Section transitions** | Text reveals, images, mockups, diagrams | Per section |
| **L3 — Signature experiences** | Major 3D scenes, interactive case studies, key storytelling | Sparingly |

L3 is capped by the §4 budget: normally no more than one dominant immersive
concept per page, 3D or not. A scroll-scrubbed SVG set-piece counts against it
just as a WebGL scene does.

Existing shared easing: `EASE = cubic-bezier(0.16, 1, 0.3, 1)` in
`lib/motion.ts`. Reuse it. Typical durations: micro 200–300ms, reveals
600–800ms, signature moments longer but never blocking.

---

## 6. Interaction principles

Respond naturally to cursor movement, hover, focus, click/tap, scroll
progress, dragging where intuitive, and device orientation only where useful
and permission-free.

- Provide immediate visual feedback.
- Clickable areas must be obvious and generous.
- **Never hide essential information behind hover-only interactions.**
- Never require complicated interaction to understand basic content.
- Mobile gets a deliberate experience, not a broken or stripped desktop scene.
- Where an advanced interaction is unsuitable on mobile, build a simplified but
  visually polished alternative.

---

## 7. Visual storytelling

Every section and page is part of one connected story. Avoid collections of
unrelated cards and generic marketing blocks.

Each section should answer a real visitor question:

- Who is Opti Reach?
- What business problem do you solve?
- How do the services work together?
- Why should a company trust you?
- How is your approach different?
- What outcomes can your work create?
- What happens after someone gets in touch?

Visuals should reinforce that answer. Give each service its **own** visual
idea — do not reuse one concept across all five:

| Service | Visual direction |
|---|---|
| SEO & GEO | Interactive search and AI-discovery visual |
| Google Ads | Campaign system or data-flow graphic |
| Branding | Identity elements resolving into a coherent system |
| Social Media | Content moving through an engagement ecosystem |
| Website Design & App Development | Layered interfaces, devices, interactive product scene |

---

## 8. Content and brand voice

**Voice:** confident · clear · modern · intelligent · benefit-focused ·
commercially aware · concise · accessible to business owners · technically
credible without unnecessary jargon. British English.

**Avoid:** empty agency buzzwords · exaggerated promises · unsupported
superlatives · generic AI phrasing · repetitive "we help businesses grow"
statements.

### Honesty rules — non-negotiable

Never invent results, metrics, testimonials, awards, accreditations, review
scores, partnerships or client relationships. Use only what the client
supplies. Label conceptual work clearly as concept, never as real client work.

### Using references

Burst Digital, Apple, Stripe, Linear, Vercel, Framer and Awwwards sites are
references for **principles and standards only**. Never copy their text,
graphics, layouts, animations, illustrations, case studies, client work,
branded assets or distinctive visual identity. Extract the underlying idea and
build an original Opti Reach interpretation — more refined, more technological
and more strategically focused than the source.

---

## 9. Imagery, video and graphics

Never add imagery just to fill space. Every asset needs a defined purpose.

**Candidate assets:** original 3D renders · digital product mockups · interface
animations · campaign dashboard concepts · analytics visualisations · brand
identity systems · device scenes · short looping video · high-quality office
and team photography · abstract technical diagrams · search-result and
AI-answer interface concepts · before/after transformations.

**Looping video must:** carry no distracting audio · be compressed · not delay
meaningful content · use a poster image · pause or simplify under reduced
motion · not autoplay unnecessarily on mobile.

Avoid generic stock photography that makes the agency feel fictional or
impersonal.

---

## 10. Technical direction

Continue with the existing architecture and conventions. **Inspect what is
already installed before introducing anything.**

Currently installed and available: `motion`, `lenis`, `webgl-fluid`, Tailwind
v4, Next.js 15 App Router, TypeScript.

Technologies that *may* be justified later: React Three Fiber · Three.js ·
Drei · GSAP · ScrollTrigger · Canvas · WebGL · SVG animation · native browser
APIs · CSS transforms.

**Do not auto-install any of these.** Introduce one only when:

- The planned experience genuinely requires it
- The outcome cannot be achieved efficiently with existing tools
- It will not create undue maintenance or performance cost
- It integrates cleanly with the existing Next.js architecture

Prefer the simplest suitable implementation. Never add a large animation
library for a minor hover effect. Prefer CSS transitions for simple hover and
colour changes; use `motion` for orchestrated or state-driven animation.

**`motion` is the default for animation. Do not hand-roll
`requestAnimationFrame` loops for work `motion` can orchestrate.** Refusing a
new library is not a licence to write the loop by hand — that is how the
preloader shipped a hang, because its RAF-driven completion never fired in a
throttled background tab.

Keep interactive and 3D components modular so they can be lazy-loaded and
maintained independently. Do not place a large client-only boundary around a
whole page when only one component needs client rendering.

**All copy and navigation data lives in `lib/content.ts`**, so desktop, mobile,
metadata and the sitemap read one source. Do not duplicate copy into components.

---

## 11. Performance requirements

Premium design must not cost performance. This is an SEO agency's own site, so
its Core Web Vitals are a sales asset a prospect can check in ten seconds.

### Budgets

Throttled mid-tier mobile profile, production build, never dev.

| Metric | Budget |
|---|---|
| LCP | ≤ 2.0s |
| CLS | < 0.05 |
| INP | < 200ms |
| Initial route JS, gzipped, excluding lazy immersive chunks | ≤ 170KB |
| Any single lazy immersive chunk, gzipped | ≤ 180KB |
| Lighthouse mobile Performance | ≥ 90 |
| Lighthouse Accessibility / SEO / Best Practices | 100 |

- The LCP element is always HTML text or a preloaded image. Never a canvas.
- Where §11 says limit device pixel ratio, the figure is `[1, 1.75]`.
- Measure sustained FPS on mount for any WebGL scene. If it holds below ~45fps
  for two seconds, unmount and show the static fallback silently.
- Self-host fonts, `font-display: swap`, subset to Latin, preload the display
  face only.
- Record each sprint's numbers in `PERF_LOG.md`. A sprint that regresses a
  budget is not done, and the regression is reported rather than absorbed.

### Techniques

- Lazy-load expensive experiences; dynamically import browser-only 3D.
- Never block initial render.
- Pause animation offscreen, and when the tab is hidden.
- Limit device pixel ratio for expensive WebGL scenes.
- Reduce particle counts on smaller or weaker devices.
- Use compressed geometry and optimised textures.
- Avoid oversized images and video; use responsive sizing.
- Prevent layout shift.
- Avoid unnecessary continuous render loops; prefer demand-based rendering.
- Dispose of WebGL resources; avoid memory leaks.
- Keep scrolling smooth; test CPU and GPU impact.

Important content and CTAs must remain available even if WebGL or JavaScript
fails. **Every complex visual needs a graceful static fallback.**

---

## 12. Accessibility and user control

- Respect `prefers-reduced-motion` **everywhere** (`lib/hooks/useReducedMotion`),
  with a reduced or static alternative in every case. Not merely where an
  animation seems significant: "significant" is a judgement call, and L1 is
  specified as *everywhere*, so the aggregate is large even when each instance
  reads as trivial on its own. §14's "reduced-motion path verified, not assumed"
  is the check on this, not a substitute for it.
- Maintain keyboard navigation and visible focus states.
- Never rely on colour alone; maintain readable contrast.
- Avoid flashing content and motion likely to cause discomfort.
- Use semantic HTML and meaningful alternative text.
- Never place essential copy inside a canvas-only experience.
- Keep all important links and CTAs available outside 3D scenes.

Immersive design must improve the experience without excluding anyone.

### Thresholds

- Contrast: 4.5:1 body text, 3:1 large text and UI boundaries.
- **Known trap, now solved — do not reintroduce.** Measured against the real
  tokens: `--color-accent` (#3B1EFF) is **7.46:1 on paper** and **6.67:1 on
  bone**, both fine, but only **2.48:1 on ink** (#12131A) — failing body text
  *and* the 3:1 floor for large text and UI.

  The fix is shipped: **`--accent-fg`** in `app/globals.css` resolves per theme —
  the raw accent on paper and bone, **`#8E7BFF` (5.67:1)** on ink, `--color-paper`
  on the accent ground, with a `:root` fallback for anything unthemed. Use
  `text-[var(--accent-fg)]` in any component that can appear on more than one
  ground. `text-accent` and literal `#3B1EFF` are for surfaces that are always
  light, or for elements carrying their own background (a solid accent button is
  white-on-indigo at 7.46:1 whatever sits behind it).
- One `h1` per page; heading order unbroken.
- Focus ring: 2px outline, 2px offset. Never `outline: none` without a
  replacement.
- Decorative canvas gets `aria-hidden="true"` alongside the §12 rule that
  essential copy never lives inside it.

### Forms

- Persistent visible labels. Placeholder-only labelling fails.
- Errors state what happened and how to fix it, in the interface's voice,
  without apologising.
- A control names its own outcome: "Send brief" produces "Brief sent."
- Full keyboard operation of nav, mega-menu, accordions and carousels. Escape
  closes; focus returns to the trigger.

---

## 13. Responsive design

Design desktop, tablet and mobile deliberately. **Do not simply shrink a
desktop 3D scene.**

For each immersive feature, decide explicitly:

- Does the full experience stay on mobile?
- Should geometry or particle counts drop?
- Does the interaction change from hover to tap?
- Is a lightweight animated version better?
- Is a static visual fallback better?

Mobile performance and clarity take priority over parity.

---

## 14. Sprint workflow

1. Inspect the existing implementation.
2. Define the commercial purpose.
3. Define the content hierarchy.
4. Propose original Opti Reach copy.
5. Propose the visual concept.
6. Decide whether imagery, video, motion, interaction or 3D adds genuine value.
7. Explain performance and mobile considerations.
8. Explain accessibility and reduced-motion behaviour.
9. List the files to be modified.
10. **Wait for approval when the task is primarily conceptual.**
11. Implement only the approved scope.
12. Test responsiveness, accessibility, lint, types and production build. Fix
    anything you caused.
13. Confirm protected areas were not changed.
14. Summarise the result.

No broad, unrequested changes. Complete one sprint before starting the next.

### Done

A sprint is complete only when all of the following hold:

- Types, lint and production build pass.
- Lighthouse mobile run on every changed route, logged to `PERF_LOG.md`, with
  no budget regression.
- Accessibility thresholds in §12 met on changed routes.
- Reduced-motion path verified, not assumed.
- The page still reads and converts with JavaScript disabled.
- `git diff` confirms no protected file changed.
- Screenshots at 375 / 768 / 1440 reviewed and self-critiqued before presenting.

Tag the commit at each sprint end so there is always a clean revert point.

### Sprint order

| Sprint | Scope | Status |
|---|---|---|
| 1 | Navigation and routing | Done |
| 2 | Homepage, section by section beneath the protected hero | Next |
| 3 | Services overview and individual service pages | |
| 4 | Case studies and portfolio storytelling | |
| 5 | About, Blog and Contact | |
| 6 | Immersive polish, page transitions, performance, accessibility, responsive | |

Plan 3D and interactive ideas throughout the earlier sprints rather than
adding them randomly in sprint 6.

---

## 15. Current state and open items

**Built:** protected hero with WebGL smoke cursor · premium navigation with
services mega menu · 11 routes, all prerendered static.

**Placeholder pages awaiting design:** five service detail pages, `/services`
overview, `/blog`.

**Beyond placeholder (approved exception):** `/case-studies`, `/about`.

**Launch blockers.** The items marked below must be resolved with real client
data before the site is made public, or before `NEXT_PUBLIC_SITE_INDEXABLE` is
set on any environment. Placeholder contact details on an indexed page are a
false representation of the business, and a public site without real Privacy
and Terms pages is a legal exposure. Neither is a cosmetic gap.

**Open items:**

- Blog article template and real posts
- **Launch blocker** — real contact details. `hello@optireach.co.uk` and
  `+44 20 7946 0412` are placeholders (the number is in the Ofcom fictional
  range)
- **Launch blocker** — Privacy policy and Terms currently link to `#`
- No awards or review-score strip exists, and none may be created without real
  credentials from the client
- Vercel Production Branch may not point at `redesign/creativeweb-direction`

**Verification caveat:** the in-app preview pane is frame-throttled and will
report animated end-states incorrectly. `CLAUDE.md` owns the environment
gotchas, including this one — read it before trusting anything the preview
tells you about a transition or a Motion animation.

---

## 16. Search, metadata and indexing

The agency sells search visibility. Its own site is the first thing a prospect
will inspect, and a technical SEO fault here costs more credibility than a
design flaw would.

- Every route sets a unique `title` and `meta description` through the App
  Router metadata API. No inherited or duplicated pairs.
- One `canonical` per route, pointing at the production domain. **Checked
  2026-07-26: `optireach.co.uk` is not registered** — Nominet returns "This
  domain name has not been registered", and DNS returns `NXDOMAIN`. Until it is
  bought and pointed at Vercel, canonicals must not name it.
- Canonical, OG URL and sitemap all derive from `siteOrigin` in
  `lib/site-url.ts`, which reads `NEXT_PUBLIC_SITE_URL` and otherwise falls back
  to the deployment's own hostname. `site.url` in `lib/content.ts` records the
  intended domain only; never canonicalise to it directly.
- Indexing is opt-in via `NEXT_PUBLIC_SITE_INDEXABLE=true`, set on the
  production environment and nowhere else. Without it `robots.ts` returns
  `disallow: /` and the root metadata sets `index: false`. This is the correct
  state while the build still carries placeholder contact details and concept
  case studies. Verify after any change to the Production Branch setting.
- `sitemap.ts` and `robots.ts` generated from the route list, not hand-written.
- JSON-LD: `Organization` and `WebSite` site-wide; `Service` on service pages;
  `BreadcrumbList` where nesting exists; `Article` on blog posts. **No
  `AggregateRating` or `Review` markup** until real, attributable reviews exist
  — inventing it breaches both the §8 honesty rules and Google's guidelines.
- Per-route OG images, 1200×630.
- Alt text describes the image for someone who cannot see it. Never
  keyword-stuffed — that fails accessibility and is a visible amateur tell on an
  SEO agency's own site.
- Headings express document structure, not keyword placement.
