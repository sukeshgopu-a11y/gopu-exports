import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFImage, type PDFPage, type RGB } from "pdf-lib";
import { COMPANY } from "@/lib/company";
import { formatCommercialMoq } from "@/lib/moq";
import { getProductBySlug } from "@/lib/products";
import { createPublicClient } from "@/src/lib/supabase/public";
import { productToApi, type ProductRow } from "@/src/lib/supabase/data";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Spec = { label: string; value: string };
type Product = {
  _id?: string;
  slug: string;
  title: string;
  tagline?: string;
  category: string;
  image?: string;
  description?: string;
  origin?: string;
  moq?: string;
  packaging?: string;
  lead?: string;
  hs?: string;
  shelfLife?: string;
  applications?: string[];
  specs?: Spec[];
  benefits?: string[];
  related?: string[];
  exportCountries?: string[];
  exportPorts?: string[];
  containerCapacity?: string;
  certifications?: string[];
};

type RouteContext = { params: Promise<{ id: string }> };

const PAGE_SIZE: [number, number] = [595.28, 841.89];
const PAGE_WIDTH = PAGE_SIZE[0];
const PAGE_HEIGHT = PAGE_SIZE[1];
const MARGIN = 42;
const TOP_Y = PAGE_HEIGHT - 116;
const BOTTOM_Y = 72;
const NAVY = rgb(0.03, 0.1, 0.17);
const TEAL = rgb(0.05, 0.46, 0.56);
const GOLD = rgb(0.91, 0.55, 0.05);
const SLATE = rgb(0.28, 0.34, 0.44);
const MUTED = rgb(0.45, 0.52, 0.62);
const LIGHT = rgb(0.95, 0.98, 0.99);
const BORDER = rgb(0.83, 0.88, 0.92);
const WHITE = rgb(1, 1, 1);

function cleanText(value: unknown, fallback = "") {
  return String(value ?? fallback)
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\u2264/g, "<=")
    .replace(/\u2265/g, ">=")
    .replace(/\u00A0/g, " ")
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function filenameFor(slug: string) {
  return `gopu-exports-${slug.replace(/[^a-z0-9-]/gi, "-").toLowerCase()}-specification.pdf`;
}

function asList(value?: string[]) {
  return (value ?? []).map((item) => cleanText(item)).filter(Boolean);
}

function defaultBuyerNotes(product: Product) {
  const category = cleanText(product.category).toLowerCase();
  const productName = cleanText(product.title, "this product");
  const notes = [
    `${productName} enquiries are reviewed with buyer quantity, destination, packing format, and documentation requirements before final quotation.`,
    "Food-grade export packing options, marking, palletization, and container planning can be discussed based on buyer requirements.",
    "Inspection, lab testing, and buyer document review can be coordinated where suitable for the product category and destination market.",
  ];

  if (category.includes("rice") || category.includes("grain") || category.includes("millet") || category.includes("pulse")) {
    notes.push("Bulk vessel, LCL, or FCL shipment assumptions should be confirmed against grade, bag size, and destination-port requirements.");
  } else if (category.includes("fruit") || category.includes("vegetable")) {
    notes.push("Fresh produce handling, cold-chain assumptions, carton size, and transit timing should be confirmed before shipment planning.");
  } else if (category.includes("spice")) {
    notes.push("Aroma, granulation, purity, moisture, and packaging expectations should be confirmed before commercial approval.");
  } else {
    notes.push("Product-specific packing, shelf-life, and handling requirements should be confirmed during procurement discussion.");
  }

  return notes;
}

function wrapText(text: string, maxWidth: number, font: PDFFont, size: number) {
  const words = cleanText(text).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) <= maxWidth) {
      current = next;
      continue;
    }
    if (current) lines.push(current);
    current = word;
  }

  if (current) lines.push(current);
  return lines;
}

function drawTextBlock({
  page,
  text,
  x,
  y,
  maxWidth,
  font,
  size,
  color,
  lineHeight,
}: {
  page: PDFPage;
  text: string;
  x: number;
  y: number;
  maxWidth: number;
  font: PDFFont;
  size: number;
  color: RGB;
  lineHeight: number;
}) {
  let cursor = y;
  for (const line of wrapText(text, maxWidth, font, size)) {
    page.drawText(line, { x, y: cursor, size, font, color });
    cursor -= lineHeight;
  }
  return cursor;
}

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle<ProductRow>();

    if (!error && data) return productToApi(data) as Product;
  } catch (error) {
    console.error("Product PDF Supabase fetch failed", error);
  }

  const fallback = getProductBySlug(slug);
  return fallback ? ({ ...fallback, _id: fallback.slug } as Product) : null;
}

