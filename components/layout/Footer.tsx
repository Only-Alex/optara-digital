"use client";

import { motion } from "motion/react";
import { footer, site } from "@/lib/content";
import { hoverTransition } from "@/lib/motion";
import { RevealGroup, RevealItem } from "@/components/ui/RevealText";
import { LogoMark } from "@/components/ui/Icons";
import { Wordmark } from "@/components/ui/Wordmark";

const linkHover = { color: "var(--accent-fg)", x: 3 };

export function Footer() {
  return (
    <footer data-theme="ink" className="bg-[var(--bg)] pt-[var(--section-y)] text-[var(--fg)]">
      <RevealGroup className="shell grid gap-12 lg:grid-cols-12" stagger={0.08} soft>
        <RevealItem className="lg:col-span-5">
          <span className="flex items-center gap-2.5">
            <LogoMark className="h-7 w-7" />
            <Wordmark className="text-[1.0625rem]" />
          </span>
          <p className="t-body mt-5 max-w-[36ch] text-[var(--muted)]">
            {footer.blurb}
          </p>
        </RevealItem>

        {footer.columns.map((column) => (
          <RevealItem key={column.title} className="lg:col-span-2">
            <h2 className="t-mono text-[var(--muted)]">{column.title}</h2>
            <ul className="mt-5 flex flex-col gap-3">
              {column.links.map((link) => (
                <li key={`${column.title}-${link.label}`}>
                  <motion.a
                    href={link.href}
                    className="t-body inline-block"
                    whileHover={linkHover}
                    whileFocus={linkHover}
                    transition={hoverTransition}
                  >
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </RevealItem>
        ))}

        <RevealItem className="lg:col-span-3">
          <h2 className="t-mono text-[var(--muted)]">Contact</h2>
          <ul className="mt-5 flex flex-col gap-3">
            <li>
              <motion.a
                href={`mailto:${site.email}`}
                className="t-body inline-block"
                whileHover={linkHover}
                whileFocus={linkHover}
                transition={hoverTransition}
              >
                {site.email}
              </motion.a>
            </li>
            <li>
              <motion.a
                href={`tel:${site.phone.replace(/\s/g, "")}`}
                className="t-body inline-block"
                whileHover={linkHover}
                whileFocus={linkHover}
                transition={hoverTransition}
              >
                {site.phone}
              </motion.a>
            </li>
          </ul>
        </RevealItem>
      </RevealGroup>

      {/* Oversized ghost wordmark — the hero opens with this gesture in ink on
          paper; the footer closes with it in paper on ink. Decorative, and
          cropped by its own container so it can never cause horizontal scroll. */}
      <div aria-hidden="true" className="mt-14 overflow-hidden">
        <p className="shell select-none whitespace-nowrap font-semibold leading-none tracking-[-0.04em] text-paper/[0.05] text-[clamp(3.5rem,12.5vw,11rem)]">
          {site.name.toLowerCase()}
        </p>
      </div>

      <div className="shell mt-10 flex flex-col gap-4 border-t border-[var(--hairline)] py-7 sm:flex-row sm:items-center sm:justify-between">
        <p className="t-mono text-[var(--muted)]">
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
        <ul className="flex items-center gap-6">
          {footer.legal.map((item) => (
            <li key={item.label}>
              <motion.a
                href={item.href}
                className="t-mono text-[var(--muted)]"
                whileHover={{ color: "var(--accent-fg)" }}
                whileFocus={{ color: "var(--accent-fg)" }}
                transition={hoverTransition}
              >
                {item.label}
              </motion.a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
