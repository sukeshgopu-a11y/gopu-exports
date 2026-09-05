import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const blogDir = path.join(root, "public", "blog");
await mkdir(blogDir, { recursive: true });

const posts = [
  {
    file: "import-indian-spices.webp",
    title: "Indian Spices",
    subtitle: "Bulk Import Guide",
    palette: ["#7F1D1D", "#DC2626", "#F59E0B"],
    motif: "spice",
  },
  {
    file: "rice-export-guide.webp",
    title: "Rice Export",
    subtitle: "Varieties & Packaging",
    palette: ["#12372A", "#7C6A35", "#F5E6B8"],
    motif: "rice",
  },
  {
    file: "apeda-products-guide.webp",
    title: "APEDA Products",
    subtitle: "Buyer Export Guide",
    palette: ["#064E3B", "#0E7490", "#FBBF24"],
    motif: "catalogue",
  },
  {
    file: "spice-board-products.webp",
    title: "Spice Board",
    subtitle: "Importer Reference",
    palette: ["#7C2D12", "#EA580C", "#FACC15"],
    motif: "spice",
  },
  {
    file: "reliable-agri-exporter.webp",
    title: "Reliable Exporter",
    subtitle: "Buyer Checklist",
    palette: ["#082F49", "#0E7490", "#67C9D8"],
    motif: "ship",
  },
  {
    file: "export-packaging-standards.webp",
    title: "Export Packaging",
    subtitle: "Standards & Planning",
    palette: ["#111827", "#0F766E", "#F59E0B"],
    motif: "boxes",
  },
  {
    file: "indian-millets-export.webp",
    title: "Indian Millets",
    subtitle: "Types, Uses & Demand",
    palette: ["#713F12", "#CA8A04", "#FDE68A"],
    motif: "grain",
  },
  {
    file: "fresh-fruits-vegetables.webp",
    title: "Fresh Produce",
    subtitle: "Quality & Shipping",
    palette: ["#14532D", "#16A34A", "#F97316"],
    motif: "produce",
  },
  {
    file: "food-import-documents.webp",
    title: "Import Documents",
    subtitle: "Food Product Checklist",
    palette: ["#1E293B", "#2563EB", "#FBBF24"],
    motif: "documents",
  },
  {
    file: "private-label-spices.webp",
    title: "Private Label",
    subtitle: "Spice Export Opportunities",
    palette: ["#4C1D95", "#BE123C", "#FBBF24"],
    motif: "label",
  },
];

function escapeXml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function motifSvg(type, colors) {
  const [dark, mid, accent] = colors;
  if (type === "rice") {
    return Array.from({ length: 26 }, (_, i) => {
      const x = 640 + (i % 7) * 62;
      const y = 126 + Math.floor(i / 7) * 92;
      const rotate = -24 + (i % 5) * 12;
      return `<ellipse cx="${x}" cy="${y}" rx="13" ry="42" fill="#FFF7D6" opacity="0.92" transform="rotate(${rotate} ${x} ${y})"/>`;
    }).join("");
  }
  if (type === "spice") {
    return Array.from({ length: 18 }, (_, i) => {
      const x = 640 + (i % 6) * 74;
      const y = 120 + Math.floor(i / 6) * 116;
      return `<path d="M${x} ${y}c38 12 59 38 55 74-45-1-76-23-91-65 11-22 24-31 36-9Z" fill="${i % 2 ? mid : accent}" opacity="0.9" transform="rotate(${i * 19} ${x} ${y})"/>`;
    }).join("");
  }
  if (type === "ship") {
    return `<path d="M610 382h430l-55 86H664l-54-86Z" fill="${mid}" opacity=".95"/><path d="M702 256h72v96h-72zM804 214h72v138h-72zM906 180h72v172h-72z" fill="${accent}" opacity=".95"/><path d="M594 506c66-24 122-24 188 0s124 24 190 0" stroke="#67C9D8" stroke-width="16" fill="none" opacity=".75"/>`;
  }
  if (type === "boxes") {
    return Array.from({ length: 9 }, (_, i) => {
      const x = 640 + (i % 3) * 130;
      const y = 190 + Math.floor(i / 3) * 108;
      return `<rect x="${x}" y="${y}" width="104" height="78" rx="8" fill="${i % 2 ? mid : accent}" opacity=".88"/><path d="M${x} ${y + 26}h104" stroke="${dark}" stroke-width="5" opacity=".35"/>`;
    }).join("");
  }
  if (type === "grain") {
    return Array.from({ length: 32 }, (_, i) => {
      const x = 630 + (i % 8) * 55;
      const y = 126 + Math.floor(i / 8) * 84;
      return `<circle cx="${x}" cy="${y}" r="${18 + (i % 3) * 4}" fill="${i % 2 ? accent : mid}" opacity=".88"/>`;
    }).join("");
  }
  if (type === "produce") {
    return Array.from({ length: 15 }, (_, i) => {
      const x = 635 + (i % 5) * 84;
      const y = 130 + Math.floor(i / 5) * 120;
      return `<circle cx="${x}" cy="${y}" r="38" fill="${i % 3 === 0 ? accent : mid}" opacity=".9"/><path d="M${x + 8} ${y - 40}c20-25 42-26 62-10-20 20-41 25-62 10Z" fill="#86EFAC" opacity=".86"/>`;
    }).join("");
  }
  if (type === "documents") {
    return Array.from({ length: 4 }, (_, i) => {
      const x = 650 + i * 92;
      const y = 148 + i * 28;
      return `<rect x="${x}" y="${y}" width="210" height="270" rx="18" fill="#F8FAFC" opacity=".94"/><path d="M${x + 34} ${y + 76}h142M${x + 34} ${y + 120}h118M${x + 34} ${y + 164}h132" stroke="${mid}" stroke-width="10" stroke-linecap="round"/><circle cx="${x + 56}" cy="${y + 216}" r="22" fill="${accent}"/>`;
    }).join("");
  }
  if (type === "label") {
    return `<rect x="642" y="146" width="360" height="360" rx="40" fill="#F8FAFC" opacity=".96"/><rect x="692" y="206" width="260" height="96" rx="18" fill="${mid}" opacity=".95"/><path d="M724 360h196M724 410h154" stroke="${dark}" stroke-width="18" stroke-linecap="round" opacity=".82"/><circle cx="916" cy="456" r="34" fill="${accent}"/>`;
  }
  return `<rect x="650" y="160" width="340" height="320" rx="36" fill="${mid}" opacity=".88"/>`;
}

