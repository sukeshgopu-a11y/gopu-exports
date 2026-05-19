import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { EXPORT_OPERATION_PAGES, getExportOperationPage } from "@/lib/exportOperationPages";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return EXPORT_OPERATION_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getExportOperationPage(slug);
  if (!page) return {};

  return {
    title: `${page.title} | Export Buyer Resources`,
    description: page.description,
    keywords: page.keywords,
    alternates: { canonical: `/resources/${page.slug}` },
    openGraph: {
      title: `${page.title} | GOPU Exports`,
      description: page.description,
      url: `https://gopuexports.com/resources/${page.slug}`,
      type: "article",
    },
  };
}

export default async function ResourceDetailPage({ params }: Props) {
  const { slug } = await params;
  const page = getExportOperationPage(slug);
  if (!page) notFound();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <main className="bg-white">
      <article>
        <section className="bg-[#071624] px-5 py-16 text-white">
          <div className="mx-auto max-w-4xl">
            <Link href="/resources" className="inline-flex items-center gap-2 text-sm font-bold text-[#67C9D8] hover:text-white">
              <ArrowLeft className="h-4 w-4" /> Buyer Resources
            </Link>
            <h1 className="mt-6 text-4xl font-black leading-tight sm:text-5xl">{page.title}</h1>
            <p className="mt-5 text-lg leading-8 text-slate-300">{page.description}</p>
          </div>
        </section>

        <section className="px-5 py-14">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-5">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">On this page</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {page.sections.map((section) => (
                  <a key={section.heading} href={`#${section.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} className="text-sm font-bold text-[#0E7490] hover:text-[#0A5A70]">
                    {section.heading}
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-10 space-y-10">
              {page.sections.map((section) => (
                <section key={section.heading} id={section.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-")}>
                  <h2 className="text-2xl font-black text-slate-900">{section.heading}</h2>
                  <p className="mt-3 text-lg leading-8 text-slate-700">{section.body}</p>
                </section>
              ))}
            </div>

            <section className="mt-12 rounded-2xl bg-[#F5F8FB] p-6">
              <h2 className="text-2xl font-black text-slate-900">Buyer questions</h2>
              <div className="mt-5 space-y-4">
                {page.faq.map((item) => (
                  <div key={item.question} className="rounded-xl bg-white p-5 ring-1 ring-slate-200">
                    <h3 className="font-black text-slate-900">{item.question}</h3>
                    <p className="mt-2 leading-7 text-slate-600">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-10 rounded-2xl bg-[#071624] p-6 text-white">
              <h2 className="text-2xl font-black">Need product-specific export guidance?</h2>
              <p className="mt-2 text-slate-300">
                Share your destination, quantity, product grade, and packing requirements so the team can respond with practical next steps.
              </p>
              <Link href="/contact" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0E7490] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0A5A70]">
                Send Enquiry <ArrowRight className="h-4 w-4" />
              </Link>
            </section>
          </div>
        </section>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </main>
  );
}
