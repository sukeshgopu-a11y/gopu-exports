export function formatCommercialMoq(input: {
  title?: string;
  category?: string;
  moq?: string;
}) {
  const title = (input.title ?? "").toLowerCase();
  const category = (input.category ?? "").toLowerCase();
  const raw = (input.moq ?? "").toLowerCase();

  if (category.includes("fruit") || category.includes("vegetable") || raw.includes("fcl") || raw.includes("container")) {
    return "LCL/FCL available based on destination and product category";
  }

  if (
    category.includes("spice") ||
    category.includes("rice") ||
    title.includes("rice") ||
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
