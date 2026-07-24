import { proof } from "@/lib/content";
import { CountUp } from "@/components/ui/CountUp";
import { RevealGroup, RevealItem, RevealText } from "@/components/ui/RevealText";

export function Proof() {
  return (
    <section data-theme="blue" className="section">
      <div className="shell">
        <RevealText>
          <p className="t-mono text-[var(--muted)]">{proof.eyebrow}</p>
          <h2 className="t-display-md mt-6 max-w-[18ch]">{proof.title}</h2>
        </RevealText>

        <RevealGroup
          className="mt-24 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4"
          stagger={0.1}
          delayChildren={0.1}
        >
          {proof.stats.map((stat) => (
            <RevealItem
              key={stat.label}
              className="flex flex-col border-t border-[var(--hairline)] pt-6"
            >
              <dl className="flex flex-col">
                <dt className="t-mono order-2 mt-5 max-w-[18ch] text-[var(--muted)]">
                  {stat.label}
                </dt>
                <dd className="t-display-lg order-1">
                  <CountUp
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    decimals={stat.decimals}
                  />
                </dd>
              </dl>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
