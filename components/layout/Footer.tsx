"use client";

import { motion } from "motion/react";
import { footer, site } from "@/lib/content";
import { hoverTransition } from "@/lib/motion";
import { RevealGroup, RevealItem } from "@/components/ui/RevealText";

const linkHover = { color: "#1B32FF", x: 4 };

export function Footer() {
  return (
    <footer
      data-theme="dark"
      className="overflow-hidden bg-[var(--bg)] pt-[var(--section-y)] text-[var(--fg)]"
    >
      <RevealGroup className="shell grid-12 gap-y-12" stagger={0.08} soft>
        {footer.columns.map((column) => (
          <RevealItem
            key={column.title}
            className="col-span-6 md:col-span-3 lg:col-span-2"
          >
            <h2 className="t-mono text-[var(--muted)]">{column.title}</h2>
            <ul className="mt-6 flex flex-col gap-3">
              {column.links.map((link) => (
                <li key={link.label}>
                  <motion.a
                    href={link.href}
                    data-cursor="Go"
                    className="t-body inline-block"
                    whileHover={linkHover}
                    whileFocus={linkHover}
                    transition={hoverTransition}
                    {...(link.href.startsWith("http")
                      ? { target: "_blank", rel: "noreferrer" }
                      : {})}
                  >
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </RevealItem>
        ))}

        {footer.offices.map((office) => (
          <RevealItem
            key={office.city}
            className="col-span-6 md:col-span-3 lg:col-span-2"
          >
            <h2 className="t-mono text-[var(--muted)]">{office.city}</h2>
            <address className="t-body mt-6 not-italic">
              {office.lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          </RevealItem>
        ))}

        <RevealItem className="col-span-12 lg:col-span-3 lg:col-start-10">
          <h2 className="t-mono text-[var(--muted)]">Enquiries</h2>
          <motion.a
            href={`mailto:${site.email}`}
            data-cursor="Email"
            className="t-body mt-6 inline-block"
            whileHover={linkHover}
            whileFocus={linkHover}
            transition={hoverTransition}
          >
            {site.email}
          </motion.a>
        </RevealItem>
      </RevealGroup>

      <div className="shell mt-24 flex items-center justify-between gap-6 border-t border-[var(--hairline)] pt-6">
        <p className="t-mono text-[var(--muted)]">
          © {new Date().getFullYear()} {site.name}
        </p>
        <motion.a
          href="#top"
          data-cursor="Top"
          className="t-mono"
          whileHover={{ color: "#1B32FF", y: -3 }}
          whileFocus={{ color: "#1B32FF", y: -3 }}
          transition={hoverTransition}
        >
          Back to top ↑
        </motion.a>
      </div>

      <div aria-hidden="true" className="mt-16 -mb-[0.18em] px-[var(--gutter)]">
        <motion.span
          className="block whitespace-nowrap font-display leading-[0.8] tracking-[-0.04em] text-[19vw]"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {site.name}
        </motion.span>
      </div>
    </footer>
  );
}
