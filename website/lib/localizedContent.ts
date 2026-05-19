import { DEFAULT_LOCALE, getLocale, isLocale } from "./i18n";

type TextMap = Record<string, string>;

export const CATEGORY_ORDER = [
  "Rice & Grains",
  "Spices & Herbs",
  "Spice Powders & Blends",
  "Millets",
  "Pulses",
  "Fresh Fruits",
  "Fresh Vegetables",
  "Oil Seeds",
  "Processed Agricultural Products",
  "Private Label / Packaging",
];

const base = {
  nav: ["Home", "About Us", "Products", "Export Markets", "Certifications", "Resources", "Blog", "Contact"],
  common: {
    searchProducts: "Search products",
    all: "All",
    featured: "Featured",
    allProducts: "All products",
    productCount: "products",
    noProducts: "No products found for your search.",
    clearFilters: "Clear filters",
    viewDetails: "View details",
    viewMore: "View more",
    showLess: "Show less",
    origin: "Origin",
    moq: "MOQ",
    leadTime: "Lead time",
    hs: "HS",
    requestQuote: "Request quote",
    viewAllProducts: "View all products",
  },
  footer: {
    navigation: "Navigation",
    products: "Products",
    contactUs: "Contact Us",
    quickEnquiry: "Quick Enquiry",
    sendExportEnquiry: "Send Export Enquiry",
    privacy: "Privacy",
    terms: "Terms",
    cookies: "Cookies",
    shipping: "Shipping",
    description:
      "Premium Indian agricultural commodities sourced from supplier networks and exported with buyer-focused documentation support.",
  },
  productsPage: {
    eyebrow: "Export catalogue",
    title: "Product Catalogue",
    body: "Browse active Indian agricultural products by category, search by keyword, and open product-specific quote requests.",
    featuredCategories: "Featured categories",
    ctaTitle: "Need a product that is not listed?",
    ctaBody: "Send product, grade, packing, quantity, destination, and document requirements. GOPU Exports will review the sourcing request.",
    requestProduct: "Request a product",
    whatsapp: "WhatsApp us",
  },
  resources: {
    eyebrow: "Buyer resources",
    title: "Export Buyer Resources",
    body: "Practical guidance for international buyers on sourcing, packing, quality control, documentation, logistics, private label, and bulk order planning.",
    cta: "Send enquiry",
    viewProducts: "View products",
    cards: [
      ["Export Process", "Understand how enquiry, specification review, quotation, packing, documentation, and shipment coordination work."],
      ["Packaging Standards", "Review practical packing options for spices, rice, pulses, millets, fruits, vegetables, and private-label products."],
      ["Quality Control", "Learn how product checks, grading, buyer specifications, and inspection planning support export readiness."],
      ["Logistics & Shipping", "Plan Incoterms, freight coordination, container loading, route timelines, and communication milestones."],
      ["Documentation Support", "Prepare commercial, origin, phytosanitary, inspection, and product-specific document discussions."],
      ["Buyer FAQ", "Get practical answers before sending a bulk enquiry or requesting a product-specific quote."],
      ["Private Label Services", "Plan brand artwork, retail packs, ingredient lists, outer cartons, and buyer-specific packing requirements."],
      ["Bulk Orders", "Structure bulk enquiries with grade, quantity, packing, destination, documents, and shipment window."],
      ["Global Supply Network", "Understand supplier coordination across Indian agricultural product categories."],
      ["Inquiry & Procurement Support", "Send clear buying requirements so the team can respond with practical next steps."],
    ],
  },
  blog: {
    eyebrow: "Buyer guides",
    title: "Export Knowledge Hub",
    body: "Read sourcing guides, documentation notes, packaging advice, and product planning articles for Indian agricultural imports.",
    open: "Read articles",
  },
  contact: {
    eyebrow: "Export enquiry",
    title: "Contact GOPU Exports",
    body: "Share your product requirement, destination, quantity, packing preference, and documentation needs.",
    open: "Open enquiry form",
  },
};

