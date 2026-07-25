import type { Metadata } from "next";
import { caseStudiesPage, site, stats, work } from "@/lib/content";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/layout/PageHero";
import { CtaBand } from "@/components/layout/CtaBand";
import { CountUp } from "@/components/ui/CountUp";
import { RevealGroup, RevealItem } from "@/components/ui/RevealText";

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
      <main>
        <PageHero
          eyebrow={caseStudiesPage.eyebrow}
          title={caseStudiesPage.title}
          standfirst={caseStudiesPage.standfirst}
        />

        <section data-theme="accent" className="section">
          <div className="shell">
            <RevealGroup
              className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8"
              stagger={0.1}
            >
              {stats.map((stat) => (
                <RevealItem
                  key={stat.client}
                  className="border-t border-[var(--hairline)] pt-6"
                >
                  <p className="t-display-lg">
                    <CountUp
                      value={stat.value}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                      decimals={stat.decimals}
                    />
                  </p>
                  <p className="t-body mt-4 max-w-[22ch]">{stat.label}</p>
                  <p className="t-mono mt-3 text-[var(--muted)]">{stat.client}</p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>

        <section data-theme="paper" className="section">
          <div className="shell">
            <RevealGroup as="ul" className="border-t border-[var(--hairline)]" stagger={0.07} soft>
              {work.cases.map((item) => (
                <RevealItem
                  key={item.client}
                  as="li"
                  className="border-b border-[var(--hairline)]"
                >
                  <div className="grid gap-4 py-10 md:grid-cols-12 md:gap-6">
                    <div className="md:col-span-4">
                      <h2 className="t-display-md">{item.client}</h2>
                      <p className="t-mono mt-3 text-[var(--muted)]">{item.sector}</p>
                    </div>
                    <div className="md:col-span-4">
                      <p className="t-display-md text-accent">{item.headline}</p>
                    </div>
                    <div className="md:col-span-4">
                      <p className="t-body text-[var(--muted)]">{item.detail}</p>
                      <ul className="mt-5 flex flex-wrap gap-2">
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
                  </div>
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
