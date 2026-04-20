const INVALID_ENV_SENTINELS = new Set(['undefined', 'null', ''])

for (const envName of ['__NEXT_INCREMENTAL_CACHE_IPC_PORT', '__NEXT_INCREMENTAL_CACHE_IPC_KEY']) {
  const rawValue = process.env[envName]

  if (typeof rawValue === 'string' && INVALID_ENV_SENTINELS.has(rawValue.trim().toLowerCase())) {
    delete process.env[envName]
  }
}

/** @type {import('next').NextConfig} */
const blockSearchIndexing = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV !== 'production'
  : process.env.NODE_ENV !== 'production'

const legacyBlogRedirects = [
  '/blog/jak-przygotowac-sie-do-konsultacji-behawioralnej-online',
  '/blog/prog-pobudzenia-u-psa',
  '/blog/reaktywnosc-na-smyczy-cwiczenie-luznej-smyczy',
  '/blog/jak-nagrac-psa-zostawionego-samemu',
  '/blog/rutyna-wyjscia-oswajanie-psa-z-samotnoscia',
  '/blog/jak-wybrac-kuwete-i-zwirek-dla-kota',
  '/blog/stres-kota-a-zachowania-toaletowe',
  '/blog/jak-wprowadzic-nowego-kota-do-domu',
  '/blog/agresja-przekierowana-u-kota',
  '/blog/pies-cignnie-na-smyczy-od-czego-zaczac',
  '/blog/jak-nauczyc-psa-zostawania-samemu',
  '/blog/jak-ustawic-kuwete-dla-kota',
  '/blog/jak-zapoznac-dwa-koty',
].map((source) => ({
  source,
  destination: '/blog',
  statusCode: 301,
}))

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
    workerThreads: true,
    cpus: 1,
    webpackBuildWorker: false,
    optimizeCss: true,
    outputFileTracingIncludes: {
      '/*': ['./qa-reports/latest-report.md'],
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      ...legacyBlogRedirects,
      {
        source: '/oferta/konsultacja-behawioralna-online',
        destination: '/konsultacja-behawioralna-online',
        statusCode: 301,
      },
      {
        source: '/behawiorysta-olsztyn',
        destination: '/behawiorysta-online-polska',
        statusCode: 301,
      },
      {
        source: '/behawiorysta-psow',
        destination: '/psy',
        statusCode: 301,
      },
      {
        source: '/behawiorysta-kotow',
        destination: '/koty',
        statusCode: 301,
      },
      {
        source: '/oferta/poradniki-pdf',
        destination: '/niezbednik',
        statusCode: 301,
      },
      {
        source: '/oferta/poradniki-pdf/pies_zostaje_sam_i_wpada_w_panike_v2',
        destination: '/oferta/poradniki-pdf/pies-zostaje-sam-plan-pierwszych-krokow',
        statusCode: 301,
      },
      {
        source: '/oferta/poradniki-pdf/pies_szczeka_na_gosci_i_dzwonek_v2',
        destination: '/oferta/poradniki-pdf/pies-boi-sie-gosci-i-dzwiekow',
        statusCode: 301,
      },
      {
        source: '/oferta/poradniki-pdf/dlaczego_pies_glupieje_na_smyczy_v2',
        destination: '/oferta/poradniki-pdf/pies-reaktywny-na-spacerze',
        statusCode: 301,
      },
      {
        source: '/oferta/poradniki-pdf/trudny_spacer_v2',
        destination: '/oferta/poradniki-pdf/pies-reaktywny-na-spacerze',
        statusCode: 301,
      },
      {
        source: '/oferta/poradniki-pdf/czy_twoj_pies_naprawde_potrzebuje_wiecej_ruchu_v2',
        destination: '/oferta/poradniki-pdf/pies-ile-ruchu-potrzebuje',
        statusCode: 301,
      },
      {
        source: '/oferta/poradniki-pdf/szczeniak_gryzie_i_skacze_v2',
        destination: '/oferta/poradniki-pdf/szczeniak-gryzienie-i-skakanie',
        statusCode: 301,
      },
      {
        source: '/oferta/poradniki-pdf/szczeniak_nie_umie_sie_wyciszyc_v2',
        destination: '/oferta/poradniki-pdf/szczeniak-wyciszanie',
        statusCode: 301,
      },
      {
        source: '/oferta/poradniki-pdf/pies_niszczy_w_domu_v2',
        destination: '/oferta/poradniki-pdf/pies-niszczy-w-domu',
        statusCode: 301,
      },
      {
        source: '/oferta/poradniki-pdf/pies_broni_zasobow_v2',
        destination: '/oferta/poradniki-pdf/pies-broni-zasobow',
        statusCode: 301,
      },
      {
        source: '/oferta/poradniki-pdf/pogon_demolka_i_brak_hamulcow_v2',
        destination: '/oferta/poradniki-pdf/pies-impulsy-i-hamulce',
        statusCode: 301,
      },
      {
        source: '/oferta/poradniki-pdf/pies_do_pracy_z_ludzmi_v2',
        destination: '/oferta/poradniki-pdf/pies-do-pracy-z-ludzmi',
        statusCode: 301,
      },
    ]
  },
  async headers() {
    if (!blockSearchIndexing) {
      return []
    }

    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, follow, noarchive',
          },
        ],
      },
    ]
  },
}

export default nextConfig
