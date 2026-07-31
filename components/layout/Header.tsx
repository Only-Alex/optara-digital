"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { dropdownCta, nav, site } from "@/lib/content";
import { EASE, hoverTransition } from "@/lib/motion";
import { ArrowIcon, LogoMark, MenuIcon } from "@/components/ui/Icons";
import { Wordmark } from "@/components/ui/Wordmark";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { MobileMenu } from "./MobileMenu";

const OPEN_DELAY = 90;
const CLOSE_DELAY = 160;

/**
 * Scroll positions where the bar changes state, in pixels.
 *
 * Two values, not one: entering compact and leaving it happen at different
 * points, so a reader hovering right on the boundary cannot flip the bar back
 * and forth. The gap is wide enough to swallow trackpad drift and the rubber
 * band at the top of the page.
 *
 * ENTER also sits well clear of the hero's own opening, so the change reads as
 * "I have started reading" rather than as a twitch on the first nudge.
 */
const COMPACT_ENTER = 120;
const COMPACT_EXIT = 70;

/** Compact logo scale. Small enough to settle the bar, not so small it reads as a different mark. */
const COMPACT_LOGO_SCALE = 0.93;

// A tight contact line and one soft diffusion — enough for the panel to stand
// clear of whatever section is behind it without reading as elevation.
const PANEL_SHADOW =
  "0 1px 2px rgba(15,15,22,0.04), 0 18px 50px rgba(15,15,22,0.08)";

const EASE_CSS = "ease-[cubic-bezier(0.16,1,0.3,1)]";

