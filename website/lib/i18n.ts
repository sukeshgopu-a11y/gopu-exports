export type Locale = {
  code: string;
  label: string;
  nativeName: string;
  dir: "ltr" | "rtl";
  marketNote: string;
};

export const DEFAULT_LOCALE = "en";

export const LOCALES: Locale[] = [
  { code: "en", label: "English", nativeName: "English", dir: "ltr", marketNote: "Indian agricultural exports for global B2B buyers." },
  { code: "ar", label: "Arabic", nativeName: "العربية", dir: "rtl", marketNote: "توريد المنتجات الزراعية الهندية للمشترين الدوليين." },
  { code: "zh", label: "Chinese", nativeName: "中文", dir: "ltr", marketNote: "面向全球买家的印度农产品出口供应。" },
  { code: "es", label: "Spanish", nativeName: "Español", dir: "ltr", marketNote: "Exportación india de productos agrícolas para compradores B2B." },
  { code: "fr", label: "French", nativeName: "Français", dir: "ltr", marketNote: "Produits agricoles indiens pour acheteurs internationaux." },
  { code: "de", label: "German", nativeName: "Deutsch", dir: "ltr", marketNote: "Indische Agrarprodukte für internationale B2B-Einkäufer." },
  { code: "pt", label: "Portuguese", nativeName: "Português", dir: "ltr", marketNote: "Exportação indiana de alimentos e commodities agrícolas." },
  { code: "ru", label: "Russian", nativeName: "Русский", dir: "ltr", marketNote: "Индийская сельхозпродукция для международных покупателей." },
  { code: "ja", label: "Japanese", nativeName: "日本語", dir: "ltr", marketNote: "海外バイヤー向けインド農産品輸出。" },
  { code: "ko", label: "Korean", nativeName: "한국어", dir: "ltr", marketNote: "글로벌 바이어를 위한 인도 농산물 수출." },
  { code: "hi", label: "Hindi", nativeName: "हिन्दी", dir: "ltr", marketNote: "वैश्विक खरीदारों के लिए भारतीय कृषि निर्यात।" },
  { code: "te", label: "Telugu", nativeName: "తెలుగు", dir: "ltr", marketNote: "అంతర్జాతీయ కొనుగోలుదారుల కోసం భారత వ్యవసాయ ఎగుమతులు." },
];

export const localeCodes = LOCALES.map((locale) => locale.code);

export function getLocale(code: string) {
  return LOCALES.find((locale) => locale.code === code) ?? LOCALES[0];
}

export function isLocale(value: string) {
  return localeCodes.includes(value);
}

export const localizedHomeCopy: Record<string, { eyebrow: string; title: string; body: string; cta: string }> = {
  en: {
    eyebrow: "International buying desk",
    title: "Indian agri commodities for professional importers",
    body: "Explore GOPU Exports in your preferred language. Full product pages, quote flows, and buyer resources are being localized through a scalable architecture.",
    cta: "View Products",
  },
  ar: {
    eyebrow: "مكتب الشراء الدولي",
    title: "سلع زراعية هندية للمستوردين المحترفين",
    body: "تصفح GOPU Exports بلغتك المفضلة. يتم إعداد صفحات المنتجات وطلبات الأسعار وموارد المشترين للترجمة بطريقة قابلة للتوسع.",
    cta: "عرض المنتجات",
  },
  zh: {
    eyebrow: "国际采购服务",
    title: "面向专业进口商的印度农产品",
    body: "使用您偏好的语言了解 GOPU Exports。产品页面、询价流程和买家资源正在以可扩展方式本地化。",
    cta: "查看产品",
  },
  es: {
    eyebrow: "Mesa internacional de compras",
    title: "Productos agrícolas indios para importadores profesionales",
    body: "Explore GOPU Exports en su idioma preferido. Las páginas de productos, cotizaciones y recursos para compradores se están localizando de forma escalable.",
    cta: "Ver productos",
  },
  fr: {
    eyebrow: "Service achats international",
    title: "Produits agricoles indiens pour importateurs professionnels",
    body: "Découvrez GOPU Exports dans votre langue. Les pages produits, demandes de devis et ressources acheteurs sont préparées pour une localisation évolutive.",
    cta: "Voir les produits",
  },
  de: {
    eyebrow: "Internationaler Einkauf",
    title: "Indische Agrarwaren für professionelle Importeure",
    body: "Entdecken Sie GOPU Exports in Ihrer bevorzugten Sprache. Produktseiten, Angebotsanfragen und Käuferressourcen werden skalierbar lokalisiert.",
    cta: "Produkte ansehen",
  },
  pt: {
    eyebrow: "Atendimento internacional",
    title: "Commodities agrícolas indianas para importadores profissionais",
    body: "Conheça a GOPU Exports no seu idioma. Páginas de produtos, cotações e recursos para compradores estão sendo localizados com arquitetura escalável.",
    cta: "Ver produtos",
  },
  ru: {
    eyebrow: "Международный отдел закупок",
    title: "Индийские агрокоммодити для профессиональных импортеров",
    body: "Изучайте GOPU Exports на удобном языке. Страницы продуктов, формы запросов и материалы для покупателей локализуются масштабируемо.",
    cta: "Смотреть продукты",
  },
  ja: {
    eyebrow: "国際調達デスク",
    title: "プロ輸入業者向けインド農産品",
    body: "希望する言語で GOPU Exports を確認できます。製品ページ、見積依頼、購入者向け情報を拡張可能な構成で多言語化しています。",
    cta: "製品を見る",
  },
  ko: {
    eyebrow: "국제 구매 데스크",
    title: "전문 수입업체를 위한 인도 농산품",
    body: "원하는 언어로 GOPU Exports를 살펴보세요. 제품 페이지, 견적 흐름, 바이어 자료가 확장 가능한 구조로 현지화되고 있습니다.",
    cta: "제품 보기",
  },
  hi: {
    eyebrow: "अंतरराष्ट्रीय खरीद डेस्क",
    title: "पेशेवर आयातकों के लिए भारतीय कृषि उत्पाद",
    body: "GOPU Exports को अपनी पसंदीदा भाषा में देखें। उत्पाद पेज, कोटेशन फ्लो और खरीदार संसाधनों को स्केलेबल ढंग से स्थानीयकृत किया जा रहा है।",
    cta: "उत्पाद देखें",
  },
  te: {
    eyebrow: "అంతర్జాతీయ కొనుగోలు డెస్క్",
    title: "ప్రొఫెషనల్ దిగుమతిదారుల కోసం భారత వ్యవసాయ ఉత్పత్తులు",
    body: "మీకు ఇష్టమైన భాషలో GOPU Exports ను చూడండి. ఉత్పత్తి పేజీలు, కోట్ ఫ్లోలు, కొనుగోలుదారుల వనరులు విస్తరించగల విధంగా స్థానికీకరించబడుతున్నాయి.",
    cta: "ఉత్పత్తులు చూడండి",
  },
};
