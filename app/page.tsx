import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Cursor } from "@/components/layout/Cursor";
import { Hero } from "@/components/sections/Hero";
import { GrowthSystem } from "@/components/sections/GrowthSystem";
import { ConnectedSystem } from "@/components/sections/ConnectedSystem";
import { Capabilities } from "@/components/sections/Capabilities";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";
import { SpeakBubble } from "@/components/ui/SpeakBubble";
import { site } from "@/lib/content";
import { siteOrigin } from "@/lib/site-url";

/**
 * The canonical Organization definition for the whole site.
 *
 * Every internal page emits an Organization node carrying the same
 * `#organization` @id and references it from its own page schema, but the
 * homepage previously emitted no structured data at all — so the identity the
 * rest of the site pointed at was never actually declared on the page that
 * owns it.
 *
 * Verified facts only: name, url, description and the logo already served from
 * this origin. No founder, no employee count, no founding date, no postal
 * address, no telephone, no sameAs — none of those is verified, and the
 * telephone in the content file is an Ofcom fiction range.
 */
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteOrigin}#organization`,
      name: site.name,
      url: siteOrigin,
      description: site.description,
      logo: `${siteOrigin}/opengraph-image`,
    },
    {
      "@type": "WebSite",
      "@id": `${siteOrigin}#website`,
      url: siteOrigin,
      name: site.name,
      description: site.description,
      publisher: { "@id": `${siteOrigin}#organization` },
      inLanguage: "en-GB",
    },
    {
      "@type": "WebPage",
      "@id": `${siteOrigin}#webpage`,
      url: siteOrigin,
      name: `${site.name} — ${site.tagline}`,
      description: site.description,
      isPartOf: { "@id": `${siteOrigin}#website` },
      about: { "@id": `${siteOrigin}#organization` },
    },
  ],
};

// Deliberately short. On 2026-07-28 the homepage was cut from eleven sections
// to seven: Work, Difference, Process, Sectors and Testimonials came off. The
// components stay on disk — Work's concept projects live on /case-studies, the
// Difference commitments live on /about and in the FAQ answers, and Process
// belongs to /about. Results stays unrendered until real figures exist, and
// Testimonials returns only with verified, nameable quotes.
//
// Grounds: paper · paper · ink · paper · ink · bone · ink. ConnectedSystem is
// the mid-page dark moment; FAQ holds the late one.
export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Cursor />
      <Header />
      <main id="main" tabIndex={-1} className="scroll-mt-24 outline-none">
        <Hero />
        <GrowthSystem />
        <ConnectedSystem />
        <Capabilities />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <SpeakBubble />
    </>
  );
}
