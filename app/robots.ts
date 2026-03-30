import type { MetadataRoute } from 'next'
import { getBaseUrl } from '@/lib/server/env'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl()

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/__internal/', '/qa-share-20260328-v7n3m8'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
