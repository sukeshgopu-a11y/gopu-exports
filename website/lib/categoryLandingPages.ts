export type CategoryLandingPage = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  keywords: string[];
  productCategory?: string;
  relatedGuides?: { title: string; href: string }[];
  relatedProducts?: { title: string; slug: string }[];
  sections: { heading: string; body: string }[];
};

export const CATEGORY_LANDING_PAGES: CategoryLandingPage[] = [
  {
    slug: "spice-powder-exporter-india",
    title: "Spice Powder Exporter from India",
    eyebrow: "Ground spices and blends for international buyers",
    description: "Indian chilli powder, turmeric powder and spice blends for importers and B2B food businesses. Review mesh, ingredients, packing and export requirements.",
    productCategory: "Spice Powders & Blends",
    keywords: ["Indian spice powder exporter", "chilli powder exporter India", "turmeric powder exporter India"],
    relatedProducts: [{ title: "Red Chilli Powder", slug: "red-chilli-powder" }, { title: "Turmeric Powder", slug: "turmeric-powder" }, { title: "Garam Masala", slug: "garam-masala" }, { title: "Coriander Powder", slug: "coriander-powder" }],
    relatedGuides: [{ title: "Whole Indian spices", href: "/export/spice-exporters-from-india" }, { title: "Company verification", href: "/company-verification" }],
    sections: [
      { heading: "Match the powder to its food application", body: "Chilli powder enquiries should state heat, colour and mesh requirements. Turmeric powder enquiries should identify curcumin, colour, moisture and mesh requirements. For coriander powder, specify aroma, fineness and purity expectations. These are buyer-requested parameters, not guaranteed catalogue values; the offered batch must be confirmed against an agreed specification." },
      { heading: "Agree blend composition before packing", body: "For garam masala and other blends, provide a recipe or target ingredient list, intended use and allergen requirements. GOPU Exports works through partner processing and white-label arrangements. Recipe approval, ingredient declarations, samples and minimum production quantities must be agreed before an order proceeds." },
      { heading: "Bulk bags or buyer-brand packs", body: "Provide the net pack weight, liner or barrier requirements, label language and artwork responsibilities. Bulk and retail formats have different filling, labelling and order-quantity requirements. Shelf life, storage instructions and loading plans are confirmed for the product and packaging offered." },
      { heading: "Testing, documentation and quotation", body: "Send the destination country, port and requested laboratory panel or inspection scope to our Hyderabad buyer desk. Testing provider availability, sample needs, charges and turnaround must be confirmed in the quotation. Company identifiers do not certify product quality, and a generic report cannot replace documentation for the agreed batch." },
    ],
  },
  {
    slug: "agricultural-exporter-hyderabad-telangana",
    relatedGuides: [{ title: "Indian spice exports", href: "/export/spice-exporters-from-india" }, { title: "Spice powders for your market", href: "/export/spice-powder-exporter-india" }, { title: "Verify GOPU Exports", href: "/company-verification" }],
    title: "Agricultural Exporter in Hyderabad, Telangana",
    eyebrow: "Hyderabad head office · International B2B exports",
    description: "GOPU Exports is an agricultural export company in Hyderabad, Telangana, supplying Indian spices, turmeric, rice and millets to international buyers.",
    keywords: ["agricultural exporter Hyderabad", "spice exporter Telangana", "turmeric exporter Telangana"],
    relatedProducts: [{ title: "Turmeric Powder", slug: "turmeric-powder" }, { title: "Sona Masoori Rice", slug: "sona-masoori-rice" }, { title: "Red Chilli", slug: "red-chilli" }],
    sections: [
      { heading: "A Hyderabad contact for your Indian imports", body: "Gopu Exports Private Limited operates its head office at Surya Arcade, ECIL, Hyderabad, Telangana. International importers, distributors and food businesses can contact our export team to discuss Indian agricultural products, packing formats and commercial quotations. Company identifiers and verification information are available on our company verification page." },
      { heading: "Turmeric from Telangana", body: "Our catalogue includes turmeric powder with Nizamabad listed as its origin. For a turmeric quotation, specify the form, intended use, curcumin requirement, moisture limit, mesh size if powdered, packing and destination. Requested quality values need to be agreed in writing and confirmed for the offered batch; regional origin alone does not establish quality." },
      { heading: "Rice and millet export requirements", body: "Buyers considering Sona Masoori rice or Telangana-origin millet products should identify the exact variety, processing style, grain specifications and required packing. Include total quantity and destination port so the export team can review the order and shipment requirements. Availability and origin are confirmed for the product offered in the quotation." },
      { heading: "Discuss an export order with our team", body: "Start with your company name, destination country, product and quantity. Add your preferred delivery timing, packaging and testing needs. Samples, inspection scope, payment terms and freight arrangements are confirmed during the quotation process. Business visits are by arrangement; contact the team before travelling." },
    ],
  },
  {
    slug: "andhra-pradesh-chilli-rice-exports",
    title: "Andhra Pradesh Chilli & Rice Exports",
    eyebrow: "Indian product origins · International importers",
    description: "Import Guntur chilli and Andhra Pradesh-origin rice through GOPU Exports. Review grades, packing and export requirements with our Hyderabad team.",
    keywords: ["Guntur chilli exporter", "Andhra Pradesh rice exports", "Andhra Pradesh agricultural exports"],
    relatedProducts: [{ title: "Guntur Red Chilli", slug: "red-chilli" }, { title: "Sona Masoori Rice", slug: "sona-masoori-rice" }, { title: "Non-Basmati Rice", slug: "non-basmati-rice" }],
    sections: [
      { heading: "Guntur chilli for overseas buyers", body: "GOPU Exports lists Guntur red chilli in its Indian export catalogue. Importers can request whole chilli or discuss powder requirements for food-service, processing and retail channels. Specify variety, stem preference, heat, colour, moisture and packing. Final grade and laboratory parameters must match the buyer-approved specification for the order." },
      { heading: "Rice from Andhra Pradesh", body: "The catalogue includes non-basmati and Sona Masoori rice with Andhra Pradesh among the listed origins. For an accurate enquiry, state the variety, raw or processed form, broken-grain limit, moisture, bag size and order quantity. The offered origin, grade and availability are confirmed before commercial agreement." },
      { heading: "Packing and shipment decisions", body: "Dry chilli and rice have different handling and packaging needs. Share your destination port, packaging preference, label requirements and inspection checklist. We review the shipment plan and quote the agreed scope. Port selection and freight arrangements depend on product readiness, carrier availability and destination; they are not fixed by the growing region." },
      { heading: "One export contact in Hyderabad", body: "GOPU Exports is headquartered in Hyderabad, Telangana. This page describes Andhra Pradesh product origins, not an Andhra Pradesh office. Overseas buyers can send a single enquiry covering product specifications, volumes and destination requirements, then review company information and quotation terms with our team." },
    ],
  },

  {
    slug: "rice-exporters-from-india",
    title: "Rice Exporters from India",
    eyebrow: "Indian Rice Exports",
    productCategory: "Rice & Grains",
    description: "Import basmati and non-basmati rice from India with buyer-specific packing, specifications, and export documentation support.",
    keywords: ["rice exporters from India", "basmati rice export", "Indian rice suppliers"],
    sections: [
      { heading: "Rice products for wholesale buyers", body: "GOPU Exports supports enquiries for basmati rice, non-basmati rice, parboiled rice, steamed rice, raw rice, and buyer-specific packing formats. Importers can request grain length, broken percentage, moisture, packing size, and private label requirements." },
      { heading: "Choose the rice specification", body: "Basmati and non-basmati rice orders differ by variety, processing method, grain dimensions and intended market. Compare the listed products and specify broken percentage, moisture, packing size and any inspection requirement. For Sona Masoori and other regional varieties, confirm the offered origin and batch details with the export team." },
      { heading: "Packaging and documents", body: "Rice shipments can be planned in bulk bags or retail packs depending on market needs. Buyers should share destination port, incoterm, quantity, packing size, and document checklist before quote finalisation." },
    ],
  },
  {
    slug: "spice-exporters-from-india",
    relatedProducts: [{ title: "Red Chilli", slug: "red-chilli" }, { title: "Turmeric", slug: "turmeric-powder" }, { title: "Chilli Powder", slug: "red-chilli-powder" }],
    relatedGuides: [{ title: "Spice powders and blends", href: "/export/spice-powder-exporter-india" }, { title: "Our Hyderabad export office", href: "/export/agricultural-exporter-hyderabad-telangana" }],
    title: "Spice Exporters from India",
    eyebrow: "Indian Spice Supply",
    productCategory: "Spices",
    description: "GOPU Exports supplies Indian spices to international buyers, including chilli, turmeric, cumin, coriander, pepper, cardamom, fennel, and private label spice packs.",
    keywords: ["spice exporters from India", "Indian spices export", "bulk spice suppliers"],
    sections: [
      { heading: "Spice categories for importers", body: "Indian spice enquiries often include whole spices, powder spices, spice blends, and private label packs. Buyers should specify grade, moisture, colour, mesh size, purity, and testing requirements." },
      { heading: "Chilli and turmeric requirements", body: "For Guntur chilli, state the required variety, heat, colour, stem preference and moisture. For turmeric powder, include curcumin requirements, mesh size and intended use. Request the testing scope needed for your destination; lab values and treatment requirements must be agreed for the offered product and order." },
      { heading: "Quality-focused dispatch", body: "Spice shipments should be supported by correct packing, batch traceability, and buyer-requested documents. GOPU Exports handles enquiries with clear product and document discussion before dispatch." },
    ],
  },
  {
    slug: "millet-suppliers-india",
    title: "Millet Suppliers India",
    eyebrow: "Indian Millet Exports",
    productCategory: "Millets",
    description: "Import Indian millets for wholesale, ingredient, food service, and private label requirements.",
    keywords: ["millet suppliers India", "Indian millets export", "bulk millet supplier"],
    sections: [
      { heading: "Millet types and forms", body: "Importer discussions may include pearl millet, finger millet, foxtail millet, barnyard millet, kodo millet, sorghum, millet flour, flakes, and retail packs." },
      { heading: "Buyer enquiry details", body: "Share variety, form, quantity, packing, destination, organic requirement if any, and quality limits so the export team can respond with practical options." },
    ],
  },
  {
    slug: "fresh-vegetables-exporters-india",
    title: "Fresh Vegetables Exporters India",
    eyebrow: "Fresh Produce Exports",
    productCategory: "Fresh Vegetables",
    description: "Plan fresh vegetable exports from India with carton packing, grading, pre-dispatch checks, and shipment coordination.",
    keywords: ["fresh vegetables exporters India", "Indian vegetable export", "fresh onion exporters"],
    sections: [
      { heading: "Fresh vegetable exports", body: "Fresh produce enquiries should mention product, variety, size grade, quantity, packing, target shipment week, and destination-country document needs." },
      { heading: "Handling and transit planning", body: "Carton strength, ventilation, maturity, temperature, and transit route affect arrival quality. Buyers should plan fresh shipments earlier than dry commodity orders." },
    ],
  },
  {
    slug: "indian-agricultural-products-exporters",
    title: "Indian Agricultural Products Exporters",
    eyebrow: "Indian Agricultural Exports",
    description: "Import Indian agricultural products across spices, rice, grains, millets, fruits, vegetables, and processed food categories.",
    keywords: ["Indian agricultural products exporters", "agri commodity suppliers India", "Indian food products export company"],
    sections: [
      { heading: "Indian agricultural export supply", body: "GOPU Exports handles structured enquiries for agricultural commodities where buyers need product clarity, packing support, documentation, and shipment coordination." },
      { heading: "Best way to enquire", body: "Send product name, grade, quantity, packing, destination, incoterm, and document requirements. For unlisted products, use the Others option in the enquiry form." },
    ],
  },
  {
    slug: "apeda-products-exporters-india",
    title: "Agricultural Product Categories: APEDA Buyer Guide",
    eyebrow: "APEDA Category Products",
    description: "Indian agricultural and processed food export categories: product selection and documentation information for international buyers.",
    keywords: ["APEDA products exporters India", "APEDA product catalogue", "Indian agri product exporters"],
    sections: [
      { heading: "APEDA product category alignment", body: "APEDA official categories include fruits and vegetables and their products, cereal and cereal products, groundnuts and nuts, pickles, papads and chutneys, guar gum, herbal and medicinal plants, floriculture, and other processed food categories." },
      { heading: "Buyer-ready enquiries", body: "This is a product category guide, not a claim that GOPU Exports holds APEDA registration. Verify any registration needed for the proposed order separately. Use APEDA categories as a starting point, then provide product-specific details such as variety, grade, packing, quantity, destination, and document checklist." },
    ],
  },
  {
    slug: "spice-board-products-exporters-india",
    title: "Indian Spice Categories: Buyer Guide",
    eyebrow: "Spice Board Product Scope",
    productCategory: "Spices",
    description: "Import Indian spice products with specification-led discussions for global importers, processors, and private label buyers.",
    keywords: ["Spice Board products exporters India", "Spices Board India products", "Indian spice suppliers"],
    sections: [
      { heading: "Spice product scope", body: "This guide does not claim that GOPU Exports holds Spices Board registration or product certification. Confirm applicable registrations and shipment documents before ordering. Spices Board India references a wide spice scope including chilli, turmeric, pepper, cumin, coriander, cardamom, ginger, fennel, fenugreek, cinnamon, clove, nutmeg, mace, and other spice products." },
      { heading: "Trade-ready spice quotes", body: "A professional spice quote should include grade, form, quality values, packing, quantity, destination, and testing requirements where applicable." },
    ],
  },
];

export function getCategoryLandingPage(slug: string) {
  return CATEGORY_LANDING_PAGES.find((page) => page.slug === slug) ?? null;
}

