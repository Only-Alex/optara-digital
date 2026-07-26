"use client";

import { work } from "@/lib/content";
import { RevealGroup, RevealItem, RevealText } from "@/components/ui/RevealText";

const PARTS = [
  { key: "challenge", label: "The challenge" },
  { key: "strategy", label: "The strategy" },
  { key: "solution", label: "What we would build" },
] as const;

export function Work() {
  return (
    <section id="work" data-theme="ink" className="section">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <RevealText>
              <p className="t-mono text-[var(--muted)]">{work.eyebrow}</p>
              <h2 className="t-display-lg mt-6 max-w-[16ch]">
                {work.title.lead}{" "}
                <span className="text-[var(--accent-fg)]">
                  {work.title.accent}
                </span>
              </h2>
            </RevealText>
          </div>

          <div className="lg:col-span-5 lg:col-start-8 lg:self-end">
            <RevealText delay={0.1}>
              <p className="t-body text-[var(--muted)]">{work.standfirst}</p>
            </RevealText>
          </div>
        </div>

        <RevealGroup
          as="ol"
          className="mt-16 border-t border-[var(--hairline)]"
          stagger={0.07}
          soft
        >
          {work.cases.map((item) => (
            <RevealItem
              key={item.title}
              as="li"
              className="border-b border-[var(--hairline)]"
            >
              <article className="grid gap-8 py-12 lg:grid-cols-12 lg:gap-10">
                <header className="lg:col-span-4">
                  <p className="t-mono inline-block rounded-full border border-[var(--hairline)] px-3 py-1.5 text-[var(--accent-fg)]">
                    {item.label}
                  </p>
                  <h3 className="t-display-md mt-5 max-w-[18ch]">
                    {item.title}
                  </h3>
                  <p className="t-mono mt-4 text-[var(--muted)]">
                    {item.sector}
                  </p>
                </header>

                <div className="lg:col-span-7 lg:col-start-6">
                  <dl className="grid gap-7 md:grid-cols-3 lg:gap-8">
                    {PARTS.map((part) => (
                      <div key={part.key}>
                        <dt className="t-mono text-[var(--muted)]">
                          {part.label}
                        </dt>
                        <dd className="t-caption mt-3 text-[var(--muted)]">
                          {item[part.key]}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <ul className="mt-8 flex flex-wrap gap-2">
                    {item.services.map((service) => (
                      <li
                        key={service}
                        className="t-mono rounded-full border border-[var(--hairline)] px-3 py-1.5 text-[var(--muted)]"
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
  );
}
