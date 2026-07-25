import { difference } from "@/lib/content";
import { RevealGroup, RevealItem, RevealText } from "@/components/ui/RevealText";

export function Difference() {
  return (
    <section data-theme="ink" className="section">
      <div className="shell">
        <RevealText>
          <p className="t-mono text-[var(--muted)]">{difference.eyebrow}</p>
          <h2 className="t-display-lg mt-6 max-w-[24ch]">
            {difference.title.lead}{" "}
            <span className="text-accent">{difference.title.accent}</span>
          </h2>
        </RevealText>

        <RevealGroup
          as="ul"
          className="mt-16 grid gap-x-10 gap-y-12 md:grid-cols-2"
          stagger={0.09}
          soft
        >
          {difference.items.map((item, i) => (
            <RevealItem
              key={item.title}
              as="li"
              className="border-t border-[var(--hairline)] pt-6"
            >
              <span className="t-mono text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="t-display-md mt-4">{item.title}</h3>
              <p className="t-body mt-4 max-w-[46ch] text-[var(--muted)]">
                {item.body}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
