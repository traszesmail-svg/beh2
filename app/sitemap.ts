import type { MetadataRoute } from 'next'
import { getBaseUrl } from '@/lib/server/env'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl()
  const lastModified = new Date()

  return ['/', '/book', '/polityka-prywatnosci', '/regulamin'].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified,
    changeFrequency: path === '/' || path === '/book' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : path === '/book' ? 0.9 : 0.5,
  }))
}
