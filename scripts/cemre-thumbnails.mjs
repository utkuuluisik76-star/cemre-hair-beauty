// Small website thumbnails reuse the existing labelled concept images.
import sharp from 'sharp';
for (const name of ['before', 'after']) {
  await sharp(`public/images/cemre/${name}-640.webp`).resize(160,240).webp({quality:78}).toFile(`public/images/cemre/${name}-160.webp`);
}
