import type { Metadata } from "next";
import { blogPage, site } from "@/lib/content";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/layout/PageHero";
import { CtaBand } from "@/components/layout/CtaBand";
import { RevealGroup, RevealItem } from "@/components/ui/RevealText";

export const metadata: Metadata = {
  title: "Blog",
  description: blogPage.standfirst,
  alternates: { canonical: "/blog" },
  openGraph: {
    title: `Blog — ${site.name}`,
    description: blogPage.standfirst,
    url: "/blog",
  },
};

export default function BlogPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow={blogPage.eyebrow}
          title={blogPage.title}
          standfirst={blogPage.standfirst}
        />

        <section data-theme="paper" className="section pt-0">
          <div className="shell">
            <RevealGroup as="ul" className="border-t border-[var(--hairline)]" stagger={0.07} soft>
              {blogPage.posts.map((post) => (
                <RevealItem
                  key={post.slug}
                  as="li"
                  className="border-b border-[var(--hairline)]"
                >
                  <article className="grid gap-4 py-10 md:grid-cols-12 md:gap-6">
                    <div className="md:col-span-3">
                      <p className="t-mono text-accent">{post.category}</p>
                      <p className="t-mono mt-2 text-[var(--muted)]">
                        {post.readingTime}
                      </p>
                    </div>
                    <div className="md:col-span-9">
                      <h2 className="t-display-md max-w-[26ch]">{post.title}</h2>
                      <p className="t-body mt-4 max-w-[62ch] text-[var(--muted)]">
                        {post.excerpt}
                      </p>
                    </div>
                  </article>
                </RevealItem>
              ))}
            </RevealGroup>

            <p className="t-caption mt-10 text-[var(--muted)]">
              Article pages are not built yet — these are outlines only.
            </p>
          </div>
        </section>

        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
