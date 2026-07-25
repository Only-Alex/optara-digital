import { process } from "@/lib/content";
import { RevealGroup, RevealItem, RevealText } from "@/components/ui/RevealText";

export function Process() {
  return (
    <section id="process" data-theme="ink" className="section">
      <div className="shell">
        <RevealText>
          <p className="t-mono text-[var(--muted)]">{process.eyebrow}</p>
          <h2 className="t-display-lg mt-6 max-w-[24ch]">
            {process.title.lead}{" "}
            <span className="text-accent">{process.title.accent}</span>
          </h2>
        </RevealText>

        <RevealGroup
          as="ol"
          className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8"
          stagger={0.1}
          soft
        >
          {process.steps.map((step) => (
            <RevealItem
              key={step.index}
              as="li"
              className="border-t border-[var(--hairline)] pt-6"
            >
              <span className="t-mono text-accent">{step.index}</span>
              <h3 className="t-display-md mt-5">{step.name}</h3>
              <p className="t-body mt-4 text-[var(--muted)]">{step.description}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
