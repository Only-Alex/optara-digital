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
 * The short honest version of a cookie policy, because the honest version is
 * short: verified by live browser inspection on 2026-07-31, this site sets no
 * cookies and uses no similar storage technology, first- or third-party, and
 * makes no third-party requests. There is deliberately no cookie table of
 * invented entries, no consent banner and no "Cookie settings" control,
 * because there is nothing for any of them to describe or manage. See
 * docs/privacy/storage-and-consent.md for the evidence and the conditions
 * under which this page must change.
 */
const TITLE = "Cookie Policy | Optara Digital";
const DESCRIPTION =
  "The cookies and similar technologies used on the Optara Digital website: currently none, verified in the browser, with a commitment to update this page before that ever changes.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/cookies" },
  ...(legalPagesApproved ? {} : { robots: { index: false, follow: false } }),
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/cookies" },
};

export default function CookiePolicyPage() {
  return (
    <>
      <Header />
      <LegalArticle
        eyebrow="Cookie Policy"
        title="This website does not use cookies."
        lastUpdated={legalDates.cookies}
        intro="Most cookie policies explain what a site stores on your device and how to manage it. Ours is shorter, because the answer is: nothing."
      >
        <h2 id="what-cookies-are">What cookies and similar technologies are</h2>
        <p>
          Cookies are small files a website stores on your device so it can
          recognise you between pages or visits. Similar technologies —
          browser local storage, session storage, tracking pixels, device
          fingerprinting — do comparable jobs by other means. UK law requires
          websites to tell you about these technologies and, for most purposes
          beyond the strictly necessary, to ask before using them.
        </p>

        <h2 id="what-we-use">What this website uses</h2>
        <p>
          <strong>None of them.</strong> This website sets no cookies — neither
          our own nor anyone else&rsquo;s — and does not use local storage,
          session storage, IndexedDB, service workers, tracking pixels or any
          comparable technology. It loads no third-party scripts, no analytics,
          no embedded media and no external fonts: every resource comes from
          this website&rsquo;s own domain.
        </p>
        <p>
          That is a statement about the real behaviour of the site, checked in
          a browser against the live website, not a template sentence. It is
          also why you have not been shown a cookie banner: there is nothing to
          consent to, and displaying a banner anyway would misdescribe how the
          site works.
        </p>

        <h2 id="browser-controls">Your browser&rsquo;s own controls</h2>
        <p>
          Independently of any website, your browser lets you view, block and
          delete cookies and site data in its privacy settings. Nothing this
          site does depends on those settings — it works identically with
          cookies blocked entirely.
        </p>

        <h2 id="if-this-changes">If this ever changes</h2>
        <p>
          If a future feature genuinely needs to store something on your device
          — or introduces a third-party service that does — this page will be
          updated first with a factual list of what is used, why, and for how
          long, and where the law requires it you will be asked before anything
          non-essential loads. Until this page says otherwise, the answer
          remains: no cookies, nothing stored.
        </p>

        <h2 id="contact">Questions</h2>
        <p>
          Email <a href={`mailto:${site.email}`}>{site.email}</a>. Our{" "}
          <Link href="/privacy">Privacy Policy</Link> explains how enquiry
          information is handled.
        </p>
      </LegalArticle>
      <Footer />
    </>
  );
}
