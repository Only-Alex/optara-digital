import { proof } from "@/lib/content";
import { CountUp } from "@/components/ui/CountUp";
import { RevealText } from "@/components/ui/RevealText";

export function Proof() {
  return (
    <section data-theme="blue" className="section">
      <div className="shell">
        <RevealText>
          <p className="t-mono text-[var(--muted)]">{proof.eyebrow}</p>
          <h2 className="t-display-md mt-6 max-w-[18ch]">{proof.title}</h2>
        </RevealText>

        <dl className="mt-24 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
          {proof.stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col border-t border-[var(--hairline)] pt-6"
            >
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
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