const translatedResourceCards = {
  ar: [
    ["عملية التصدير", "فهم خطوات الاستفسار ومراجعة المواصفات والتسعير والتعبئة والوثائق وتنسيق الشحن."],
    ["معايير التعبئة", "خيارات تعبئة عملية للتوابل والأرز والبقول والدخن والفواكه والخضروات والعلامات الخاصة."],
    ["مراقبة الجودة", "تخطيط الفحص والدرجات ومواصفات المشتري لدعم جاهزية المنتجات للتصدير."],
    ["اللوجستيات والشحن", "تخطيط شروط التجارة والشحن والحاويات والجداول الزمنية والتواصل."],
    ["دعم الوثائق", "مناقشة الفواتير وشهادات المنشأ والصحة النباتية والفحص والوثائق الخاصة بالمنتج."],
    ["أسئلة المشترين", "إجابات عملية قبل إرسال استفسار بالجملة أو طلب عرض سعر لمنتج محدد."],
    ["خدمات العلامة الخاصة", "تخطيط التصميم والعبوات وقوائم المكونات والكرتون ومتطلبات المشتري."],
    ["طلبات الجملة", "تنظيم الاستفسارات حسب الدرجة والكمية والتعبئة والوجهة والوثائق وموعد الشحن."],
    ["شبكة التوريد", "فهم تنسيق الموردين عبر فئات المنتجات الزراعية الهندية."],
    ["دعم الاستفسار والشراء", "إرسال متطلبات شراء واضحة للحصول على خطوات عملية تالية."],
  ],
  zh: [
    ["出口流程", "了解询盘、规格确认、报价、包装、文件和装运协调的基本步骤。"],
    ["包装标准", "查看香料、大米、豆类、小米、水果、蔬菜和贴牌产品的实用包装选择。"],
    ["质量控制", "了解产品检查、分级、买方规格和检验计划如何支持出口准备。"],
    ["物流与运输", "规划贸易术语、货运协调、装柜、路线时间和沟通节点。"],
    ["文件支持", "准备商业文件、原产地、植物检疫、检验和产品相关文件讨论。"],
    ["买方问答", "在发送大宗询盘或产品报价请求前获得实用答案。"],
    ["贴牌服务", "规划品牌设计、零售包装、配料表、外箱和买方包装要求。"],
    ["大宗订单", "按等级、数量、包装、目的地、文件和装运时间组织询盘。"],
    ["供应网络", "了解印度农业产品类别中的供应商协调方式。"],
    ["采购支持", "发送清晰采购需求，以便获得可执行的下一步建议。"],
  ],
  es: [
    ["Proceso de exportación", "Comprenda consulta, revisión de especificaciones, cotización, empaque, documentación y coordinación de envío."],
    ["Estándares de empaque", "Opciones prácticas para especias, arroz, legumbres, mijos, frutas, verduras y marca privada."],
    ["Control de calidad", "Planificación de controles, grados, especificaciones del comprador e inspecciones para exportación."],
    ["Logística y envío", "Planifique Incoterms, flete, carga de contenedor, tiempos de ruta y comunicación."],
    ["Soporte documental", "Prepare discusiones sobre factura, origen, fitosanitario, inspección y documentos específicos."],
    ["FAQ del comprador", "Respuestas prácticas antes de enviar una consulta mayorista o una cotización por producto."],
    ["Servicios de marca privada", "Planifique arte, packs minoristas, ingredientes, cajas exteriores y requisitos del comprador."],
    ["Pedidos al por mayor", "Estructure consultas con grado, cantidad, empaque, destino, documentos y ventana de envío."],
    ["Red de suministro", "Entienda la coordinación de proveedores en categorías agrícolas de India."],
    ["Apoyo de consulta y compras", "Envíe requisitos claros para recibir próximos pasos prácticos."],
  ],
  fr: [
    ["Processus export", "Comprendre demande, spécifications, devis, emballage, documentation et coordination d’expédition."],
    ["Standards d’emballage", "Options pratiques pour épices, riz, légumineuses, millets, fruits, légumes et marque privée."],
    ["Contrôle qualité", "Planifier contrôles, grades, spécifications acheteur et inspections pour l’export."],
    ["Logistique et expédition", "Planifier Incoterms, fret, chargement conteneur, délais de route et communication."],
    ["Support documentaire", "Préparer factures, origine, phytosanitaire, inspection et documents spécifiques au produit."],
    ["FAQ acheteurs", "Réponses pratiques avant une demande en gros ou une cotation produit."],
    ["Services marque privée", "Planifier design, packs retail, ingrédients, cartons et exigences acheteur."],
    ["Commandes en gros", "Structurer les demandes par grade, quantité, emballage, destination, documents et fenêtre d’expédition."],
    ["Réseau d’approvisionnement", "Comprendre la coordination fournisseurs dans les catégories agricoles indiennes."],
    ["Support achat et demande", "Envoyer des besoins clairs pour recevoir des étapes concrètes."],
  ],
};

