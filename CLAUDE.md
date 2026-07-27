# Optara Digital — Project Rules

**Read `docs/IMMERSIVE-DESIGN-SYSTEM.md` before planning or implementing any
significant visual, motion, 3D, video or interaction work.** That document owns
the creative direction and every rule with a threshold in it: vision, hero
rationale, 3D and motion, interaction, storytelling, voice, honesty, imagery,
technical direction, performance budgets, accessibility, responsive, search and
metadata, sprint workflow and sprint order.

Where this file and `docs/IMMERSIVE-DESIGN-SYSTEM.md` disagree, that document
wins. Report the conflict rather than silently picking one.

This file holds only what is needed in every session regardless of task.

---

## Stack

Premium marketing site for **Optara Digital**, a UK B2B digital marketing agency
(SEO, paid advertising, branding, social, web/app).

Next.js 15 App Router · TypeScript strict · Tailwind CSS v4 (CSS-first `@theme`
in `app/globals.css`, no `tailwind.config.js`) · `motion` (Framer Motion
successor) · `lenis` smooth scroll · `webgl-fluid`.

**Commands:** `npx tsc --noEmit` · `npx eslint .` · `npx next build --turbopack`

---

## Token names

`app/globals.css`: `--color-paper` `--color-bone` `--color-ink` `--color-accent`
`--color-accent-deep` `--color-line`.

Per-theme: `--bg` `--fg` `--hairline` `--muted` `--accent-fg`. Section grounds
are set with `data-theme="paper|bone|ink|accent"`.

Shared easing `EASE = cubic-bezier(0.16, 1, 0.3, 1)` in `lib/motion.ts`.
All copy and nav data in `lib/content.ts`.

Use `text-[var(--accent-fg)]`, not `text-accent`, in anything that can render on
a dark ground — see §12 of the design system for why.

---

## Protected files

Do not modify without an explicit request:

- `components/sections/Hero.tsx`
- `components/ui/FluidCursor.tsx`
- the hero-related tokens in `app/globals.css`

**Run `git diff` on all three after any nav or section work** and confirm they
are unchanged before reporting done. Rationale is in §2 of the design system.

---

## Current sprint

**Sprint 2 — homepage sections beneath the protected hero.** Full order and the
per-sprint definition of done are in §14 of the design system.

---

## Environment gotchas (learned the hard way)

- **The in-app preview pane is frame-throttled.** `getComputedStyle` returns the
  *start* value of any CSS transition or Motion animation, screenshots can be
  stale or mid-animation, synthetic scroll does not reliably advance Motion, and
  `readPixels` returns zeros without `preserveDrawingBuffer`. Verify structure
  and computed layout there, but treat unconfirmed hover and animation
  end-states as unverified and say so.
- **Never run `next build` while the dev server is running**, and never
  `rm -rf .next` while it is running — both corrupt the dev cache and serve a
  blank page. Stop the preview server first.
- Restart the dev server after adding a new route directory; the watcher
  sometimes misses it and returns a 404.

---

## Useful revert points

- `fluid-subtle` tag — subtler smoke-cursor tuning.
- `4080f73` — service pages before invented commercial claims were stripped.
