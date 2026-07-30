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

// Tight contact shadow plus a short diffusion. Deliberately no wide ambient
// pass, which is what made the panel read as a floating card.
const PANEL_SHADOW =
  "0 1px 2px rgba(18,19,26,0.05), 0 6px 16px rgba(18,19,26,0.06), 0 18px 36px rgba(18,19,26,0.07)";

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
    const onScroll = () => setLifted(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
          className="shell relative flex items-center justify-between gap-8"
          animate={{
            paddingTop: lifted ? "0.625rem" : "1rem",
            paddingBottom: lifted ? "0.625rem" : "1rem",
            backgroundColor:
              lifted || megaOpen
                ? "rgba(255,255,255,0.72)"
                : "rgba(255,255,255,0)",
            borderBottomColor:
              lifted || megaOpen ? "rgba(18,19,26,0.07)" : "rgba(18,19,26,0)",
            boxShadow:
              lifted || megaOpen
                ? "0 1px 0 rgba(255,255,255,0.6) inset, 0 8px 28px rgba(18,19,26,0.05)"
                : "0 0 0 rgba(18,19,26,0)",
          }}
          transition={{ duration: 0.4, ease: EASE }}
          style={{
            paddingTop: "1rem",
            paddingBottom: "1rem",
            borderBottomWidth: 1,
            borderBottomStyle: "solid",
            backdropFilter:
              lifted || megaOpen ? "blur(14px) saturate(1.6)" : "none",
            WebkitBackdropFilter:
              lifted || megaOpen ? "blur(14px) saturate(1.6)" : "none",
          }}
        >
          <Link
            href="/"
            className="flex items-center gap-3.5"
            aria-label={`${site.name} — home`}
          >
            <LogoMark className="h-8 w-8" />
            <Wordmark className="text-[0.9375rem]" />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => {
              const active = isActive(item.href);

              if (!item.children) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative rounded-full px-3.5 py-2 text-[0.9375rem] transition-colors duration-200 ${EASE_CSS} ${
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
                    className="relative flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[0.9375rem]"
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
            {/* Get Started removed on request (2026-07-28). The phone number
                steps up from 2xl to lg so the right side is not empty. */}
            <a
              href={`tel:${site.phone.replace(/\s/g, "")}`}
              className="hidden text-[0.9375rem] text-ink/70 transition-colors duration-200 hover:text-accent lg:block"
            >
              {site.phone}
            </a>
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
                // Vapour condensing into a surface: a long soft-blur resolve,
                // a slow top-to-bottom unroll, and only a hint of perspective
                // so it drifts down rather than hinging like a door. The
                // magic is in the resolve being slower than the movement.
                //
                // The unroll clip lives on the inner card, not here — clipping
                // this wrapper would shear off the vapour and bloom that hug
                // the card's borders from outside.
                initial={
                  reduced
                    ? undefined
                    : {
                        opacity: 0,
                        rotateX: -8,
                        y: 12,
                        scale: 0.98,
                        filter: "blur(14px)",
                      }
                }
                animate={
                  reduced
                    ? undefined
                    : {
                        opacity: 1,
                        rotateX: 0,
                        y: 0,
                        scale: 1,
                        filter: "blur(0px)",
                      }
                }
                exit={
                  reduced
                    ? undefined
                    : {
                        opacity: 0,
                        rotateX: -4,
                        y: 6,
                        filter: "blur(8px)",
                        transition: { duration: 0.22, ease: EASE },
                      }
                }
                transition={{
                  duration: 0.5,
                  ease: EASE,
                  filter: { duration: 0.56, ease: EASE },
                }}
                style={{
                  transformOrigin: "top center",
                  transformPerspective: 1100,
                  willChange: "transform, opacity, filter",
                }}
                onMouseEnter={clearTimers}
                onMouseLeave={scheduleClose}
              >
                {/* One-off bloom of accent light while the panel condenses —
                    it flares and dies, never persists. Light is what sells
                    materialisation; the flat accent, not a hue ramp. */}
                {!reduced && (
                  <motion.div
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-4 top-0 rounded-[30px]"
                    style={{
                      background:
                        "radial-gradient(55% 60% at 50% 0%, rgba(91, 61, 245,0.18), transparent 72%)",
                      filter: "blur(16px)",
                    }}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: [0, 0.85, 0], scale: [0.92, 1.02, 1] }}
                    transition={{ duration: 1.0, ease: EASE, times: [0, 0.35, 1] }}
                  />
                )}

                <motion.div
                  className="relative rounded-[22px] border border-[rgba(18,19,26,0.07)] bg-paper/[0.985] p-2.5 backdrop-blur-sm md:p-3"
                  style={{ boxShadow: PANEL_SHADOW }}
                  initial={
                    reduced
                      ? undefined
                      : { clipPath: "inset(0 0 88% 0 round 22px)" }
                  }
                  animate={
                    reduced
                      ? undefined
                      : { clipPath: "inset(0 0 0% 0 round 22px)" }
                  }
                  exit={
                    reduced
                      ? undefined
                      : {
                          clipPath: "inset(0 0 22% 0 round 22px)",
                          transition: { duration: 0.22, ease: EASE },
                        }
                  }
                  transition={{ duration: 0.56, ease: EASE }}
                >
                  {/* Six services, an even two-by-three grid — no spanning
                      special cases, which is most of what makes it clean. */}
                  <ul className="grid gap-1 md:grid-cols-2">
                    {megaEntry.children?.map((child, index) => {
                      const current = pathname === child.href;

                      return (
                        // Rows condense in just behind the unroll, top pair
                        // first — the cascade is what sells the scroll. No
                        // exit: the panel's own exit carries the close.
                        <motion.li
                          key={child.href}
                          initial={
                            reduced
                              ? undefined
                              : {
                                  opacity: 0,
                                  y: 12,
                                  scale: 0.97,
                                  filter: "blur(6px)",
                                }
                          }
                          animate={
                            reduced
                              ? undefined
                              : {
                                  opacity: 1,
                                  y: 0,
                                  scale: 1,
                                  filter: "blur(0px)",
                                }
                          }
                          transition={{
                            duration: 0.45,
                            ease: EASE,
                            delay: 0.12 + Math.floor(index / 2) * 0.06,
                          }}
                        >
                          <Link
                            href={child.href}
                            onClick={() => closeMenu()}
                            aria-current={current ? "page" : undefined}
                            className={`group flex h-full items-start gap-4 rounded-[16px] p-4 transition-[background-color,transform] duration-[240ms] ${EASE_CSS} will-change-transform hover:-translate-y-[2px] hover:bg-accent/[0.045] ${
                              current ? "bg-accent/[0.045]" : ""
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
                              <span className="mt-1.5 block max-w-[40ch] text-[0.8125rem] leading-[1.55] text-ink/60 transition-colors duration-[240ms] group-hover:text-ink/75">
                                {child.blurb}
                              </span>
                            </span>

                            <ArrowIcon
                              aria-hidden="true"
                              className={`mt-1 h-4 w-4 shrink-0 text-accent opacity-0 transition-all duration-[240ms] ${EASE_CSS} group-hover:translate-x-1 group-hover:opacity-100`}
                            />
                          </Link>
                        </motion.li>
                      );
                    })}
                  </ul>

                  <div className="mx-4 mt-1.5 border-t border-[rgba(18,19,26,0.07)]" />

                  <Link
                    href={dropdownCta.href}
                    onClick={() => closeMenu()}
                    className={`group flex flex-col gap-2 rounded-[16px] px-4 py-3 transition-colors duration-[240ms] ${EASE_CSS} hover:bg-bone/60 sm:flex-row sm:items-center sm:justify-between sm:gap-6`}
                  >
                    <span className="block">
                      <span className="block text-[0.875rem] font-medium leading-tight">
                        {dropdownCta.prompt}
                      </span>
                      <span className="mt-1 block text-[0.8125rem] leading-[1.5] text-ink/60">
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
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.header>

      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}
