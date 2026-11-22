export function formatCommercialMoq(input: {
  slug?: string;
  title?: string;
  category?: string;
  moq?: string;
}) {
  const title = (input.title ?? "").toLowerCase();
  const category = (input.category ?? "").toLowerCase();
  const raw = (input.moq ?? "").toLowerCase();

  // LCL/FCL describes a shipment mode, not an order quantity; keep it out of MOQ copy.
  if (input.slug === "fresh-potato") {
    return input.moq?.trim() || "Minimum quantity confirmed in quotation";
  }

  if (category.includes("rice") || title.includes("rice")) {
    return "Bulk order; minimum quantity confirmed in quotation";
  }

  if (category.includes("fruit") || category.includes("vegetable") || raw.includes("fcl") || raw.includes("container")) {
    return "Minimum quantity confirmed in quotation";
  }

  if (
    category.includes("spice") ||
    title.includes("chilli") ||
    title.includes("turmeric") ||
    title.includes("cumin") ||
    title.includes("coriander") ||
    title.includes("pepper") ||
    title.includes("cardamom")
  ) {
    return "Bulk orders accepted; final quantity depends on packaging, destination, and availability";
  }

  return "Starts from 1 MT / buyer requirement";
}
