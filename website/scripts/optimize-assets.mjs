import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();

const logoSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="880" height="288" viewBox="0 0 880 288" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="880" height="288" fill="none"/>
  <g transform="translate(24 24)">
    <rect x="0" y="0" width="240" height="240" rx="54" fill="#071624"/>
    <path d="M56 136c0-49 37-86 88-86 27 0 49 9 65 25l-31 31c-9-9-20-14-34-14-25 0-42 18-42 44 0 27 18 45 44 45 11 0 21-2 29-7v-25h-39v-37h83v96c-20 17-47 26-77 26-51 0-86-36-86-88Z" fill="#FFFFFF"/>
    <path d="M50 197c50-5 92-29 126-72 20-25 42-41 70-47-35 35-51 78-54 125-44 8-92 7-142-6Z" fill="#67C9D8"/>
    <path d="M53 202c42 15 91 17 145 6-35 21-78 28-127 21-10-2-17-12-18-27Z" fill="#0E7490"/>
  </g>
  <g transform="translate(306 70)">
    <text x="0" y="84" font-family="Arial Black, Arial, sans-serif" font-size="84" font-weight="900" letter-spacing="-2" fill="#071624">GOPU</text>
    <text x="4" y="136" font-family="Arial, sans-serif" font-size="28" font-weight="800" letter-spacing="13" fill="#0E7490">EXPORTS</text>
    <rect x="4" y="154" width="396" height="5" rx="2.5" fill="#67C9D8"/>
    <text x="4" y="198" font-family="Arial, sans-serif" font-size="24" font-weight="700" fill="#334155">Indian Agri Commodities for Global Buyers</text>
  </g>
</svg>`;

const markSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="112" fill="#071624"/>
  <path d="M118 288c0-104 79-184 188-184 57 0 104 20 138 54l-66 66c-19-19-42-30-72-30-54 0-91 38-91 94 0 58 39 96 94 96 24 0 45-5 62-15v-52h-83v-80h177v204c-42 36-100 56-164 56-109 0-183-77-183-189Z" fill="#FFFFFF"/>
  <path d="M106 418c107-11 197-62 269-153 43-54 90-88 149-101-74 74-109 166-116 265-94 17-196 15-302-11Z" fill="#67C9D8"/>
  <path d="M112 428c90 31 194 36 309 13-75 44-167 60-271 44-22-4-36-25-38-57Z" fill="#0E7490"/>
</svg>`;

async function ensureDir(...parts) {
  await mkdir(path.join(root, ...parts), { recursive: true });
}

function icoFromPng(png) {
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  header.writeUInt8(32, 6);
  header.writeUInt8(32, 7);
  header.writeUInt8(0, 8);
  header.writeUInt8(0, 9);
  header.writeUInt16LE(1, 10);
  header.writeUInt16LE(32, 12);
  header.writeUInt32LE(png.length, 14);
  header.writeUInt32LE(22, 18);
  return Buffer.concat([header, png]);
}

await ensureDir("public", "logos");

await writeFile(path.join(root, "public", "logos", "gopu-exports-logo.svg"), logoSvg);
await writeFile(path.join(root, "public", "logos", "gopu-mark.svg"), markSvg);

await sharp(Buffer.from(logoSvg)).resize(640, 210).png({ quality: 95 }).toFile(path.join(root, "public", "logos", "logo.png"));
await sharp(Buffer.from(markSvg)).resize(512, 512).png({ quality: 95 }).toFile(path.join(root, "public", "logos", "logo-icon.png"));
await sharp(Buffer.from(markSvg)).resize(1200, 630, { fit: "contain", background: "#F5F7FA" }).png({ quality: 90 }).toFile(path.join(root, "public", "logos", "og-image.png"));

const icon512 = await sharp(Buffer.from(markSvg)).resize(512, 512).png({ quality: 95 }).toBuffer();
const apple180 = await sharp(Buffer.from(markSvg)).resize(180, 180).png({ quality: 95 }).toBuffer();
const favicon32 = await sharp(Buffer.from(markSvg)).resize(32, 32).png({ quality: 95 }).toBuffer();
await writeFile(path.join(root, "app", "icon.png"), icon512);
await writeFile(path.join(root, "app", "apple-touch-icon.png"), apple180);
await writeFile(path.join(root, "app", "favicon.ico"), icoFromPng(favicon32));

const conversions = [
  ["public/images/hero-bg.jpg", "public/images/hero-bg.webp", 1920, 74],
  ["public/images/hero-export.jpg", "public/images/hero-export.webp", 1600, 74],
  ["public/images/cta-ship.jpg", "public/images/cta-ship.webp", 1600, 74],
  ["public/images/world-map.png", "public/images/world-map.webp", 1400, 78],
  ["public/products/red-chilli.jpg", "public/products/red-chilli.webp", 900, 76],
  ["public/products/turmeric.jpg", "public/products/turmeric.webp", 900, 76],
  ["public/products/rice.jpg", "public/products/rice.webp", 900, 76],
];

for (const [input, output, width, quality] of conversions) {
  const source = await readFile(path.join(root, input));
  await sharp(source)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality, effort: 6 })
    .toFile(path.join(root, output));
}