export function Header() {
  const [open, setOpen] = useState(false);
  const [lifted, setLifted] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const pathname = usePathname();

  const openTimer = useRef<number | undefined>(undefined);
  const closeTimer = useRef<number | undefined>(undefined);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    let queued = false;

    const measure = () => {
      queued = false;
      const y = window.scrollY;
      // Hysteresis: which threshold applies depends on the state we are in.
      // React bails out when the next value equals the current one, so this
      // re-renders only on an actual crossing, not on every frame of scrolling.
      setLifted((prev) => (prev ? y > COMPACT_EXIT : y > COMPACT_ENTER));
    };

    // Coalesced to one read per frame. Scroll fires far more often than that,
    // and reading scrollY straight from the handler would sample layout at
    // whatever rate the browser chooses to deliver events.
    const onScroll = () => {
      if (queued) return;
      queued = true;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const clearTimers = useCallback(() => {
    window.clearTimeout(openTimer.current);
    window.clearTimeout(closeTimer.current);
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  useEffect(() => {
    setOpenMenu(null);
  }, [pathname]);

  const closeMenu = useCallback(
    (returnFocusTo?: string) => {
      clearTimers();
      setOpenMenu(null);
      if (returnFocusTo) triggerRefs.current[returnFocusTo]?.focus();
    },
    [clearTimers],
  );

  useEffect(() => {
    if (!openMenu) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu(openMenu);
    };

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (triggerRefs.current[openMenu]?.contains(target)) return;
      closeMenu();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [openMenu, closeMenu]);

  const scheduleOpen = (label: string) => {
    clearTimers();
    openTimer.current = window.setTimeout(() => setOpenMenu(label), OPEN_DELAY);
  };

  const scheduleClose = () => {
    clearTimers();
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), CLOSE_DELAY);
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const megaEntry = nav.find((item) => item.children);
  const megaOpen = Boolean(megaEntry && openMenu === megaEntry.label);

  // The bar carries a surface when the reader has scrolled, and also whenever
  // the mega menu is open at the top of the page — the panel needs something
  // to sit against rather than floating free over the hero.
  const surfaced = lifted || megaOpen;

  // Reduced motion still gets both states, it just arrives at them instantly:
  // the brief is to remove the interpolation, not the behaviour.
  const motionTransition = reduced
    ? { duration: 0 }
    : { duration: 0.3, ease: EASE };

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        initial={reduced ? undefined : { opacity: 0, y: -16 }}
        animate={reduced ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <motion.div
          // Compact scrolled state: the bar loses a third of its padding once
          // the reader leaves the hero. Padding animates rather than height,
          // so nothing inside reflows; the header is fixed, so the page never
          // shifts; and the mega menu is anchored to this shell's bottom edge,
          // so it tracks the compact state automatically.
          //
          // Blur comes from classes rather than the animated style below, both
          // because a filter is far too expensive to interpolate and because a
          // class can carry a breakpoint: phones get a lighter blur than
          // laptops, which is where the cost actually bites.
          // The tighter gap is confined to 1024-1279, the only band where the
          // lockup, six nav items and the number compete for the same row. At
          // 1280 and above the approved spacing is untouched.
          className={`shell relative flex items-center justify-between gap-8 lg:max-xl:gap-4 ${
            surfaced
              ? "backdrop-blur-[10px] backdrop-saturate-[1.6] lg:backdrop-blur-[14px]"
              : ""
          }`}
          animate={{
            paddingTop: lifted ? "0.625rem" : "1rem",
            paddingBottom: lifted ? "0.625rem" : "1rem",
            // Near-opaque, so navigation stays legible over the dark sections
            // and over the hero's blues without the bar having to restyle
            // itself per section. Still short of solid, so the page beneath
            // reads through it and it never becomes a white slab.
            backgroundColor: surfaced
              ? "rgba(255,255,255,0.92)"
              : "rgba(255,255,255,0)",
            borderBottomColor: surfaced
              ? "rgba(18,19,26,0.09)"
              : "rgba(18,19,26,0)",
            // The inset hairline is what keeps a near-white bar from looking
            // flat against a white page; the drop is barely there on purpose.
            boxShadow: surfaced
              ? "0 1px 0 rgba(255,255,255,0.6) inset, 0 8px 28px rgba(15,15,22,0.05)"
              : "0 0 0 rgba(15,15,22,0)",
          }}
          transition={motionTransition}
          style={{
            paddingTop: "1rem",
            paddingBottom: "1rem",
            borderBottomWidth: 1,
            borderBottomStyle: "solid",
          }}
        >
          {/* Scaled by transform rather than by font and icon size, so the
              lockup keeps its exact proportions and, more importantly, takes
              no layout with it — the nav beside it cannot shift as the bar
              changes state. Anchored left so it shrinks toward the gutter
              instead of drifting inward. */}
          <motion.div
            animate={{ scale: lifted ? COMPACT_LOGO_SCALE : 1 }}
            transition={motionTransition}
            style={{ originX: 0, originY: 0.5 }}
          >
            <Link
              href="/"
              className="flex items-center gap-3.5"
              aria-label={`${site.name} — home`}
            >
              <LogoMark className="h-8 w-8" />
              <Wordmark className="text-[1.125rem]" />
            </Link>
          </motion.div>

          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => {
              const active = isActive(item.href);

              if (!item.children) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative whitespace-nowrap rounded-full px-3.5 py-2 text-[0.9375rem] transition-colors duration-200 lg:max-xl:px-2.5 ${EASE_CSS} ${
                      active ? "text-accent" : "text-[var(--fg)] hover:text-accent"
                    }`}
                  >
                    {item.label}
                    {active && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 -bottom-0.5 mx-auto h-[3px] w-[3px] rounded-full bg-accent"
                      />
                    )}
                  </Link>
                );
              }

              const expanded = openMenu === item.label;

              return (
                <div
                  key={item.href}
                  onMouseEnter={() => scheduleOpen(item.label)}
                  onMouseLeave={scheduleClose}
                >
                  <motion.button
                    ref={(node) => {
                      triggerRefs.current[item.label] = node;
                    }}
                    type="button"
                    style={{
                      backgroundColor: expanded
                        ? "rgba(244,242,237,0.9)"
                        : "transparent",
                      color:
                        expanded || active ? "rgb(59,30,255)" : "rgb(18,19,26)",
                      // Faint halo while open — the trigger is the wand, the
                      // panel is what it conjured; the glow ties them together.
                      boxShadow: expanded
                        ? "0 4px 20px rgba(91, 61, 245,0.2)"
                        : "0 0 0 rgba(91, 61, 245,0)",
                      transition:
                        "background-color 200ms cubic-bezier(0.16,1,0.3,1), color 200ms cubic-bezier(0.16,1,0.3,1), box-shadow 300ms cubic-bezier(0.16,1,0.3,1)",
                    }}
                    aria-expanded={expanded}
                    aria-controls="services-mega-menu"
                    onClick={() =>
                      expanded ? closeMenu(item.label) : setOpenMenu(item.label)
                    }
                    onFocus={() => setOpenMenu(item.label)}
                    onKeyDown={(event) => {
                      if (event.key === "ArrowDown") {
                        event.preventDefault();
                        setOpenMenu(item.label);
                        window.setTimeout(
                          () =>
                            panelRef.current
                              ?.querySelector<HTMLAnchorElement>("a[href]")
                              ?.focus(),
                          40,
                        );
                      }
                    }}
                    className="relative flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-[0.9375rem] lg:max-xl:px-2.5"
                  >
                    {item.label}
                    <motion.svg
                      viewBox="0 0 24 24"
                      className="h-3.5 w-3.5 opacity-60"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      animate={{ rotate: expanded ? 180 : 0 }}
                      transition={hoverTransition}
                    >
                      <path d="M6 9l6 6 6-6" />
                    </motion.svg>
                    {active && !expanded && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 -bottom-0.5 mx-auto h-[3px] w-[3px] rounded-full bg-accent"
                      />
                    )}
                  </motion.button>
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {/* Get Started removed on request (2026-07-28). The telephone
                number that used to sit here is deliberately absent: it is in
                Ofcom's 020 7946 0xxx range, reserved for fiction, so a
                clickable tel: link to it is a dead end dressed as a contact
                route. Contact takes its place. Reinstate once a real line
                exists. */}
            <Link
              href="/contact"
              className="hidden whitespace-nowrap text-[0.9375rem] text-ink/70 transition-colors duration-200 hover:text-accent lg:block"
            >
              Contact
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label="Open menu"
              className="pill border border-[var(--hairline)] px-4 lg:hidden"
            >
              <MenuIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Anchored to the header shell rather than the trigger, so the panel
              stays centred and can never overflow the viewport on laptops. */}
          <AnimatePresence>
            {megaEntry && megaOpen && (
              <motion.div
                ref={panelRef}
                id="services-mega-menu"
                className="absolute left-1/2 top-full hidden w-[min(58rem,calc(100vw-3rem))] -translate-x-1/2 pt-3 lg:block"
                // A drop of a few pixels and a fade, nothing else: a menu is a
                // tool the reader reaches for mid-task, so it should feel
                // immediate rather than staged. Closing runs faster than
                // opening — dismissal should never linger. Under reduced
                // motion the variants collapse to plain visibility.
                initial={reduced ? undefined : { opacity: 0, y: -5 }}
                animate={reduced ? undefined : { opacity: 1, y: 0 }}
                exit={
                  reduced
                    ? undefined
                    : {
                        opacity: 0,
                        y: -3,
                        transition: { duration: 0.16, ease: EASE },
                      }
                }
                transition={{ duration: 0.22, ease: EASE }}
                onMouseEnter={clearTimers}
                onMouseLeave={scheduleClose}
              >
                {/* Near-opaque, no backdrop blur: at this opacity a blur costs
                    compositing and shows nothing, and the page behind must
                    never interfere with the menu's own text. */}
                <div className="relative rounded-[22px] border border-[rgba(15,15,22,0.08)] bg-paper/[0.985] p-2.5 md:p-3"
                  style={{ boxShadow: PANEL_SHADOW }}
                >
                  {/* Six services, an even two-by-three grid — no spanning
                      special cases, which is most of what makes it clean. */}
                  <ul className="grid gap-1 md:grid-cols-2">
                    {megaEntry.children?.map((child) => {
                      const current = pathname === child.href;

                      return (
                        // Plain rows: they arrive with the panel. The stagger
                        // was theatre, and a menu re-opened four times a visit
                        // cannot afford theatre.
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={() => closeMenu()}
                            aria-current={current ? "page" : undefined}
                            // Hover is a tint, not a lift — the row answers
                            // without the grid appearing to move. Focus gets
                            // the same tint plus the global accent ring, so
                            // keyboard reads as deliberate, not as hover.
                            className={`group flex h-full items-start gap-4 rounded-[16px] p-4 transition-colors duration-[220ms] ${EASE_CSS} hover:bg-accent/[0.055] focus-visible:bg-accent/[0.055] focus-visible:outline-offset-[-2px] ${
                              current ? "bg-accent/[0.055]" : ""
                            }`}
                          >
                            <span
                              className={`mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-[13px] text-accent transition-colors duration-[240ms] ${EASE_CSS} ${
                                current
                                  ? "bg-accent/[0.14]"
                                  : "bg-accent/[0.07] group-hover:bg-accent/[0.14]"
                              }`}
                            >
                              <ServiceIcon
                                name={child.icon}
                                className="h-5 w-5"
                              />
                            </span>

                            <span className="min-w-0 flex-1">
                              <span
                                className={`block text-[0.9375rem] font-medium leading-tight transition-colors duration-[240ms] ${EASE_CSS} group-hover:text-accent ${
                                  current ? "text-accent" : ""
                                }`}
                              >
                                {child.label}
                              </span>
                              {/* 14px at ink/70 — the step up from 13px/60
                                  that makes blurbs readable on an ordinary
                                  laptop while staying clearly beneath the
                                  titles. */}
                              <span className="mt-1.5 block max-w-[40ch] text-[0.875rem] leading-[1.55] text-ink/70 transition-colors duration-[220ms] group-hover:text-ink/80">
                                {child.blurb}
                              </span>
                            </span>

                            <ArrowIcon
                              aria-hidden="true"
                              className={`mt-1 h-4 w-4 shrink-0 text-accent opacity-0 transition-all duration-[220ms] ${EASE_CSS} group-hover:translate-x-1 group-hover:opacity-100 group-focus-visible:translate-x-1 group-focus-visible:opacity-100`}
                            />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="mx-4 mt-1.5 border-t border-[rgba(18,19,26,0.07)]" />

                  <Link
                    href={dropdownCta.href}
                    onClick={() => closeMenu()}
                    className={`group flex flex-col gap-2 rounded-[16px] px-4 py-3 transition-colors duration-[220ms] ${EASE_CSS} hover:bg-bone/60 focus-visible:bg-bone/60 focus-visible:outline-offset-[-2px] sm:flex-row sm:items-center sm:justify-between sm:gap-6`}
                  >
                    <span className="block">
                      <span className="block text-[0.875rem] font-medium leading-tight">
                        {dropdownCta.prompt}
                      </span>
                      <span className="mt-1 block text-[0.8125rem] leading-[1.5] text-ink/70">
                        {dropdownCta.sub}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-1.5 text-[0.875rem] font-medium text-accent">
                      {dropdownCta.label}
                      <ArrowIcon
                        aria-hidden="true"
                        className={`h-4 w-4 transition-transform duration-[240ms] ${EASE_CSS} group-hover:translate-x-1`}
                      />
                    </span>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.header>

      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}
