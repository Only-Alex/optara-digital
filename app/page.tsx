import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Cursor } from "@/components/layout/Cursor";
import { Hero } from "@/components/sections/Hero";
// Results is intentionally not rendered for now: its metrics and client names
// are unverified. The component and its data are kept for the Case Studies
// sprint, where they will be substantiated before going back on the page.
import { GrowthSystem } from "@/components/sections/GrowthSystem";
import { Intro } from "@/components/sections/Intro";
import { Sectors } from "@/components/sections/Sectors";
import { Capabilities } from "@/components/sections/Capabilities";
import { Work } from "@/components/sections/Work";
import { Difference } from "@/components/sections/Difference";
import { Process } from "@/components/sections/Process";
import { Testimonials } from "@/components/sections/Testimonials";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";
import { SpeakBubble } from "@/components/ui/SpeakBubble";

export default function Home() {
  return (
    <>
      <Cursor />
      <Header />
      <main>
        <Hero />
        <GrowthSystem />
        <Intro />
        <Sectors />
        <Capabilities />
        <Work />
        <Difference />
        <Process />
        <Testimonials />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <SpeakBubble />
    </>
  );
}
