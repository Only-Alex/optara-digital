import { difference } from "@/lib/content";
import { RevealText } from "@/components/ui/RevealText";

/**
 * "What makes us different" as a stacked deck: the heading holds sticky on
 * the left with a numbered index of the four differentiators, and on the
 * right each card is itself sticky at a slightly deeper offset than the one
 * before, so scrolling slides every card up over the last like a settling
 * deck. Pure CSS `position: sticky` — no scroll listeners, no hijacking, and
 * on phones (below md) it degrades to a plain stacked list.
 *
 * The staggered offsets both create the deck's peeking edges and guarantee a
 * card never fully hides the one beneath it while they overlap. Cards are
 * opaque paper with a brand-gradient top rail, so the layered rails read as
 * the deck's spine while covered.
 *
 * Split out of ServicesSticky.tsx 2026-08-06 (Stage 2A mechanical
 * isolation) — content and markup unchanged.
 */
export function DifferenceSticky() {
  const count = difference.items.length;

  return (
    <section data-theme="paper" className="section bg-[var(--bg)]">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-x-[clamp(3rem,5vw,6rem)]">
        <div className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
          <RevealText>
            <p className="t-mono text-[var(--muted)]">{difference.eyebrow}</p>
            <h2 className="t-display-lg mt-6">
              {difference.title.lead}{" "}
              <span className="text-accent">{difference.title.accent}</span>
            </h2>
          </RevealText>
          <RevealText delay={0.08}>
            {/* The deck's table of contents. Repeats the card titles, so it is
                decorative for a screen reader — hidden from AT and from
                mobile, where the cards sit right below anyway. */}
            <ol aria-hidden="true" className="mt-10 hidden border-l border-[var(--hairline)] lg:block">
              {difference.items.map((item, i) => (
                <li
                  key={item.title}
                  className="flex items-baseline gap-3 py-2 pl-6 text-[0.9375rem] text-ink/60"
                >
                  <span className="t-mono text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item.title}
                </li>
              ))}
            </ol>
          </RevealText>
        </div>

        {/* .deck powers the scroll-driven settle in globals.css: in browsers
            with animation-timeline support, covered cards ease back and dim
            as the next one slides over. Everywhere else the class is inert. */}
        <ol className="deck flex flex-col gap-6 md:gap-10 md:pb-16 lg:col-span-7 lg:col-start-6">
          {difference.items.map((item, i) => (
            <li
              key={item.title}
              className="md:sticky"
              style={{ top: `calc(6.5rem + ${i * 3.5}rem)` }}
            >
              <article className="relative overflow-hidden rounded-[24px] border border-[var(--hairline)] bg-paper p-8 shadow-[0_28px_80px_rgba(18,19,26,0.12)] md:p-12">
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,#2B7FFF,#5B3DF5_50%,#7B2FF7)]"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-4 -top-8 select-none text-[10rem] font-medium leading-none tracking-[-0.04em] text-ink/[0.04]"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="t-mono bg-[linear-gradient(92deg,#175FD4,#4C2FD9_55%,#6B21D8)] bg-clip-text text-transparent">
                  {String(i + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
                </p>
                <h3 className="t-display-md mt-5 max-w-[20ch]">{item.title}</h3>
                <p className="mt-5 max-w-[52ch] text-[1.0625rem] leading-[1.7] text-ink/75">
                  {item.body}
                </p>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
