"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { brand, site } from "@/lib/content";
import { EASE, hoverTransition } from "@/lib/motion";
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
          <motion.a
            href="#top"
            className="flex items-center gap-2"
            data-cursor="Top"
            whileHover="hover"
            initial="rest"
            animate="rest"
          >
            <motion.span
              variants={{ rest: { rotate: 0 }, hover: { rotate: -20 } }}
              transition={hoverTransition}
            >
              <LogoMark className="h-6 w-6 text-ink" />
            </motion.span>
            <span className="hidden font-display text-xl leading-none tracking-[-0.03em] md:block">
              {site.name}
            </span>
          </motion.a>

          <motion.button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            data-cursor="Open"
            className="flex items-center gap-2 rounded-full bg-ink py-1.5 pl-1.5 pr-4 text-paper"
            initial="rest"
            animate="rest"
            whileHover="hover"
            whileFocus="hover"
            whileTap={{ scale: 0.97 }}
            variants={{ rest: {}, hover: { backgroundColor: "#1B32FF" } }}
            transition={hoverTransition}
          >
            <motion.span
              className="grid h-7 w-7 place-items-center rounded-full bg-paper text-ink md:h-8 md:w-8"
              variants={{ rest: { rotate: 0 }, hover: { rotate: 90 } }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <PlusIcon className="h-3 w-3" />
            </motion.span>
            <span className="text-[11px]">{brand.menuLabel}</span>
          </motion.button>

          <ul className="hidden items-center gap-3 rounded-full bg-fog px-4 py-2.5 md:flex">
            {brand.navTags.map((tag) => (
              <li key={tag} className="text-[11px] text-ink/70">
                {tag}
              </li>
            ))}
          </ul>
        </div>

        <motion.a
          href="#contact"
          data-cursor="Say hi"
          className="pointer-events-auto flex items-center gap-2 rounded-full bg-fog py-1.5 pl-1.5 pr-1.5 md:pr-4"
          initial="rest"
          animate="rest"
          whileHover="hover"
          whileFocus="hover"
          whileTap={{ scale: 0.97 }}
          variants={{
            rest: { backgroundColor: "#E8E8EA", color: "#0A0A0B" },
            hover: { backgroundColor: "#0A0A0B", color: "#FFFFFF" },
          }}
          transition={hoverTransition}
        >
          <motion.span
            className="grid h-7 w-7 place-items-center rounded-full text-paper md:h-8 md:w-8"
            variants={{
              rest: { backgroundColor: "#0A0A0B", rotate: 0 },
              hover: { backgroundColor: "#1B32FF", rotate: 45 },
            }}
            transition={hoverTransition}
          >
            <GridIcon className="h-3 w-3 text-paper" />
          </motion.span>
          <span className="hidden text-[11px] md:block">{brand.ctaLabel}</span>
        </motion.a>
      </motion.header>

      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}
