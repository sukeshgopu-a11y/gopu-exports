import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DEFAULT_BLOGS, getDefaultBlogBySlug } from "@/lib/blogs";
import { CATEGORY_LANDING_PAGES, getCategoryLandingPage } from "@/lib/categoryLandingPages";
import { EXPORT_OPERATION_PAGES, getExportOperationPage } from "@/lib/exportOperationPages";
import { getLocale, isLocale, localeCodes } from "@/lib/i18n";
import { localizedArticleExcerpt, localizedBlogTitle, uiForLocale } from "@/lib/localizedContent";

type Props = { params: Promise<{ locale: string; segments: string[] }> };

const sectionCopy = {
  de: {
    about: ["Über GOPU Exports", "Professionelle Exportkommunikation für Käufer indischer Agrarprodukte mit Schwerpunkt auf klaren Spezifikationen, Verpackung und Dokumentation."],
    markets: ["Exportmärkte", "Käufer aus internationalen Märkten können Anforderungen zu Produkt, Qualität, Menge, Verpackung und Dokumenten strukturiert einreichen."],
    certifications: ["Zertifizierungen und Qualitätsnachweise", "Sichtbare Zertifikate werden aus dem Dashboard gesteuert. Verborgene Einträge erscheinen nicht auf öffentlichen Seiten."],
    gallery: ["Galerie", "Produkt- und Exportbilder werden für eine klare, professionelle Käuferpräsentation kuratiert."],
    fallback: ["Seite nicht gefunden", "Diese lokalisierte Seite ist nicht verfügbar. Nutzen Sie die Navigation, um zur passenden Hauptseite zu wechseln."],
    readMore: "Weiterlesen",
    related: "Weitere hilfreiche Seiten",
  },
  es: {
    about: ["Acerca de GOPU Exports", "Comunicación profesional de exportación para compradores de productos agrícolas indios, con especificaciones, empaque y documentación claros."],
    markets: ["Mercados de exportación", "Compradores internacionales pueden enviar requisitos de producto, calidad, cantidad, empaque y documentos de forma estructurada."],
    certifications: ["Certificaciones y calidad", "Las certificaciones visibles se controlan desde el dashboard. Las ocultas no aparecen en páginas públicas."],
    gallery: ["Galería", "Imágenes de productos y exportación curadas para una presentación profesional al comprador."],
    fallback: ["Página no encontrada", "Esta página localizada no está disponible. Use la navegación para volver a una sección principal."],
    readMore: "Leer más",
    related: "Páginas útiles",
  },
  zh: {
    about: ["关于 GOPU Exports", "为印度农业产品买方提供专业出口沟通，重点关注清晰规格、包装和文件要求。"],
    markets: ["出口市场", "国际买方可以按产品、质量、数量、包装和文件要求提交结构化询盘。"],
    certifications: ["认证与质量", "公开显示的认证由后台控制。隐藏的认证不会出现在公开页面。"],
    gallery: ["图库", "产品和出口图片经过整理，用于专业买方展示。"],
    fallback: ["页面未找到", "此本地化页面暂不可用。请使用导航返回相应主页面。"],
    readMore: "阅读更多",
    related: "相关页面",
  },
  fr: {
    about: ["À propos de GOPU Exports", "Communication export professionnelle pour acheteurs de produits agricoles indiens, avec spécifications, emballage et documentation clairs."],
    markets: ["Marchés export", "Les acheteurs internationaux peuvent envoyer des besoins structurés de produit, qualité, quantité, emballage et documents."],
    certifications: ["Certifications et qualité", "Les certifications visibles sont pilotées depuis le tableau de bord. Les éléments masqués ne s’affichent pas publiquement."],
    gallery: ["Galerie", "Images produit et export sélectionnées pour une présentation acheteur professionnelle."],
    fallback: ["Page introuvable", "Cette page localisée n’est pas disponible. Utilisez la navigation pour revenir à une section principale."],
    readMore: "Lire plus",
    related: "Pages utiles",
  },
  ar: {
    about: ["حول GOPU Exports", "تواصل تصديري مهني لمشتري المنتجات الزراعية الهندية مع تركيز على المواصفات والتعبئة والوثائق."],
    markets: ["أسواق التصدير", "يمكن للمشترين الدوليين إرسال متطلبات المنتج والجودة والكمية والتعبئة والوثائق بطريقة منظمة."],
    certifications: ["الشهادات والجودة", "تتم إدارة الشهادات الظاهرة من لوحة التحكم. العناصر المخفية لا تظهر في الصفحات العامة."],
    gallery: ["المعرض", "صور المنتجات والتصدير منظمة لتقديم عرض احترافي للمشترين."],
    fallback: ["الصفحة غير موجودة", "هذه الصفحة المحلية غير متاحة. استخدم التنقل للعودة إلى القسم المناسب."],
    readMore: "اقرأ المزيد",
    related: "صفحات مفيدة",
  },
};

