import { difference } from "@/lib/content";
import { RevealGroup, RevealItem, RevealText } from "@/components/ui/RevealText";

export function Difference() {
  return (
    <section data-theme="paper" className="section">
      <div className="shell">
        <RevealText>
          <p className="t-mono text-[var(--muted)]">{difference.eyebrow}</p>
          <h2 className="t-display-lg mt-6 max-w-[24ch]">
            {difference.title.lead}{" "}
            <span className="text-[var(--accent-fg)]">
              {difference.title.accent}
            </span>
          </h2>
        </RevealText>

        {/* Split rows rather than a card grid: the page already answers three
            other sections with four boxes, and these are the claims that have
            to sound certain. No numerals — four reasons are not a sequence,
            and §4 rules out decorative numbering. */}
        <RevealGroup
          as="ul"
          className="mt-16 border-b border-[var(--hairline)]"
          stagger={0.09}
          soft
        >
          {difference.items.map((item) => (
            <RevealItem
              key={item.title}
              as="li"
              className="border-t border-[var(--hairline)]"
            >
              <div className="grid gap-4 py-10 lg:grid-cols-12 lg:gap-10 lg:py-12">
                <h3 className="t-display-md max-w-[16ch] lg:col-span-5">
                  {item.title}
                </h3>
                <p className="t-body-lg max-w-[52ch] text-[var(--muted)] lg:col-span-6 lg:col-start-7">
                  {item.body}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
