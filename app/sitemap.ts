import type { MetadataRoute } from 'next'
import { listPdfRoutePaths } from '@/lib/pdf-guides'
import { getBaseUrl } from '@/lib/server/env'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl()
  const lastModified = new Date()
  const paths = [
    '/',
    '/oferta',
    '/oferta/szybka-konsultacja-15-min',
    '/oferta/konsultacja-30-min',
    '/oferta/konsultacja-behawioralna-online',
    '/oferta/konsultacja-domowa-wyjazdowa',
    '/oferta/indywidualna-terapia-behawioralna',
    '/oferta/pobyty-socjalizacyjno-terapeutyczne',
    ...listPdfRoutePaths(),
    '/koty',
    '/kontakt',
    '/book',
    '/polityka-prywatnosci',
    '/regulamin',
  ]

  return paths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified,
    changeFrequency:
      path === '/' || path === '/oferta' || path === '/book'
        ? 'weekly'
        : path === '/koty' || path === '/kontakt'
          ? 'monthly'
          : 'monthly',
    priority:
      path === '/'
        ? 1
        : path === '/oferta'
          ? 0.9
          : path === '/book'
            ? 0.85
            : path === '/koty'
              ? 0.8
              : 0.6,
  }))
}
