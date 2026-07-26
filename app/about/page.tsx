import type { Metadata } from "next";
import { aboutPage, phases, site } from "@/lib/content";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/layout/PageHero";
import { CtaBand } from "@/components/layout/CtaBand";
import { RevealGroup, RevealItem, RevealText } from "@/components/ui/RevealText";

export const metadata: Metadata = {
  title: "About",
  description: aboutPage.standfirst,
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About — ${site.name}`,
    description: aboutPage.standfirst,
    url: "/about",
  },
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow={aboutPage.eyebrow}
          title={aboutPage.title}
          standfirst={aboutPage.standfirst}
        />

        <section data-theme="paper" className="section pt-0">
          <div className="shell grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7 lg:col-start-6">
              <RevealGroup stagger={0.08}>
                {aboutPage.body.map((paragraph, i) => (
                  <RevealItem
                    key={paragraph}
                    as="p"
                    className={
                      i === 0
                        ? "t-body-lg mb-6"
                        : "t-body-lg mb-6 text-[var(--muted)]"
                    }
                  >
                    {paragraph}
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          </div>
        </section>

        <section data-theme="bone" className="section">
          <div className="shell">
            <RevealText>
              <h2 className="t-display-lg max-w-[20ch]">
                How we <span className="text-accent">operate.</span>
              </h2>
            </RevealText>
            <RevealGroup
              className="mt-14 grid gap-6 sm:grid-cols-2"
              stagger={0.08}
              soft
            >
              {aboutPage.values.map((value) => (
                <RevealItem key={value.title} className="card h-full p-8">
                  <h3 className="t-display-md">{value.title}</h3>
                  <p className="t-body mt-4 max-w-[42ch] text-[var(--muted)]">
                    {value.body}
                  </p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>

        {/* Results band removed: the figures behind it were never verified.
            It returns when real, attributable numbers exist. */}

        <section data-theme="paper" className="section">
          <div className="shell">
            <RevealText>
              <p className="t-mono text-[var(--muted)]">{phases.eyebrow}</p>
              <h2 className="t-display-lg mt-6 max-w-[22ch]">
                {phases.title.lead}{" "}
                <span className="text-accent">{phases.title.accent}</span>
              </h2>
            </RevealText>

            <RevealGroup
              as="ol"
              className="mt-14 border-t border-[var(--hairline)]"
              stagger={0.08}
              soft
            >
              {phases.items.map((item) => (
                <RevealItem
                  key={item.phase}
                  as="li"
                  className="border-b border-[var(--hairline)] py-10"
                >
                  <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
                    <div className="lg:col-span-3">
                      <p className="t-mono text-accent">{item.phase}</p>
                      <h3 className="t-display-md mt-4">{item.name}</h3>
                    </div>
                    <div className="lg:col-span-3">
                      <ul className="flex flex-wrap gap-2 lg:flex-col lg:items-start">
                        {item.steps.map((step) => (
                          <li
                            key={step}
                            className="t-mono rounded-full bg-bone px-3 py-1.5 text-[var(--muted)]"
                          >
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="lg:col-span-6">
                      <p className="t-body-lg text-[var(--muted)]">{item.body}</p>
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
