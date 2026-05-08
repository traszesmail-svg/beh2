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

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
    ],
  },
  experimental: {
    typedRoutes: false,
    workerThreads: false,
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
      {
        source: '/przybornik',
        destination: '/niezbednik',
        statusCode: 301,
      },
      {
        source: '/jak-sie-przygotowac',
        destination: '/book',
        statusCode: 301,
      },
      {
        source: '/metodyka',
        destination: '/o-mnie',
        statusCode: 301,
      },
      {
        source: '/blog/prog-pobudzenia-u-psa',
        destination: '/blog/dlaczego-moj-pies-szczeka-na-inne-psy',
        statusCode: 301,
      },
      {
        source: '/blog/pies-cignnie-na-smyczy',
        destination: '/blog/pies-ciagnie-na-smyczy',
        statusCode: 301,
      },
      {
        source: '/blog/pies-cignnie-na-smyczy-od-czego-zaczac',
        destination: '/blog/pies-ciagnie-na-smyczy-od-czego-zaczac',
        statusCode: 301,
      },
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
        destination: '/materialy',
        statusCode: 301,
      },
      {
        source: '/oferta/poradniki-pdf/pies_zostaje_sam_i_wpada_w_panike_v2',
        destination: '/materialy/pies-sam-w-domu',
        statusCode: 301,
      },
      {
        source: '/oferta/poradniki-pdf/pies_szczeka_na_gosci_i_dzwonek_v2',
        destination: '/materialy',
        statusCode: 301,
      },
      {
        source: '/oferta/poradniki-pdf/dlaczego_pies_glupieje_na_smyczy_v2',
        destination: '/materialy/pies-ile-ruchu-potrzebuje',
        statusCode: 301,
      },
      {
        source: '/oferta/poradniki-pdf/trudny_spacer_v2',
        destination: '/materialy/pies-ile-ruchu-potrzebuje',
        statusCode: 301,
      },
      {
        source: '/oferta/poradniki-pdf/czy_twoj_pies_naprawde_potrzebuje_wiecej_ruchu_v2',
        destination: '/materialy/pies-ile-ruchu-potrzebuje',
        statusCode: 301,
      },
      {
        source: '/oferta/poradniki-pdf/szczeniak_gryzie_i_skacze_v2',
        destination: '/materialy',
        statusCode: 301,
      },
      {
        source: '/oferta/poradniki-pdf/szczeniak_nie_umie_sie_wyciszyc_v2',
        destination: '/materialy',
        statusCode: 301,
      },
      {
        source: '/oferta/poradniki-pdf/pies_niszczy_w_domu_v2',
        destination: '/materialy/pies-sam-w-domu',
        statusCode: 301,
      },
      {
        source: '/oferta/poradniki-pdf/pies_broni_zasobow_v2',
        destination: '/materialy',
        statusCode: 301,
      },
      {
        source: '/oferta/poradniki-pdf/pogon_demolka_i_brak_hamulcow_v2',
        destination: '/materialy',
        statusCode: 301,
      },
      {
        source: '/oferta/poradniki-pdf/pies_do_pracy_z_ludzmi_v2',
        destination: '/materialy',
        statusCode: 301,
      },
      {
        source: '/oferta/poradniki-pdf/szczeniak-pierwsze-30-dni',
        destination: '/materialy',
        statusCode: 301,
      },
      {
        source: '/oferta/poradniki-pdf/kot-stres-srodowisko-i-bledy-opiekuna',
        destination: '/materialy/kot-zyje-w-napieciu',
        statusCode: 301,
      },
      {
        source: '/oferta/poradniki-pdf/pakiety/pakiet-kota-domowego',
        destination: '/materialy',
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
