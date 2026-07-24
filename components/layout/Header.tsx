"use client";

import { useState } from "react";
import { nav, site } from "@/lib/content";
import { MobileMenu } from "./MobileMenu";

const ctaLabel = "Start a project";
const menuLabel = "Menu";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 text-paper mix-blend-difference">
        <div className="shell flex items-center justify-between gap-6 py-5">
          <a
            href="#top"
            className="font-display text-xl leading-none tracking-[-0.03em] sm:text-2xl"
          >
            {site.name}
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
            <ul className="flex items-center gap-8">
              {nav.slice(0, 3).map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="t-mono inline-block py-1 transition-opacity duration-200 hover:opacity-60"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <span aria-hidden="true" className="t-mono invisible px-5 py-3">
              {ctaLabel}
            </span>
          </nav>

          <span aria-hidden="true" className="t-mono invisible px-4 py-3 md:hidden">
            {menuLabel}
          </span>
        </div>
      </header>

      <div className="pointer-events-none fixed inset-x-0 top-0 z-50">
        <div className="shell flex items-center justify-end py-5">
          <a
            href="#contact"
            data-cursor="Say hi"
            className="t-mono pointer-events-auto hidden bg-blue px-5 py-3 text-paper transition-colors duration-200 hover:bg-blue-deep md:inline-block"
          >
            {ctaLabel}
          </a>
          <button
            type="button"
            className="t-mono pointer-events-auto bg-blue px-4 py-3 text-paper md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
          >
            {menuLabel}
          </button>
        </div>
      </div>

      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}
