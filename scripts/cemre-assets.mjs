import sharp from "sharp";
import { mkdir, copyFile } from "node:fs/promises";
const origin = process.argv[2];
if (!origin)
  throw new Error("Pass the absolute path of the generated contact sheet.");
await mkdir("src/images-src/cemre", { recursive: true });
await mkdir("public/images/cemre", { recursive: true });
await copyFile(origin, "src/images-src/cemre/concept-sheet.png");
const { width, height } = await sharp(origin).metadata();
const panelWidth = Math.floor(width / 3);
for (const [i, name] of ["salon", "before", "after"].entries()) {
  const crop = await sharp(origin)
    .extract({
      left: i * panelWidth + 2,
      top: 0,
      width: panelWidth - 4,
      height,
    })
    .toBuffer();
  for (const size of [640, 1280]) {
    const resized = sharp(crop).resize(size, Math.round(size * 1.5), {
      fit: "cover",
    });
    await resized
      .clone()
      .avif({ quality: 62 })
      .toFile(`public/images/cemre/${name}-${size}.avif`);
    await resized
      .clone()
      .webp({ quality: 83 })
      .toFile(`public/images/cemre/${name}-${size}.webp`);
  }
}
await copyFile(
  "node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2",
  "public/fonts/cemre-serif.woff2",
);
await copyFile(
  "node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-ext-400-normal.woff2",
  "public/fonts/cemre-serif-tr.woff2",
);
console.log("Cemre assets exported.");
