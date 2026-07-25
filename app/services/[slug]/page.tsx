import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { servicePages, site } from "@/lib/content";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/layout/PageHero";
import { CtaBand } from "@/components/layout/CtaBand";
import { RevealGroup, RevealItem, RevealText } from "@/components/ui/RevealText";
import { CheckIcon } from "@/components/ui/Icons";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return servicePages.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const service = servicePages.find((item) => item.slug === slug);
  if (!service) return {};

  return {
    title: service.label,
    description: service.standfirst,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: `${service.label} — ${site.name}`,
      description: service.standfirst,
      url: `/services/${service.slug}`,
    },
  };
}

export default async function ServiceDetailPage({ params }: Params) {
  const { slug } = await params;
  const service = servicePages.find((item) => item.slug === slug);
  if (!service) notFound();

  const others = servicePages.filter((item) => item.slug !== service.slug);

  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow={service.eyebrow}
          title={service.title}
          standfirst={service.standfirst}
        />

        <section data-theme="paper" className="section pt-0">
          <div className="shell grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <RevealGroup stagger={0.08}>
                {service.intro.map((paragraph, i) => (
                  <RevealItem
                    key={paragraph}
                    as="p"
                    className={
                      i === 0
                        ? "t-body-lg mb-6"
                        : "t-body-lg mb-6 text-[var(--muted)]"
                    }
                  >
                    {paragraph}
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>

            <div className="lg:col-span-4 lg:col-start-9">
              <RevealText>
                <div className="card p-8">
                  <p className="t-display-lg text-accent">{service.proof.value}</p>
                  <p className="t-body mt-4">{service.proof.label}</p>
                  <p className="t-mono mt-4 text-[var(--muted)]">
                    {service.proof.client}
                  </p>
                </div>
              </RevealText>
            </div>
          </div>
        </section>

        <section data-theme="bone" className="section">
          <div className="shell">
            <RevealText>
              <h2 className="t-display-lg max-w-[20ch]">
                What the work{" "}
                <span className="text-accent">actually involves.</span>
              </h2>
            </RevealText>

            <RevealGroup
              className="mt-14 grid gap-6 md:grid-cols-2"
              stagger={0.08}
              soft
            >
              {service.offerings.map((item) => (
                <RevealItem key={item.title} className="card h-full p-8">
                  <h3 className="t-display-md">{item.title}</h3>
                  <p className="t-body mt-4 max-w-[40ch] text-[var(--muted)]">
                    {item.body}
                  </p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>

        <section data-theme="paper" className="section">
          <div className="shell grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <RevealText>
                <h2 className="t-display-lg max-w-[14ch]">
                  What you <span className="text-accent">receive.</span>
                </h2>
              </RevealText>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <RevealGroup as="ul" className="grid gap-4 sm:grid-cols-2" stagger={0.06}>
                {service.deliverables.map((item) => (
                  <RevealItem key={item} as="li" className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent/10 text-accent">
                      <CheckIcon className="h-3 w-3" />
                    </span>
                    <span className="t-body">{item}</span>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          </div>
        </section>

        <section data-theme="bone" className="section">
          <div className="shell grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <RevealText>
                <h2 className="t-display-lg max-w-[14ch]">
                  Common <span className="text-accent">questions.</span>
                </h2>
              </RevealText>
            </div>
            <RevealGroup
              as="ul"
              className="lg:col-span-7 lg:col-start-6"
              stagger={0.07}
              soft
            >
              {service.faqs.map((item) => (
                <RevealItem
                  key={item.question}
                  as="li"
                  className="border-b border-[var(--hairline)] py-6 first:border-t"
                >
                  <h3 className="t-body-lg font-medium">{item.question}</h3>
                  <p className="t-body mt-3 text-[var(--muted)]">{item.answer}</p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>

        <section data-theme="paper" className="section">
          <div className="shell">
            <RevealText>
              <p className="t-mono text-[var(--muted)]">Other services</p>
            </RevealText>
            <RevealGroup
              as="ul"
              className="mt-8 flex flex-wrap gap-3"
              stagger={0.05}
            >
              {others.map((item) => (
                <RevealItem key={item.slug} as="li">
                  <Link
                    href={`/services/${item.slug}`}
                    className="pill border border-[var(--hairline)] transition-colors duration-200 hover:border-accent hover:text-accent"
                  >
                    {item.label}
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
