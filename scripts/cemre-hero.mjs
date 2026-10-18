// Optimise the approved fictional salon hero without replacing previous sources.
import sharp from "sharp";
import { copyFile } from "node:fs/promises";
const source = process.argv[2];
if (!source) throw new Error("Pass the generated salon image path.");
await copyFile(source, "src/images-src/cemre/hero-salon-v2.png");
for (const size of [640, 1280]) {
  const image = sharp(source).resize(size, Math.round(size * 1.5));
  await image
    .clone()
    .avif({ quality: 62 })
    .toFile(`public/images/cemre/hero-salon-v2-${size}.avif`);
  await image
    .clone()
    .webp({ quality: 83 })
    .toFile(`public/images/cemre/hero-salon-v2-${size}.webp`);
}
