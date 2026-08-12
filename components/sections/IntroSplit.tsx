import Link from "next/link";
import { IntroSpatial } from "@/components/ui/IntroSpatial";
import { RevealText } from "@/components/ui/RevealText";
import { ArrowIcon } from "@/components/ui/Icons";

/**
 * The split intro that follows the hero in the reference: the 3D panel
 * cluster left (IntroSpatial — pointer-tracked tilt, depth separation on
 * hover, glare and ground shadow), copy right, one link out. The panels
 * remain abstract brand shapes because no client screenshots exist to show.
 *
 * Split out of ServicesSticky.tsx 2026-08-06 (Stage 2A mechanical
 * isolation) — content and markup unchanged.
 */
export function IntroSplit() {
  return (
    <section data-theme="paper" className="section bg-[var(--bg)]">
      <div className="shell grid items-center gap-14 lg:grid-cols-12 lg:gap-x-[clamp(3rem,5vw,6rem)]">
        {/* Hidden below lg here as well as inside the component, so the
            empty grid child cannot add a phantom row and double gap. */}
        <div className="hidden lg:col-span-5 lg:block">
          <IntroSpatial />
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <RevealText>
            <p className="t-mono text-[var(--muted)]">Optara Digital</p>
            {/* Reworded 2026-08-04 on instruction: the old line dismissed
                exposure, and Optara sells both. Two balanced sentences —
                exposure first, enquiries as the pay-off the accent lands on. */}
            <h2 className="t-display-lg mt-6 max-w-[20ch]">
              The exposure you want.{" "}
              <span className="text-accent">The enquiries you need.</span>
            </h2>
          </RevealText>
          <RevealText delay={0.08}>
            <p className="t-body-lg mt-7 max-w-[52ch] text-ink/75">
              We build visibility and demand together: brand, search, paid
              media, social, websites and apps working as one connected
              system, every channel amplifying the others. Growth moves in
              clear, deliberate phases, every engagement is measured against
              cost per qualified lead — and if a channel is not earning its
              keep, we are the first to tell you.
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