function copyFor(locale: string) {
  return sectionCopy[locale as keyof typeof sectionCopy] ?? sectionCopy.de;
}

function pageShell({
  locale,
  title,
  eyebrow,
  body,
  children,
}: {
  locale: ReturnType<typeof getLocale>;
  title: string;
  eyebrow: string;
  body: string;
  children?: React.ReactNode;
}) {
  const prefix = `/${locale.code}`;
  const { text } = uiForLocale(locale.code);
  return (
    <main dir={locale.dir} className="min-h-screen bg-[#F5F7FA] text-[#0F172A]">
      <section className="bg-[#071624] px-6 py-20 text-white sm:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#67C9D8]">{eyebrow}</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-[-0.04em] sm:text-5xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300">{body}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`${prefix}/products`} className="rounded-xl bg-[#0E7490] px-6 py-3 text-sm font-bold text-white">
              {text.common.viewAllProducts}
            </Link>
            <Link href={`${prefix}/contact`} className="rounded-xl border border-white/20 px-6 py-3 text-sm font-bold text-white">
              {text.common.requestQuote}
            </Link>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-6 py-12 sm:px-8">
        {children}
      </section>
    </main>
  );
}

function cards(localeCode: string) {
  const { text } = uiForLocale(localeCode);
  const prefix = `/${localeCode}`;
  return [
    [text.nav[2], text.productsPage.body, `${prefix}/products`],
    [text.nav[5], text.resources.body, `${prefix}/resources`],
    [text.nav[7], text.contact.body, `${prefix}/contact`],
  ];
}

export function generateStaticParams() {
  return localeCodes.filter((code) => code !== "en").flatMap((locale) => [
    { locale, segments: ["about"] },
    { locale, segments: ["markets"] },
    { locale, segments: ["certifications"] },
    { locale, segments: ["resources", "export-process"] },
    { locale, segments: ["export", "rice-exporters-from-india"] },
  ]);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, segments } = await params;
  if (!isLocale(locale) || locale === "en") return {};
  const current = getLocale(locale);
  const slug = segments.at(-1) ?? "";
  const route = segments[0];
  const local = copyFor(locale);
  const resource = route === "resources" ? getExportOperationPage(slug) : null;
  const exportPage = route === "export" ? getCategoryLandingPage(slug) : null;
  const blog = route === "blog" ? getDefaultBlogBySlug(slug) : null;
  const staticPage = route && route in local ? local[route as keyof typeof local] : null;
  const title = blog
    ? localizedBlogTitle(blog.slug, locale, blog.title)
    : resource
      ? local.related
      : exportPage
        ? exportPage.title
        : Array.isArray(staticPage)
          ? staticPage[0]
          : local.fallback[0];
  const description = blog ? localizedArticleExcerpt(locale) : Array.isArray(staticPage) ? staticPage[1] : exportPage?.description ?? resource?.description ?? local.fallback[1];
  return {
    title: `${title} | GOPU Exports`,
    description,
    alternates: { canonical: `/${current.code}/${segments.join("/")}` },
  };
}

