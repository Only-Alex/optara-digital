"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { capabilities } from "@/lib/content";
import { EASE, hoverTransition } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { RevealText } from "@/components/ui/RevealText";
import { ServiceMockup } from "@/components/ui/ServiceMockup";

/**
 * Crossfade between service visuals. Long enough to read as a dissolve rather
 * than a cut, short enough that the section never feels like it is waiting.
 */
const CROSSFADE = 0.52;

/**
 * The permanent visual shell.
 *
 * Every service layer is mounted at once and stacked in the same frame, with
 * only opacity and a few pixels of travel between them. This is the whole fix
 * for the blank panel: the previous version put the entire right-hand column
 * inside a single `AnimatePresence mode="wait"`, so the outgoing service had to
 * finish leaving before the incoming one was allowed to mount — measured at
 * ~180ms of a completely empty 600x735px column on every switch. Here the
 * incoming layer is already at full opacity while the outgoing one is still
 * fading, so the combined opacity never dips and the shell itself never
 * animates, unmounts or collapses.
 */
function VisualShell({
  active,
  reduced,
}: {
  active: number;
  reduced: boolean;
}) {
  return (
    <div className="relative">
      {/* Offset plane behind the panel — layered depth without a glow. */}
      <span
        aria-hidden="true"
        className="absolute -right-2.5 -top-2.5 h-full w-full rounded-[13px] border border-[rgba(18,19,26,0.08)] bg-[color-mix(in_srgb,var(--color-ink)_4%,transparent)]"
      />
      <div
        data-theme="ink"
        // aspect-ratio, not a measured height: the frame keeps its exact
        // dimensions whatever is inside it, so nothing can collapse mid-switch.
        className="relative aspect-[4/3] w-full overflow-hidden rounded-[13px] border border-[rgba(255,255,255,0.06)] bg-[linear-gradient(165deg,#171827_0%,#101119_58%,#0d0e15_100%)] p-4 shadow-[0_18px_44px_rgba(18,19,26,0.18)] sm:p-5"
      >
        {/* Fine internal grid — ambient structure, kept well under the
            drawings so it reads as paper rather than as content. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:32px_32px]"
        />

        {capabilities.groups.map((group, i) => {
          const shown = i === active;
          return (
            <motion.div
              key={group.name}
              aria-hidden="true"
              className="absolute inset-4 sm:inset-5"
              initial={false}
              animate={{
                opacity: shown ? 1 : 0,
                y: reduced ? 0 : shown ? 0 : -6,
                scale: reduced ? 1 : shown ? 1 : 0.99,
              }}
              transition={
                reduced
                  ? { duration: 0 }
                  : {
                      duration: CROSSFADE,
                      ease: EASE,
                      // The incoming layer leads and the outgoing one trails,
                      // so the two overlap through the middle of the switch.
                      opacity: { duration: shown ? 0.34 : CROSSFADE },
                    }
              }
              style={{ pointerEvents: "none" }}
            >
              <ServiceMockup index={i} className="h-full w-full" />
            </motion.div>
          );
        })}

        {/* Service identifier, pinned to the frame rather than to a layer, so
            it updates without taking part in the crossfade. */}
        <span
          aria-hidden="true"
          className="t-mono absolute bottom-4 right-5 text-[0.6875rem] text-[color-mix(in_srgb,var(--color-paper)_55%,transparent)] sm:bottom-5"
        >
          {capabilities.groups[active].number}
        </span>
      </div>
    </div>
  );
}

/** Every service laid out in full, one after another. Used on small screens
 *  and whenever reduced motion is on, so no content is ever behind a control
 *  the reader has to operate — or behind a transition they cannot see. */
