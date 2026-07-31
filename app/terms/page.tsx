import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/content";
import { legalDates, legalPagesApproved } from "@/lib/legal";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LegalArticle } from "@/components/layout/LegalArticle";

/**
 * DRAFT until `legalPagesApproved` is true — noindexed, unlinked, out of the
 * sitemap.
 *
 * These terms govern use of the public website only; they are not a service
 * contract. Deliberate omissions, recorded in
 * docs/privacy/LEGAL_FACTS_REQUIRED.md rather than guessed here:
 *
 * - No legal entity details (company type, number, registered office) — not
 *   verified anywhere in the project.
 * - No governing-law clause — "UK-based" is verified, but the UK has three
 *   legal systems and the business must confirm which applies before this
 *   page can be finalised.
 *
 * The liability and intellectual-property wording below is drafted
 * conservatively and is flagged for solicitor review before approval.
 */
const TITLE = "Website Terms | Optara Digital";
const DESCRIPTION =
  "The terms that apply to using the Optara Digital website: permitted use, intellectual property, content, external links, availability and liability.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/terms" },
  ...(legalPagesApproved ? {} : { robots: { index: false, follow: false } }),
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/terms" },
};

export default function WebsiteTermsPage() {
  return (
    <>
      <Header />
      <LegalArticle
        eyebrow="Website Terms"
        title="The terms for using this website."
        lastUpdated={legalDates.terms}
        intro="These terms cover your use of the Optara Digital website. They are not a contract for services — any engagement with Optara Digital is agreed separately, in writing, with its own terms."
      >
        <h2 id="about">About this website and these terms</h2>
        <p>
          This website at optaradigital.com is operated by Optara Digital, a
          UK-based digital marketing agency. By using the website you accept
          these terms; if you do not accept them, do not use the website. We
          may update these terms, and the date at the top shows the last
          revision.
        </p>

        <h2 id="permitted-use">Using the website</h2>
        <p>
          You may browse the website, and share links to it, for any lawful
          purpose. You must not:
        </p>
        <ul>
          <li>
            attempt to gain unauthorised access to the website, its
            infrastructure or any connected system
          </li>
          <li>
            introduce malicious software or attempt to interfere with the
            website&rsquo;s availability, including by deliberate overload
          </li>
          <li>
            submit enquiry forms in an automated or abusive way, or use them to
            send unlawful, deceptive or malicious content
          </li>
          <li>
            misrepresent an association with Optara Digital, or frame or
            mirror the website in a way that implies one
          </li>
        </ul>

        <h2 id="ip">Intellectual property</h2>
        <p>
          The content of this website — its text, design, graphics and code —
          belongs to Optara Digital or its licensors. You may not reproduce it
          commercially without permission. Third-party names and trademarks
          mentioned on the website (for example, platform names such as Google)
          belong to their respective owners, and no affiliation or endorsement
          is implied.
        </p>
        <p>
          Project work shown on this website that is labelled as a concept
          project is illustrative of approach and is not, and does not depict,
          delivered client work.
        </p>

        <h2 id="content">Website and blog content</h2>
        <p>
          The content of this website, including any blog articles, is general
          information and commentary. It is not professional advice for your
          specific circumstances, and you should not rely on it as such —
          decisions about your business remain your own. We work to keep
          content accurate, but we do not promise that everything is complete
          or current at every moment.
        </p>

        <h2 id="links">Links to other websites</h2>
        <p>
          Where this website links to other websites, those sites are outside
          our control and we are not responsible for their content or their
          handling of your information.
        </p>

        <h2 id="availability">Availability and changes</h2>
        <p>
          We may change, suspend or withdraw any part of the website at any
          time and do not guarantee uninterrupted availability. We may also
          update these terms; continued use after a change means the revised
          terms apply.
        </p>

        <h2 id="enquiries">Enquiries</h2>
        <p>
          Submitting an enquiry through the website starts a conversation and
          nothing more: it does not create a contract, an engagement or any
          obligation on either side. How enquiry information is handled is
          explained in the <Link href="/privacy">Privacy Policy</Link>.
        </p>

        <h2 id="liability">Liability</h2>
        <p>
          Nothing in these terms excludes or limits any liability that cannot
          lawfully be excluded or limited. Subject to that, the website is
          provided free of charge on an &ldquo;as is&rdquo; basis, and we are
          not liable for loss arising from reliance on its general content or
          from interruption or unavailability of the website.
        </p>

        <h2 id="contact">Contact</h2>
        <p>
          Questions about these terms:{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
      </LegalArticle>
      <Footer />
    </>
  );
}
