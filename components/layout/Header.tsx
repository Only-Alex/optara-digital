"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { dropdownCta, nav, primaryCta, site } from "@/lib/content";
import { EASE, hoverTransition } from "@/lib/motion";
import { ArrowIcon, LogoMark, MenuIcon } from "@/components/ui/Icons";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { Button } from "@/components/ui/Button";
import { MobileMenu } from "./MobileMenu";

const OPEN_DELAY = 90;
const CLOSE_DELAY = 160;

// Layered rather than one flat drop: tight contact, mid diffusion, wide ambient.
const PANEL_SHADOW =
  "0 1px 2px rgba(18,19,26,0.04), 0 10px 28px rgba(18,19,26,0.06), 0 32px 72px rgba(18,19,26,0.10)";

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
          className="shell relative flex items-center justify-between gap-8 py-4"
          animate={{
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
            className="flex items-center gap-2.5"
            aria-label={`${site.name} — home`}
          >
            <LogoMark className="h-7 w-7 text-accent" />
            <span className="text-lg font-semibold tracking-[-0.02em]">
              {site.name}
            </span>
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
                      transition:
                        "background-color 200ms cubic-bezier(0.16,1,0.3,1), color 200ms cubic-bezier(0.16,1,0.3,1)",
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
            <a
              href={`tel:${site.phone.replace(/\s/g, "")}`}
              className="hidden text-[0.9375rem] text-ink/70 transition-colors duration-200 hover:text-accent xl:block"
            >
              {site.phone}
            </a>
            <Button
              href={primaryCta.href}
              className="hidden lg:inline-flex"
              withArrow
            >
              {primaryCta.label}
            </Button>
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
                className="absolute left-1/2 top-full hidden w-[min(64rem,calc(100vw-3rem))] -translate-x-1/2 pt-3 lg:block"
                initial={reduced ? undefined : { opacity: 0, y: 8, scale: 0.985 }}
                animate={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
                exit={reduced ? undefined : { opacity: 0, y: 6, scale: 0.99 }}
                transition={{ duration: 0.24, ease: EASE }}
                style={{
                  transformOrigin: "top center",
                  willChange: "transform, opacity",
                }}
                onMouseEnter={clearTimers}
                onMouseLeave={scheduleClose}
              >
                <div
                  className="rounded-[22px] border border-[rgba(18,19,26,0.06)] bg-paper/95 p-3 backdrop-blur-xl md:p-4"
                  style={{ boxShadow: PANEL_SHADOW }}
                >
                  <ul className="grid gap-1.5 md:grid-cols-2">
                    {megaEntry.children?.map((child, index) => {
                      const current = pathname === child.href;
                      const isLast =
                        index === (megaEntry.children?.length ?? 0) - 1;

                      return (
                        <li
                          key={child.href}
                          className={isLast ? "md:col-span-2" : undefined}
                        >
                          <Link
                            href={child.href}
                            onClick={() => closeMenu()}
                            aria-current={current ? "page" : undefined}
                            className={`group flex h-full items-start gap-4 rounded-[16px] p-5 transition-[background-color,transform] duration-[240ms] ${EASE_CSS} will-change-transform hover:-translate-y-[2px] hover:bg-accent/[0.045] ${
                              current ? "bg-accent/[0.045]" : ""
                            }`}
                          >
                            <span
                              className={`mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-[12px] text-accent transition-colors duration-[240ms] ${EASE_CSS} ${
                                current
                                  ? "bg-accent/[0.14]"
                                  : "bg-accent/[0.07] group-hover:bg-accent/[0.14]"
                              }`}
                            >
                              <ServiceIcon
                                name={child.icon}
                                className="h-[19px] w-[19px]"
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
                              <span className="mt-2 block max-w-[42ch] text-[0.8125rem] leading-[1.6] text-ink/50 transition-colors duration-[240ms] group-hover:text-ink/70">
                                {child.blurb}
                              </span>
                            </span>

                            <ArrowIcon
                              aria-hidden="true"
                              className={`mt-1 h-4 w-4 shrink-0 text-accent opacity-0 transition-all duration-[240ms] ${EASE_CSS} group-hover:translate-x-1 group-hover:opacity-100`}
                            />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="mt-2 border-t border-[rgba(18,19,26,0.06)]" />

                  <Link
                    href={dropdownCta.href}
                    onClick={() => closeMenu()}
                    className={`group flex flex-col gap-3 rounded-[16px] px-5 py-4 transition-colors duration-[240ms] ${EASE_CSS} hover:bg-bone/60 sm:flex-row sm:items-center sm:justify-between`}
                  >
                    <span className="block">
                      <span className="block text-[0.875rem] font-medium">
                        {dropdownCta.prompt}
                      </span>
                      <span className="mt-1 block text-[0.8125rem] text-ink/50">
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
