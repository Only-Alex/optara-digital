import Link from "next/link";
import { placeholderNotice } from "@/lib/content";
import { RevealText } from "@/components/ui/RevealText";
import { Button } from "@/components/ui/Button";

type Props = {
  intro: string;
  backHref?: string;
  backLabel?: string;
};

export function PagePlaceholder({
  intro,
  backHref = "/",
  backLabel = "Back to home",
}: Props) {
  return (
    <section data-theme="paper" className="section pt-0">
      <div className="shell">
        <RevealText>
          <div className="card max-w-[46rem] p-9 md:p-12">
            <span className="t-mono inline-flex items-center gap-2 rounded-full border border-[var(--hairline)] px-4 py-2 text-[var(--muted)]">
              <span
                aria-hidden="true"
                className="inline-block h-1.5 w-1.5 rounded-full bg-accent"
              />
              {placeholderNotice}
            </span>

            <p className="t-body-lg mt-7 text-[var(--muted)]">{intro}</p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href="/contact" withArrow className="justify-center">
                Get Started
              </Button>
              <Link
                href={backHref}
                className="t-body inline-flex items-center justify-center rounded-full border border-[var(--hairline)] px-6 py-3.5 text-[0.9375rem] transition-colors duration-200 hover:border-accent hover:text-accent"
              >
                {backLabel}
              </Link>
            </div>
          </div>
        </RevealText>
      </div>
    </section>
  );
}
