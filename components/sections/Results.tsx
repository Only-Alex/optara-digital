import { stats } from "@/lib/content";
import { CountUp } from "@/components/ui/CountUp";
import { RevealGroup, RevealItem } from "@/components/ui/RevealText";

/**
 * Not rendered on any page. Kept ready for the day genuine, attributable
 * figures exist — see the note on `stats` in lib/content.ts. Do not mount
 * this until every value has a real source and a stated timeframe.
 */
export function Results() {
  return (
    <section data-theme="accent" className="section">
      <div className="shell">
        <RevealGroup
          className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8"
          stagger={0.1}
        >
          {stats.map((stat, index) => (
            <RevealItem
              key={index}
              className="border-t border-[var(--hairline)] pt-6"
            >
              <p className="t-display-lg">
                <CountUp
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  decimals={stat.decimals}
                />
              </p>
              <p className="t-body mt-4 max-w-[22ch]">{stat.label}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
