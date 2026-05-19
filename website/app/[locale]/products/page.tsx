import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocale, isLocale, localeCodes } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

const COPY: Record<string, { title: string; body: string; cta: string }> = {
  ar: { title: "كتالوج منتجات GOPU Exports", body: "استعرض فئات المنتجات الزراعية الهندية ثم تابع إلى الكتالوج الكامل باللغة الإنجليزية أثناء استكمال الترجمة.", cta: "عرض الكتالوج" },
  zh: { title: "GOPU Exports 产品目录", body: "查看印度农产品类别，并在完整本地化期间继续浏览英文产品目录。", cta: "查看产品" },
  es: { title: "Catálogo de productos GOPU Exports", body: "Revise categorías de productos agrícolas indios y continúe al catálogo completo mientras se completa la localización.", cta: "Ver productos" },
  fr: { title: "Catalogue produits GOPU Exports", body: "Consultez les catégories de produits agricoles indiens et ouvrez le catalogue complet pendant la localisation.", cta: "Voir les produits" },
  de: { title: "GOPU Exports Produktkatalog", body: "Prüfen Sie indische Agrarprodukt-Kategorien und öffnen Sie den vollständigen Katalog während der Lokalisierung.", cta: "Produkte ansehen" },
  pt: { title: "Catálogo de produtos GOPU Exports", body: "Veja categorias de produtos agrícolas indianos e acesse o catálogo completo durante a localização.", cta: "Ver produtos" },
  ru: { title: "Каталог продукции GOPU Exports", body: "Изучите категории индийской сельхозпродукции и перейдите к полному каталогу на этапе локализации.", cta: "Смотреть продукты" },
  ja: { title: "GOPU Exports 製品カタログ", body: "インド農産品カテゴリを確認し、多言語化中は完全な英語カタログをご覧ください。", cta: "製品を見る" },
  ko: { title: "GOPU Exports 제품 카탈로그", body: "인도 농산품 카테고리를 확인하고 현지화가 진행되는 동안 전체 카탈로그를 확인하세요.", cta: "제품 보기" },
  hi: { title: "GOPU Exports उत्पाद कैटलॉग", body: "भारतीय कृषि उत्पाद श्रेणियां देखें और स्थानीयकरण पूरा होने तक पूर्ण कैटलॉग खोलें।", cta: "उत्पाद देखें" },
  te: { title: "GOPU Exports ఉత్పత్తుల క్యాటలాగ్", body: "భారతీయ వ్యవసాయ ఉత్పత్తుల వర్గాలను చూడండి మరియు స్థానికీకరణ పూర్తయ్యే వరకు పూర్తి క్యాటలాగ్‌ను తెరవండి.", cta: "ఉత్పత్తులు చూడండి" },
};

export function generateStaticParams() {
  return localeCodes.filter((code) => code !== "en").map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "en") return {};
  const copy = COPY[locale] ?? COPY.es;
  return {
    title: copy.title,
    description: copy.body,
    alternates: { canonical: `/${locale}/products` },
  };
}

export default async function LocalizedProductsPage({ params }: Props) {
  const { locale: code } = await params;
  if (!isLocale(code) || code === "en") notFound();
  const locale = getLocale(code);
  const copy = COPY[code] ?? COPY.es;

  return (
    <main dir={locale.dir} className="min-h-screen bg-[#F5F7FA] px-6 py-16">
      <section className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-[#0E7490]">{locale.nativeName}</p>
        <h1 className="mt-4 text-4xl font-black text-slate-900">{copy.title}</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">{copy.body}</p>
        <Link href="/products" className="mt-7 inline-flex rounded-xl bg-[#0E7490] px-6 py-3 text-sm font-bold text-white">
          {copy.cta}
        </Link>
      </section>
    </main>
  );
}
