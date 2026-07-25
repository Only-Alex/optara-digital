"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { EASE } from "@/lib/motion";
import { nav, site } from "@/lib/content";
import { CloseIcon, LogoMark, PlusIcon } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function MobileMenu({ open, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [expanded, setExpanded] = useState<string | null>("Services");

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
          className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-paper"
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

          <nav aria-label="Primary" className="shell flex-1 py-6">
            <ul className="flex flex-col">
              {nav.map((item) => {
                if (!item.children) {
                  return (
                    <li
                      key={item.href}
                      className="border-b border-[var(--hairline)] first:border-t"
                    >
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className="t-display-md block py-5"
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                }

                const isOpen = expanded === item.label;

                return (
                  <li
                    key={item.href}
                    className="border-b border-[var(--hairline)] first:border-t"
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls="menu-services"
                      onClick={() => setExpanded(isOpen ? null : item.label)}
                      className="flex w-full items-center justify-between gap-4 py-5 text-left"
                    >
                      <span className="t-display-md">{item.label}</span>
                      <motion.span
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[var(--hairline)]"
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                      >
                        <PlusIcon className="h-3 w-3" />
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id="menu-services"
                          className="overflow-hidden"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: EASE }}
                        >
                          <ul className="flex flex-col gap-1 pb-5">
                            <li>
                              <Link
                                href={item.href}
                                onClick={onClose}
                                className="t-body block py-2 font-medium text-accent"
                              >
                                All services
                              </Link>
                            </li>
                            {item.children.map((child) => (
                              <li key={child.href}>
                                <Link
                                  href={child.href}
                                  onClick={onClose}
                                  className="t-body block py-2 text-[var(--muted)]"
                                >
                                  {child.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="shell flex flex-col gap-4 pb-10">
            <Button href="/contact" withArrow className="justify-center">
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
