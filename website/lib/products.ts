export type Product = {
  slug: string;
  title: string;
  category: string;
  image: string;
  gallery?: string[];
  tagline: string;
  description: string;
  origin: string;
  moq: string;
  packaging: string;
  lead: string;
  hs: string;
  shelfLife: string;
  moisture?: string;
  color?: string;
  aroma?: string;
  applications: string[];
  specs: { label: string; value: string }[];
  benefits: string[];
  related: string[];
  featured?: boolean;
};

export const CATEGORIES = [
  "All",
  "Spices & Herbs",
  "Rice & Grains",
  "Fresh Fruits",
  "Fresh Vegetables",
] as const;

export const PRODUCTS: Product[] = [
  /* ─── SPICES ──────────────────────────────────────────── */
  {
    slug: "green-cardamom",
    title: "Green Cardamom",
    category: "Spices & Herbs",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop",
    tagline: "Queen of Spices — Premium Export Grade",
    description:
      "Bold aromatic green cardamom pods sourced from the highlands of Kerala and Karnataka. Prized worldwide for perfumery, confectionery, and premium food processing.",
    origin: "Kerala / Karnataka, India",
    moq: "1 MT",
    packaging: "25 kg jute bags / vacuum pouches",
    lead: "10–14 Days",
    hs: "0908 31 00",
    shelfLife: "24 months",
    moisture: "≤ 12%",
    color: "Bright green",
    aroma: "Strong, sweet, camphoraceous",
    applications: ["Confectionery", "Beverages", "Perfumery", "Pharmaceuticals", "Food processing"],
    specs: [
      { label: "Variety", value: "Malabar, Mysore" },
      { label: "Bold Size", value: "7–8 mm & above" },
      { label: "Moisture", value: "≤ 12%" },
      { label: "Volatile Oil", value: "≥ 5%" },
      { label: "Color", value: "Bright green pods" },
      { label: "Purity", value: "98% minimum" },
      { label: "Packaging", value: "25 kg / vacuum packed" },
      { label: "MOQ", value: "1 MT" },
    ],
    benefits: [
      "Rich aromatic essential oils",
      "APEDA certified sourcing",
      "Uniform pod size & color grading",
      "Phytosanitary certificate included",
      "Air or sea freight options",
    ],
    related: ["black-pepper", "cloves", "cinnamon"],
    featured: true,
  },
  {
    slug: "black-pepper",
    title: "Black Pepper",
    category: "Spices & Herbs",
    image: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=800&auto=format&fit=crop",
    tagline: "King of Spices — World-Class Export Quality",
    description:
      "Export-grade whole black peppercorns with strong pungency and dense weight sourced from Malabar coast farms under responsible agricultural practices.",
    origin: "Kerala / Karnataka, India",
    moq: "1 MT",
    packaging: "25 kg bags / 50 kg PP bags",
    lead: "7–12 Days",
    hs: "0904 11 10",
    shelfLife: "24 months",
    moisture: "≤ 12%",
    applications: ["Food manufacturing", "Spice blending", "Condiments", "Pharmaceuticals"],
    specs: [
      { label: "Grade", value: "MG1, TGSEB" },
      { label: "Bulk Density", value: "≥ 550 g/L" },
      { label: "Moisture", value: "≤ 12%" },
      { label: "Piperine", value: "≥ 4%" },
      { label: "Purity", value: "99% minimum" },
      { label: "Packaging", value: "25 kg / 50 kg bags" },
    ],
    benefits: [
      "High piperine content",
      "Tested for pesticide residues",
      "Fumigation certificate available",
      "FSSAI compliant",
    ],
    related: ["green-cardamom", "cloves", "coriander-seeds"],
    featured: true,
  },
  {
    slug: "turmeric-powder",
    title: "Turmeric Powder",
    category: "Spices & Herbs",
    image: "/products/turmeric.jpg",
    tagline: "High Curcumin — Food & Industrial Grade",
    description:
      "Premium turmeric powder processed from Nizamabad and Erode varieties known globally for high curcumin content, deep color, and clean processing standards.",
    origin: "Nizamabad, Telangana / Erode, Tamil Nadu",
    moq: "1 MT",
    packaging: "25 kg PP bags / 50 kg jute bags",
    lead: "10–15 Days",
    hs: "0910 30 20",
    shelfLife: "24 months",
    moisture: "≤ 10%",
    color: "Deep golden yellow",
    applications: ["Food coloring", "Cosmetics", "Pharmaceuticals", "Nutraceuticals", "Textiles"],
    specs: [
      { label: "Curcumin", value: "≥ 3.5%" },
      { label: "Moisture", value: "≤ 10%" },
      { label: "Ash Content", value: "≤ 7%" },
      { label: "Color", value: "Deep golden yellow (60–80 ASTA)" },
      { label: "Mesh Size", value: "60–100 mesh" },
      { label: "Purity", value: "99% minimum" },
    ],
    benefits: [
      "Highest curcumin content available",
      "No artificial coloring",
      "APEDA & Spice Board certified",
      "Lab tested for aflatoxins",
    ],
    related: ["red-chilli", "coriander-seeds", "cumin-seeds"],
    featured: true,
  },
  {
    slug: "red-chilli",
    title: "Red Chilli (Whole)",
    category: "Spices & Herbs",
    image: "/products/red-chilli.jpg",
    tagline: "Guntur S4 Grade — Premium Heat & Color",
    description:
      "Export-grade whole Guntur red chillies celebrated globally for their fiery heat, vivid color, and strong market demand in food processing and condiment industries.",
    origin: "Guntur, Andhra Pradesh, India",
    moq: "1 MT",
    packaging: "25 kg PP bags / custom packaging",
    lead: "7–12 Days",
    hs: "0904 21 10",
    shelfLife: "18 months",
    moisture: "≤ 12%",
    color: "Deep red",
    applications: ["Spice blending", "Sauce manufacturing", "Food processing", "Restaurant supply"],
    specs: [
      { label: "Variety", value: "Guntur S4, Teja, 334" },
      { label: "ASTA Color", value: "80–100+ units" },
      { label: "Scoville Heat", value: "25,000–60,000 SHU" },
      { label: "Moisture", value: "≤ 12%" },
      { label: "Stem", value: "With / without stem" },
      { label: "Purity", value: "99%" },
    ],
    benefits: [
      "Strong consistent pungency",
      "High ASTA color value",
      "Available with or without stems",
      "Fumigation certificate included",
    ],
    related: ["turmeric-powder", "cumin-seeds", "coriander-seeds"],
    featured: true,
  },
  {
    slug: "cumin-seeds",
    title: "Cumin Seeds",
    category: "Spices & Herbs",
    image: "https://images.unsplash.com/photo-1623227891085-32898e93de1c?w=800&auto=format&fit=crop",
    tagline: "Gujarat's Finest — Strong Aroma Export Grade",
    description:
      "Machine-cleaned premium cumin seeds from Unjha, Gujarat — India's largest cumin market. Known for their intense aroma, uniform color, and consistent quality.",
    origin: "Unjha, Gujarat, India",
    moq: "1 MT",
    packaging: "25 kg PP bags / 50 kg bags",
    lead: "10–14 Days",
    hs: "0909 21 00",
    shelfLife: "24 months",
    moisture: "≤ 10%",
    applications: ["Food seasoning", "Spice blends", "Pharmaceuticals", "Ayurveda"],
    specs: [
      { label: "Grade", value: "European / Asian / Singapore" },
      { label: "Moisture", value: "≤ 10%" },
      { label: "Purity", value: "99% min" },
      { label: "Volatile Oil", value: "≥ 2.5%" },
      { label: "Admixture", value: "≤ 1%" },
      { label: "Color", value: "Uniform greenish-brown" },
    ],
    benefits: [
      "Machine cleaned and sorted",
      "No artificial color",
      "APEDA export certified",
      "Tested for heavy metals",
    ],
    related: ["coriander-seeds", "fennel-seeds", "turmeric-powder"],
    featured: false,
  },
  {
    slug: "coriander-seeds",
    title: "Coriander Seeds",
    category: "Spices & Herbs",
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop",
    tagline: "Eagle Grade — Premium Global Export",
    description:
      "Export-quality whole coriander seeds with fresh citrusy aroma sourced from Rajasthan's prime coriander belt. Available in Eagle and Scooter grades.",
    origin: "Rajasthan / Madhya Pradesh, India",
    moq: "1 MT",
    packaging: "25 kg PP bags",
    lead: "10–14 Days",
    hs: "0909 22 00",
    shelfLife: "24 months",
    moisture: "≤ 10%",
    applications: ["Culinary use", "Essential oil extraction", "Pharmaceuticals", "Beverages"],
    specs: [
      { label: "Grade", value: "Eagle, Scooter, Singapore" },
      { label: "Moisture", value: "≤ 10%" },
      { label: "Purity", value: "98% min" },
      { label: "Volatile Oil", value: "≥ 0.5%" },
      { label: "Split", value: "≤ 5%" },
    ],
    benefits: [
      "Fresh citrusy aroma",
      "Uniform grade separation",
      "Lab tested and certified",
    ],
    related: ["cumin-seeds", "fennel-seeds", "turmeric-powder"],
    featured: false,
  },
  {
    slug: "cloves",
    title: "Cloves",
    category: "Spices & Herbs",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop",
    tagline: "High Eugenol — Premium Export Grade",
    description:
      "Whole cloves with high eugenol content and strong essential oil yield, sourced and processed to international export standards for global buyers.",
    origin: "Tamil Nadu / Kerala, India",
    moq: "500 kg",
    packaging: "25 kg bags / vacuum packaging",
    lead: "14–18 Days",
    hs: "0907 10 00",
    shelfLife: "36 months",
    moisture: "≤ 12%",
    applications: ["Food manufacturing", "Essential oils", "Dental care", "Pharmaceuticals"],
    specs: [
      { label: "Grade", value: "Hand-picked, whole" },
      { label: "Eugenol", value: "≥ 72%" },
      { label: "Moisture", value: "≤ 12%" },
      { label: "Volatile Oil", value: "≥ 15%" },
      { label: "Purity", value: "99%" },
    ],
    benefits: [
      "High essential oil content",
      "No stems or broken cloves in premium grade",
      "Certificate of analysis available",
    ],
    related: ["green-cardamom", "cinnamon", "black-pepper"],
    featured: false,
  },
  {
    slug: "cinnamon",
    title: "Cinnamon (Dalchini)",
    category: "Spices & Herbs",
    image: "https://images.unsplash.com/photo-1587049332298-1c42e83937a7?w=800&auto=format&fit=crop",
    tagline: "Ceylon & Cassia — Premium Export Sticks",
    description:
      "Export-grade cinnamon sticks and powder available in both Ceylon (true cinnamon) and Cassia varieties, processed and packed for international food industry buyers.",
    origin: "Tamil Nadu / Karnataka, India",
    moq: "500 kg",
    packaging: "25 kg bags / 5 kg retail packs",
    lead: "14–18 Days",
    hs: "0906 11 00",
    shelfLife: "36 months",
    moisture: "≤ 13%",
    applications: ["Baking", "Confectionery", "Beverages", "Nutraceuticals", "Perfumery"],
    specs: [
      { label: "Type", value: "Cassia / Ceylon" },
      { label: "Moisture", value: "≤ 13%" },
      { label: "Volatile Oil", value: "≥ 1%" },
      { label: "Coumarin", value: "As per destination norms" },
      { label: "Form", value: "Sticks / Powder / Quill" },
    ],
    benefits: [
      "Consistent aroma profile",
      "Coumarin levels tested per market",
      "Available in multiple grades",
    ],
    related: ["cloves", "green-cardamom", "fennel-seeds"],
    featured: false,
  },
  {
    slug: "fennel-seeds",
    title: "Fennel Seeds",
    category: "Spices & Herbs",
    image: "https://images.unsplash.com/photo-1628684669898-49f2dce90e0f?w=800&auto=format&fit=crop",
    tagline: "Gujarat Premium — Bold Aroma Export",
    description:
      "Sweet, aromatic fennel seeds from Gujarat's prime growing regions. Popular in Middle East, Europe, and Southeast Asia for culinary and pharmaceutical applications.",
    origin: "Gujarat / Rajasthan, India",
    moq: "1 MT",
    packaging: "25 kg PP bags",
    lead: "10–14 Days",
    hs: "0909 61 00",
    shelfLife: "24 months",
    moisture: "≤ 10%",
    applications: ["Culinary seasoning", "Herbal teas", "Pharmaceuticals", "Mouth fresheners"],
    specs: [
      { label: "Grade", value: "European, Lucknowi" },
      { label: "Moisture", value: "≤ 10%" },
      { label: "Purity", value: "98% min" },
      { label: "Volatile Oil", value: "≥ 1.5%" },
      { label: "Color", value: "Bright green-yellow" },
    ],
    benefits: [
      "Machine cleaned",
      "Bold consistent size",
      "No foreign matter",
    ],
    related: ["cumin-seeds", "coriander-seeds", "black-pepper"],
    featured: false,
  },

  /* ─── RICE & GRAINS ────────────────────────────────────── */
  {
    slug: "basmati-rice",
    title: "Basmati Rice",
    category: "Rice & Grains",
    image: "/products/rice.jpg",
    tagline: "Aged Premium Basmati — Long Grain Export",
    description:
      "Aged long-grain basmati rice with natural aroma, non-sticky texture, and elongation ratio ideal for restaurant chains, wholesalers, and branded retail buyers worldwide.",
    origin: "Punjab / Haryana / Uttarakhand, India",
    moq: "1 FCL (20 MT)",
    packaging: "1 kg / 5 kg / 10 kg / 25 kg / 50 kg bags",
    lead: "15–21 Days",
    hs: "1006 30 10",
    shelfLife: "24 months",
    moisture: "≤ 13%",
    applications: ["Restaurant supply", "Retail wholesale", "Food processing", "Hotels & Catering"],
    specs: [
      { label: "Variety", value: "1121, Traditional, Pusa, Sharbati" },
      { label: "Grain Length", value: "≥ 7.5 mm (raw)" },
      { label: "Elongation", value: "≥ 1.5× on cooking" },
      { label: "Moisture", value: "≤ 13%" },
      { label: "Broken", value: "≤ 2%" },
      { label: "Aroma", value: "Natural Pandan-like fragrance" },
      { label: "Processing", value: "Double polished / Silky" },
    ],
    benefits: [
      "GI certified origin",
      "APEDA export registered",
      "Parboiled options available",
      "Private labeling & OEM packaging",
      "Custom bag printing available",
    ],
    related: ["non-basmati-rice", "cumin-seeds"],
    featured: true,
  },
  {
    slug: "non-basmati-rice",
    title: "Non-Basmati Rice",
    category: "Rice & Grains",
    image: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800&auto=format&fit=crop",
    tagline: "IR64, Sona Masuri — Bulk Export Supply",
    description:
      "Export-grade non-basmati rice varieties including IR64, Sona Masuri, and parboiled rice. Preferred for bulk food aid programs, institutional buyers, and retail markets in Africa and Middle East.",
    origin: "Andhra Pradesh / Telangana / Odisha, India",
    moq: "1 FCL (25 MT)",
    packaging: "25 kg / 50 kg PP bags",
    lead: "14–20 Days",
    hs: "1006 30 90",
    shelfLife: "18 months",
    moisture: "≤ 14%",
    applications: ["Food aid programs", "Institutional supply", "Retail markets", "Food processing"],
    specs: [
      { label: "Varieties", value: "IR64, Sona Masuri, Swarna" },
      { label: "Type", value: "Raw / Parboiled / Steamed" },
      { label: "Broken", value: "5% / 10% / 25% (as required)" },
      { label: "Moisture", value: "≤ 14%" },
      { label: "Admixture", value: "≤ 1%" },
    ],
    benefits: [
      "Competitive bulk pricing",
      "Large volume capacity",
      "Multiple broken % options",
      "WFP and government tender ready",
    ],
    related: ["basmati-rice"],
    featured: false,
  },

  /* ─── FRESH FRUITS ─────────────────────────────────────── */
  {
    slug: "mango",
    title: "Alphonso Mango",
    category: "Fresh Fruits",
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&auto=format&fit=crop",
    tagline: "King of Mangoes — GI Protected Origin",
    description:
      "GI-tagged Alphonso mangoes from Ratnagiri, Maharashtra — regarded globally as the premium mango variety for their exceptional sweetness, saffron color, and limited seasonal availability.",
    origin: "Ratnagiri / Devgad, Maharashtra, India",
    moq: "5 MT",
    packaging: "Corrugated carton boxes (3–4 kg per box)",
    lead: "5–7 Days (Seasonal: March–June)",
    hs: "0804 50 20",
    shelfLife: "14–21 days (refrigerated)",
    moisture: "N/A",
    applications: ["Premium retail", "Hotel supply", "Juice & pulp processing", "Gift boxes"],
    specs: [
      { label: "Variety", value: "Alphonso (Hapus)" },
      { label: "Size", value: "A, B (150–250 g per piece)" },
      { label: "Brix", value: "≥ 18°" },
      { label: "Color", value: "Golden saffron yellow" },
      { label: "Season", value: "March – June" },
      { label: "Storage", value: "8–12°C" },
    ],
    benefits: [
      "GI protected origin certification",
      "Pre-cooling & cold chain logistics",
      "Phytosanitary certificate",
      "Air freight option for premium markets",
    ],
    related: ["banana", "pomegranate"],
    featured: true,
  },
  {
    slug: "banana",
    title: "Banana (Cavendish)",
    category: "Fresh Fruits",
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&auto=format&fit=crop",
    tagline: "Grade A Cavendish — Year-Round Export",
    description:
      "Grade A Cavendish bananas grown in Tamil Nadu and Andhra Pradesh with consistent size, weight, and sugar content. Available year-round for bulk retail and wholesale buyers.",
    origin: "Tamil Nadu / Andhra Pradesh, India",
    moq: "1 FCL (18–22 MT)",
    packaging: "18–20 kg carton boxes",
    lead: "7–10 Days",
    hs: "0803 90 10",
    shelfLife: "21–28 days (green stage cold chain)",
    moisture: "N/A",
    applications: ["Retail supermarkets", "Wholesale markets", "Processing (chips, flour)"],
    specs: [
      { label: "Variety", value: "Cavendish G9" },
      { label: "Length", value: "≥ 18 cm" },
      { label: "Weight/piece", value: "100–150 g" },
      { label: "Brix", value: "≥ 19°" },
      { label: "Stage", value: "Green (stage 1–2)" },
    ],
    benefits: [
      "Year-round availability",
      "Uniform bunch & finger size",
      "Pre-cooling treatment",
      "Ethylene ripening chamber support",
    ],
    related: ["mango", "pomegranate"],
    featured: false,
  },
  {
    slug: "pomegranate",
    title: "Pomegranate",
    category: "Fresh Fruits",
    image: "https://images.unsplash.com/photo-1541344999736-83eca272f6fc?w=800&auto=format&fit=crop",
    tagline: "Bhagwa Variety — Premium Juice Grade",
    description:
      "Export-quality Bhagwa variety pomegranates from Solapur with deep red arils, high juice content, and excellent shelf life preferred by European and Middle East buyers.",
    origin: "Solapur / Nashik, Maharashtra, India",
    moq: "3 MT",
    packaging: "4–5 kg carton boxes (tissue-wrapped)",
    lead: "7–10 Days",
    hs: "0810 90 40",
    shelfLife: "60–90 days (4–6°C cold storage)",
    moisture: "N/A",
    applications: ["Fresh retail", "Juice extraction", "Food processing", "Nutraceuticals"],
    specs: [
      { label: "Variety", value: "Bhagwa (Wonderful)" },
      { label: "Weight", value: "250–400 g per fruit" },
      { label: "Brix", value: "≥ 16°" },
      { label: "Arils", value: "Deep red, soft seed" },
      { label: "Shelf life", value: "60–90 days cold" },
    ],
    benefits: [
      "GlobalG.A.P. farm-level traceability",
      "EurepGAP compliance available",
      "Pre-sorted and graded",
    ],
    related: ["mango", "banana"],
    featured: false,
  },

  /* ─── FRESH VEGETABLES ─────────────────────────────────── */
  {
    slug: "onion",
    title: "Red Onion",
    category: "Fresh Vegetables",
    image: "https://images.unsplash.com/photo-1508747703725-719777637510?w=800&auto=format&fit=crop",
    tagline: "Nashik Red — World's Premium Export Onion",
    description:
      "Premium Nashik red onions with deep color, high pungency, and long shelf life. India's most exported vegetable — trusted by buyers across South-East Asia, Middle East, and Europe.",
    origin: "Nashik / Pune, Maharashtra, India",
    moq: "1 FCL (25 MT)",
    packaging: "25 kg mesh bags / 50 kg jute bags",
    lead: "7–12 Days",
    hs: "0703 10 19",
    shelfLife: "3–6 months",
    moisture: "N/A",
    applications: ["Retail wholesale", "Food processing", "Industrial dehydration", "Restaurant supply"],
    specs: [
      { label: "Variety", value: "Nashik Red, Poona Red" },
      { label: "Size", value: "35–55mm / 55–75mm / 75mm+" },
      { label: "Dry Matter", value: "≥ 12%" },
      { label: "Skin", value: "3–4 outer skins intact" },
      { label: "Shelf Life", value: "3–6 months" },
    ],
    benefits: [
      "India's most in-demand export vegetable",
      "Year-round availability",
      "Custom size grading available",
      "Fumigation certificate",
    ],
    related: ["mango", "banana"],
    featured: true,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "All") return PRODUCTS;
  return PRODUCTS.filter((p) => p.category === category);
}

export function getRelatedProducts(slugs: string[]): Product[] {
  return PRODUCTS.filter((p) => slugs.includes(p.slug));
}

export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter((p) => p.featured);
}
