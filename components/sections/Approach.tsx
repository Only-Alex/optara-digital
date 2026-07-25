import { approach } from "@/lib/content";
import { RevealGroup, RevealItem, RevealText } from "@/components/ui/RevealText";

export function Approach() {
  return (
    <section id="approach" data-theme="paper" className="section">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <RevealText>
            <p className="t-mono text-[var(--muted)]">{approach.eyebrow}</p>
            <h2 className="t-display-lg mt-6">
              {approach.title.lead}{" "}
              <span className="text-accent">{approach.title.accent}</span>
            </h2>
          </RevealText>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <RevealGroup stagger={0.08}>
            {approach.body.map((paragraph) => (
              <RevealItem key={paragraph} as="p" className="t-body-lg mb-6 text-[var(--muted)]">
                {paragraph}
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>

      <div className="shell mt-20">
        <RevealGroup
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          stagger={0.09}
          soft
        >
          {approach.points.map((point) => (
            <RevealItem key={point.title} className="card p-7">
              <h3 className="t-body font-medium">{point.title}</h3>
              <p className="t-caption mt-3 text-[var(--muted)]">{point.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