const translatedBlogTitles: Record<string, Record<string, string>> = {
  de: {
    "how-to-import-indian-spices-in-bulk": "Indische Gewürze in großen Mengen importieren",
    "rice-export-from-india-varieties-packaging-buyer-checklist": "Reisexport aus Indien: Sorten, Verpackung und Käufercheckliste",
    "apeda-products-export-guide-international-buyers": "APEDA-Produkte: Exportleitfaden für internationale Käufer",
    "spice-board-products-from-india-importers-guide": "Spice-Board-Produkte aus Indien: Hinweise für Importeure",
    "choose-reliable-agricultural-exporter-from-india": "Einen zuverlässigen Agrar-Exporteur aus Indien auswählen",
    "export-packaging-standards-spices-rice-fruits-vegetables": "Exportverpackung für Gewürze, Reis, Obst und Gemüse",
    "indian-millets-export-types-uses-global-demand": "Indische Hirse für den Export: Typen, Nutzung und Nachfrage",
    "fresh-fruits-vegetables-export-india-quality-shipping": "Frisches Obst und Gemüse aus Indien exportieren",
    "documents-required-importing-food-products-from-india": "Dokumente für den Import von Lebensmitteln aus Indien",
    "private-label-spice-manufacturing-export-opportunities-india": "Private-Label-Gewürze aus Indien: Exportmöglichkeiten",
  },
  zh: {
    "how-to-import-indian-spices-in-bulk": "如何批量进口印度香料",
    "rice-export-from-india-varieties-packaging-buyer-checklist": "印度大米出口：品种、包装与买方清单",
    "apeda-products-export-guide-international-buyers": "APEDA产品出口买方指南",
    "spice-board-products-from-india-importers-guide": "印度香料委员会产品：进口商须知",
    "choose-reliable-agricultural-exporter-from-india": "如何选择可靠的印度农业出口商",
    "export-packaging-standards-spices-rice-fruits-vegetables": "香料、大米、水果和蔬菜出口包装标准",
    "indian-millets-export-types-uses-global-demand": "印度小米出口：类型、用途和需求",
    "fresh-fruits-vegetables-export-india-quality-shipping": "印度新鲜水果和蔬菜出口基础",
    "documents-required-importing-food-products-from-india": "从印度进口食品所需文件",
    "private-label-spice-manufacturing-export-opportunities-india": "印度贴牌香料制造与出口机会",
  },
  es: {
    "how-to-import-indian-spices-in-bulk": "Cómo importar especias indias al por mayor",
    "rice-export-from-india-varieties-packaging-buyer-checklist": "Exportación de arroz de India: variedades, empaque y checklist",
    "apeda-products-export-guide-international-buyers": "Guía de productos APEDA para compradores internacionales",
    "spice-board-products-from-india-importers-guide": "Productos del Spice Board de India para importadores",
    "choose-reliable-agricultural-exporter-from-india": "Cómo elegir un exportador agrícola confiable de India",
    "export-packaging-standards-spices-rice-fruits-vegetables": "Estándares de empaque para especias, arroz, frutas y verduras",
    "indian-millets-export-types-uses-global-demand": "Mijos indios para exportación: tipos, usos y demanda",
    "fresh-fruits-vegetables-export-india-quality-shipping": "Exportación de frutas y verduras frescas de India",
    "documents-required-importing-food-products-from-india": "Documentos para importar alimentos desde India",
    "private-label-spice-manufacturing-export-opportunities-india": "Marca privada de especias y oportunidades de exportación desde India",
  },
  fr: {
    "how-to-import-indian-spices-in-bulk": "Importer des épices indiennes en vrac",
    "rice-export-from-india-varieties-packaging-buyer-checklist": "Export de riz depuis l’Inde : variétés, emballage et checklist",
    "apeda-products-export-guide-international-buyers": "Guide des produits APEDA pour acheteurs internationaux",
    "spice-board-products-from-india-importers-guide": "Produits Spice Board d’Inde : points clés pour importateurs",
    "choose-reliable-agricultural-exporter-from-india": "Choisir un exportateur agricole fiable en Inde",
    "export-packaging-standards-spices-rice-fruits-vegetables": "Standards d’emballage export pour épices, riz, fruits et légumes",
    "indian-millets-export-types-uses-global-demand": "Millets indiens à l’export : types, usages et demande",
    "fresh-fruits-vegetables-export-india-quality-shipping": "Export de fruits et légumes frais depuis l’Inde",
    "documents-required-importing-food-products-from-india": "Documents nécessaires pour importer des aliments d’Inde",
    "private-label-spice-manufacturing-export-opportunities-india": "Épices marque privée et opportunités export depuis l’Inde",
  },
  ar: {
    "how-to-import-indian-spices-in-bulk": "كيفية استيراد التوابل الهندية بالجملة",
    "rice-export-from-india-varieties-packaging-buyer-checklist": "تصدير الأرز من الهند: الأصناف والتعبئة وقائمة المشتري",
    "apeda-products-export-guide-international-buyers": "دليل منتجات APEDA للمشترين الدوليين",
    "spice-board-products-from-india-importers-guide": "منتجات مجلس التوابل الهندي للمستوردين",
    "choose-reliable-agricultural-exporter-from-india": "كيفية اختيار مصدر زراعي موثوق من الهند",
    "export-packaging-standards-spices-rice-fruits-vegetables": "معايير تعبئة التوابل والأرز والفواكه والخضروات",
    "indian-millets-export-types-uses-global-demand": "الدخن الهندي للتصدير: الأنواع والاستخدامات والطلب",
    "fresh-fruits-vegetables-export-india-quality-shipping": "تصدير الفواكه والخضروات الطازجة من الهند",
    "documents-required-importing-food-products-from-india": "الوثائق المطلوبة لاستيراد المنتجات الغذائية من الهند",
    "private-label-spice-manufacturing-export-opportunities-india": "تصنيع وتصدير توابل العلامة الخاصة من الهند",
  },
};

