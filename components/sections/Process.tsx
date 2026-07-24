"use client";

import { useEffect, useRef, useState } from "react";
import { process } from "@/lib/content";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

export function Process() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [current, setCurrent] = useState(0);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    if (!isDesktop) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = stepRefs.current.indexOf(entry.target as HTMLLIElement);
          if (index >= 0) setCurrent(index);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    stepRefs.current.forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
  }, [isDesktop]);

  return (
    <section data-theme="light" className="section">
      <div className="shell grid-12 gap-y-12">
        <div className="col-span-12 lg:col-span-4">
          <p className="t-mono text-[var(--muted)]">{process.eyebrow}</p>
          <div className="lg:sticky lg:top-[38vh]">
            <h2 className="t-display-md mt-6 max-w-[12ch]">{process.title}</h2>
            <span
              aria-hidden="true"
              className="t-display-xl mt-10 hidden leading-none text-blue lg:block"
            >
              {process.steps[current].index}
            </span>
          </div>
        </div>

        <ol className="col-span-12 lg:col-span-7 lg:col-start-6">
          {process.steps.map((step, i) => (
            <li
              key={step.index}
              ref={(node) => {
                stepRefs.current[i] = node;
              }}
              className="border-t border-[var(--hairline)] py-12 last:border-b"
            >
              <p className="t-mono text-[var(--muted)] lg:hidden">{step.index}</p>
              <h3 className="t-display-md mt-3 lg:mt-0">{step.name}</h3>
              <p className="t-body-lg mt-5 max-w-[52ch] text-[var(--muted)]">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
