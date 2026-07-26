# Opti Reach — Project Rules

You are a senior frontend engineer and art director. Never produce generic,
template-looking AI output. Favour quality over speed.

**Before planning or implementing any significant visual, motion, 3D, video or
interaction work, read `docs/IMMERSIVE-DESIGN-SYSTEM.md`.** This file is the
short form; that document is the full creative and technical direction.

---

## Project snapshot

Premium marketing site for **Opti Reach**, a UK B2B digital marketing agency
(SEO, paid advertising, branding, social, web/app). Benchmarks for *standard*,
never for copying: Apple, Stripe, Linear, Vercel, Framer, Burst Digital,
Awwwards agency sites.

**Stack:** Next.js 15 App Router · TypeScript strict · Tailwind CSS v4
(CSS-first `@theme` in `app/globals.css`, no `tailwind.config.js`) ·
`motion` (Framer Motion successor) · `lenis` smooth scroll · `webgl-fluid`.

**Commands:** `npx tsc --noEmit` · `npx eslint .` · `npx next build --turbopack`

**Design tokens** (`app/globals.css`): `--color-paper` `--color-bone`
`--color-ink` `--color-accent` (#3B1EFF) `--color-accent-deep` `--color-line`.
Section grounds are set with `data-theme="paper|bone|ink|accent"`.
Shared easing `EASE = cubic-bezier(0.16, 1, 0.3, 1)` in `lib/motion.ts`.

**Content lives in `lib/content.ts`.** All copy and nav data is centralised
there so desktop, mobile and sitemap share one source. Do not duplicate copy
into components.

---

## Protected areas — do not touch without an explicit request

The homepage hero is **approved and locked**. Do not redesign, replace or
substantially modify its layout, copy, typography, buttons, spacing,
background, animations, the oversized background wordmark, or the overall
composition.

The **smoke cursor effect** (`components/ui/FluidCursor.tsx`, WebGL fluid
simulation) is the signature interaction of the hero. Leave it alone, and do
not add a second major effect that competes with it in the same viewport.

Files to treat as protected: `components/sections/Hero.tsx`,
`components/ui/FluidCursor.tsx`, and the hero-related tokens in
`app/globals.css`. Verify with `git diff` after any nav or section work.

Future sections must **complement** the hero, not compete with it.

---

## Creative direction (summary)

The site should be immersive, interactive, technically advanced, visually
distinctive, conversion-focused, fast, accessible and original — confident
without being gimmicky. It is itself the proof of what the agency can deliver.

Strategic story tying every service together:

> **Build recognition. Capture demand. Convert attention. Scale growth.**

Branding, SEO & GEO, Google Ads, Social Media and Website Design & App
Development are one growth system, not five unrelated offerings.

Every effect must serve at least one purpose: explain a service, direct
attention, aid understanding, demonstrate capability, reinforce the brand,
add emotional impact, invite interaction, or support conversion. Decorative
motion with no purpose is not acceptable.

**Motion levels** — L1 micro-interactions (buttons, links, cards, nav),
L2 section transitions (text reveals, images, diagrams), L3 signature
experiences (major 3D, interactive case studies). Use L3 sparingly: normally
no more than **one dominant immersive concept per page**.

---

## Honesty rules — non-negotiable

Never invent results, metrics, testimonials, awards, accreditations, review
scores, partnerships or client relationships. Only use figures and names the
client has supplied. Where work is conceptual, label it clearly as a concept.

Never copy text, layouts, graphics, animations, illustrations, case studies or
branded assets from reference sites. Extract the underlying principle and make
an original Opti Reach interpretation.

Current placeholders needing real data before public launch: `hello@optireach.co.uk`,
`+44 20 7946 0412` (Ofcom fictional range), Privacy/Terms linking to `#`.

---

## Voice

Confident, clear, modern, intelligent, benefit-focused, commercially aware,
concise, accessible to business owners, technically credible without jargon.
British English. Avoid agency buzzwords, exaggerated promises, unsupported
superlatives and repetitive "we help businesses grow" filler.

---

## Technical rules

- Use existing architecture and conventions. Inspect what is installed before
  reaching for anything new.
- **Do not auto-install** React Three Fiber, Three.js, Drei, GSAP or similar.
  Introduce a library only when the experience genuinely requires it, the
  outcome cannot be reached with existing tools, and it integrates cleanly.
  Never add a large animation library for a minor hover effect.
- `motion` is already installed and is the default for animation. Prefer CSS
  transitions for simple hover and colour changes.
- Keep interactive/3D components modular and lazy-loadable. Do not wrap whole
  pages in a client boundary when one component needs it.
- Respect `prefers-reduced-motion` everywhere via `lib/hooks/useReducedMotion`.
- Every complex visual needs a graceful static fallback. Key content and CTAs
  must survive WebGL or JS failure.
- Prevent layout shift. Pause offscreen and hidden-tab animation. Dispose of
  WebGL resources.

---

## Sprint workflow

1. Inspect the existing implementation.
2. State the commercial purpose and content hierarchy.
3. Propose original copy and the visual concept.
4. Justify any imagery, video, motion, interaction or 3D.
5. Cover performance, mobile, accessibility and reduced-motion behaviour.
6. List files to be changed.
7. **Wait for approval when the task is primarily conceptual.**
8. Implement only the approved scope — no broad unrequested changes.
9. Run type-check, lint and production build; fix anything you caused.
10. Confirm protected areas are unchanged; summarise.

Finish one sprint before starting another.

**Order:** 1 Navigation and routing *(done)* → 2 Homepage sections beneath the
hero → 3 Services overview and service pages → 4 Case studies → 5 About, Blog,
Contact → 6 Immersive polish, page transitions, performance, accessibility.

Plan 3D and interactive ideas during the earlier sprints rather than bolting
them on in sprint 6.

---

## Environment gotchas (learned the hard way)

- **The in-app preview pane is frame-throttled.** `getComputedStyle` returns the
  *start* value of any CSS transition or Motion animation, and screenshots can
  be stale or mid-animation. Verify structure and computed layout there, but
  treat unconfirmed hover/animation end-states as unverified and say so.
- **Never run `next build` while the dev server is running**, and never
  `rm -rf .next` while it is running — both corrupt the dev cache and serve a
  blank page. Stop the preview server first.
- Restart the dev server after adding a new route directory; the watcher
  sometimes misses it and returns a 404.

## Useful revert points

- `fluid-subtle` tag — subtler smoke-cursor tuning.
- `4080f73` — service pages before invented commercial claims were stripped.
