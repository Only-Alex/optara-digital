import { phases } from "@/lib/content";
import { RevealText } from "@/components/ui/RevealText";

/**
 * The process, staged the way the reference does it: each phase is a tall
 * chapter — "Phase 1 / 4", a large name, its steps as chips, the body copy —
 * with generous air so scrolling through feels like turning pages rather than
 * reading a list. No pinning and no scroll hijacking: the height does the
 * pacing, the scroll stays native, and every chapter is complete as a still.
 *
 * Content is the approved four-phase process from lib/content, verbatim.
 */
export function ProcessPhases() {
  return (
    <section data-theme="ink" className="section bg-[var(--bg)]">
      <div className="shell">
        <RevealText>
          <p className="t-mono text-[var(--muted)]">{phases.eyebrow}</p>
          <h2 className="t-display-lg mt-6 max-w-[16ch] text-paper">
            {phases.title.lead}{" "}
            <span className="text-[var(--accent-fg)]">{phases.title.accent}</span>
          </h2>
        </RevealText>

        <ol className="mt-10 flex flex-col">
          {phases.items.map((item, i) => (
            <li
              key={item.phase}
              className="grid content-center gap-6 border-t border-[rgba(255,255,255,0.12)] py-16 first:border-t-0 md:min-h-[70vh] lg:grid-cols-12 lg:gap-x-[clamp(3rem,5vw,6rem)]"
            >
              <div className="lg:col-span-5">
                <RevealText>
                  <p className="t-mono text-[var(--accent-fg)]">{item.phase}</p>
                  <h3 className="t-display-lg mt-5 text-[clamp(2rem,4.4vw,3.5rem)] text-paper">
                    {item.name}
                  </h3>
                  <ul className="mt-7 flex flex-wrap gap-2">
                    {item.steps.map((step) => (
                      <li
                        key={step}
                        className="t-mono rounded-full border border-[rgba(255,255,255,0.18)] px-3.5 py-2 text-[rgba(255,255,255,0.72)]"
                      >
                        {step}
                      </li>
                    ))}
                  </ul>
                </RevealText>
              </div>

              <div className="lg:col-span-6 lg:col-start-7 lg:self-center">
                <RevealText delay={0.08}>
                  <p className="t-body-lg max-w-[52ch] text-[rgba(255,255,255,0.78)]">
                    {item.body}
                  </p>
                  {/* A quiet progress rule: how far through the four phases
                      this chapter sits. Decorative; the "Phase n / 4" label
                      above carries the information as text. */}
                  <span
                    aria-hidden="true"
                    className="mt-10 block h-px w-full bg-[rgba(255,255,255,0.12)]"
                  >
                    <span
                      className="block h-px bg-[linear-gradient(90deg,#2B7FFF,#5B3DF5,#7B2FF7)]"
                      style={{ width: `${((i + 1) / phases.items.length) * 100}%` }}
                    />
                  </span>
                </RevealText>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
