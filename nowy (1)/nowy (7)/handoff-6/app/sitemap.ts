// handoff-6/app/sitemap.ts
// Next.js App Router native sitemap generator
// Lokalizacja: app/sitemap.ts (root)
// Auto-publikowane jako /sitemap.xml

import type { MetadataRoute } from 'next';
import { SITE, pageSeo } from '@/lib/seo.config';

export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date();

  return Object.entries(pageSeo)
    .filter(([_, cfg]) => !cfg.noindex)
    .map(([path, cfg]) => ({
      url: `${SITE.url}${path === '/' ? '' : path}`,
      lastModified: today,
      changeFrequency: cfg.changefreq ?? 'monthly',
      priority: cfg.priority ?? 0.5,
    }));
}

/*
Dla dynamicznych stron (np. blog) — rozszerz:

import { getAllBlogPosts } from '@/lib/blog';

export default async function sitemap() {
  const staticPages = Object.entries(pageSeo).map(...);

  const posts = await getAllBlogPosts();
  const blogPages = posts.map(post => ({
    url: `${SITE.url}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticPages, ...blogPages];
}
*/
