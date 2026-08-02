import Link from "next/link";
import { legalPagesApproved } from "@/lib/legal";

/**
 * The shared shell for the three legal pages. A server component: legal pages
 * are prose, and nothing here needs the client.
 *
 * Reading first: a calm hero, a narrow measure (~736px, inside the 720–820px
 * guidance), no decorative motion, no marketing CTA. While
 * `legalPagesApproved` is false every page renders a visible draft notice, so
 * anyone who reaches the unlinked route understands the status — polished
 * wording never disguises an unapproved document.
 */

export function LegalArticle({
  eyebrow,
  title,
  lastUpdated,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  lastUpdated: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <main id="main" tabIndex={-1} className="scroll-mt-24 outline-none">
      <section
        data-theme="paper"
        className="bg-[var(--bg)] pb-[var(--section-y)] pt-36 md:pt-44"
      >
        <div className="shell">
          <nav aria-label="Breadcrumb" className="mb-7">
            <ol className="t-mono flex flex-wrap items-center gap-2 text-[var(--muted)]">
              <li>
                <Link href="/" className="-mx-2 -my-2 inline-block px-2 py-2 transition-colors duration-200 hover:text-accent">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-ink/70">
                {eyebrow}
              </li>
            </ol>
          </nav>

          <p className="t-mono text-[var(--muted)]">{eyebrow}</p>
          <h1 className="t-display-lg mt-5 max-w-[18ch]">{title}</h1>
          <p className="t-mono mt-6 text-[var(--muted)]">
            Last updated <time dateTime={lastUpdated}>{lastUpdated}</time>
          </p>

          {!legalPagesApproved ? (
            <div className="mt-8 max-w-[46rem] rounded-[12px] border border-[rgba(18,19,26,0.16)] bg-bone p-5">
              <p className="text-[1rem] font-medium">
                Draft — awaiting final business and legal review
              </p>
              <p className="mt-2 text-[0.9375rem] leading-[1.6] text-ink/75">
                This document has not been finalised or approved yet, and is
                not linked from the website. Its contents describe the website
                accurately as far as they go, but details are still being
                confirmed before publication.
              </p>
            </div>
          ) : null}

          <p className="t-body-lg mt-10 max-w-[46rem] text-ink/75">{intro}</p>

          {/* The prose system: h2/h3 hierarchy, readable lists, visible links,
              tables that scroll inside their own container. */}
          <div
            className={[
              "mt-4 max-w-[46rem]",
              "[&_h2]:t-display-md [&_h2]:mt-12 [&_h2]:scroll-mt-28 [&_h2]:text-[clamp(1.375rem,2vw,1.65rem)]",
              "[&_h3]:mt-8 [&_h3]:scroll-mt-28 [&_h3]:text-[1.125rem] [&_h3]:font-medium",
              "[&_p]:mt-5 [&_p]:text-[1.0625rem] [&_p]:leading-[1.7] [&_p]:text-ink/80",
              "[&_ul]:mt-5 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2.5 [&_ul]:pl-5 [&_ul]:list-disc",
              "[&_li]:text-[1.0625rem] [&_li]:leading-[1.65] [&_li]:text-ink/80",
              "[&_a]:text-accent [&_a]:underline [&_a]:decoration-accent/30 [&_a]:underline-offset-4 hover:[&_a]:decoration-accent",
              "[&_strong]:font-medium [&_strong]:text-ink",
            ].join(" ")}
          >
            {children}
          </div>
        </div>
      </section>
    </main>
  );
}
