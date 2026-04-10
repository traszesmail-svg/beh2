/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
    ],
  },
  experimental: {
    typedRoutes: false,
    webpackBuildWorker: false,
    outputFileTracingIncludes: {
      '/*': ['./qa-reports/latest-report.md'],
    },
  },
}

export default nextConfig