export default async function LocalizedCatchAllPage({ params }: Props) {
  const { locale: code, segments } = await params;
  if (!isLocale(code) || code === "en") notFound();
  const locale = getLocale(code);
  const local = copyFor(code);
  const route = segments[0];
  const slug = segments.at(-1) ?? "";

  if (route === "resources" && segments.length > 1) {
    const index = EXPORT_OPERATION_PAGES.findIndex((item) => item.slug === slug);
    const { text } = uiForLocale(code);
    const card = text.resources.cards[index] ?? [text.resources.title, text.resources.body];
    return pageShell({
      locale,
      eyebrow: text.resources.eyebrow,
      title: card[0],
      body: card[1],
      children: (
        <div className="grid gap-4 sm:grid-cols-2">
          {(text.resources.cards.length ? text.resources.cards.slice(0, 4) : []).map(([heading, body]) => (
            <div key={heading} className="rounded-2xl border border-[#D9E2EC] bg-white p-6 shadow-sm">
              <h2 className="text-lg font-black">{heading}</h2>
              <p className="mt-3 text-sm leading-7 text-[#64748B]">{body}</p>
            </div>
          ))}
        </div>
      ),
    });
  }

  if (route === "blog" && segments.length > 1) {
    const post = getDefaultBlogBySlug(slug) ?? DEFAULT_BLOGS[0];
    const title = localizedBlogTitle(post.slug, code, post.title);
    const excerpt = localizedArticleExcerpt(code);
    return pageShell({
      locale,
      eyebrow: uiForLocale(code).text.blog.eyebrow,
      title,
      body: excerpt,
      children: (
        <div className="rounded-3xl border border-[#D9E2EC] bg-white p-7 shadow-sm">
          <p className="text-sm leading-8 text-[#64748B]">{excerpt}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {cards(code).map(([heading, body, href]) => (
              <Link key={href} href={href} className="rounded-2xl border border-[#D9E2EC] p-5 transition hover:border-[#0E7490]">
                <h2 className="font-black">{heading}</h2>
                <p className="mt-2 text-sm leading-6 text-[#64748B]">{body}</p>
              </Link>
            ))}
          </div>
        </div>
      ),
    });
  }

  if (route === "export" && segments.length > 1) {
    const page = getCategoryLandingPage(slug) ?? CATEGORY_LANDING_PAGES[0];
    const { text } = uiForLocale(code);
    return pageShell({
      locale,
      eyebrow: text.productsPage.eyebrow,
      title: page.title,
      body: text.productsPage.body,
      children: (
        <div className="grid gap-4 sm:grid-cols-2">
          {page.sections.map((section) => (
            <div key={section.heading} className="rounded-2xl border border-[#D9E2EC] bg-white p-6 shadow-sm">
              <h2 className="text-lg font-black">{text.productsPage.featuredCategories}</h2>
              <p className="mt-3 text-sm leading-7 text-[#64748B]">{text.productsPage.ctaBody}</p>
            </div>
          ))}
        </div>
      ),
    });
  }

  if (route && route in local && Array.isArray(local[route as keyof typeof local])) {
    const [title, body] = local[route as "about"];
    return pageShell({
      locale,
      eyebrow: title,
      title,
      body,
      children: (
        <div className="grid gap-4 sm:grid-cols-3">
          {cards(code).map(([heading, body, href]) => (
            <Link key={href} href={href} className="rounded-2xl border border-[#D9E2EC] bg-white p-6 shadow-sm transition hover:border-[#0E7490]">
              <h2 className="text-lg font-black">{heading}</h2>
              <p className="mt-3 text-sm leading-7 text-[#64748B]">{body}</p>
            </Link>
          ))}
        </div>
      ),
    });
  }

  return pageShell({
    locale,
    eyebrow: local.fallback[0],
    title: local.fallback[0],
    body: local.fallback[1],
    children: (
      <div className="grid gap-4 sm:grid-cols-3">
        {cards(code).map(([heading, body, href]) => (
          <Link key={href} href={href} className="rounded-2xl border border-[#D9E2EC] bg-white p-6 shadow-sm transition hover:border-[#0E7490]">
            <h2 className="text-lg font-black">{heading}</h2>
            <p className="mt-3 text-sm leading-7 text-[#64748B]">{body}</p>
          </Link>
        ))}
      </div>
    ),
  });
}
