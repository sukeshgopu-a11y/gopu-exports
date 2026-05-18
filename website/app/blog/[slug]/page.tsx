import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createPublicClient } from "@/src/lib/supabase/public";

export const revalidate = 60;

type BlogPost = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  image?: string;
  author?: string;
  tags?: string[];
  published?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
};

type Props = { params: Promise<{ slug: string }> };

async function getPost(slug: string) {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "blogs")
    .maybeSingle();

  const posts = Array.isArray(data?.value) ? (data.value as BlogPost[]) : [];
  return posts.find((post) => post.slug === slug && post.published) ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt || "GOPU Exports article.",
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt || "GOPU Exports article.",
      images: post.image ? [{ url: post.image }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const paragraphs = (post.content || post.excerpt || "")
    .split(/\n{2,}/)
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <main className="min-h-screen bg-[#F5F7FA] text-[#0F172A]">
      <article className="mx-auto max-w-4xl px-6 py-14 sm:px-8">
        <Link href="/blog" className="text-[13px] font-bold text-[#0E7490] hover:text-[#0A5A70]">
          BACK TO BLOG
        </Link>
        <p className="mt-6 text-[11px] font-black uppercase tracking-[0.22em] text-[#0E7490]">
          {post.author || "GOPU Exports"} · {new Date(post.createdAt).toLocaleDateString()}
        </p>
        <h1 className="mt-4 text-[42px] font-black leading-tight tracking-[-0.05em] lg:text-[58px]">
          {post.title}
        </h1>
        {post.excerpt && <p className="mt-5 text-[18px] leading-8 text-[#64748B]">{post.excerpt}</p>}
        {post.image && (
          <div className="relative mt-10 h-[420px] overflow-hidden rounded-2xl border border-[#D9E2EC] bg-white">
            <Image src={post.image} alt={post.title} fill sizes="100vw" className="object-cover" />
          </div>
        )}
        <div className="mt-10 space-y-6 text-[16px] leading-8 text-[#334155]">
          {paragraphs.length > 0 ? (
            paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
          ) : (
            <p>This article is being prepared by GOPU Exports.</p>
          )}
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
