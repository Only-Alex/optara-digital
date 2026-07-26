import type { Metadata } from "next";
import Link from "next/link";
import { serviceNav, servicesIndex, site } from "@/lib/content";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/layout/PageHero";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";
import { RevealGroup, RevealItem } from "@/components/ui/RevealText";
import { ArrowIcon } from "@/components/ui/Icons";
import { ServiceIcon } from "@/components/ui/ServiceIcon";

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
            <RevealGroup
              as="ul"
              className="grid gap-5 md:grid-cols-2"
              stagger={0.07}
              soft
            >
              {serviceNav.map((service) => (
                <RevealItem key={service.href} as="li">
                  <Link
                    href={service.href}
                    className="card group flex h-full items-start gap-4 p-8 transition-colors duration-200 hover:border-accent"
                  >
                    <span className="mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent/10 text-accent">
                      <ServiceIcon name={service.icon} className="h-5 w-5" />
                    </span>
                    <span className="flex-1">
                      <span className="t-display-md block transition-colors duration-200 group-hover:text-accent">
                        {service.label}
                      </span>
                      <span className="t-body mt-3 block max-w-[38ch] text-[var(--muted)]">
                        {service.blurb}
                      </span>
                    </span>
                    <ArrowIcon className="mt-1 h-5 w-5 shrink-0 text-accent transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>

        <PagePlaceholder intro="Detailed service pages are in development. Each one will cover what the work involves, what you receive and how results are measured." />
      </main>
      <Footer />
    </>
  );
}
