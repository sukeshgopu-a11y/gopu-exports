import type { Metadata } from "next";
import { publicMetadata, editorialSearchTitle } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  DEFAULT_BLOG_IMAGE,
  getPublicBlogPostBySlug,
} from "@/lib/blogStore";
import { serializeJsonLd } from "@/lib/jsonLd";

export const revalidate = 30;

type Props = { params: Promise<{ slug: string }> };

async function getPost(slug: string) {
  return getPublicBlogPostBySlug(slug);
}

function publicationDate(post: { publishedAt?: string; createdAt: string }) {
  return post.publishedAt || post.createdAt;
}

function formatPublicationDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const title = editorialSearchTitle(post.metaTitle || post.title);
  const description = post.metaDescription || post.excerpt || "GOPU Exports article.";
  const metadata = publicMetadata(title, description, `/blog/${post.slug}`);
  return {
    ...metadata,
    openGraph: { ...metadata.openGraph, type: "article", images: [{ url: post.image || DEFAULT_BLOG_IMAGE }] },
    twitter: { ...metadata.twitter, card: "summary_large_image", images: [post.image || DEFAULT_BLOG_IMAGE] },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const publishedAt = publicationDate(post);

  const paragraphs = (post.content || post.excerpt || "")
    .split(/\n{2,}/)
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <main className="min-h-screen bg-[#F5F7FA] text-[#0F172A]">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.metaDescription || post.excerpt,
            author: post.author && post.author !== "GOPU Exports"
              ? { "@type": "Person", name: post.author }
              : { "@id": "https://gopuexports.com/#organization" },
            publisher: { "@id": "https://gopuexports.com/#organization" },
            image: post.image || DEFAULT_BLOG_IMAGE,
            datePublished: publishedAt,
            dateModified: post.updatedAt || publishedAt,
            mainEntityOfPage: `https://gopuexports.com/blog/${post.slug}`,
            mainEntity: post.faqs?.length
              ? post.faqs.map((faq) => ({
                  "@type": "Question",
                  name: faq.question,
                  acceptedAnswer: { "@type": "Answer", text: faq.answer },
                }))
              : undefined,
          }),
        }}
      />
      <article className="mx-auto max-w-4xl px-6 py-14 sm:px-8">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Insights", href: "/blog" }, { name: post.title, href: `/blog/${post.slug}` }]} />
        <p className="mt-6 text-[11px] font-black uppercase tracking-[0.22em] text-[#0E7490]">
          {post.author || "GOPU Exports"} · <time dateTime={publishedAt}>{formatPublicationDate(publishedAt)}</time>
        </p>
        <h1 className="mt-4 text-[42px] font-black leading-tight tracking-[-0.05em] lg:text-[58px]">
          {post.title}
        </h1>
        {post.excerpt && <p className="mt-5 text-[18px] leading-8 text-[#64748B]">{post.excerpt}</p>}
        <div className="relative mt-10 h-[420px] overflow-hidden rounded-2xl border border-[#D9E2EC] bg-white">
          <Image src={post.image || DEFAULT_BLOG_IMAGE} alt={post.title} fill sizes="100vw" className="object-cover" />
        </div>
        {post.sections && post.sections.length > 0 && (
          <nav className="mt-8 rounded-2xl border border-[#D9E2EC] bg-white p-6">
            <p className="text-[12px] font-black uppercase tracking-[0.2em] text-[#0E7490]">Table of Contents</p>
            <ol className="mt-4 space-y-2 text-[14px] text-[#475569]">
              {post.sections.map((section, index) => (
                <li key={section.heading}>
                  <a className="hover:text-[#0E7490]" href={`#section-${index + 1}`}>
                    {index + 1}. {section.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}
        <div className="mt-10 space-y-8 text-[16px] leading-8 text-[#334155]">
          {post.sections && post.sections.length > 0 ? (
            post.sections.map((section, index) => (
              <section key={section.heading} id={`section-${index + 1}`}>
                <h2 className="text-[28px] font-black tracking-[-0.03em] text-[#0F172A]">{section.heading}</h2>
                <div className="mt-4 space-y-5">
                  {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
              </section>
            ))
          ) : paragraphs.length > 0 ? (
            paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
          ) : (
            <p>This article is being prepared by GOPU Exports.</p>
          )}
        </div>
        {post.faqs && post.faqs.length > 0 && (
          <section className="mt-12 rounded-2xl border border-[#D9E2EC] bg-white p-7">
            <h2 className="text-[28px] font-black tracking-[-0.03em] text-[#0F172A]">FAQ</h2>
            <div className="mt-5 space-y-5">
              {post.faqs.map((faq) => (
                <div key={faq.question}>
                  <h3 className="text-[16px] font-bold text-[#0F172A]">{faq.question}</h3>
                  <p className="mt-2 text-[14px] leading-7 text-[#64748B]">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}
        <div className="mt-10 flex flex-wrap gap-3 rounded-2xl bg-[#071624] p-6">
          <Link href="/products" className="rounded-lg bg-[#0E7490] px-5 py-3 text-[13px] font-bold text-white">
            View Export Products
          </Link>
          <Link href="/contact" className="rounded-lg border border-white/20 px-5 py-3 text-[13px] font-bold text-white">
            Send Bulk Inquiry
          </Link>
        </div>
        {post.tags && post.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-[#E6F4F7] px-3 py-1 text-[12px] font-bold text-[#0E7490]">
                {tag}
              </span>
            ))}
          </div>
        )}
      </article>
    </main>
  );
}

