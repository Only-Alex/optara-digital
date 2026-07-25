import { phases } from "@/lib/content";
import { RevealGroup, RevealItem, RevealText } from "@/components/ui/RevealText";

export function Process() {
  return (
    <section id="process" data-theme="paper" className="section">
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
          className="mt-16 border-t border-[var(--hairline)]"
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
  );
}
