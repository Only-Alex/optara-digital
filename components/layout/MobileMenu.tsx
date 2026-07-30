"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { EASE } from "@/lib/motion";
import { dropdownCta, nav, primaryCta, site } from "@/lib/content";
import { ArrowIcon, CloseIcon, LogoMark, PlusIcon } from "@/components/ui/Icons";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { Button } from "@/components/ui/Button";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function MobileMenu({ open, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const reduced = useReducedMotion();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Open the group you are already inside; otherwise start collapsed.
  const [expanded, setExpanded] = useState<string | null>(() =>
    pathname.startsWith("/services") ? "Services" : null,
  );

  useEffect(() => {
    if (open && pathname.startsWith("/services")) setExpanded("Services");
  }, [open, pathname]);

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

  const overlayMotion = reduced
    ? {}
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.28, ease: EASE },
      };

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
          {...overlayMotion}
        >
          <div className="shell flex items-center justify-between py-4">
            <span className="flex items-center gap-2.5">
              <LogoMark className="h-7 w-7" />
              <span className="text-[0.9375rem] font-normal uppercase tracking-[0.24em]">
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

          <nav aria-label="Primary" className="shell flex-1 py-4">
            <ul className="flex flex-col">
              {nav.map((item, index) => {
                const active = isActive(item.href);
                const itemMotion = reduced
                  ? {}
                  : {
                      initial: { opacity: 0, y: 10 },
                      animate: { opacity: 1, y: 0 },
                      transition: {
                        duration: 0.4,
                        ease: EASE,
                        delay: 0.06 + index * 0.04,
                      },
                    };

                if (!item.children) {
                  return (
                    <motion.li
                      key={item.href}
                      className="border-b border-[var(--hairline)] first:border-t"
                      {...itemMotion}
                    >
                      <Link
                        href={item.href}
                        onClick={onClose}
                        aria-current={active ? "page" : undefined}
                        className={`flex items-center justify-between py-5 text-[1.75rem] tracking-[-0.02em] transition-colors duration-200 ${
                          active ? "text-accent" : ""
                        }`}
                      >
                        {item.label}
                        {active && (
                          <span
                            aria-hidden="true"
                            className="h-1.5 w-1.5 rounded-full bg-accent"
                          />
                        )}
                      </Link>
                    </motion.li>
                  );
                }

                const isOpen = expanded === item.label;

                return (
                  <motion.li
                    key={item.href}
                    className="border-b border-[var(--hairline)] first:border-t"
                    {...itemMotion}
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls="menu-services"
                      onClick={() => setExpanded(isOpen ? null : item.label)}
                      className="flex w-full items-center justify-between gap-4 py-5 text-left"
                    >
                      <span
                        className={`text-[1.75rem] tracking-[-0.02em] transition-colors duration-200 ${
                          active ? "text-accent" : ""
                        }`}
                      >
                        {item.label}
                      </span>
                      <motion.span
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[var(--hairline)]"
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: reduced ? 0 : 0.3, ease: EASE }}
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
                          transition={{ duration: reduced ? 0 : 0.36, ease: EASE }}
                        >
                          <ul className="flex flex-col gap-1 pb-5">
                            {item.children.map((child) => {
                              const current = pathname === child.href;
                              return (
                                <li key={child.href}>
                                  <Link
                                    href={child.href}
                                    onClick={onClose}
                                    aria-current={current ? "page" : undefined}
                                    className={`flex items-start gap-3.5 rounded-[16px] p-3 transition-colors duration-200 ${
                                      current ? "bg-bone/70" : ""
                                    }`}
                                  >
                                    <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-[11px] bg-accent/[0.07] text-accent">
                                      <ServiceIcon
                                        name={child.icon}
                                        className="h-[18px] w-[18px]"
                                      />
                                    </span>
                                    <span className="min-w-0">
                                      <span
                                        className={`block text-[0.9375rem] font-medium leading-tight ${
                                          current ? "text-accent" : ""
                                        }`}
                                      >
                                        {child.label}
                                      </span>
                                      <span className="mt-1.5 block text-[0.8125rem] leading-[1.55] text-ink/50">
                                        {child.blurb}
                                      </span>
                                    </span>
                                  </Link>
                                </li>
                              );
                            })}

                            <li className="mt-1 border-t border-[var(--hairline)] pt-4">
                              <Link
                                href={dropdownCta.href}
                                onClick={onClose}
                                className="flex flex-col gap-2 px-3"
                              >
                                <span className="text-[0.875rem] font-medium">
                                  {dropdownCta.prompt}
                                </span>
                                <span className="flex items-center gap-1.5 text-[0.8125rem] font-medium text-accent">
                                  {dropdownCta.label}
                                  <ArrowIcon className="h-3.5 w-3.5" />
                                </span>
                              </Link>
                            </li>
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.li>
                );
              })}
            </ul>
          </nav>

          <div className="shell flex flex-col gap-4 pb-10">
            <Button
              href={primaryCta.href}
              withArrow
              className="justify-center"
            >
              {primaryCta.label}
            </Button>
            <a
              href={`tel:${site.phone.replace(/\s/g, "")}`}
              className="t-body text-ink/70"
            >
              {site.phone}
            </a>
            <a href={`mailto:${site.email}`} className="t-body text-ink/50">
              {site.email}
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
