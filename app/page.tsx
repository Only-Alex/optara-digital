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
      <Cursor />
      <Header />
      <main>
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
