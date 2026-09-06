import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  DEFAULT_BLOG_IMAGE,
  getPublicBlogPosts,
} from "@/lib/blogStore";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Export Insights",
  description:
    "GOPU Exports insights on Indian agricultural exports, spices, rice, grains, documentation, and B2B sourcing.",
  alternates: { canonical: "/blog" },
};

async function getPosts() {
  try {
    return { posts: await getPublicBlogPosts(), error: "" };
  } catch (error) {
    console.error("Public blog list failed", error);
    return { posts: [], error: "Insights are temporarily unavailable. Please try again shortly." };
  }
}

export default async function BlogPage() {
  const { posts, error } = await getPosts();

  return (
    <main className="min-h-screen bg-[#F5F7FA] text-[#0F172A]">
      <section className="border-b border-[#E2E8F0] bg-white">
        <div className="mx-auto max-w-[1450px] px-6 py-14 sm:px-8">
          <div className="flex items-center gap-4">
            <div className="h-[2px] w-10 bg-[#0E7490]" />
            <p className="text-[11px] font-black tracking-[0.26em] text-[#0E7490]">EXPORT INSIGHTS</p>
          </div>
          <h1 className="mt-4 text-[48px] font-black leading-none tracking-[-0.05em] text-[#0F172A] lg:text-[64px]">
            Insights
          </h1>
          <p className="mt-4 max-w-2xl text-[17px] leading-[1.8] text-[#64748B]">
            Practical updates for importers sourcing Indian spices, rice, grains, and agricultural commodities.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1450px] px-6 py-14 sm:px-8">
        {error ? (
          <div className="rounded-2xl border border-red-200 bg-white p-10 text-center text-red-700">
            <h2 className="text-[24px] font-black tracking-[-0.03em]">Unable to load insights.</h2>
            <p className="mx-auto mt-3 max-w-lg text-[15px] leading-[1.8]">{error}</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-2xl border border-[#D9E2EC] bg-white p-10 text-center">
            <h2 className="text-[24px] font-black tracking-[-0.03em]">No published posts yet.</h2>
            <p className="mx-auto mt-3 max-w-lg text-[15px] leading-[1.8] text-[#64748B]">
              New buyer insights will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug}`}
                className="group overflow-hidden rounded-2xl border border-[#D9E2EC] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={post.image || DEFAULT_BLOG_IMAGE}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#0E7490]">
                    {post.author || "GOPU Exports"}
                  </p>
                  <h2 className="mt-3 text-[22px] font-black leading-tight tracking-[-0.03em]">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="mt-3 line-clamp-3 text-[14px] leading-7 text-[#64748B]">{post.excerpt}</p>
                  )}
                  <p className="mt-5 text-[12px] font-bold text-[#0E7490]">READ ARTICLE</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
