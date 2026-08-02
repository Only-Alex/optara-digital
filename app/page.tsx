import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Cursor } from "@/components/layout/Cursor";
import { Hero3D } from "@/components/sections/Hero3D";
import {
  DifferenceSticky,
  IntroSplit,
  ServicesSticky,
} from "@/components/sections/ServicesSticky";
import { ProcessPhases } from "@/components/sections/ProcessPhases";
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

/**
 * Rebuilt 2026-08-02 to the approved reference direction
 * (cbwebsitedesign.co.uk): an interactive three.js hero, a floating-panel
 * intro, the sticky services chapters with the cursor bubble, the sticky
 * differentiators, and the process staged as full-height phases — all in the
 * logo's blue→violet→purple palette.
 *
 * The previous sections (Hero with the fluid smoke, GrowthSystem,
 * ConnectedSystem, Capabilities) stay on disk untouched, so this composition
 * is one revert away from the old homepage. Faq and Contact carry over: the
 * reference closes the same way, and both are approved as they stand.
 *
 * Grounds: paper · paper · bone · paper · ink · bone · ink. ProcessPhases is
 * the mid-page dark moment; FAQ holds the late one. Hero3D keeps id="top",
 * which the floating SpeakBubble watches, and Contact keeps id="contact".
 */
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
        <Hero3D />
        <IntroSplit />
        <ServicesSticky />
        <DifferenceSticky />
        <ProcessPhases />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <SpeakBubble />
    </>
  );
}
