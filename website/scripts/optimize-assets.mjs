import { access, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();

function icoFromPng(png, size = 64) {
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

const emblem = await readFile(path.join(root, "public", "logos", "gopu-exports-emblem.png"));
const fullLogo = await readFile(path.join(root, "public", "logos", "gopu-exports-logo-full.png"));

await sharp(emblem).resize(256, 256).png({ quality: 95 }).toFile(path.join(root, "public", "logos", "logo-icon.png"));
await sharp(fullLogo).resize({ width: 900, withoutEnlargement: true }).png({ quality: 95 }).toFile(path.join(root, "public", "logos", "logo.png"));
await sharp(fullLogo).resize(1200, 630, { fit: "contain", background: "#F5F7FA" }).png({ quality: 90 }).toFile(path.join(root, "public", "logos", "og-image.png"));

const icon512 = await sharp(emblem).resize(512, 512).png({ quality: 95 }).toBuffer();
const apple180 = await sharp(emblem).resize(180, 180).png({ quality: 95 }).toBuffer();
const favicon64 = await sharp(emblem).resize(64, 64).png({ quality: 95 }).toBuffer();

for (const dir of ["app", "public"]) {
  await writeFile(path.join(root, dir, "icon.png"), icon512);
  await writeFile(path.join(root, dir, "apple-touch-icon.png"), apple180);
  await writeFile(path.join(root, dir, "favicon.ico"), icoFromPng(favicon64, 64));
}

await writeFile(path.join(root, "public", "favicon.png"), favicon64);

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
  const inputPath = path.join(root, input);
  try {
    await access(inputPath);
  } catch {
    continue;
  }

  const source = await readFile(inputPath);
  await sharp(source)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality, effort: 6 })
    .toFile(path.join(root, output));
}