function LinearSequence() {
  return (
    <div className="mt-14 flex flex-col gap-16">
      {capabilities.groups.map((group, i) => (
        <article key={group.name}>
          <div className="flex items-baseline gap-4">
            <span className="t-mono text-accent">{group.number}</span>
            <h3 className="t-display-md">{group.name}</h3>
          </div>
          <p className="t-body-lg mt-4 max-w-[52ch] text-ink/80">
            {group.body}
          </p>
          <div className="mt-7">
            <div
              data-theme="ink"
              className="relative aspect-[4/3] w-full overflow-hidden rounded-[13px] border border-[rgba(255,255,255,0.06)] bg-[linear-gradient(165deg,#171827_0%,#101119_58%,#0d0e15_100%)] p-4 shadow-[0_18px_44px_rgba(18,19,26,0.18)] sm:p-5"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:32px_32px]"
              />
              <ServiceMockup index={i} className="h-full w-full" />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export function Capabilities() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const group = capabilities.groups[active];

  return (
    <section id="services" data-theme="paper" className="section">
      <div className="shell">
        <RevealText>
          <p className="t-mono text-[var(--muted)]">{capabilities.eyebrow}</p>
          <h2 className="t-display-lg mt-6 max-w-[24ch]">
            {capabilities.title.lead}{" "}
            <span className="text-accent">{capabilities.title.accent}</span>
          </h2>
          <p className="t-body-lg mt-6 max-w-[62ch] text-ink/75">
            {capabilities.intro}
          </p>
        </RevealText>

        {/* Below lg, and under reduced motion at any width, the six services
            are simply listed out. A tab strip hides five services behind a
            control, which is the wrong trade on a phone and the wrong trade
            for anyone who has asked not to be shown transitions. */}
        <div className="lg:hidden">
          <LinearSequence />
        </div>
        {reduced && (
          <div className="hidden lg:block">
            <LinearSequence />
          </div>
        )}

        {!reduced && (
          <div className="mt-14 hidden gap-12 lg:grid lg:grid-cols-12">
            {/* 5/12 and 7/12 — the 41%/58% split the composition calls for. */}
            <div className="lg:col-span-5">
              <ul
                role="tablist"
                aria-label="Services"
                className="flex flex-col border-t border-[var(--hairline)]"
              >
                {capabilities.groups.map((item, i) => {
                  const selected = i === active;
                  return (
                    <li
                      key={item.name}
                      className="border-b border-[var(--hairline)]"
                    >
                      <motion.button
                        type="button"
                        role="tab"
                        id={`cap-tab-${i}`}
                        aria-selected={selected}
                        aria-controls="cap-panel"
                        onClick={() => setActive(i)}
                        className="relative flex w-full items-center gap-4 py-4 text-left"
                        whileHover={{ x: 4 }}
                        transition={hoverTransition}
                      >
                        <span
                          className={`t-mono w-7 shrink-0 transition-colors duration-200 ${
                            selected ? "text-accent" : "text-[var(--muted)]"
                          }`}
                        >
                          {item.number}
                        </span>
                        <span
                          className={`t-display-md transition-colors duration-200 ${
                            selected ? "text-accent" : "text-[var(--fg)]"
                          }`}
                        >
                          {item.name}
                        </span>
                        {/* Selection is carried by the rule and the number as
                            well as by colour, so it is never colour alone. */}
                        {selected && (
                          <motion.span
                            layoutId="cap-indicator"
                            aria-hidden="true"
                            className="absolute -bottom-px left-0 h-0.5 w-full bg-accent"
                            transition={{ duration: 0.35, ease: EASE }}
                          />
                        )}
                      </motion.button>
                    </li>
                  );
                })}
              </ul>

              {/* The description sits in a fixed region so switching service
                  cannot reflow the column or shift the tabs above it. */}
              <div className="relative mt-8 min-h-[9.5rem]">
                {capabilities.groups.map((item, i) => (
                  <motion.p
                    key={item.name}
                    id={i === active ? "cap-panel" : undefined}
                    role={i === active ? "tabpanel" : undefined}
                    aria-labelledby={i === active ? `cap-tab-${i}` : undefined}
                    aria-hidden={i === active ? undefined : true}
                    className="t-body-lg absolute inset-x-0 top-0 max-w-[46ch] text-ink/80"
                    initial={false}
                    animate={{
                      opacity: i === active ? 1 : 0,
                      y: i === active ? 0 : 4,
                    }}
                    transition={{
                      duration: i === active ? 0.34 : CROSSFADE,
                      ease: EASE,
                    }}
                    style={{ pointerEvents: i === active ? "auto" : "none" }}
                  >
                    {item.body}
                  </motion.p>
                ))}
              </div>
            </div>

            {/* Safe area for the floating contact button. It is fixed, so at
                some scroll position it crosses the shell's right edge whatever
                its vertical placement — clearing horizontally is the only
                reliable fix. The reserve is the button's own footprint (92px
                plus its 28px margin, plus room for its hover scale) minus the
                space the container already leaves, so it is zero from about
                1480px up, where the centred container has pulled clear on its
                own, and never touches the left column. */}
            <div
              className="lg:col-span-7"
              style={{
                paddingRight:
                  "max(0px, calc(132px - max(0px, (100vw - 1360px) / 2) - clamp(1.25rem, 4vw, 4rem)))",
              }}
            >
              <VisualShell active={active} reduced={reduced} />
            </div>
          </div>
        )}
      </div>
      {/* Screen readers get the active service announced through the tab
          panel; the visual frame is decorative throughout. */}
      <span className="sr-only" aria-live="polite">
        {group.name}
      </span>
    </section>
  );
}