async function embedProductImage(pdf: PDFDocument, imageSrc: string | undefined, origin: string) {
  if (!imageSrc) return null;

  try {
    const imageUrl = imageSrc.startsWith("/") ? `${origin}${imageSrc}` : imageSrc;
    const response = await fetch(imageUrl, {
      headers: { Accept: "image/jpeg,image/png,image/webp,image/avif,*/*" },
      cache: "no-store",
    });
    if (!response.ok) return null;

    const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
    const bytes = new Uint8Array(await response.arrayBuffer());

    try {
      if (contentType.includes("jpeg") || contentType.includes("jpg") || /\.jpe?g($|\?)/i.test(imageUrl)) {
        return await pdf.embedJpg(bytes);
      }
      if (contentType.includes("png") || /\.png($|\?)/i.test(imageUrl)) {
        return await pdf.embedPng(bytes);
      }
    } catch {
      // Some storage objects have a .jpg extension but contain WebP/AVIF bytes.
      // Convert below so dashboard-uploaded product images still render in PDFs.
    }

    const jpeg = await sharp(bytes)
      .rotate()
      .resize({ width: 1200, height: 900, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 84 })
      .toBuffer();
    return await pdf.embedJpg(jpeg);
  } catch (error) {
    console.error("Product PDF image embed failed", { imageSrc, error });
    return null;
  }
}

function addHeader(page: PDFPage, bold: PDFFont, font: PDFFont) {
  page.drawRectangle({ x: 0, y: PAGE_HEIGHT - 92, width: PAGE_WIDTH, height: 92, color: NAVY });
  page.drawText("GOPU EXPORTS", { x: MARGIN, y: PAGE_HEIGHT - 43, size: 22, font: bold, color: WHITE });
  page.drawText("Indian Agricultural Export Sourcing", { x: MARGIN, y: PAGE_HEIGHT - 63, size: 9.5, font, color: rgb(0.78, 0.87, 0.92) });
  page.drawText(`${COMPANY.email} | ${COMPANY.phone} | gopuexports.com`, {
    x: MARGIN,
    y: PAGE_HEIGHT - 80,
    size: 8.5,
    font,
    color: rgb(0.78, 0.87, 0.92),
  });
  page.drawRectangle({ x: PAGE_WIDTH - 185, y: PAGE_HEIGHT - 56, width: 142, height: 2, color: GOLD });
  page.drawText("PRODUCT SPECIFICATION", { x: PAGE_WIDTH - 185, y: PAGE_HEIGHT - 45, size: 8.5, font: bold, color: WHITE });
}

function addFooter(page: PDFPage, font: PDFFont, bold: PDFFont, pageNumber: number, pageCount: number) {
  page.drawLine({ start: { x: MARGIN, y: 44 }, end: { x: PAGE_WIDTH - MARGIN, y: 44 }, thickness: 0.5, color: BORDER });
  page.drawText("GOPU Exports - Buyer review document", { x: MARGIN, y: 28, size: 8, font: bold, color: TEAL });
  page.drawText(`Page ${pageNumber} of ${pageCount}`, { x: PAGE_WIDTH - MARGIN - 58, y: 28, size: 8, font, color: MUTED });
}

function drawSectionTitle(page: PDFPage, y: number, title: string, bold: PDFFont) {
  page.drawText(cleanText(title), { x: MARGIN, y, size: 14.5, font: bold, color: TEAL });
  page.drawRectangle({ x: MARGIN, y: y - 8, width: 62, height: 2, color: GOLD });
  return y - 24;
}

function drawKeyValue(page: PDFPage, font: PDFFont, bold: PDFFont, y: number, label: string, value?: string, width = PAGE_WIDTH - MARGIN * 2) {
  const cleanValue = cleanText(value);
  if (!cleanValue) return y;

  const labelWidth = 145;
  const valueWidth = width - labelWidth;
  const valueLines = wrapText(cleanValue, valueWidth - 18, font, 8.7);
  const rowHeight = Math.max(28, valueLines.length * 11 + 13);

  page.drawRectangle({ x: MARGIN, y: y - rowHeight + 8, width: labelWidth, height: rowHeight, color: LIGHT, borderColor: BORDER, borderWidth: 0.5 });
  page.drawRectangle({ x: MARGIN + labelWidth, y: y - rowHeight + 8, width: valueWidth, height: rowHeight, color: WHITE, borderColor: BORDER, borderWidth: 0.5 });
  page.drawText(cleanText(label), { x: MARGIN + 9, y: y - 8, size: 8.5, font: bold, color: TEAL });

  let textY = y - 8;
  for (const line of valueLines) {
    page.drawText(line, { x: MARGIN + labelWidth + 10, y: textY, size: 8.7, font, color: SLATE });
    textY -= 11;
  }
  return y - rowHeight;
}