const translations: Record<string, typeof base> = {
  en: base,
  de: {
    nav: ["Startseite", "Über uns", "Produkte", "Exportmärkte", "Zertifizierungen", "Ressourcen", "Blog", "Kontakt"],
    common: { searchProducts: "Produkte suchen", all: "Alle", featured: "Empfohlen", allProducts: "Alle Produkte", productCount: "Produkte", noProducts: "Keine Produkte gefunden.", clearFilters: "Filter löschen", viewDetails: "Details ansehen", viewMore: "Mehr anzeigen", showLess: "Weniger anzeigen", origin: "Herkunft", moq: "MOQ", leadTime: "Lieferzeit", hs: "HS", requestQuote: "Angebot anfordern", viewAllProducts: "Alle Produkte anzeigen" },
    footer: { navigation: "Navigation", products: "Produkte", contactUs: "Kontakt", quickEnquiry: "Schnellanfrage", sendExportEnquiry: "Exportanfrage senden", privacy: "Datenschutz", terms: "Bedingungen", cookies: "Cookies", shipping: "Versand", description: "Indische Agrarprodukte für professionelle Käufer, mit koordinierter Beschaffung, Verpackung und Dokumentationsunterstützung." },
    productsPage: { eyebrow: "Exportkatalog", title: "Produktkatalog", body: "Durchsuchen Sie aktive indische Agrarprodukte nach Kategorie, Suchbegriff und produktbezogener Angebotsanfrage.", featuredCategories: "Wichtige Kategorien", ctaTitle: "Benötigen Sie ein nicht gelistetes Produkt?", ctaBody: "Senden Sie Produkt, Qualität, Verpackung, Menge, Zielmarkt und Dokumentanforderungen.", requestProduct: "Produkt anfragen", whatsapp: "WhatsApp senden" },
    resources: { eyebrow: "Käuferressourcen", title: "Exportressourcen für Käufer", body: "Praktische Hinweise zu Beschaffung, Verpackung, Qualitätskontrolle, Dokumentation, Logistik, Private Label und Großbestellungen.", cta: "Anfrage senden", viewProducts: "Produkte ansehen", cards: [
      ["Exportprozess", "So funktionieren Anfrage, Spezifikationsprüfung, Angebot, Verpackung, Dokumentation und Versandkoordination."],
      ["Verpackungsstandards", "Praktische Verpackungsoptionen für Gewürze, Reis, Hülsenfrüchte, Hirse, Obst, Gemüse und Private Label."],
      ["Qualitätskontrolle", "Produktprüfung, Sortierung, Käuferspezifikationen und Inspektionsplanung für exportfähige Ware."],
      ["Logistik & Versand", "Incoterms, Frachtkoordination, Containerbeladung, Routenzeiten und Kommunikationspunkte planen."],
      ["Dokumentationssupport", "Handels-, Ursprungs-, phytosanitäre, Inspektions- und produktspezifische Dokumente vorbereiten."],
      ["Käufer-FAQ", "Praktische Antworten vor einer Großanfrage oder produktbezogenen Angebotsanfrage."],
      ["Private-Label-Services", "Markenlayout, Einzelhandelspackungen, Zutatenlisten, Umkartons und käuferspezifische Verpackung planen."],
      ["Großbestellungen", "Anfragen mit Qualität, Menge, Verpackung, Zielmarkt, Dokumenten und Versandfenster strukturieren."],
      ["Globales Liefernetzwerk", "Lieferantenkoordination über indische Agrarproduktkategorien verstehen."],
      ["Anfrage- und Beschaffungsunterstützung", "Klare Einkaufsanforderungen senden, damit konkrete nächste Schritte möglich sind."],
    ] },
    blog: { eyebrow: "Käuferleitfäden", title: "Export-Wissenszentrum", body: "Lesen Sie Leitfäden zu Beschaffung, Dokumentation, Verpackung und Produktplanung für indische Agrarimporte.", open: "Artikel lesen" },
    contact: { eyebrow: "Exportanfrage", title: "GOPU Exports kontaktieren", body: "Teilen Sie Produkt, Zielmarkt, Menge, Verpackung und Dokumentanforderungen mit.", open: "Anfrageformular öffnen" },
  },
  ar: {
    nav: ["الرئيسية", "من نحن", "المنتجات", "أسواق التصدير", "الشهادات", "الموارد", "المدونة", "اتصل بنا"],
    common: { searchProducts: "ابحث عن المنتجات", all: "الكل", featured: "مميز", allProducts: "كل المنتجات", productCount: "منتجات", noProducts: "لم يتم العثور على منتجات.", clearFilters: "مسح الفلاتر", viewDetails: "عرض التفاصيل", viewMore: "عرض المزيد", showLess: "عرض أقل", origin: "المنشأ", moq: "الحد الأدنى", leadTime: "مدة التجهيز", hs: "HS", requestQuote: "طلب عرض سعر", viewAllProducts: "عرض كل المنتجات" },
    footer: { navigation: "التنقل", products: "المنتجات", contactUs: "اتصل بنا", quickEnquiry: "استفسار سريع", sendExportEnquiry: "إرسال استفسار تصدير", privacy: "الخصوصية", terms: "الشروط", cookies: "ملفات تعريف الارتباط", shipping: "الشحن", description: "سلع زراعية هندية للمشترين المحترفين مع دعم في التوريد والتعبئة والتوثيق." },
    productsPage: { eyebrow: "كتالوج التصدير", title: "كتالوج المنتجات", body: "تصفح المنتجات الزراعية الهندية النشطة حسب الفئة أو البحث أو طلب عرض سعر خاص بالمنتج.", featuredCategories: "الفئات الرئيسية", ctaTitle: "هل تحتاج إلى منتج غير موجود؟", ctaBody: "أرسل المنتج والدرجة والتعبئة والكمية والوجهة ومتطلبات الوثائق.", requestProduct: "اطلب منتجاً", whatsapp: "تواصل عبر واتساب" },
    resources: { ...base.resources, eyebrow: "موارد المشترين", title: "موارد التصدير للمشترين", body: "إرشادات عملية حول التوريد والتعبئة والجودة والوثائق والخدمات اللوجستية والطلبات الكبيرة.", cta: "إرسال استفسار", viewProducts: "عرض المنتجات", cards: translatedResourceCards.ar },
    blog: { eyebrow: "أدلة المشترين", title: "مركز معرفة التصدير", body: "اقرأ إرشادات التوريد والوثائق والتعبئة وتخطيط المنتجات للواردات الزراعية الهندية.", open: "قراءة المقالات" },
    contact: { eyebrow: "استفسار تصدير", title: "اتصل بـ GOPU Exports", body: "شارك المنتج والوجهة والكمية والتعبئة والوثائق المطلوبة.", open: "فتح نموذج الاستفسار" },
  },
  zh: {
    nav: ["首页", "关于我们", "产品", "出口市场", "认证", "资源", "博客", "联系"],
    common: { searchProducts: "搜索产品", all: "全部", featured: "推荐", allProducts: "所有产品", productCount: "产品", noProducts: "未找到产品。", clearFilters: "清除筛选", viewDetails: "查看详情", viewMore: "查看更多", showLess: "收起", origin: "产地", moq: "起订量", leadTime: "交期", hs: "HS", requestQuote: "询价", viewAllProducts: "查看全部产品" },
    footer: { navigation: "导航", products: "产品", contactUs: "联系我们", quickEnquiry: "快速询盘", sendExportEnquiry: "发送出口询盘", privacy: "隐私", terms: "条款", cookies: "Cookie", shipping: "运输", description: "面向专业买家的印度农产品，支持采购、包装和出口文件沟通。" },
    productsPage: { eyebrow: "出口目录", title: "产品目录", body: "按类别、关键词和产品询价浏览可供应的印度农产品。", featuredCategories: "重点类别", ctaTitle: "没有找到需要的产品？", ctaBody: "请发送产品、等级、包装、数量、目的地和文件要求。", requestProduct: "提交产品需求", whatsapp: "WhatsApp 联系" },
    resources: { ...base.resources, eyebrow: "买家资源", title: "出口买家资源", body: "关于采购、包装、质量控制、文件、物流、贴牌和大宗订单的实用指南。", cta: "发送询盘", viewProducts: "查看产品", cards: translatedResourceCards.zh },
    blog: { eyebrow: "买家指南", title: "出口知识中心", body: "阅读印度农产品进口的采购、文件、包装和产品规划文章。", open: "阅读文章" },
    contact: { eyebrow: "出口询盘", title: "联系 GOPU Exports", body: "请提供产品、目的地、数量、包装和文件要求。", open: "打开询盘表单" },
  },
  es: {
    nav: ["Inicio", "Nosotros", "Productos", "Mercados", "Certificaciones", "Recursos", "Blog", "Contacto"],
    common: { searchProducts: "Buscar productos", all: "Todos", featured: "Destacados", allProducts: "Todos los productos", productCount: "productos", noProducts: "No se encontraron productos.", clearFilters: "Limpiar filtros", viewDetails: "Ver detalles", viewMore: "Ver más", showLess: "Ver menos", origin: "Origen", moq: "MOQ", leadTime: "Plazo", hs: "HS", requestQuote: "Solicitar cotización", viewAllProducts: "Ver todos los productos" },
    footer: { navigation: "Navegación", products: "Productos", contactUs: "Contacto", quickEnquiry: "Consulta rápida", sendExportEnquiry: "Enviar consulta de exportación", privacy: "Privacidad", terms: "Términos", cookies: "Cookies", shipping: "Envío", description: "Productos agrícolas indios para compradores profesionales con apoyo de abastecimiento, empaque y documentación." },
    productsPage: { eyebrow: "Catálogo de exportación", title: "Catálogo de productos", body: "Explore productos agrícolas indios activos por categoría, búsqueda y solicitud de cotización.", featuredCategories: "Categorías destacadas", ctaTitle: "¿Necesita un producto no listado?", ctaBody: "Envíe producto, grado, empaque, cantidad, destino y documentos requeridos.", requestProduct: "Solicitar producto", whatsapp: "WhatsApp" },
    resources: { ...base.resources, eyebrow: "Recursos para compradores", title: "Recursos de exportación", body: "Guías prácticas sobre abastecimiento, empaque, calidad, documentación, logística, marca privada y pedidos al por mayor.", cta: "Enviar consulta", viewProducts: "Ver productos", cards: translatedResourceCards.es },
    blog: { eyebrow: "Guías para compradores", title: "Centro de conocimiento de exportación", body: "Lea guías de abastecimiento, documentación, empaque y planificación de productos para importar desde India.", open: "Leer artículos" },
    contact: { eyebrow: "Consulta de exportación", title: "Contactar GOPU Exports", body: "Comparta producto, destino, cantidad, empaque y requisitos documentales.", open: "Abrir formulario" },
  },
  fr: {
    nav: ["Accueil", "À propos", "Produits", "Marchés", "Certifications", "Ressources", "Blog", "Contact"],
    common: { searchProducts: "Rechercher des produits", all: "Tous", featured: "Sélection", allProducts: "Tous les produits", productCount: "produits", noProducts: "Aucun produit trouvé.", clearFilters: "Effacer les filtres", viewDetails: "Voir les détails", viewMore: "Voir plus", showLess: "Voir moins", origin: "Origine", moq: "MOQ", leadTime: "Délai", hs: "HS", requestQuote: "Demander un devis", viewAllProducts: "Voir tous les produits" },
    footer: { navigation: "Navigation", products: "Produits", contactUs: "Contact", quickEnquiry: "Demande rapide", sendExportEnquiry: "Envoyer une demande export", privacy: "Confidentialité", terms: "Conditions", cookies: "Cookies", shipping: "Expédition", description: "Produits agricoles indiens pour acheteurs professionnels avec accompagnement sourcing, emballage et documentation." },
    productsPage: { eyebrow: "Catalogue export", title: "Catalogue produits", body: "Parcourez les produits agricoles indiens actifs par catégorie, recherche et demande de devis.", featuredCategories: "Catégories clés", ctaTitle: "Vous cherchez un produit non listé ?", ctaBody: "Envoyez produit, grade, emballage, quantité, destination et documents requis.", requestProduct: "Demander un produit", whatsapp: "WhatsApp" },
    resources: { ...base.resources, eyebrow: "Ressources acheteurs", title: "Ressources export pour acheteurs", body: "Guides pratiques sur sourcing, emballage, qualité, documentation, logistique, marque privée et commandes en gros.", cta: "Envoyer une demande", viewProducts: "Voir les produits", cards: translatedResourceCards.fr },
    blog: { eyebrow: "Guides acheteurs", title: "Centre de connaissances export", body: "Lisez des guides sur sourcing, documents, emballage et planification produit pour importer depuis l’Inde.", open: "Lire les articles" },
    contact: { eyebrow: "Demande export", title: "Contacter GOPU Exports", body: "Partagez produit, destination, quantité, emballage et besoins documentaires.", open: "Ouvrir le formulaire" },
  },
};

