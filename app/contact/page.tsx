import type { Metadata } from "next";
import { contactPage, site } from "@/lib/content";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/layout/PageHero";
import { Contact } from "@/components/sections/Contact";

export const metadata: Metadata = {
  title: "Contact",
  description: contactPage.standfirst,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `Contact — ${site.name}`,
    description: contactPage.standfirst,
    url: "/contact",
  },
};

export default function ContactRoute() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow={contactPage.eyebrow}
          title={contactPage.title}
          standfirst={contactPage.standfirst}
        />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
