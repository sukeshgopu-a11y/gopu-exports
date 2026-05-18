export type CategoryLandingPage = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  keywords: string[];
  productCategory?: string;
  sections: { heading: string; body: string }[];
};

export const CATEGORY_LANDING_PAGES: CategoryLandingPage[] = [
  {
    slug: "rice-exporters-from-india",
    title: "Rice Exporters from India",
    eyebrow: "Rice Export Sourcing",
    productCategory: "Rice & Grains",
    description: "Source basmati and non-basmati rice from India with buyer-specific packing, specifications, and export documentation support.",
    keywords: ["rice exporters from India", "basmati rice export", "Indian rice suppliers"],
    sections: [
      { heading: "Rice products for wholesale buyers", body: "GOPU Exports supports enquiries for basmati rice, non-basmati rice, parboiled rice, steamed rice, raw rice, and buyer-specific packing formats. Importers can request grain length, broken percentage, moisture, packing size, and private label requirements." },
      { heading: "Packaging and documents", body: "Rice shipments can be planned in bulk bags or retail packs depending on market needs. Buyers should share destination port, incoterm, quantity, packing size, and document checklist before quote finalisation." },
    ],
  },
  {
    slug: "spice-exporters-from-india",
    title: "Spice Exporters from India",
    eyebrow: "Indian Spice Supply",
    productCategory: "Spices",
    description: "Professional sourcing for Indian spices including chilli, turmeric, cumin, coriander, pepper, cardamom, fennel, and private label spice packs.",
    keywords: ["spice exporters from India", "Indian spices export", "bulk spice suppliers"],
    sections: [
      { heading: "Spice categories for importers", body: "Indian spice enquiries often include whole spices, powder spices, spice blends, and private label packs. Buyers should specify grade, moisture, colour, mesh size, purity, and testing requirements." },
      { heading: "Quality-focused dispatch", body: "Spice shipments should be supported by correct packing, batch traceability, and buyer-requested documents. GOPU Exports handles enquiries with clear product and document discussion before dispatch." },
    ],
  },
  {
    slug: "millet-suppliers-india",
    title: "Millet Suppliers India",
    eyebrow: "Millet Export Sourcing",
    productCategory: "Millets",
    description: "Source Indian millets for wholesale, ingredient, food service, and private label requirements.",
    keywords: ["millet suppliers India", "Indian millets export", "bulk millet supplier"],
    sections: [
      { heading: "Millet types and forms", body: "Importer discussions may include pearl millet, finger millet, foxtail millet, barnyard millet, kodo millet, sorghum, millet flour, flakes, and retail packs." },
      { heading: "Buyer enquiry details", body: "Share variety, form, quantity, packing, destination, organic requirement if any, and quality limits so the sourcing team can respond with practical options." },
    ],
  },
  {
    slug: "fresh-vegetables-exporters-india",
    title: "Fresh Vegetables Exporters India",
    eyebrow: "Fresh Produce Exports",
    productCategory: "Fresh Vegetables",
    description: "Plan fresh vegetable sourcing from India with carton packing, grading, pre-dispatch checks, and shipment coordination.",
    keywords: ["fresh vegetables exporters India", "Indian vegetable export", "fresh onion exporters"],
    sections: [
      { heading: "Fresh vegetable sourcing", body: "Fresh produce enquiries should mention product, variety, size grade, quantity, packing, target shipment week, and destination-country document needs." },
      { heading: "Handling and transit planning", body: "Carton strength, ventilation, maturity, temperature, and transit route affect arrival quality. Buyers should plan fresh shipments earlier than dry commodity orders." },
    ],
  },
  {
    slug: "indian-agricultural-products-exporters",
    title: "Indian Agricultural Products Exporters",
    eyebrow: "Agri Commodity Sourcing",
    description: "Source Indian agricultural products across spices, rice, grains, millets, fruits, vegetables, and processed food categories.",
    keywords: ["Indian agricultural products exporters", "agri commodity suppliers India", "Indian food products export company"],
    sections: [
      { heading: "Broad agricultural sourcing", body: "GOPU Exports handles structured enquiries for agricultural commodities where buyers need product clarity, packing support, documentation, and shipment coordination." },
      { heading: "Best way to enquire", body: "Send product name, grade, quantity, packing, destination, incoterm, and document requirements. For unlisted products, use the Others option in the enquiry form." },
    ],
  },
  {
    slug: "apeda-products-exporters-india",
    title: "APEDA Products Exporters India",
    eyebrow: "APEDA Category Products",
    description: "Buyer-focused sourcing support for APEDA-type agricultural and processed food categories from India.",
    keywords: ["APEDA products exporters India", "APEDA product catalogue", "Indian agri product exporters"],
    sections: [
      { heading: "APEDA product category alignment", body: "APEDA official categories include fruits and vegetables and their products, cereal and cereal products, groundnuts and nuts, pickles, papads and chutneys, guar gum, herbal and medicinal plants, floriculture, and other processed food categories." },
      { heading: "Buyer-ready enquiries", body: "Use APEDA categories as a starting point, then provide product-specific details such as variety, grade, packing, quantity, destination, and document checklist." },
    ],
  },
  {
    slug: "spice-board-products-exporters-india",
    title: "Spice Board Products Exporters India",
    eyebrow: "Spice Board Product Scope",
    productCategory: "Spices",
    description: "Source Indian spice products with specification-led discussions for global importers, processors, and private label buyers.",
    keywords: ["Spice Board products exporters India", "Spices Board India products", "Indian spice suppliers"],
    sections: [
      { heading: "Spice product scope", body: "Spices Board India references a wide spice scope including chilli, turmeric, pepper, cumin, coriander, cardamom, ginger, fennel, fenugreek, cinnamon, clove, nutmeg, mace, and other spice products." },
      { heading: "Trade-ready spice quotes", body: "A professional spice quote should include grade, form, quality values, packing, quantity, destination, and testing requirements where applicable." },
    ],
  },
];

export function getCategoryLandingPage(slug: string) {
  return CATEGORY_LANDING_PAGES.find((page) => page.slug === slug) ?? null;
}
