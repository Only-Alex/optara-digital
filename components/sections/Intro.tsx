import { intro } from "@/lib/content";
import { RevealGroup, RevealItem, RevealText } from "@/components/ui/RevealText";
import { Button } from "@/components/ui/Button";

export function Intro() {
  return (
    <section id="about" data-theme="paper" className="section">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <RevealText>
            <p className="t-mono text-[var(--muted)]">{intro.eyebrow}</p>
            <p className="t-display-lg mt-6 text-accent">{intro.wordmark}</p>
          </RevealText>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <RevealGroup stagger={0.08}>
            {intro.body.map((paragraph, i) => (
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

          <RevealText delay={0.2}>
            <div className="mt-4">
              <Button href={intro.cta.href} variant="outline" withArrow>
                {intro.cta.label}
              </Button>
            </div>
          </RevealText>
        </div>
      </div>
    </section>
  );
}
