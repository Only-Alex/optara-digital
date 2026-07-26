import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { serviceNav, site } from "@/lib/content";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/layout/PageHero";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";
import { RevealGroup, RevealItem, RevealText } from "@/components/ui/RevealText";
import { ServiceIcon } from "@/components/ui/ServiceIcon";

type Params = { params: Promise<{ slug: string }> };

const slugOf = (href: string) => href.replace("/services/", "");

export function generateStaticParams() {
  return serviceNav.map((service) => ({ slug: slugOf(service.href) }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const service = serviceNav.find((item) => slugOf(item.href) === slug);
  if (!service) return {};

  return {
    title: service.label,
    description: service.blurb,
    alternates: { canonical: service.href },
    openGraph: {
      title: `${service.label} — ${site.name}`,
      description: service.blurb,
      url: service.href,
    },
  };
}

export default async function ServiceDetailPage({ params }: Params) {
  const { slug } = await params;
  const service = serviceNav.find((item) => slugOf(item.href) === slug);
  if (!service) notFound();

  const others = serviceNav.filter((item) => item.href !== service.href);

  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow="Services"
          title={{ lead: service.label, accent: "" }}
          standfirst={service.blurb}
        />

        <PagePlaceholder
          intro="This service page is being written. The full detail — what the work involves, what you receive and how it is measured — is coming in a later sprint."
          backHref="/services"
          backLabel="All services"
        />

        <section data-theme="bone" className="section">
          <div className="shell">
            <RevealText>
              <p className="t-mono text-[var(--muted)]">Other services</p>
            </RevealText>

            <RevealGroup
              as="ul"
              className="mt-8 grid gap-4 sm:grid-cols-2"
              stagger={0.06}
              soft
            >
              {others.map((item) => (
                <RevealItem key={item.href} as="li">
                  <Link
                    href={item.href}
                    className="card flex h-full items-start gap-4 p-6 transition-colors duration-200 hover:border-accent"
                  >
                    <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent/10 text-accent">
                      <ServiceIcon name={item.icon} className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="t-body block font-medium">
                        {item.label}
                      </span>
                      <span className="t-caption mt-1 block text-[var(--muted)]">
                        {item.blurb}
                      </span>
                    </span>
                  </Link>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