function drawImageBox(page: PDFPage, image: PDFImage | null, x: number, y: number, width: number, height: number, font: PDFFont, bold: PDFFont) {
  page.drawRectangle({ x, y, width, height, color: rgb(0.96, 0.98, 0.99), borderColor: BORDER, borderWidth: 0.75 });
  if (!image) {
    page.drawText("Product image", { x: x + 24, y: y + height / 2 + 7, size: 10, font: bold, color: TEAL });
    page.drawText("Available from uploaded catalogue image", { x: x + 24, y: y + height / 2 - 9, size: 8, font, color: MUTED });
    return;
  }

  const scale = Math.min((width - 14) / image.width, (height - 14) / image.height);
  const imageWidth = image.width * scale;
  const imageHeight = image.height * scale;
  page.drawImage(image, {
    x: x + (width - imageWidth) / 2,
    y: y + (height - imageHeight) / 2,
    width: imageWidth,
    height: imageHeight,
  });
}

function drawBullets(page: PDFPage, y: number, items: string[], font: PDFFont, bold: PDFFont, title: string) {
  if (!items.length) return y;
  y = drawSectionTitle(page, y, title, bold);
  for (const item of items) {
    const lines = wrapText(item, PAGE_WIDTH - MARGIN * 2 - 18, font, 9.5);
    page.drawText("-", { x: MARGIN + 4, y, size: 9.5, font: bold, color: TEAL });
    let lineY = y;
    for (const line of lines) {
      page.drawText(line, { x: MARGIN + 18, y: lineY, size: 9.5, font, color: SLATE });
      lineY -= 13;
    }
    y = lineY - 3;
  }
  return y - 10;
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  const { id: slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const image = await embedProductImage(pdf, product.image, req.nextUrl.origin);
  const commercialMoq = formatCommercialMoq(product);
  const productUrl = `${req.nextUrl.origin}/products/${product.slug}`;
  const inquiryUrl = `${req.nextUrl.origin}/contact?product=${encodeURIComponent(product.title)}`;
  const specs = (product.specs ?? []).filter((spec) => cleanText(spec.label) && cleanText(spec.value));

  let page = pdf.addPage(PAGE_SIZE);
  addHeader(page, bold, font);
  let y = TOP_Y;

  const newPage = () => {
    page = pdf.addPage(PAGE_SIZE);
    addHeader(page, bold, font);
    y = TOP_Y;
  };

  const ensureSpace = (height: number) => {
    if (y - height < BOTTOM_Y) newPage();
  };

  page.drawText(`${cleanText(product.title).toUpperCase()} SPECIFICATION`, {
    x: MARGIN,
    y,
    size: 19,
    font: bold,
    color: NAVY,
  });
  y -= 20;
  page.drawText(cleanText(product.category), { x: MARGIN, y, size: 9.5, font: bold, color: TEAL });
  if (product.tagline) {
    page.drawText(cleanText(product.tagline), { x: MARGIN + 112, y, size: 9.5, font, color: MUTED });
  }

  const imageTop = y - 18;
  drawImageBox(page, image, PAGE_WIDTH - MARGIN - 178, imageTop - 126, 178, 126, font, bold);
  y -= 26;
  y = drawTextBlock({
    page,
    text: product.description || `Export specification sheet for ${product.title}.`,
    x: MARGIN,
    y,
    maxWidth: PAGE_WIDTH - MARGIN * 2 - 198,
    font,
    size: 10,
    color: SLATE,
    lineHeight: 14,
  });
  y = Math.min(y, imageTop - 142);

  ensureSpace(255);
  y = drawSectionTitle(page, y, "Product & Commercial Details", bold);
  const detailRows: Array<[string, string | undefined]> = [
    ["Product Name", product.title],
    ["Category", product.category],
    ["HS Code", product.hs || "Available on request / confirmed during quotation"],
    ["Origin", product.origin || "India"],
    ["MOQ", commercialMoq],
    ["Packaging", product.packaging || "Food-grade export packing options reviewed by product and destination"],
    ["Shelf Life", product.shelfLife || "Depends on product category and packing format"],
    ["Lead Time", product.lead || "Confirmed after product, quantity, packing, and destination review"],
    ["Container Loading", product.containerCapacity],
    ["Loading Ports", asList(product.exportPorts).join(", ") || "Confirmed based on route and availability"],
    ["Export Destinations", asList(product.exportCountries).join(", ") || "Reviewed against buyer destination and import requirements"],
  ];
  for (const [label, value] of detailRows) {
    ensureSpace(36);
    y = drawKeyValue(page, font, bold, y, label, value);
  }

  if (specs.length > 0) {
    ensureSpace(70);
    y -= 12;
    y = drawSectionTitle(page, y, "Quality / Product Specifications", bold);
    for (const spec of specs) {
      ensureSpace(40);
      y = drawKeyValue(page, font, bold, y, spec.label, spec.value);
    }
  }

  const applications = asList(product.applications);
  const benefits = asList(product.benefits);
  const buyerNotes = benefits.length ? benefits : defaultBuyerNotes(product);
  const certifications = asList(product.certifications);

  ensureSpace(100);
  y -= 6;
  y = drawBullets(page, y, applications, font, bold, "Applications / Use Cases");
  ensureSpace(100);
  y = drawBullets(page, y, buyerNotes, font, bold, "Buyer Notes / Advantages");

  ensureSpace(150);
  y = drawSectionTitle(page, y, "Documentation & Certification Notes", bold);
  const documentationNotes = [
    certifications.length ? `Referenced certifications / documents: ${certifications.join(", ")}.` : "Available certification references and document copies can be shared with verified buyers on request.",
    "Product specification, packing assumptions, inspection requirements, certificate needs, destination port, and shipment terms should be confirmed before final quote preparation.",
    "NABL lab testing, SGS or third-party inspection coordination can be discussed on request where suitable for buyer and destination requirements.",
  ];
  for (const note of documentationNotes) {
    ensureSpace(36);
    const nextY = drawTextBlock({ page, text: note, x: MARGIN, y, maxWidth: PAGE_WIDTH - MARGIN * 2, font, size: 9.5, color: SLATE, lineHeight: 13 });
    y = nextY - 6;
  }

  ensureSpace(154);
  y = drawSectionTitle(page, y, "Buyer Enquiry", bold);
  page.drawRectangle({ x: MARGIN, y: y - 62, width: PAGE_WIDTH - MARGIN * 2, height: 76, color: LIGHT, borderColor: BORDER, borderWidth: 0.75 });
  page.drawText("For buyer enquiries, quote discussions, or document requests:", { x: MARGIN + 14, y: y - 8, size: 9.5, font: bold, color: TEAL });
  drawTextBlock({
    page,
    text: `${inquiryUrl} | ${COMPANY.email} | ${COMPANY.phone}. Product page: ${productUrl}`,
    x: MARGIN + 14,
    y: y - 25,
    maxWidth: PAGE_WIDTH - MARGIN * 2 - 28,
    font,
    size: 8.8,
    color: SLATE,
    lineHeight: 12,
  });
  y -= 94;

  ensureSpace(138);
  y = drawSectionTitle(page, y, "Company Disclaimer", bold);
  const disclaimer =
    "This specification sheet is prepared for preliminary B2B buyer review only. Product availability, final grade, origin, packaging, MOQ, lead time, pricing, inspection scope, certificate acceptance, and shipment terms are subject to seasonal availability, buyer requirements, destination-country rules, and written quotation or proforma invoice confirmation. Product images are indicative and may vary by crop, lot, grade, packing, and season. GOPU Exports does not guarantee import approval, customs clearance, lab results, freight timelines, or destination certification acceptance unless expressly confirmed in writing by the relevant authority or issuing body.";
  y = drawTextBlock({
    page,
    text: disclaimer,
    x: MARGIN,
    y,
    maxWidth: PAGE_WIDTH - MARGIN * 2,
    font,
    size: 8.4,
    color: MUTED,
    lineHeight: 12,
  });

  const pages = pdf.getPages();
  pages.forEach((pdfPage, index) => addFooter(pdfPage, font, bold, index + 1, pages.length));

  const pdfBytes = await pdf.save();
  const pdfBody = pdfBytes.buffer.slice(pdfBytes.byteOffset, pdfBytes.byteOffset + pdfBytes.byteLength) as ArrayBuffer;

  return new NextResponse(pdfBody, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filenameFor(product.slug)}"`,
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
