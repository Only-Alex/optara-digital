"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { nav, site } from "@/lib/content";
import { EASE, hoverTransition } from "@/lib/motion";
import { LogoMark, MenuIcon } from "@/components/ui/Icons";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { Button } from "@/components/ui/Button";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const [open, setOpen] = useState(false);
  const [lifted, setLifted] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
          <a href="#top" className="flex items-center gap-2.5">
            <LogoMark className="h-7 w-7 text-accent" />
            <span className="text-lg font-semibold tracking-[-0.02em]">
              {site.name}
            </span>
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-9 md:flex">
            {nav.map((item) => (
              <motion.a
                key={item.href}
                href={item.href}
                className="t-body relative text-[0.9375rem]"
                initial="rest"
                animate="rest"
                whileHover="hover"
                whileFocus="hover"
              >
                {item.label}
                <motion.span
                  className="absolute -bottom-1 left-0 h-px w-full origin-left bg-accent"
                  variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
                  transition={hoverTransition}
                />
              </motion.a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${site.phone.replace(/\s/g, "")}`}
              className="t-body hidden text-[0.9375rem] lg:block"
            >
              {site.phone}
            </a>
            <Button href="#contact" className="hidden md:inline-flex" withArrow>
              Book a call
            </Button>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label="Open menu"
              className="pill border border-[var(--hairline)] px-4 md:hidden"
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
