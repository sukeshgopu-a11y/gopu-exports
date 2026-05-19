export type ExportOperationPage = {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  sections: { heading: string; body: string }[];
  faq: { question: string; answer: string }[];
};

export const EXPORT_OPERATION_PAGES: ExportOperationPage[] = [
  {
    slug: "export-process",
    title: "Export Process",
    description: "A practical overview of how GOPU Exports handles buyer enquiries, product matching, documentation, packing, and shipment coordination.",
    keywords: ["Indian export process", "agricultural export process", "bulk food export India"],
    sections: [
      { heading: "Buyer requirement review", body: "Every enquiry starts with product type, target destination, packing preference, quantity, documentation needs, and shipment timeline. This helps the sourcing team quote realistic options instead of generic stock messages." },
      { heading: "Product confirmation", body: "Samples, specifications, packaging options, and quality expectations are clarified before commercial confirmation. For agricultural commodities, seasonal availability and grade consistency are discussed upfront." },
      { heading: "Documentation and shipment coordination", body: "The export workflow includes invoice, packing list, certificate support, origin details, and logistics coordination with buyer-appointed or recommended freight partners." },
    ],
    faq: [
      { question: "Can buyers request multiple products in one enquiry?", answer: "Yes. Buyers can send a combined sourcing requirement and the team will respond with product-wise availability and next steps." },
      { question: "Does GOPU Exports support buyer-specific packing?", answer: "Packing options can be discussed for bulk, retail, and private-label requirements depending on product type and order quantity." },
    ],
  },
  {
    slug: "packaging-standards",
    title: "Packaging Standards",
    description: "Export packaging considerations for rice, spices, pulses, millets, fruits, vegetables, and processed agri products.",
    keywords: ["export packaging standards", "spice packaging India", "rice export packaging"],
    sections: [
      { heading: "Commodity-specific packing", body: "Dry commodities usually require moisture-conscious sacks, cartons, liners, or vacuum options. Fresh produce needs handling plans that consider ventilation, carton strength, and transit duration." },
      { heading: "Buyer labeling needs", body: "Labels can include product name, net weight, batch details, country of origin, handling marks, and buyer-specified branding where commercially agreed." },
      { heading: "Shipment protection", body: "Packaging decisions are aligned with container loading method, route, weather exposure, shelf-life expectation, and import compliance requirements." },
    ],
    faq: [
      { question: "Can packaging be customized?", answer: "Customization is possible for suitable products and quantities. The quote process confirms feasibility, lead time, and artwork or label requirements." },
      { question: "Are retail packs available?", answer: "Retail pack discussions are supported where the product and order volume make private-label or consumer packaging practical." },
    ],
  },
  {
    slug: "quality-control",
    title: "Quality Control",
    description: "How agricultural export buyers can structure quality expectations, inspection points, and product specifications.",
    keywords: ["export quality control", "Indian spice quality", "agricultural commodity inspection"],
    sections: [
      { heading: "Specification-led sourcing", body: "Clear specification sheets reduce misunderstandings. Typical parameters include variety, grade, moisture, size, purity, processing style, packaging, and shelf-life expectations." },
      { heading: "Inspection readiness", body: "Buyer-appointed inspection, lab reports, and product photos can be coordinated where required. Requirements should be stated before order confirmation." },
      { heading: "Traceable communication", body: "Product changes, substitutions, grade limits, and seasonal constraints should be documented during the enquiry and quotation stage." },
    ],
    faq: [
      { question: "Can buyers request lab testing?", answer: "Yes, testing needs can be reviewed during quotation and coordinated based on product, market, and buyer requirements." },
      { question: "How are quality expectations confirmed?", answer: "The most reliable method is a written specification sheet with agreed product, packing, inspection, and shipment terms." },
    ],
  },
  {
    slug: "logistics-shipping",
    title: "Logistics & Shipping",
    description: "Shipment coordination considerations for global buyers sourcing agricultural products from India.",
    keywords: ["export logistics India", "agri commodity shipping", "Indian food products shipment"],
    sections: [
      { heading: "Route planning", body: "Shipping plans depend on destination port, container type, cargo weight, documentation needs, and required delivery timeline." },
      { heading: "Buyer and freight coordination", body: "Buyers may nominate a forwarder or request coordination support. Clear Incoterms and contact details prevent delays at dispatch." },
      { heading: "Shipment communication", body: "Professional export handling includes sharing packing details, dispatch status, shipment milestones, and documentation updates when available." },
    ],
    faq: [
      { question: "Can buyers use their own forwarder?", answer: "Yes. Buyer-appointed freight forwarders can be coordinated with once order and pickup details are confirmed." },
      { question: "Are air shipments possible?", answer: "Air freight may be suitable for samples or urgent cargo depending on product type, quantity, and destination restrictions." },
    ],
  },
  {
    slug: "documentation-support",
    title: "Documentation Support",
    description: "Export documentation guidance for buyers importing Indian agricultural and food products.",
    keywords: ["export documentation India", "food import documents", "certificate of origin India"],
    sections: [
      { heading: "Core commercial documents", body: "Most export shipments require commercial invoice, packing list, transport documents, and buyer or destination-specific paperwork." },
      { heading: "Product and market requirements", body: "Depending on product and destination, buyers may request certificate of origin, phytosanitary support, health-related documents, fumigation records, or inspection reports." },
      { heading: "Early requirement mapping", body: "The safest approach is to share destination import requirements during enquiry so documentation can be factored into pricing and timelines." },
    ],
    faq: [
      { question: "Can all documents be guaranteed for every market?", answer: "No. Documentation depends on product, destination rules, order terms, and issuing authority requirements." },
      { question: "When should buyers mention document requirements?", answer: "Document requirements should be shared at enquiry stage to avoid quote revisions and shipment delays." },
    ],
  },
  {
    slug: "buyer-faq",
    title: "Buyer FAQ",
    description: "Common questions from international buyers sourcing rice, spices, millets, pulses, fruits, vegetables, and Indian agri commodities.",
    keywords: ["Indian agri exporter FAQ", "bulk food import questions", "GOPU Exports buyer questions"],
    sections: [
      { heading: "Starting an enquiry", body: "Share product name, quantity, destination country, packing preference, target delivery timeline, and any inspection or document requirements." },
      { heading: "Product selection", body: "If you are unsure about grades or packing, describe the end use and target buyer segment. This helps the team suggest practical options." },
      { heading: "Communication flow", body: "Professional buying requires clear questions, written confirmations, and timely responses on documents, samples, and shipment instructions." },
    ],
    faq: [
      { question: "Is a small trial order possible?", answer: "Trial order feasibility depends on product, packing, destination, and shipping economics. Buyers can request available options." },
      { question: "Can GOPU Exports source products not listed online?", answer: "Yes. The team can review flexible sourcing requests for suitable Indian agricultural products." },
    ],
  },
  {
    slug: "private-label-services",
    title: "Private Label Services",
    description: "Private-label and buyer-brand export options for spices, food products, and suitable agricultural commodities.",
    keywords: ["private label spices India", "private label food export", "buyer brand spice export"],
    sections: [
      { heading: "Brand-ready planning", body: "Private-label enquiries should include product type, pack size, label language, carton requirements, target market, and compliance expectations." },
      { heading: "Practical product selection", body: "Spice powders, blends, selected grains, and processed products may suit private-label workflows depending on MOQ and packaging feasibility." },
      { heading: "Design and compliance", body: "Artwork, label declarations, barcode needs, and destination-specific requirements should be reviewed before printing or packing." },
    ],
    faq: [
      { question: "Can GOPU Exports design private-label packaging?", answer: "Packaging support can be discussed, but buyer approval and destination compliance remain important before production." },
      { question: "Is private label available for all products?", answer: "No. Suitability depends on product, order size, processing requirement, and packaging availability." },
    ],
  },
  {
    slug: "bulk-orders",
    title: "Bulk Orders",
    description: "Bulk procurement guidance for importers sourcing Indian agricultural commodities and food products.",
    keywords: ["bulk agri products India", "bulk spice exporter", "bulk rice supplier India"],
    sections: [
      { heading: "Commercial clarity", body: "Bulk quotes are more accurate when buyers share quantity, destination, packing, grade, Incoterms, and target shipment window." },
      { heading: "Supply planning", body: "Agricultural products can be seasonal. Early communication helps align availability, quality parameters, and logistics timing." },
      { heading: "Repeat buying", body: "Repeat orders benefit from agreed specifications, packing standards, document templates, and consistent communication routines." },
    ],
    faq: [
      { question: "What information is needed for bulk quote?", answer: "Product, grade, quantity, destination, packing, document needs, and preferred shipping terms are the most useful details." },
      { question: "Can multiple SKUs be consolidated?", answer: "Consolidation may be possible depending on products, quantities, packing type, and shipment route." },
    ],
  },
  {
    slug: "global-supply-network",
    title: "Global Supply Network",
    description: "How GOPU Exports approaches reliable sourcing across Indian agricultural product categories.",
    keywords: ["Indian agricultural supply network", "global food supply India", "agri sourcing India"],
    sections: [
      { heading: "Category-led sourcing", body: "Sourcing is organized around practical categories including rice, millets, spices, pulses, fruits, vegetables, and selected processed agricultural products." },
      { heading: "Supplier coordination", body: "A reliable sourcing process checks product availability, packing readiness, inspection expectations, and communication discipline." },
      { heading: "Buyer fit", body: "The strongest results come when product choice, quality level, packing, documentation, and budget are aligned early." },
    ],
    faq: [
      { question: "Does the website list every possible product?", answer: "No. Buyers can request products beyond the visible catalog, and the team will review sourcing feasibility." },
      { question: "Can GOPU Exports support long-term supply discussions?", answer: "Yes. Long-term discussions work best when specifications, forecast volumes, and destination requirements are clear." },
    ],
  },
  {
    slug: "inquiry-procurement-support",
    title: "Inquiry & Procurement Support",
    description: "A buyer-focused guide to submitting complete sourcing enquiries and receiving practical export responses.",
    keywords: ["export inquiry support", "procurement support India", "agri products quote request"],
    sections: [
      { heading: "Complete requirement capture", body: "A strong enquiry includes product, grade, volume, destination, packing, target price context if available, and any document requirements." },
      { heading: "Fast clarification", body: "When key details are missing, the team may ask follow-up questions before issuing a quote. This avoids inaccurate pricing or unsuitable product suggestions." },
      { heading: "Procurement next steps", body: "Once requirements are clear, buyers can proceed with sample discussion, commercial quote, documentation mapping, and shipment planning." },
    ],
    faq: [
      { question: "What is the fastest way to contact GOPU Exports?", answer: "Use the contact form, product enquiry CTA, email admin@gopuexports.com, or WhatsApp +91 87128 16876." },
      { question: "Can buyers request a product catalogue?", answer: "Yes. Buyers can request a catalogue or product shortlist through the enquiry form." },
    ],
  },
];

export function getExportOperationPage(slug: string) {
  return EXPORT_OPERATION_PAGES.find((page) => page.slug === slug);
}
