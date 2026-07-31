import { RevealText } from "@/components/ui/RevealText";

type Props = {
  eyebrow: string;
  title: { lead: string; accent?: string };
  standfirst?: string;
};

export function PageHero({ eyebrow, title, standfirst }: Props) {
  return (
    <section data-theme="paper" className="relative overflow-hidden bg-[var(--bg)] pb-16 pt-36 md:pt-44">
      <div
        aria-hidden="true"
        // No spaces inside the arbitrary value: Tailwind splits a class on
        // whitespace, so the previous rgba(91, 61, 245,0.10) compiled to
        // nothing and this ambient glow never rendered on any internal page.
        className="pointer-events-none absolute left-1/2 top-0 h-[30rem] w-[70rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(91,61,245,0.10),transparent_65%)]"
      />
      <div className="shell relative">
        <RevealText>
          <p className="t-mono text-[var(--muted)]">{eyebrow}</p>
          <h1 className="t-display-xl mt-6 max-w-[18ch]">
            {title.lead}
            {title.accent ? (
              <> <span className="text-accent">{title.accent}</span></>
            ) : null}
          </h1>
        </RevealText>
        {standfirst ? (
          <RevealText delay={0.1}>
            <p className="t-body-lg mt-8 max-w-[58ch] text-[var(--muted)]">
              {standfirst}
            </p>
          </RevealText>
        ) : null}
      </div>
    </section>
  );
}
