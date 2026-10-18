import sharp from "sharp";
import { copyFile } from "node:fs/promises";
const source = process.argv[2];
if (!source) throw new Error("Pass the generated sea image path.");
await copyFile(source, "src/images-src/cemre/bodrum-sea-v1.png");
for (const size of [640, 1280]) {
  const image = sharp(source).resize(size, Math.round(size * 1.5));
  await image
    .clone()
    .avif({ quality: 60 })
    .toFile(`public/images/cemre/bodrum-sea-v1-${size}.avif`);
  await image
    .clone()
    .webp({ quality: 82 })
    .toFile(`public/images/cemre/bodrum-sea-v1-${size}.webp`);
}
