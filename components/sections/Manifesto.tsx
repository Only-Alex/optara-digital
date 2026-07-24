import { manifesto } from "@/lib/content";
import { RevealText } from "@/components/ui/RevealText";

export function Manifesto() {
  return (
    <section id="studio" data-theme="light" className="section">
      <div className="shell grid-12 gap-y-12">
        <div className="col-span-12 lg:col-span-4">
          <RevealText>
            <p className="t-mono text-[var(--muted)]">{manifesto.eyebrow}</p>
          </RevealText>
        </div>

        <div className="col-span-12 lg:col-span-7 lg:col-start-6">
          <RevealText>
            <p className="t-display-md">
              {manifesto.lead.map((chunk, i) =>
                chunk.accent ? (
                  <em key={i} className="not-italic text-blue">
                    {chunk.text}
                  </em>
                ) : (
                  <span key={i}>{chunk.text}</span>
                ),
              )}
            </p>
          </RevealText>

          <RevealText delay={0.1}>
            <h2 className="t-mono mt-16 text-[var(--muted)]">
              {manifesto.refusalsTitle}
            </h2>
            <ul className="mt-6 border-t border-[var(--hairline)]">
              {manifesto.refusals.map((item) => (
                <li
                  key={item}
                  className="t-body-lg border-b border-[var(--hairline)] py-5"
                >
                  {item}
                </li>
              ))}
            </ul>
          </RevealText>
        </div>
      </div>
    </section>
  );
}
