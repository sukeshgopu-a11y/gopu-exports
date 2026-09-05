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
  "Spices",
  "Rice & Grains",
  "Fresh Fruits",
  "Fresh Vegetables",
] as const;

export const PRODUCTS: Product[] = [
  /* ─── SPICES ──────────────────────────────────────────── */
  {
    slug: "green-cardamom",
    title: "Green Cardamom",
    category: "Spices",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop",
    tagline: "Whole green cardamom available by grade and buyer specification",
    description:
      "Whole green cardamom pods sourced for bulk food-service, processing, and wholesale procurement. Grade, colour, size, packing, and documentation requirements are confirmed with the buyer before quotation.",
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
      "Buyer documentation review available",
      "Uniform pod size & color grading",
      "Phytosanitary documentation can be arranged where required by product, destination or buyer specification",
      "Air or sea freight options",
    ],
    related: ["black-pepper", "cloves", "cinnamon"],
    featured: true,
  },
  {
    slug: "black-pepper",
    title: "Black Pepper",
    category: "Spices",
    image: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=800&auto=format&fit=crop",
    tagline: "Whole black pepper available for bulk and food-service procurement",
    description:
      "Whole black peppercorns available for spice processors, food-service distributors, wholesalers, and ingredient buyers. Density, piperine, packing, and documentation requirements are reviewed against buyer specifications.",
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
      "Fumigation documentation can be arranged where required by product, destination or buyer specification",
      "Food safety documentation available on request",
    ],
    related: ["green-cardamom", "cloves", "coriander-seeds"],
    featured: true,
  },
  {
    slug: "turmeric-powder",
    title: "Turmeric Powder",
    category: "Spices",
    image: "/products/turmeric.webp",
    tagline: "Turmeric powder for food processing, wholesale, and private-label packing",
    description:
      "Turmeric powder processed for bulk food, ingredient, and private-label procurement. Curcumin, mesh size, colour, packing, and testing requirements are confirmed against the buyer-approved specification.",
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
      "Curcumin range can be discussed by grade and buyer specification",
      "No artificial coloring",
      "Trade certification references available on request",
      "Lab testing can be coordinated where required by buyer or destination",
    ],
    related: ["red-chilli", "coriander-seeds", "cumin-seeds"],
    featured: true,
  },
  {
    slug: "red-chilli",
    title: "Red Chilli (Whole)",
    category: "Spices",
    image: "/products/red-chilli.webp",
    tagline: "Whole red chilli for bulk spice and food processing procurement",
    description:
      "Whole red chillies sourced for spice processors, seasoning manufacturers, wholesalers, and food-service buyers. ASTA, SHU, moisture, stem, packing, and documentation requirements are confirmed before order finalisation.",
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
      { label: "Typical ASTA Color", value: "80–100+ units, buyer-specific ranges available" },
      { label: "Typical Scoville Heat", value: "25,000–60,000 SHU, subject to variety and specification" },
      { label: "Moisture", value: "Target ≤ 12%, confirmed by contract specification" },
      { label: "Stem", value: "With / without stem" },
      { label: "Purity", value: "99%" },
    ],
    benefits: [
      "Pungency range reviewed by variety and buyer requirement",
      "ASTA colour range confirmed against buyer-approved specification",
      "Available with or without stems",
      "Fumigation documentation can be arranged where required by product, destination or buyer specification",
    ],
    related: ["turmeric-powder", "cumin-seeds", "coriander-seeds"],
    featured: true,
  },
  {
    slug: "cumin-seeds",
    title: "Cumin Seeds",
    category: "Spices",
    image: "https://images.unsplash.com/photo-1623227891085-32898e93de1c?w=800&auto=format&fit=crop",
    tagline: "Cumin seeds for bulk spice and ingredient procurement",
    description:
      "Machine-cleaned cumin seeds sourced for spice blending, food processing, wholesale, and ingredient buyers. Aroma, purity, moisture, packing, and testing requirements are reviewed before quotation.",
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
      "Export documentation support available",
      "Tested for heavy metals",
    ],
    related: ["coriander-seeds", "fennel-seeds", "turmeric-powder"],
    featured: false,
  },
  {
    slug: "coriander-seeds",
    title: "Coriander Seeds",
    category: "Spices",
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop",
    tagline: "Coriander seeds for bulk spice procurement",
    description:
      "Whole coriander seeds available for spice processors, wholesalers, and food-service buyers. Grade, purity, split percentage, packing, and documentation requirements are confirmed with the buyer.",
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
      "Lab testing can be discussed for buyer requirements",
    ],
    related: ["cumin-seeds", "fennel-seeds", "turmeric-powder"],
    featured: false,
  },
  {
    slug: "cloves",
    title: "Cloves",
    category: "Spices",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop",
    tagline: "Whole cloves for food manufacturing and wholesale procurement",
    description:
      "Whole cloves available for food manufacturing, spice blending, and wholesale procurement. Grade, eugenol range, moisture, packing, and documentation requirements are reviewed before quotation.",
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
    category: "Spices",
    image: "https://images.unsplash.com/photo-1587049332298-1c42e83937a7?w=800&auto=format&fit=crop",
    tagline: "Cinnamon sticks and powder for bulk procurement",
    description:
      "Cinnamon sticks and powder available for food industry, wholesale, and ingredient buyers. Variety, form, coumarin considerations, packing, and destination requirements are reviewed during quotation.",
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
    category: "Spices",
    image: "https://images.unsplash.com/photo-1628684669898-49f2dce90e0f?w=800&auto=format&fit=crop",
    tagline: "Fennel seeds for culinary, tea, and ingredient procurement",
    description:
      "Sweet aromatic fennel seeds available for culinary, tea, wholesale, and ingredient procurement. Grade, colour, purity, packing, and testing requirements are confirmed by buyer specification.",
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
    image: "/products/rice.webp",
    tagline: "Long-grain basmati rice for wholesale, food-service, and private-label packing",
    description:
      "Long-grain basmati rice available for restaurant chains, wholesalers, food-service buyers, and suitable private-label packing programmes. Variety, ageing, broken percentage, packing, and documentation are confirmed before quotation.",
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
      "Origin documentation can be discussed",
      "Export documentation support available",
      "Parboiled options available",
      "Private-label packaging available for suitable order quantities and buyer requirements",
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
    tagline: "Alphonso mango enquiries reviewed by season, grade, and route",
    description:
      "Alphonso mango sourcing enquiries are reviewed by season, grade, packing, cold-chain route, and destination requirements. Origin and product documentation are confirmed during buyer discussions.",
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
      "Origin documentation can be reviewed where applicable",
      "Pre-cooling & cold chain logistics",
      "Phytosanitary documentation can be arranged where required by product, destination or buyer specification",
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
    tagline: "Cavendish banana enquiries reviewed by grade, packing, and route",
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
    tagline: "Bhagwa pomegranate enquiries reviewed by grade and destination",
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
      "Farm-level traceability can be discussed where available",
      "Destination documentation can be reviewed during quotation",
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
    tagline: "Red onion enquiries reviewed by size, packing, and route",
    description:
      "Red onions available for wholesale, food-service, and processing enquiries. Size grading, packing, shelf life, route, and destination documentation requirements are confirmed before quotation.",
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
      "Year-round availability",
      "Custom size grading available",
      "Fumigation documentation can be arranged where required by product, destination or buyer specification",
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
