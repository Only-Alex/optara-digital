"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { brand, site } from "@/lib/content";
import { EASE } from "@/lib/motion";
import { LogoMark, PlusIcon, GridIcon } from "@/components/ui/Icons";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  return (
    <>
      <motion.header
        className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between p-4 md:px-8 md:py-6"
        initial={reduced ? undefined : { opacity: 0, y: -16 }}
        animate={reduced ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <div className="pointer-events-auto flex items-center gap-3">
          <a href="#top" className="flex items-center gap-2" data-cursor="Top">
            <LogoMark className="h-6 w-6 text-ink" />
            <span className="hidden font-display text-xl leading-none tracking-[-0.03em] md:block">
              {site.name}
            </span>
          </a>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            data-cursor="Open"
            className="group flex items-center gap-2 rounded-full bg-ink py-1.5 pl-1.5 pr-4 text-paper transition-colors duration-200 hover:bg-blue"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-paper text-ink transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-90 md:h-8 md:w-8">
              <PlusIcon className="h-3 w-3" />
            </span>
            <span className="text-[11px]">{brand.menuLabel}</span>
          </button>

          <ul className="hidden items-center gap-3 rounded-full bg-fog px-4 py-2.5 md:flex">
            {brand.navTags.map((tag) => (
              <li key={tag} className="text-[11px] text-ink/70">
                {tag}
              </li>
            ))}
          </ul>
        </div>

        <a
          href="#contact"
          data-cursor="Say hi"
          className="group pointer-events-auto flex items-center gap-2 rounded-full bg-fog py-1.5 pl-1.5 pr-1.5 transition-colors duration-200 hover:bg-ink md:pr-4"
        >
          <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-paper transition-colors duration-200 group-hover:bg-blue md:h-8 md:w-8">
            <GridIcon className="h-3 w-3" />
          </span>
          <span className="hidden text-[11px] transition-colors duration-200 group-hover:text-paper md:block">
            {brand.ctaLabel}
          </span>
        </a>
      </motion.header>

      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}
