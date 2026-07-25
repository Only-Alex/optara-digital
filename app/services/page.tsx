import type { Metadata } from "next";
import Link from "next/link";
import { servicePages, servicesIndex, site } from "@/lib/content";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/layout/PageHero";
import { CtaBand } from "@/components/layout/CtaBand";
import { RevealGroup, RevealItem } from "@/components/ui/RevealText";
import { ArrowIcon } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Services",
  description: servicesIndex.standfirst,
  alternates: { canonical: "/services" },
  openGraph: {
    title: `Services — ${site.name}`,
    description: servicesIndex.standfirst,
    url: "/services",
  },
};

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow={servicesIndex.eyebrow}
          title={servicesIndex.title}
          standfirst={servicesIndex.standfirst}
        />

        <section data-theme="paper" className="section pt-0">
          <div className="shell">
            <RevealGroup as="ul" className="border-t border-[var(--hairline)]" stagger={0.07} soft>
              {servicePages.map((service, i) => (
                <RevealItem
                  key={service.slug}
                  as="li"
                  className="border-b border-[var(--hairline)]"
                >
                  <Link
                    href={`/services/${service.slug}`}
                    className="group grid gap-4 py-10 md:grid-cols-12 md:items-baseline md:gap-6"
                  >
                    <span className="t-mono text-accent md:col-span-1">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h2 className="t-display-md transition-colors duration-200 group-hover:text-accent md:col-span-4">
                      {service.label}
                    </h2>
                    <p className="t-body max-w-[52ch] text-[var(--muted)] md:col-span-6">
                      {service.standfirst}
                    </p>
                    <span className="flex justify-start text-accent md:col-span-1 md:justify-end">
                      <ArrowIcon className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                    </span>
                  </Link>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>

        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
