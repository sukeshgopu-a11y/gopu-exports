import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage, type RGB } from "pdf-lib";
import { COMPANY } from "@/lib/company";
import { formatCommercialMoq } from "@/lib/moq";
import { getProductBySlug } from "@/lib/products";
import { createPublicClient } from "@/src/lib/supabase/public";
import { productToApi, type ProductRow } from "@/src/lib/supabase/data";

export const dynamic = "force-dynamic";

type Spec = { label: string; value: string };
type Product = {
  _id?: string;
  slug: string;
  title: string;
  category: string;
  description?: string;
  origin?: string;
  moq?: string;
  packaging?: string;
  lead?: string;
  hs?: string;
  shelfLife?: string;
  specs?: Spec[];
};

type RouteContext = { params: Promise<{ id: string }> };

const PAGE_SIZE: [number, number] = [595.28, 841.89];
const MARGIN = 48;
const NAVY = rgb(0.03, 0.1, 0.17);
const TEAL = rgb(0.05, 0.46, 0.56);
const GOLD = rgb(0.91, 0.55, 0.05);
const SLATE = rgb(0.28, 0.34, 0.44);
const LIGHT = rgb(0.95, 0.98, 0.99);
const BORDER = rgb(0.83, 0.88, 0.92);

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

function drawKeyValue(page: PDFPage, font: PDFFont, bold: PDFFont, y: number, label: string, value?: string) {
  if (!value) return y;
  page.drawRectangle({ x: MARGIN, y: y - 19, width: 160, height: 28, color: LIGHT, borderColor: BORDER, borderWidth: 0.5 });
  page.drawRectangle({ x: MARGIN + 160, y: y - 19, width: 339, height: 28, color: rgb(1, 1, 1), borderColor: BORDER, borderWidth: 0.5 });
  page.drawText(cleanText(label), { x: MARGIN + 10, y: y - 8, size: 9, font: bold, color: TEAL });
  drawTextBlock({
    page,
    text: cleanText(value),
    x: MARGIN + 174,
    y: y - 8,
    maxWidth: 315,
    font,
    size: 9,
    color: SLATE,
    lineHeight: 11,
  });
  return y - 28;
}

function addHeader(page: PDFPage, bold: PDFFont, font: PDFFont) {
  page.drawRectangle({ x: 0, y: PAGE_SIZE[1] - 118, width: PAGE_SIZE[0], height: 118, color: NAVY });
  page.drawText("GOPU EXPORTS", { x: MARGIN, y: PAGE_SIZE[1] - 56, size: 24, font: bold, color: rgb(1, 1, 1) });
  page.drawText("Indian Agricultural Export Sourcing", { x: MARGIN, y: PAGE_SIZE[1] - 78, size: 10, font, color: rgb(0.78, 0.87, 0.92) });
  page.drawText(`${COMPANY.email} | ${COMPANY.phone} | gopuexports.com`, {
    x: MARGIN,
    y: PAGE_SIZE[1] - 98,
    size: 9,
    font,
    color: rgb(0.78, 0.87, 0.92),
  });
  page.drawRectangle({ x: PAGE_SIZE[0] - 188, y: PAGE_SIZE[1] - 80, width: 140, height: 2, color: GOLD });
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  const { id: slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const pdf = await PDFDocument.create();
  const page = pdf.addPage(PAGE_SIZE);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const commercialMoq = formatCommercialMoq(product);
  const productUrl = `${req.nextUrl.origin}/products/${product.slug}`;
  const inquiryUrl = `${req.nextUrl.origin}/contact?product=${encodeURIComponent(product.title)}`;

  addHeader(page, bold, font);

  let y = PAGE_SIZE[1] - 158;
  page.drawText(`${cleanText(product.title).toUpperCase()} SPECIFICATION`, {
    x: MARGIN,
    y,
    size: 21,
    font: bold,
    color: NAVY,
  });

  y -= 28;
  y = drawTextBlock({
    page,
    text: product.description || `Export specification sheet for ${product.title}.`,
    x: MARGIN,
    y,
    maxWidth: 499,
    font,
    size: 10.5,
    color: SLATE,
    lineHeight: 15,
  }) - 16;

  page.drawText("Product Details", { x: MARGIN, y, size: 15, font: bold, color: TEAL });
  y -= 18;
  y = drawKeyValue(page, font, bold, y, "Product Name", product.title);
  y = drawKeyValue(page, font, bold, y, "Category", product.category);
  y = drawKeyValue(page, font, bold, y, "HS Code", product.hs || "Available on request");
  y = drawKeyValue(page, font, bold, y, "Origin", product.origin || "India");
  y = drawKeyValue(page, font, bold, y, "MOQ", commercialMoq);
  y = drawKeyValue(page, font, bold, y, "Packaging", product.packaging || "Food-grade export packing options reviewed by product and destination");
  y = drawKeyValue(page, font, bold, y, "Shelf Life", product.shelfLife || "Depends on product category and packing format");
  y = drawKeyValue(page, font, bold, y, "Lead Time", product.lead || "Confirmed after product, quantity, packing, and destination review");

  const specs = product.specs ?? [];
  if (specs.length > 0) {
    y -= 18;
    page.drawText("Specifications", { x: MARGIN, y, size: 15, font: bold, color: TEAL });
    y -= 18;
    for (const spec of specs.slice(0, 12)) {
      if (y < 112) break;
      y = drawKeyValue(page, font, bold, y, spec.label, spec.value);
    }
  }

  page.drawRectangle({ x: MARGIN, y: 54, width: 499, height: 42, color: LIGHT, borderColor: BORDER, borderWidth: 0.5 });
  page.drawText("Buyer Enquiry CTA", { x: MARGIN + 14, y: 78, size: 10, font: bold, color: TEAL });
  drawTextBlock({
    page,
    text: `For buyer enquiries, submit requirements at ${inquiryUrl} or email ${COMPANY.email}. Product page: ${productUrl}`,
    x: MARGIN + 14,
    y: 64,
    maxWidth: 470,
    font,
    size: 8.5,
    color: SLATE,
    lineHeight: 11,
  });

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
