/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: false,
    webpackBuildWorker: false,
    outputFileTracingIncludes: {
      '/*': ['./qa-reports/latest-report.md'],
    },
  },
}

export default nextConfig
