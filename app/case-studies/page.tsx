import type { Metadata } from "next";
import { caseStudiesPage, site, work } from "@/lib/content";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/layout/PageHero";
import { CtaBand } from "@/components/layout/CtaBand";
import { RevealGroup, RevealItem } from "@/components/ui/RevealText";

const CASE_PARTS = [
  { key: "challenge", label: "The challenge" },
  { key: "strategy", label: "The strategy" },
  { key: "solution", label: "What we would build" },
] as const;

export const metadata: Metadata = {
  title: "Case Studies",
  description: caseStudiesPage.standfirst,
  alternates: { canonical: "/case-studies" },
  openGraph: {
    title: `Case Studies — ${site.name}`,
    description: caseStudiesPage.standfirst,
    url: "/case-studies",
  },
};

export default function CaseStudiesPage() {
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1} className="scroll-mt-24 outline-none">
        <PageHero
          eyebrow={caseStudiesPage.eyebrow}
          title={caseStudiesPage.title}
          standfirst={caseStudiesPage.standfirst}
        />

        {/* No results band here. Published performance figures return only
            once they are real, attributable and permitted to be named. */}
        <section data-theme="paper" className="section">
          <div className="shell">
            <RevealGroup as="ol" className="border-t border-[var(--hairline)]" stagger={0.07} soft>
              {work.cases.map((item) => (
                <RevealItem
                  key={item.title}
                  as="li"
                  className="border-b border-[var(--hairline)]"
                >
                  <article className="grid gap-8 py-12 lg:grid-cols-12 lg:gap-10">
                    <header className="lg:col-span-4">
                      <p className="t-mono inline-block rounded-full border border-[var(--hairline)] px-3 py-1.5 text-accent">
                        {item.label}
                      </p>
                      <h2 className="t-display-md mt-5 max-w-[18ch]">{item.title}</h2>
                      <p className="t-mono mt-4 text-[var(--muted)]">{item.sector}</p>
                    </header>

                    <div className="lg:col-span-7 lg:col-start-6">
                      <dl className="grid gap-7 md:grid-cols-3 lg:gap-8">
                        {CASE_PARTS.map((part) => (
                          <div key={part.key}>
                            <dt className="t-mono text-[var(--muted)]">{part.label}</dt>
                            <dd className="t-caption mt-3 text-ink/70">{item[part.key]}</dd>
                          </div>
                        ))}
                      </dl>

                      <ul className="mt-8 flex flex-wrap gap-2">
                        {item.services.map((service) => (
                          <li
                            key={service}
                            className="t-mono rounded-full bg-bone px-3 py-1.5 text-[var(--muted)]"
                          >
                            {service}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>

        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
