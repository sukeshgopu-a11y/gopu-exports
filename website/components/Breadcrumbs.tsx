import Link from "next/link";
import { serializeJsonLd } from "@/lib/jsonLd";
import { SITE_URL } from "@/lib/seo";

export default function Breadcrumbs({ items, inverse = false }: {
  items: Array<{ name: string; href: string }>;
  inverse?: boolean;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem", position: index + 1, name: item.name,
      item: new URL(item.href, SITE_URL).href,
    })),
  };
  return <>
    <nav aria-label="Breadcrumb" className={`text-sm leading-6 ${inverse ? "text-slate-300" : "text-slate-600"}`}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">{items.map((item, index) => <li key={item.href} className="inline-flex min-w-0 items-baseline gap-2">
        {index > 0 && <span aria-hidden="true">/</span>}
        {index === items.length - 1 ? <span aria-current="page" className="break-words font-medium">{item.name}</span> : <Link href={item.href} className={`underline underline-offset-4 ${inverse ? "hover:text-white" : "hover:text-[#0E7490]"}`}>{item.name}</Link>}
      </li>)}</ol>
    </nav>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }} />
  </>;
}
