import { BUILD_MARKER_KEY } from '@/lib/build-marker'

export type ReleaseSmokeRule = {
  path: string
  required?: string[]
  forbidden?: string[]
  ordered?: string[]
  requireBuildMarker?: boolean
}

export type ReleaseSmokeResult = {
  rule: ReleaseSmokeRule
  url: string
  ok: boolean
  visibleText: string
  buildMarker: string | null
  missing: string[]
  forbiddenFound: string[]
  orderFailures: string[]
}

function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
}

export function normalizeReleaseSmokeText(input: string): string {
  return decodeHtmlEntities(input).replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim()
}

export function extractVisibleTextFromHtml(html: string): string {
  const withoutNoise = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')

  return normalizeReleaseSmokeText(withoutNoise)
}

export function extractBuildMarkerFromHtml(html: string): string | null {
  const doubleQuoted = html.match(/data-build-marker="([^"]+)"/i)
  if (doubleQuoted?.[1]) {
    return doubleQuoted[1]
  }

  const singleQuoted = html.match(/data-build-marker='([^']+)'/i)
  return singleQuoted?.[1] ?? null
}

function findPhraseIndex(text: string, phrase: string): number {
  return normalizeReleaseSmokeText(text).indexOf(normalizeReleaseSmokeText(phrase))
}

export function buildExpectedMarker(branch: string, commit: string) {
  return `${BUILD_MARKER_KEY}:${branch}:${commit}`
}

export function evaluateReleaseSmokePage(html: string, baseUrl: string, rule: ReleaseSmokeRule): ReleaseSmokeResult {
  const visibleText = extractVisibleTextFromHtml(html)
  const buildMarker = extractBuildMarkerFromHtml(html)
  const missing = (rule.required ?? []).filter((phrase) => findPhraseIndex(visibleText, phrase) === -1)
  const forbiddenFound = (rule.forbidden ?? []).filter((phrase) => findPhraseIndex(visibleText, phrase) > -1)
  const orderFailures: string[] = []

  let lastIndex = -1
  for (const phrase of rule.ordered ?? []) {
    const currentIndex = findPhraseIndex(visibleText, phrase)

    if (currentIndex === -1) {
      orderFailures.push(`missing ordered phrase: ${phrase}`)
      continue
    }

    if (currentIndex < lastIndex) {
      orderFailures.push(`wrong order around: ${phrase}`)
    }

    lastIndex = currentIndex
  }

  if (rule.requireBuildMarker && !buildMarker) {
    missing.push('data-build-marker')
  }

  return {
    rule,
    url: new URL(rule.path, baseUrl).toString(),
    ok: missing.length === 0 && forbiddenFound.length === 0 && orderFailures.length === 0,
    visibleText,
    buildMarker,
    missing,
    forbiddenFound,
    orderFailures,
  }
}

export function getDefaultReleaseSmokeRules(): ReleaseSmokeRule[] {
  return [
    {
      path: '/',
      required: [
        'Spokojna konsultacja, która porządkuje problem psa lub kota w 15 minut',
        'Aktualna cena i płatność',
        'Kwotę potwierdzisz po wyborze tematu konsultacji',
        'Wersja serwisu',
      ],
      ordered: [
        'Opinie i realne przypadki',
        'Publikacje / Media',
        'FAQ',
        'Pierwszy krok',
        'Udostępnij znajomemu, który ma problem z pupilem',
        'Dogoterapia',
        'Social media',
      ],
      requireBuildMarker: true,
    },
    {
      path: '/book',
      required: [
        'Aktualna cena i płatność',
        'Etap rezerwacji: wybór tematu',
      ],
      forbidden: [
        'Cena konsultacji',
        '69 zł',
        'Podeślij tę stronę komuś, kto też potrzebuje szybkiego wsparcia dla pupila',
      ],
      requireBuildMarker: true,
    },
    {
      path: '/slot?problem=szczeniak',
      required: [
        'Etap rezerwacji: wybór terminu',
        'Wybierz termin rozmowy: Szczeniak i młody pies',
      ],
      forbidden: ['Krok 2 z 6'],
      requireBuildMarker: true,
    },
    {
      path: '/form?problem=szczeniak&slotId=2026-03-24-11%3A20',
      required: [
        'Etap rezerwacji: dane do konsultacji',
        'Kwotę potwierdzisz na ekranie płatności po zapisaniu rezerwacji i zablokowaniu terminu.',
      ],
      forbidden: ['Krok 3 z 6'],
      requireBuildMarker: true,
    },
  ]
}