function makeSvg(post) {
  const [dark, mid, accent] = post.palette;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="675" viewBox="0 0 1200 675" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="675" fill="${dark}"/>
  <circle cx="1090" cy="-90" r="360" fill="${mid}" opacity=".45"/>
  <circle cx="900" cy="690" r="380" fill="${accent}" opacity=".20"/>
  <path d="M0 520C170 470 310 478 452 524C612 576 760 574 1200 500V675H0V520Z" fill="#020617" opacity=".36"/>
  <g opacity=".13">
    ${Array.from({ length: 19 }, (_, i) => `<path d="M${i * 78 - 190} 0L${i * 78 + 210} 675" stroke="#FFFFFF" stroke-width="2"/>`).join("")}
  </g>
  <g>${motifSvg(post.motif, post.palette)}</g>
  <rect x="64" y="76" width="472" height="500" rx="34" fill="#FFFFFF" opacity=".08" stroke="#FFFFFF" stroke-opacity=".16"/>
  <text x="96" y="146" font-family="Arial, sans-serif" font-size="24" font-weight="800" letter-spacing="8" fill="${accent}">GOPU EXPORTS</text>
  <text x="96" y="282" font-family="Arial Black, Arial, sans-serif" font-size="70" font-weight="900" fill="#FFFFFF">${escapeXml(post.title)}</text>
  <text x="96" y="350" font-family="Arial Black, Arial, sans-serif" font-size="46" font-weight="900" fill="#FFFFFF">${escapeXml(post.subtitle)}</text>
  <rect x="96" y="398" width="170" height="8" rx="4" fill="${accent}"/>
  <text x="96" y="486" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="#CBD5E1">Buyer-focused export guidance</text>
  <text x="96" y="528" font-family="Arial, sans-serif" font-size="24" font-weight="700" fill="#94A3B8">India agri commodities, documents, packaging</text>
  <g transform="translate(994 548)">
    <rect width="134" height="54" rx="14" fill="#FFFFFF" opacity=".92"/>
    <text x="18" y="35" font-family="Arial Black, Arial, sans-serif" font-size="22" font-weight="900" fill="#071624">GOPU</text>
  </g>
</svg>`;
}

for (const post of posts) {
  await sharp(Buffer.from(makeSvg(post)))
    .resize(960, 540)
    .webp({ quality: 82, effort: 6 })
    .toFile(path.join(blogDir, post.file));
}

const emblem = await readFile(path.join(root, "public", "logos", "gopu-exports-emblem.png"));
const icon512 = await sharp(emblem).resize(512, 512).png({ quality: 95 }).toBuffer();
const apple180 = await sharp(emblem).resize(180, 180).png({ quality: 95 }).toBuffer();
const favicon32 = await sharp(emblem).resize(32, 32).png({ quality: 95 }).toBuffer();

function icoFromPng(png, size = 32) {
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  header.writeUInt8(size === 256 ? 0 : size, 6);
  header.writeUInt8(size === 256 ? 0 : size, 7);
  header.writeUInt8(0, 8);
  header.writeUInt8(0, 9);
  header.writeUInt16LE(1, 10);
  header.writeUInt16LE(32, 12);
  header.writeUInt32LE(png.length, 14);
  header.writeUInt32LE(22, 18);
  return Buffer.concat([header, png]);
}

for (const dir of ["app", "public"]) {
  await writeFile(path.join(root, dir, "icon.png"), icon512);
  await writeFile(path.join(root, dir, "apple-touch-icon.png"), apple180);
  await writeFile(path.join(root, dir, "favicon.ico"), icoFromPng(favicon32, 32));
}
