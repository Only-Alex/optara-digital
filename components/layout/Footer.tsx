import { footer, site } from "@/lib/content";

export function Footer() {
  return (
    <footer data-theme="dark" className="overflow-hidden bg-[var(--bg)] pt-[var(--section-y)] text-[var(--fg)]">
      <div className="shell grid-12 gap-y-12">
        {footer.columns.map((column) => (
          <div key={column.title} className="col-span-6 md:col-span-3 lg:col-span-2">
            <h2 className="t-mono text-[var(--muted)]">{column.title}</h2>
            <ul className="mt-6 flex flex-col gap-3">
              {column.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="t-body transition-colors duration-200 hover:text-blue"
                    {...(link.href.startsWith("http")
                      ? { target: "_blank", rel: "noreferrer" }
                      : {})}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {footer.offices.map((office) => (
          <div key={office.city} className="col-span-6 md:col-span-3 lg:col-span-2">
            <h2 className="t-mono text-[var(--muted)]">{office.city}</h2>
            <address className="t-body mt-6 not-italic">
              {office.lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          </div>
        ))}

        <div className="col-span-12 lg:col-span-3 lg:col-start-10">
          <h2 className="t-mono text-[var(--muted)]">Enquiries</h2>
          <a
            href={`mailto:${site.email}`}
            className="t-body mt-6 inline-block transition-colors duration-200 hover:text-blue"
          >
            {site.email}
          </a>
        </div>
      </div>

      <div className="shell mt-24 flex items-center justify-between gap-6 border-t border-[var(--hairline)] pt-6">
        <p className="t-mono text-[var(--muted)]">
          © {new Date().getFullYear()} {site.name}
        </p>
        <a href="#top" className="t-mono transition-colors duration-200 hover:text-blue">
          Back to top ↑
        </a>
      </div>

      <div aria-hidden="true" className="mt-16 -mb-[0.18em] px-[var(--gutter)]">
        <span className="block whitespace-nowrap font-display leading-[0.8] tracking-[-0.04em] text-[19vw]">
          {site.name}
        </span>
      </div>
    </footer>
  );
}
