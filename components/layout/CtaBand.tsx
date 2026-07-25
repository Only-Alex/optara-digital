import { ctaBand } from "@/lib/content";
import { RevealText } from "@/components/ui/RevealText";
import { Button } from "@/components/ui/Button";

export function CtaBand() {
  return (
    <section data-theme="accent" className="section">
      <div className="shell flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <RevealText>
          <h2 className="t-display-lg max-w-[16ch]">
            {ctaBand.title.lead}{" "}
            <span className="text-paper/70">{ctaBand.title.accent}</span>
          </h2>
          <p className="t-body-lg mt-6 max-w-[46ch] text-[var(--muted)]">
            {ctaBand.body}
          </p>
        </RevealText>
        <RevealText delay={0.1}>
          <Button href={ctaBand.action.href} variant="light" withArrow>
            {ctaBand.action.label}
          </Button>
        </RevealText>
      </div>
    </section>
  );
}
