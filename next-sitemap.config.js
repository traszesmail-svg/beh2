/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://regulskibehawiorysta.pl',
  generateRobotsTxt: false,
  additionalPaths: async () => [
    {
      loc: '/book',
      changefreq: 'weekly',
      priority: 0.9,
      lastmod: new Date().toISOString(),
    },
    {
      loc: '/kontakt',
      changefreq: 'monthly',
      priority: 0.8,
      lastmod: new Date().toISOString(),
    },
  ],
  exclude: [
    '/api/*',
    '/admin',
    '/admin/*',
    '/__internal/*',
    '/qa-share-20260328-v7n3m8',
    '/call/*',
    '/room/*',
    '/pokoj',
    '/problem',
    '/materialy',
    '/przybornik',
  ],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: '/api/' },
    ],
  },
}