translations.pt = translations.es;
translations.ru = translations.de;
translations.ja = translations.zh;
translations.ko = translations.zh;
translations.hi = translations.en;
translations.te = translations.en;

export function localeFromPath(pathname: string | null | undefined) {
  const first = (pathname ?? "/").split("/").filter(Boolean)[0];
  return first && isLocale(first) ? first : DEFAULT_LOCALE;
}

export function uiForLocale(code: string) {
  const locale = getLocale(code);
  return { locale, text: translations[locale.code] ?? translations.en };
}

export function categoryLabel(category: string, localeCode: string) {
  const map: Record<string, TextMap> = {
    de: { "Rice & Grains": "Reis & Getreide", "Spices & Herbs": "Gewürze & Kräuter", "Spice Powders & Blends": "Gewürzpulver & Mischungen", Millets: "Hirse", Pulses: "Hülsenfrüchte", "Fresh Fruits": "Frisches Obst", "Fresh Vegetables": "Frisches Gemüse", "Oil Seeds": "Ölsaaten", "Processed Agricultural Products": "Verarbeitete Agrarprodukte", "Private Label / Packaging": "Private Label / Verpackung" },
    ar: { "Rice & Grains": "الأرز والحبوب", "Spices & Herbs": "التوابل والأعشاب", "Spice Powders & Blends": "مساحيق وخلطات التوابل", Millets: "الدخن", Pulses: "البقوليات", "Fresh Fruits": "فواكه طازجة", "Fresh Vegetables": "خضروات طازجة", "Oil Seeds": "بذور زيتية", "Processed Agricultural Products": "منتجات زراعية مصنعة", "Private Label / Packaging": "علامة خاصة / تعبئة" },
    zh: { "Rice & Grains": "大米与谷物", "Spices & Herbs": "香料与草本", "Spice Powders & Blends": "香料粉与混合料", Millets: "小米类", Pulses: "豆类", "Fresh Fruits": "新鲜水果", "Fresh Vegetables": "新鲜蔬菜", "Oil Seeds": "油籽", "Processed Agricultural Products": "加工农产品", "Private Label / Packaging": "贴牌 / 包装" },
    es: { "Rice & Grains": "Arroz y granos", "Spices & Herbs": "Especias y hierbas", "Spice Powders & Blends": "Polvos y mezclas de especias", Millets: "Mijos", Pulses: "Legumbres", "Fresh Fruits": "Frutas frescas", "Fresh Vegetables": "Verduras frescas", "Oil Seeds": "Semillas oleaginosas", "Processed Agricultural Products": "Productos agrícolas procesados", "Private Label / Packaging": "Marca privada / empaque" },
    fr: { "Rice & Grains": "Riz et céréales", "Spices & Herbs": "Épices et herbes", "Spice Powders & Blends": "Poudres et mélanges d’épices", Millets: "Millets", Pulses: "Légumineuses", "Fresh Fruits": "Fruits frais", "Fresh Vegetables": "Légumes frais", "Oil Seeds": "Graines oléagineuses", "Processed Agricultural Products": "Produits agricoles transformés", "Private Label / Packaging": "Marque privée / emballage" },
  };
  return map[localeCode]?.[category] ?? category;
}

