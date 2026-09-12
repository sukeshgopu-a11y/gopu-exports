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
    eyebrow: "Rice Export Supply",
    productCategory: "Rice & Grains",
    description: "Indian basmati and non-basmati rice for international buyers, with buyer-specific specifications, packing and export documentation support.",
    keywords: ["rice exporters from India", "basmati rice export", "Indian rice supplier"],
    sections: [
      { heading: "Rice products for international buyers", body: "GOPU Exports handles export enquiries for basmati rice, non-basmati rice and selected rice formats. Importers can specify grain length, broken percentage, moisture, packing size, quantity and private-label requirements where applicable." },
      { heading: "Packing and export documentation", body: "Rice packing and documentation are reviewed against product, destination, order quantity and buyer requirements before quotation finalisation." },
    ],
  },
  {
    slug: "spice-exporters-from-india",
    title: "Spice Exporters from India",
    eyebrow: "Indian Spice Export Supply",
    productCategory: "Spices",
    description: "Indian spices for international importers, distributors, processors and private-label buyers, including chilli, turmeric, cumin, coriander and selected whole and ground spices.",
    keywords: ["spice exporters from India", "Indian spices export", "bulk spice supplier India"],
    sections: [
      { heading: "Indian spices for importers", body: "Export enquiries may include whole spices, ground spices and selected spice blends. Buyers should specify grade, form, moisture, colour, mesh size, purity, quantity, packing and testing requirements where applicable." },
      { heading: "Buyer-specification export supply", body: "GOPU Exports reviews product specifications, packing, batch information and required documentation before commercial confirmation and dispatch planning." },
    ],
  },
  {
    slug: "millet-suppliers-india",
    title: "Millet Suppliers India",
    eyebrow: "Indian Millet Export Supply",
    productCategory: "Millets",
    description: "Indian millets for wholesale, ingredient, food-service and private-label export requirements.",
    keywords: ["millet suppliers India", "Indian millets export", "bulk millet supplier"],
    sections: [
      { heading: "Millet export range", body: "Buyer enquiries may include pearl millet, finger millet, foxtail millet, barnyard millet, kodo millet, sorghum and selected processed millet formats, subject to availability." },
      { heading: "Buyer enquiry details", body: "Share variety, form, quantity, packing, destination and quality requirements so the export team can confirm suitable supply options." },
    ],
  },
  {
    slug: "fresh-vegetables-exporters-india",
    title: "Fresh Vegetables Exporters India",
    eyebrow: "Fresh Produce Exports",
    productCategory: "Fresh Vegetables",
    description: "Indian fresh vegetables supplied for export based on variety, grade, packing, destination and shipment requirements.",
    keywords: ["fresh vegetables exporters India", "Indian vegetable export", "fresh onion exporters"],
    sections: [
      { heading: "Fresh vegetable export requirements", body: "Fresh produce enquiries should include product, variety, size grade, quantity, packing, target shipment window and destination-country documentation requirements." },
      { heading: "Handling and transit planning", body: "Carton strength, ventilation, maturity, temperature and transit route can affect arrival quality. Shipment planning is reviewed before commercial confirmation." },
    ],
  },
  {
    slug: "indian-agricultural-products-exporters",
    title: "Indian Agricultural Products Exporters",
    eyebrow: "Indian Agricultural Export Supply",
    description: "Indian agricultural products for international B2B buyers across spices, rice, grains, millets, fruits, vegetables and selected processed food categories.",
    keywords: ["Indian agricultural products exporters", "agri commodity exporter India", "Indian food products export company"],
    sections: [
      { heading: "Agricultural export portfolio", body: "GOPU Exports handles structured international buyer enquiries for agricultural products with product specifications, packing, documentation and shipment coordination reviewed before quotation." },
      { heading: "How to request an export quote", body: "Send product name, grade, quantity, packing, destination, Incoterm and document requirements. For products not displayed in the catalogue, select Others in the enquiry form." },
    ],
  },
  {
    slug: "apeda-products-exporters-india",
    title: "APEDA Product Categories from India",
    eyebrow: "Agricultural Export Categories",
    description: "A buyer reference for selected Indian agricultural and processed food categories commonly covered within APEDA product classifications. Product availability is confirmed separately by GOPU Exports.",
    keywords: ["APEDA product categories India", "Indian agri product exporters", "agricultural exports India"],
    sections: [
      { heading: "Product category reference", body: "APEDA publishes official agricultural and processed-food product categories. This page is a buyer reference only and does not imply that GOPU Exports supplies every APEDA-listed category or holds any certification beyond registrations expressly shown on the company verification pages." },
      { heading: "Buyer-ready export enquiries", body: "Provide the exact product, variety, grade, packing, quantity, destination and required documents so availability and export requirements can be reviewed accurately." },
    ],
  },
  {
    slug: "spice-board-products-exporters-india",
    title: "Indian Spice Export Products",
    eyebrow: "Indian Spice Product Scope",
    productCategory: "Spices",
    description: "Indian spice products for international importers, processors, wholesalers and private-label buyers, subject to product availability and buyer specifications.",
    keywords: ["Indian spice exporters", "Spices Board India products", "Indian spice supplier"],
    sections: [
      { heading: "Spice product scope", body: "India produces a wide range of spices including chilli, turmeric, pepper, cumin, coriander, cardamom, ginger, fennel, fenugreek, cinnamon, clove, nutmeg and mace. GOPU Exports confirms its available export range separately against each enquiry." },
      { heading: "Trade-ready spice quotations", body: "A professional export quote should include grade, form, quality parameters, packing, quantity, destination and testing requirements where applicable." },
    ],
  },
];

export function getCategoryLandingPage(slug: string) {
  return CATEGORY_LANDING_PAGES.find((page) => page.slug === slug) ?? null;
}
