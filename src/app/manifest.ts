import type { MetadataRoute } from 'next';
import { site } from '@/content/site';
import { tr } from '@/content/tr';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.name,
    description: 'Cemre Hair & Beauty — Bodrum concept demo',
    start_url: '/',
    display: 'browser',
    background_color: site.themeColor,
    theme_color: site.themeColor,
    lang: 'tr',
    icons: [{ src: '/cemre-icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
