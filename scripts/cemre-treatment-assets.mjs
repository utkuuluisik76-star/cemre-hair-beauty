import sharp from "sharp";
import { copyFile } from "node:fs/promises";
const [name, source] = process.argv.slice(2);
if (!["facial-v1", "hair-care-v1"].includes(name) || !source)
  throw new Error("Pass asset name and image path.");
await copyFile(source, `src/images-src/cemre/${name}.png`);
for (const width of [1280, 1920]) {
  const img = sharp(source).resize(width, Math.round((width * 2) / 3), {
    fit: "cover",
  });
  await img
    .clone()
    .avif({ quality: 61 })
    .toFile(`public/images/cemre/${name}-${width}.avif`);
  await img
    .clone()
    .webp({ quality: 82 })
    .toFile(`public/images/cemre/${name}-${width}.webp`);
}
const meta = await sharp(source).metadata(),
  cropWidth = Math.round((meta.height * 2) / 3),
  left = Math.max(
    0,
    Math.min(
      meta.width - cropWidth,
      Math.round(meta.width * 0.7 - cropWidth / 2),
    ),
  );
await sharp(source)
  .extract({ left, top: 0, width: cropWidth, height: meta.height })
  .resize(960, 1440)
  .avif({ quality: 61 })
  .toFile(`public/images/cemre/${name}-portrait-960.avif`);
