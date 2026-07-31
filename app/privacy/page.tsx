import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/content";
import { legalDates, legalPagesApproved } from "@/lib/legal";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LegalArticle } from "@/components/layout/LegalArticle";

/**
 * DRAFT until `legalPagesApproved` is true — noindexed, not in the sitemap,
 * not linked from the footer or the contact form.
 *
 * Every statement below was verified against the implementation on
 * 2026-07-31: the storage claims against a live browser session, the
 * processing claims against the source, the hosting claims against live
 * response headers and DNS. What could not be verified is deliberately
 * absent — the legal entity's registration details, the eventual email
 * delivery provider and confirmed transfer safeguards are all recorded in
 * docs/privacy/LEGAL_FACTS_REQUIRED.md, not invented here.
 *
 * This drafting does not constitute legal advice and the page must be
 * reviewed by the business and an appropriate professional before it is
 * approved.
 */
const TITLE = "Privacy Policy | Optara Digital";
const DESCRIPTION =
  "How Optara Digital handles information on this website: what is collected through the enquiry form, why, the lawful bases relied on, and the rights you have.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/privacy" },
  // Draft legal pages are never indexable, whatever the site-wide state.
  ...(legalPagesApproved ? {} : { robots: { index: false, follow: false } }),
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/privacy" },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <LegalArticle
        eyebrow="Privacy Policy"
        title="How this website handles your information."
        lastUpdated={legalDates.privacy}
        intro="This notice explains what information the Optara Digital website collects, why, and the choices and rights you have. It is written to describe what actually happens rather than what privacy policies usually say."
      >
        <h2 id="who-we-are">Who we are</h2>
        <p>
          Optara Digital is a UK-based digital marketing agency. For the
          information handled through this website, Optara Digital is the
          controller — the party that decides why and how that information is
          used.
        </p>

        <h2 id="contact">How to contact us</h2>
        <p>
          For anything in this notice, including exercising your rights, email{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>

        <h2 id="what-we-collect">The information we collect</h2>
        <p>
          <strong>Enquiry information, provided by you.</strong> The contact
          forms ask for your name, work email and company, the area you are
          interested in, and a description of what you want to improve. A
          website address, an approximate budget range, timing and (on the
          homepage form) a telephone number are optional — the forms say which
          fields are required, and nothing optional is needed to get a reply.
        </p>
        <p>
          <strong>Technical information, collected automatically.</strong> Like
          any website, requests to this site carry technical details such as
          your IP address. Our hosting provider processes these to serve the
          site, and we use the IP address transiently to protect the enquiry
          forms from automated abuse. The website sets no cookies and stores
          nothing on your device — see the{" "}
          <Link href="/cookies">Cookie Policy</Link>.
        </p>

        <h2 id="why">Why we use it, and the lawful bases</h2>
        <p>
          <strong>Responding to your enquiry.</strong> We use the details you
          send to review and reply to your enquiry, and for nothing else. There
          is no mailing list, and submitting the form signs you up to nothing.
          The lawful basis is that this processing is necessary to take steps
          you have asked for before entering into a contract (UK GDPR Article
          6(1)(b)).
        </p>
        <p>
          <strong>Running and protecting the website.</strong> Serving pages,
          keeping request logs and preventing automated abuse of the forms rely
          on our legitimate interests (Article 6(1)(f)) in operating a secure,
          available service. The anti-abuse checks hold an IP address only in
          short-lived memory, never in a lasting store, and the application
          logs no personal information from enquiries.
        </p>

        <h2 id="recipients">Who receives the information</h2>
        <p>
          The website runs on Vercel, a hosting provider that processes
          requests — including their technical details — on our behalf. Domain
          name records are managed at Cloudflare, but website traffic does not
          pass through Cloudflare. We do not sell information, and we do not
          share it with anyone for their own marketing.
        </p>
        <p>
          Enquiry delivery is not yet switched on — the contact page says so
          plainly. Before it goes live, an email delivery provider will be
          appointed and this notice will be updated to name it.
        </p>

        <h2 id="transfers">International transfers</h2>
        <p>
          Our hosting provider is headquartered in the United States, and some
          processing of technical request data may take place outside the UK.
          Where a transfer of personal information outside the UK occurs, it
          must be covered by a recognised safeguard, and we are confirming the
          exact arrangements with each provider before this notice is
          finalised. You can ask us about the safeguards that apply using the
          contact details above.
        </p>

        <h2 id="retention">How long we keep information</h2>
        <p>
          Enquiries are kept for as long as needed to deal with them and, where
          a conversation continues, for the relationship that follows. We keep
          information no longer than we need it for the purpose it was given,
          and we will publish specific periods here once the enquiry channel is
          fully in operation. Hosting request logs are retained by the platform
          for its standard short operational period.
        </p>

        <h2 id="rights">Your rights</h2>
        <p>Depending on the processing, you have the right to:</p>
        <ul>
          <li>ask for a copy of the information we hold about you (access)</li>
          <li>have inaccurate information corrected (rectification)</li>
          <li>have information deleted (erasure)</li>
          <li>restrict how information is used</li>
          <li>object to processing based on legitimate interests</li>
          <li>receive certain information in a portable format</li>
        </ul>
        <p>
          To exercise any of these, email{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>. We will respond
          within one calendar month. There is normally no fee.
        </p>

        <h2 id="object">Your right to object</h2>
        <p>
          You can object to the processing we base on legitimate interests. Be
          aware of one honest limitation: the anti-abuse checks run as part of
          serving a form submission, so they cannot be switched off for an
          individual visitor while the form is being used — if you object to
          them, the alternative is to contact us by another channel.
        </p>

        <h2 id="complaints">Complaints</h2>
        <p>
          If you are unhappy with how we have handled your information, contact
          us first and we will look into it. You also have the right to
          complain to the Information Commissioner&rsquo;s Office at{" "}
          <a href="https://ico.org.uk" rel="noopener noreferrer">
            ico.org.uk
          </a>{" "}
          or on 0303 123 1113.
        </p>

        <h2 id="automated-decisions">Automated decision-making</h2>
        <p>
          This website makes no solely automated decisions about you that have
          legal or similarly significant effects. Enquiries are read and
          answered by a person.
        </p>

        <h2 id="children">Children</h2>
        <p>
          This website is aimed at businesses and is not directed at children.
          We do not knowingly collect children&rsquo;s information; if we
          discover an enquiry has come from a child, we will delete it.
        </p>

        <h2 id="changes">Changes to this notice</h2>
        <p>
          When what the website does changes — for example, when enquiry
          delivery is switched on — this notice will be updated first, and the
          date at the top reflects the last material revision.
        </p>
      </LegalArticle>
      <Footer />
    </>
  );
}
