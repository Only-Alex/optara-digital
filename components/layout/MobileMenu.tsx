"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EASE } from "@/lib/motion";
import { nav, site } from "@/lib/content";
import { CloseIcon, LogoMark } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";

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
        "a[href], button:not([disabled])",
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
          id="site-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-[60] flex flex-col bg-paper"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          <div className="shell flex items-center justify-between py-4">
            <span className="flex items-center gap-2.5">
              <LogoMark className="h-7 w-7 text-accent" />
              <span className="text-lg font-semibold tracking-[-0.02em]">
                {site.name}
              </span>
            </span>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="pill border border-[var(--hairline)] px-4"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          <nav aria-label="Primary" className="shell flex flex-1 flex-col justify-center">
            <ul className="flex flex-col gap-2">
              {nav.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: EASE, delay: 0.08 + i * 0.06 }}
                >
                  <a
                    href={item.href}
                    onClick={onClose}
                    className="t-display-md block border-b border-[var(--hairline)] py-5"
                  >
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </nav>

          <div className="shell flex flex-col gap-4 pb-10">
            <Button href="#contact" withArrow className="justify-center">
              Book a call
            </Button>
            <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="t-body">
              {site.phone}
            </a>
            <a href={`mailto:${site.email}`} className="t-body text-[var(--muted)]">
              {site.email}
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
