import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Cursor } from "@/components/layout/Cursor";
import { Hero } from "@/components/sections/Hero";
// Two components are deliberately absent from this page:
//
// Results — its figures were never verified, so the data is zeroed and the
// component is held for the day real, attributable numbers exist.
// Intro — retired from the homepage because it restated GrowthSystem. The
// component and its copy stay for the /about rebuild in sprint 5.
//
// Insights/blog is also absent until /blog has real articles rather than stubs.
import { GrowthSystem } from "@/components/sections/GrowthSystem";
import { ConnectedSystem } from "@/components/sections/ConnectedSystem";
import { Capabilities } from "@/components/sections/Capabilities";
import { Work } from "@/components/sections/Work";
import { Difference } from "@/components/sections/Difference";
import { Process } from "@/components/sections/Process";
import { Sectors } from "@/components/sections/Sectors";
import { Testimonials } from "@/components/sections/Testimonials";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";
import { SpeakBubble } from "@/components/ui/SpeakBubble";

// Grounds alternate deliberately: paper · paper · bone · paper · ink · paper ·
// bone · paper · ink · paper · bone, closing on an ink footer. The three dark
// moments are evenly spaced so the page changes gear rather than running flat.
export default function Home() {
  return (
    <>
      <Cursor />
      <Header />
      <main>
        <Hero />
        <GrowthSystem />
        <ConnectedSystem />
        <Capabilities />
        <Work />
        <Difference />
        <Process />
        <Sectors />
        <Testimonials />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <SpeakBubble />
    </>
  );
}
