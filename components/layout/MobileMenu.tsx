"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EASE } from "@/lib/motion";
import { nav, site } from "@/lib/content";
import { CloseIcon, LogoMark } from "@/components/ui/Icons";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function MobileMenu({ open, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusables || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.removeProperty("overflow");
      previous?.focus();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          data-theme="dark"
          className="fixed inset-0 z-[60] flex flex-col bg-void text-paper"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <div className="flex items-center justify-between p-4 md:px-8 md:py-6">
            <span className="flex items-center gap-2">
              <LogoMark className="h-6 w-6 text-paper" />
              <span className="font-display text-xl leading-none tracking-[-0.03em]">
                {site.name}
              </span>
            </span>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              data-cursor="Close"
              className="group flex items-center gap-2 rounded-full bg-paper py-1.5 pl-1.5 pr-4 text-ink transition-colors duration-200 hover:bg-blue hover:text-paper"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-paper transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-90 md:h-8 md:w-8">
                <CloseIcon className="h-3 w-3" />
              </span>
              <span className="text-[11px]">Close</span>
            </button>
          </div>

          <nav aria-label="Primary" className="shell flex flex-1 items-center">
            <ul className="flex w-full flex-col gap-4">
              {nav.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    ease: EASE,
                    delay: 0.15 + i * 0.06,
                  }}
                >
                  <a
                    href={item.href}
                    onClick={onClose}
                    data-cursor="Go"
                    className="t-display-lg inline-block transition-colors duration-200 hover:text-blue"
                  >
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </nav>

          <div className="shell pb-10">
            <a href={`mailto:${site.email}`} className="t-mono">
              {site.email}
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
