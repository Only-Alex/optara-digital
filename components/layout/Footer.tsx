import Link from "next/link";
import { footer, site } from "@/lib/content";
import { RevealGroup, RevealItem } from "@/components/ui/RevealText";
import { LogoMark } from "@/components/ui/Icons";
import { Wordmark } from "@/components/ui/Wordmark";

/**
 * A server component on purpose.
 *
 * The footer had "use client" only so that Motion could drive a colour change
 * on link hover — a transition CSS does natively. Dropping it means the
 * copyright year is evaluated once, on the server, so it can never disagree
 * with a hydrated client across a New Year boundary. The reveal wrappers stay
 * client components in their own right, which a server component may render.
 */

/** Hover and focus share one treatment: brighten to accent, nudge 3px. */
const LINK =
  "inline-block py-2 text-[0.9375rem] leading-[1.5] text-paper/80 transition-[color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:translate-x-[3px] hover:text-[var(--accent-fg)] focus-visible:translate-x-[3px] focus-visible:text-[var(--accent-fg)] lg:py-0";

export function Footer() {
  return (
    <footer
      data-theme="ink"
      className="bg-[var(--bg)] pt-[var(--section-y)] text-[var(--fg)]"
    >
      <RevealGroup
        className="shell grid gap-12 lg:grid-cols-12 lg:gap-x-[clamp(3rem,4vw,5.5rem)]"
        stagger={0.08}
        soft
      >
        <RevealItem className="lg:col-span-5">
          <span className="flex items-center gap-3.5">
            <LogoMark className="h-8 w-8" />
            <Wordmark className="text-[1.125rem]" />
          </span>
          <p className="mt-5 max-w-[42ch] text-[0.9375rem] leading-[1.6] text-paper/70">
            {footer.blurb}
          </p>
          {/* Where the work happens, stated without inventing an office. */}
          <p className="mt-4 max-w-[36ch] text-[0.875rem] leading-[1.55] text-paper/50">
            {footer.location}
          </p>
        </RevealItem>

        {footer.columns.map((column) => {
          const id = `footer-${column.title.toLowerCase()}`;
          return (
            <RevealItem key={column.title} className="lg:col-span-2">
              {/* Each group is its own landmark, named by its own heading, so
                  a screen reader hears "Services navigation" rather than three
                  unlabelled lists of links. */}
              <nav aria-labelledby={id}>
                <h2 id={id} className="t-mono text-paper/55">
                  {column.title}
                </h2>
                <ul className="mt-5 flex flex-col gap-3">
                  {column.links.map((link) => (
                    <li key={`${column.title}-${link.label}`}>
                      <Link href={link.href} className={LINK}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </RevealItem>
          );
        })}

        <RevealItem className="lg:col-span-3">
          <h2 className="t-mono text-paper/55">Contact</h2>
          <ul className="mt-5 flex flex-col gap-3">
            <li>
              <a href={`mailto:${site.email}`} className={LINK}>
                {site.email}
              </a>
            </li>
            {/* The telephone number is deliberately absent. The one in the
                content file sits in Ofcom's 020 7946 0xxx range, which is
                reserved for fiction and can never connect to anyone — a
                clickable tel: link to it is a dead end dressed as a contact
                route. Reinstate here once a real line exists. */}
          </ul>
          {/* No social row: no genuine Optara profiles are recorded anywhere in
              the project, and icons linking to "#" would be worse than none. */}
        </RevealItem>
      </RevealGroup>

      {/* Oversized ghost wordmark — the hero opens with this gesture in ink on
          paper; the footer closes with it in paper on ink. Decorative, and
          cropped by its own container so it can never cause horizontal scroll. */}
      <div aria-hidden="true" className="mt-14 overflow-hidden">
        <p className="shell select-none whitespace-nowrap">
          <Wordmark
            display
            className="text-paper/[0.07] text-[clamp(2.6rem,9.2vw,9rem)]"
          />
        </p>
      </div>

      {/* pb respects the home indicator on iOS without adding empty space on a
          desktop, where the inset resolves to zero. */}
      <div className="shell mt-10 flex flex-col gap-4 border-t border-[var(--hairline)] pt-7 pb-[max(1.75rem,env(safe-area-inset-bottom))] sm:flex-row sm:items-center sm:justify-between">
        <p className="t-mono text-paper/55">
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
        {/* footer.legal is intentionally empty: no Privacy or Terms route
            exists yet. The row stays so those links have a home the moment
            real pages land. */}
        {footer.legal.length > 0 && (
          <ul className="flex items-center gap-6">
            {footer.legal.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="t-mono text-paper/55 transition-colors duration-200 hover:text-[var(--accent-fg)] focus-visible:text-[var(--accent-fg)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </footer>
  );
}
