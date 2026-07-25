"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { nav, site } from "@/lib/content";
import { EASE, hoverTransition } from "@/lib/motion";
import { LogoMark, MenuIcon } from "@/components/ui/Icons";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { Button } from "@/components/ui/Button";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const [open, setOpen] = useState(false);
  const [lifted, setLifted] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const closeTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMenu(null);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const scheduleClose = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), 140);
  };

  const cancelClose = () => window.clearTimeout(closeTimer.current);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        initial={reduced ? undefined : { opacity: 0, y: -16 }}
        animate={reduced ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <motion.div
          className="shell flex items-center justify-between gap-6 py-4"
          animate={{
            backgroundColor: lifted ? "rgba(255,255,255,0.86)" : "rgba(255,255,255,0)",
          }}
          transition={hoverTransition}
          style={{ backdropFilter: lifted ? "blur(12px)" : "none" }}
        >
          <Link href="/" className="flex items-center gap-2.5">
            <LogoMark className="h-7 w-7 text-accent" />
            <span className="text-lg font-semibold tracking-[-0.02em]">
              {site.name}
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
            {nav.map((item) => {
              if (!item.children) {
                return (
                  <motion.span key={item.href} initial="rest" whileHover="hover">
                    <Link
                      href={item.href}
                      className="t-body relative inline-block text-[0.9375rem]"
                    >
                      {item.label}
                      <motion.span
                        className="absolute -bottom-1 left-0 h-px w-full origin-left bg-accent"
                        variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
                        transition={hoverTransition}
                      />
                    </Link>
                  </motion.span>
                );
              }

              const expanded = openMenu === item.label;

              return (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => {
                    cancelClose();
                    setOpenMenu(item.label);
                  }}
                  onMouseLeave={scheduleClose}
                >
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-haspopup="true"
                    onClick={() => setOpenMenu(expanded ? null : item.label)}
                    onFocus={() => setOpenMenu(item.label)}
                    className="t-body flex items-center gap-1.5 text-[0.9375rem]"
                  >
                    {item.label}
                    <motion.svg
                      viewBox="0 0 24 24"
                      className="h-3.5 w-3.5"
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
                  </button>

                  <AnimatePresence>
                    {expanded && (
                      <motion.div
                        className="absolute left-1/2 top-full z-50 w-[22rem] -translate-x-1/2 pt-4"
                        initial={reduced ? undefined : { opacity: 0, y: -8 }}
                        animate={reduced ? undefined : { opacity: 1, y: 0 }}
                        exit={reduced ? undefined : { opacity: 0, y: -8 }}
                        transition={{ duration: 0.22, ease: EASE }}
                      >
                        <ul className="card overflow-hidden p-2 shadow-[0_18px_50px_rgba(18,19,26,0.12)]">
                          {item.children.map((child) => (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                onClick={() => setOpenMenu(null)}
                                className="block rounded-[var(--radius-sm)] px-4 py-3 transition-colors duration-200 hover:bg-bone"
                              >
                                <span className="t-body block font-medium">
                                  {child.label}
                                </span>
                                <span className="t-caption mt-1 block text-[var(--muted)]">
                                  {child.blurb}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${site.phone.replace(/\s/g, "")}`}
              className="t-body hidden text-[0.9375rem] xl:block"
            >
              {site.phone}
            </a>
            <Button href="/contact" className="hidden lg:inline-flex" withArrow>
              Book a call
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
        </motion.div>
      </motion.header>

      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}
