import type { MetadataRoute } from 'next'
import { listBlogRoutePaths } from '@/lib/blog'
import { listLeadMagnetPaths } from '@/lib/growth-layer'
import { listPdfRoutePaths } from '@/lib/pdf-guides'
import { listRealCaseStudyPaths } from '@/lib/real-case-studies'
import { getCanonicalBaseUrl } from '@/lib/server/env'

const STATIC_ROUTES: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }> = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/psy', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/psy/reaktywnosc-na-smyczy', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/psy/lek-separacyjny', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/koty', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/koty/zalatwianie-poza-kuweta', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/koty/konflikt-miedzy-kotami', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/o-mnie', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/cennik', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/book', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/kontakt', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/faq', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/blog', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/newsletter', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/quiz', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/niezbednik', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/behawiorysta-online-polska', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/konsultacja-behawioralna-online', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/opinie', priority: 0.6, changeFrequency: 'monthly' },
]

function buildAbsoluteUrl(baseUrl: string, path: string) {
  return new URL(path, baseUrl).toString()
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getCanonicalBaseUrl()
  const lastModified = new Date()
  const routeMap = new Map<string, MetadataRoute.Sitemap[number]>()

  for (const route of STATIC_ROUTES) {
    routeMap.set(route.path, {
      url: buildAbsoluteUrl(baseUrl, route.path),
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })
  }

  for (const path of listBlogRoutePaths()) {
    routeMap.set(path, {
      url: buildAbsoluteUrl(baseUrl, path),
      lastModified,
      changeFrequency: path === '/blog' ? 'weekly' : 'monthly',
      priority: path === '/blog' ? 0.8 : 0.7,
    })
  }

  for (const path of listPdfRoutePaths()) {
    routeMap.set(path, {
      url: buildAbsoluteUrl(baseUrl, path),
      lastModified,
      changeFrequency: path === '/niezbednik' ? 'weekly' : 'monthly',
      priority: path === '/niezbednik' ? 0.8 : 0.7,
    })
  }

  for (const path of listLeadMagnetPaths()) {
    routeMap.set(path, {
      url: buildAbsoluteUrl(baseUrl, path),
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  }

  for (const path of listRealCaseStudyPaths()) {
    routeMap.set(path, {
      url: buildAbsoluteUrl(baseUrl, path),
      lastModified,
      changeFrequency: 'monthly',
      priority: path === '/historie' ? 0.7 : 0.6,
    })
  }

  return [...routeMap.values()]
}
