// handoff-6/app/robots.ts
// Next.js App Router robots.txt generator
// Lokalizacja: app/robots.ts (root)
// Auto-publikowane jako /robots.txt

import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/seo.config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/private/',
          '/*.json$',
        ],
      },
      {
        userAgent: 'GPTBot',
        disallow: '/',  // Opcjonalnie — blokuje OpenAI scraping
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