export function categoryIntro(category: string, localeCode: string) {
  const fallback = `Products in this category are prepared for B2B enquiry discussions around grade, packing, quantity, destination, and documentation.`;
  const en: TextMap = {
    "Rice & Grains": "Rice and grain options for importers, wholesalers, food-service buyers, and private-label packing discussions.",
    "Spices & Herbs": "Whole spices and herbs sourced for bulk spice buyers, processors, wholesalers, and food-service markets.",
    "Spice Powders & Blends": "Ground spices and blends for bulk supply, private-label projects, seasoning manufacturers, and retail packing.",
    Millets: "Indian millet options for health-food brands, grain wholesalers, ingredient buyers, and retail packing.",
    Pulses: "Pulses and lentils for wholesalers, millers, retail packers, and food manufacturing buyers.",
    "Fresh Fruits": "Fresh produce enquiries planned around season, grade, packing, destination, and transit route.",
    "Fresh Vegetables": "Fresh vegetable sourcing discussions based on variety, packing, shelf life, route, and destination requirements.",
    "Oil Seeds": "Oil seed and kernel options for food processors, ingredient buyers, wholesalers, and edible oil discussions.",
    "Processed Agricultural Products": "Processed agri products and ingredients for food brands, wholesalers, and private-label supply.",
  };
  const translated: Record<string, TextMap> = {
    de: { "Rice & Grains": "Reis- und Getreideoptionen für Importeure, Großhändler, Food-Service und Private Label.", "Spices & Herbs": "Ganze Gewürze und Kräuter für Großabnehmer, Verarbeiter und Händler.", "Spice Powders & Blends": "Gemahlene Gewürze und Mischungen für Bulk, Private Label und Einzelhandelspackungen.", Millets: "Indische Hirseoptionen für Health-Food-Marken, Getreidehändler und Zutatenkäufer.", Pulses: "Hülsenfrüchte und Linsen für Großhändler, Mühlen, Packbetriebe und Lebensmittelhersteller.", "Fresh Fruits": "Frischwarenanfragen nach Saison, Qualität, Verpackung, Zielmarkt und Route.", "Fresh Vegetables": "Gemüsebeschaffung nach Sorte, Verpackung, Haltbarkeit, Route und Zielmarkt.", "Oil Seeds": "Ölsaaten und Kerne für Verarbeiter, Zutatenkäufer und Händler.", "Processed Agricultural Products": "Verarbeitete Agrarprodukte und Zutaten für Marken, Händler und Private Label." },
    ar: { "Rice & Grains": "خيارات الأرز والحبوب للمستوردين وتجار الجملة وخدمات الطعام.", "Spices & Herbs": "توابل وأعشاب كاملة للمشترين بالجملة والمعالجين والأسواق التجارية.", "Spice Powders & Blends": "مساحيق وخلطات للتوريد بالجملة والعلامات الخاصة.", Millets: "خيارات الدخن الهندي لعلامات الأغذية الصحية والمشترين التجاريين.", Pulses: "بقوليات وعدس لتجار الجملة والمطاحن والتعبئة.", "Fresh Fruits": "استفسارات فواكه طازجة حسب الموسم والدرجة والتعبئة والوجهة.", "Fresh Vegetables": "خضروات طازجة حسب الصنف والتعبئة ومدة الصلاحية والمسار.", "Oil Seeds": "بذور زيتية للمصنعين ومشتري المكونات والتجار.", "Processed Agricultural Products": "منتجات زراعية مصنعة ومكونات للعلامات الغذائية والتجار." },
    zh: { "Rice & Grains": "面向进口商、批发商、餐饮渠道和贴牌包装的大米与谷物选项。", "Spices & Herbs": "面向香料采购商、加工商和批发市场的整粒香料与草本。", "Spice Powders & Blends": "适合大宗供应、贴牌和零售包装的香料粉与混合料。", Millets: "面向健康食品品牌、谷物批发和配料买家的印度小米类产品。", Pulses: "适合批发、磨坊、零售包装和食品加工的豆类。", "Fresh Fruits": "按季节、等级、包装、目的地和运输路线规划的新鲜水果询盘。", "Fresh Vegetables": "按品种、包装、货架期、路线和目的地要求讨论的新鲜蔬菜。", "Oil Seeds": "面向加工商、配料买家和批发商的油籽与仁类。", "Processed Agricultural Products": "面向食品品牌、批发商和贴牌供应的加工农产品。" },
    es: { "Rice & Grains": "Opciones de arroz y granos para importadores, mayoristas, food service y marca privada.", "Spices & Herbs": "Especias enteras y hierbas para compradores a granel, procesadores y mayoristas.", "Spice Powders & Blends": "Especias molidas y mezclas para granel, marca privada y empaque minorista.", Millets: "Mijos indios para marcas saludables, mayoristas de granos y compradores de ingredientes.", Pulses: "Legumbres y lentejas para mayoristas, molinos, empacadores y fabricantes.", "Fresh Fruits": "Consultas de fruta fresca según temporada, grado, empaque, destino y ruta.", "Fresh Vegetables": "Verduras frescas según variedad, empaque, vida útil, ruta y destino.", "Oil Seeds": "Semillas oleaginosas para procesadores, compradores de ingredientes y mayoristas.", "Processed Agricultural Products": "Productos procesados e ingredientes para marcas, mayoristas y marca privada." },
    fr: { "Rice & Grains": "Options de riz et céréales pour importateurs, grossistes, restauration et marque privée.", "Spices & Herbs": "Épices entières et herbes pour achats en gros, transformation et distribution.", "Spice Powders & Blends": "Épices moulues et mélanges pour vrac, marque privée et packs retail.", Millets: "Millets indiens pour marques santé, grossistes céréaliers et acheteurs ingrédients.", Pulses: "Légumineuses pour grossistes, moulins, conditionneurs et fabricants.", "Fresh Fruits": "Demandes de fruits frais selon saison, grade, emballage, destination et route.", "Fresh Vegetables": "Légumes frais selon variété, emballage, durée, route et destination.", "Oil Seeds": "Graines oléagineuses pour transformateurs, acheteurs ingrédients et grossistes.", "Processed Agricultural Products": "Produits agricoles transformés pour marques, grossistes et marque privée." },
  };
  return translated[localeCode]?.[category] ?? en[category] ?? fallback;
}

