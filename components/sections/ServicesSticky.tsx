import Link from "next/link";
import { difference, servicesPage } from "@/lib/content";
import { RevealText } from "@/components/ui/RevealText";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { CursorBubble } from "@/components/ui/CursorBubble";
import { ArrowIcon } from "@/components/ui/Icons";

/**
 * The reference site's signature scroll pattern, rebuilt for Optara: each
 * service is a chapter whose name holds sticky on the left while its
 * substance — positioning, description, capabilities — scrolls past on the
 * right, under a cursor-following bubble naming the destination.
 *
 * A server component. The layout is CSS `position: sticky`: no scroll
 * listeners, no pinning, nothing hijacked — the whole section reads perfectly
 * as static content, and only CursorBubble and the reveals are client islands.
 *
 * Content is the approved servicesPage.showcase data — the same six services,
 * numbers, positioning lines and capability lists the /services page renders,
 * so the two cannot drift apart.
 */
export function ServicesSticky() {
  const { services } = servicesPage.showcase;

  return (
    <section data-theme="bone" className="section bg-[var(--bg)]">
      <div className="shell">
        <RevealText>
          <p className="t-mono text-[var(--muted)]">
            {servicesPage.showcase.eyebrow}
          </p>
          <h2 className="t-display-lg mt-6 max-w-[22ch]">
            Six disciplines.{" "}
            <span className="text-accent">One connected system for growth.</span>
          </h2>
        </RevealText>

        <ol className="mt-16 flex flex-col">
          {services.map((service) => (
            <li
              key={service.href}
              className="grid gap-8 border-t border-[var(--hairline)] py-14 lg:grid-cols-12 lg:gap-x-[clamp(2rem,4vw,5rem)] lg:py-20"
            >
              {/* The sticky chapter title. `self-start` is what lets sticky
                  work inside a grid track; top-28 clears the compact header. */}
              <div className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
                <p className="t-mono bg-[linear-gradient(92deg,#2B7FFF,#7B2FF7)] bg-clip-text text-transparent">
                  {service.number}
                </p>
                <h3 className="t-display-lg mt-4 text-[clamp(1.75rem,3.2vw,2.75rem)]">
                  {service.name}
                </h3>
                <p className="mt-5 max-w-[26ch] text-[1.0625rem] leading-[1.6] text-ink/70">
                  {service.positioning}
                </p>
              </div>

              <div className="lg:col-span-7 lg:col-start-6">
                <CursorBubble label={`View ${service.name}`}>
                  <Link
                    href={service.href}
                    className="group block rounded-[22px] border border-[var(--hairline)] bg-paper p-7 transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_24px_60px_rgba(18,19,26,0.08)] motion-reduce:transform-none md:p-10"
                  >
                    {/* An abstract brand panel where the reference shows client
                        screenshots — Optara shows no work it has not done, so
                        the visual is the service's own gradient and icon. */}
                    <div
                      aria-hidden="true"
                      className="relative flex h-44 items-center justify-center overflow-hidden rounded-[14px] bg-[linear-gradient(120deg,rgba(43,127,255,0.10),rgba(91,61,245,0.14)_50%,rgba(123,47,247,0.10))] before:absolute before:inset-y-0 before:left-0 before:w-1/2 before:-translate-x-[150%] before:skew-x-[-18deg] before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)] before:transition-transform before:duration-700 before:ease-out group-hover:before:translate-x-[320%] motion-reduce:before:hidden md:h-56"
                    >
                      <span className="pointer-events-none absolute inset-0 opacity-[0.5] [background-image:linear-gradient(rgba(18,19,26,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(18,19,26,0.04)_1px,transparent_1px)] [background-size:34px_34px]" />
                      <span className="grid h-20 w-20 place-items-center rounded-full bg-paper/80 text-accent shadow-[0_16px_44px_rgba(91,61,245,0.18)] backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                        <ServiceIcon name={service.icon} className="h-8 w-8" />
                      </span>
                    </div>

                    <p className="mt-8 max-w-[58ch] text-[1.0625rem] leading-[1.7] text-ink/75">
                      {service.description}
                    </p>

                    <ul className="mt-7 flex flex-wrap gap-2">
                      {service.capabilities.map((capability) => (
                        <li
                          key={capability}
                          className="rounded-full border border-[var(--hairline)] px-3 py-1.5 text-[0.8125rem] text-ink/65"
                        >
                          {capability}
                        </li>
                      ))}
                    </ul>

                    <span className="mt-8 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-accent">
                      Explore {service.name}
                      <ArrowIcon
                        aria-hidden="true"
                        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </span>
                  </Link>
                </CursorBubble>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/**
 * The split intro that follows the hero in the reference: floating tilted
 * panels left, copy right, one link out. Server component — the tilt is
 * static CSS transforms, and the panels are abstract brand shapes because no
 * client screenshots exist to float.
 *
 * The panels levitate on the shared panel-float keyframe, each on its own
 * period and phase so the drift never synchronises. Each restates its tilt
 * through --tilt (the keyframe's transform would otherwise flatten it), and
 * reduced motion switches the animation off, leaving the static tilts.
 */
export function IntroSplit() {
  return (
    <section data-theme="paper" className="section bg-[var(--bg)]">
      <div className="shell grid items-center gap-14 lg:grid-cols-12 lg:gap-x-[clamp(3rem,5vw,6rem)]">
        <div
          aria-hidden="true"
          className="relative mx-auto hidden h-[26rem] w-full max-w-[24rem] lg:col-span-5 lg:block"
        >
          <div className="absolute left-0 top-6 h-56 w-44 -rotate-6 rounded-[18px] bg-[linear-gradient(160deg,rgba(43,127,255,0.13),rgba(91,61,245,0.20))] shadow-[0_24px_60px_rgba(43,127,255,0.18)] [--tilt:-6deg] [animation:panel-float_10s_ease-in-out_infinite] motion-reduce:[animation:none]" />
          <div className="absolute right-2 top-0 h-64 w-48 rotate-3 rounded-[18px] bg-[linear-gradient(200deg,rgba(91,61,245,0.18),rgba(123,47,247,0.13))] shadow-[0_24px_60px_rgba(123,47,247,0.16)] [--tilt:3deg] [animation:panel-float_12s_ease-in-out_-4s_infinite] motion-reduce:[animation:none]" />
          {/* Centring lives on this wrapper so the float animation on the
              card cannot overwrite the -translate-x-1/2. */}
          <div className="absolute bottom-0 left-1/2 w-56 -translate-x-1/2">
            <div className="h-52 rotate-1 rounded-[18px] border border-[var(--hairline)] bg-paper p-5 shadow-[0_30px_70px_rgba(18,19,26,0.10)] [--tilt:1deg] [animation:panel-float_11s_ease-in-out_-7s_infinite] motion-reduce:[animation:none]">
              <span className="block h-2.5 w-2/3 rounded-full bg-[linear-gradient(90deg,#2B7FFF,#5B3DF5)]" />
              <span className="mt-3 block h-1.5 w-full rounded-full bg-ink/10" />
              <span className="mt-2 block h-1.5 w-4/5 rounded-full bg-ink/10" />
              <span className="mt-2 block h-1.5 w-5/6 rounded-full bg-ink/10" />
              <span className="mt-6 inline-block rounded-full bg-accent px-4 py-2 text-[0.6875rem] font-medium text-paper">
                Qualified enquiry
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <RevealText>
            <p className="t-mono text-[var(--muted)]">Optara Digital</p>
            <h2 className="t-display-lg mt-6 max-w-[18ch]">
              Built for businesses that need{" "}
              <span className="text-accent">enquiries, not exposure.</span>
            </h2>
          </RevealText>
          <RevealText delay={0.08}>
            <p className="t-body-lg mt-7 max-w-[52ch] text-ink/75">
              We break growth into manageable phases and connect the
              disciplines — brand, search, paid media, social, websites and
              apps — so every channel reinforces the others instead of pulling
              apart. Each engagement is measured against cost per qualified
              lead, and when a channel cannot earn its keep, we say so.
            </p>
            <Link
              href="/about"
              className="group mt-8 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-accent"
            >
              How we work
              <ArrowIcon
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </RevealText>
        </div>
      </div>
    </section>
  );
}

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

        <ol className="flex flex-col gap-6 md:gap-10 md:pb-16 lg:col-span-7 lg:col-start-6">
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
                <p className="t-mono bg-[linear-gradient(92deg,#2B7FFF,#7B2FF7)] bg-clip-text text-transparent">
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