export function localizedProductDescription(name: string, category: string, localeCode: string) {
  const c = categoryLabel(category, localeCode);
  const map: TextMap = {
    de: `${name} ist für professionelle B2B-Anfragen vorbereitet. Bitte teilen Sie Qualität, Verpackung, Menge, Zielmarkt und Dokumentanforderungen mit.`,
    ar: `${name} متاح لمناقشات الشراء التجارية. يرجى مشاركة الدرجة والتعبئة والكمية والوجهة ومتطلبات الوثائق.`,
    zh: `${name} 适合专业B2B询盘。请提供等级、包装、数量、目的地和文件要求。`,
    es: `${name} está disponible para consultas B2B. Comparta grado, empaque, cantidad, destino y requisitos documentales.`,
    fr: `${name} est disponible pour les demandes B2B. Indiquez le grade, l’emballage, la quantité, la destination et les documents requis.`,
  };
  return map[localeCode] ?? `${name} in ${c} is available for B2B sourcing discussions. Share grade, packing, quantity, destination, and document requirements.`;
}

export function localizedBlogTitle(slug: string, localeCode: string, fallback: string) {
  return translatedBlogTitles[localeCode]?.[slug] ?? fallback;
}

export function localizedArticleExcerpt(localeCode: string) {
  const map: TextMap = {
    de: "Professioneller Einkaufsleitfaden mit praktischen Punkten zu Spezifikation, Verpackung, Dokumenten und Anfragevorbereitung.",
    ar: "دليل مهني للمشترين يتناول المواصفات والتعبئة والوثائق وطريقة إعداد الاستفسار.",
    zh: "面向专业买方的指南，涵盖规格、包装、文件和询盘准备要点。",
    es: "Guía profesional para compradores con puntos prácticos sobre especificación, empaque, documentos y preparación de consultas.",
    fr: "Guide professionnel pour acheteurs avec points pratiques sur spécifications, emballage, documents et préparation de demande.",
  };
  return map[localeCode] ?? "Professional buyer guide covering specifications, packaging, documents, and enquiry preparation.";
}

export function localizedDetailLabel(key: "packaging" | "shelfLife", localeCode: string) {
  const map: Record<string, Record<"packaging" | "shelfLife", string>> = {
    de: { packaging: "Verpackung", shelfLife: "Haltbarkeit" },
    ar: { packaging: "التعبئة", shelfLife: "مدة الصلاحية" },
    zh: { packaging: "包装", shelfLife: "保质期" },
    es: { packaging: "Empaque", shelfLife: "Vida útil" },
    fr: { packaging: "Emballage", shelfLife: "Durée de conservation" },
  };
  return map[localeCode]?.[key] ?? (key === "packaging" ? "Packaging" : "Shelf life");
}
