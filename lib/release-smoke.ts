import { BUILD_MARKER_KEY } from '@/lib/build-marker'

export type ReleaseSmokeRule = {
  path: string
  required?: string[]
  forbidden?: string[]
  forbiddenRaw?: string[]
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
  forbiddenRawFound: string[]
  orderFailures: string[]
}

function decodeHtmlEntities(input: string) {
  return input
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
}

export function normalizeReleaseSmokeText(input: string) {
  return decodeHtmlEntities(input).replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim()
}

export function extractVisibleTextFromHtml(html: string) {
  const withoutNoise = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')

  return normalizeReleaseSmokeText(withoutNoise)
}

export function extractBuildMarkerFromHtml(html: string) {
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

function findRawPhraseIndex(text: string, phrase: string): number {
  return text.toLowerCase().indexOf(phrase.toLowerCase())
}

export function buildExpectedMarker(branch: string, commit: string) {
  return `${BUILD_MARKER_KEY}:${branch}:${commit}`
}

export function evaluateReleaseSmokePage(html: string, baseUrl: string, rule: ReleaseSmokeRule): ReleaseSmokeResult {
  const visibleText = extractVisibleTextFromHtml(html)
  const buildMarker = extractBuildMarkerFromHtml(html)
  const missing = (rule.required ?? []).filter((phrase) => findPhraseIndex(visibleText, phrase) === -1)
  const forbiddenFound = (rule.forbidden ?? []).filter((phrase) => findPhraseIndex(visibleText, phrase) > -1)
  const forbiddenRawFound = (rule.forbiddenRaw ?? []).filter((phrase) => findRawPhraseIndex(html, phrase) > -1)
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
    ok: missing.length === 0 && forbiddenFound.length === 0 && forbiddenRawFound.length === 0 && orderFailures.length === 0,
    visibleText,
    buildMarker,
    missing,
    forbiddenFound,
    forbiddenRawFound,
    orderFailures,
  }
}

export function getDefaultReleaseSmokeRules(): ReleaseSmokeRule[] {
  return [
    {
      path: '/',
      required: [
        'Jak mogę Ci pomóc?',
        'Wybierz zwierzę albo odpowiedz na kilka krótkich pytań',
        'Mam psa',
        'Mam kota',
        'Nie wiem, od czego zacząć',
        'Jak wygląda nasza współpraca?',
        'Najczesciej zadawane pytania',
      ],
      requireBuildMarker: true,
    },
    {
      path: '/oferta',
      required: [
        'Wybierz start dla swojej sytuacji.',
        'Trzy glowne uslugi i jedna logika wyboru.',
        'Aktywna oferta',
        'Jedna zasada wyboru przed rezerwacja.',
        'Kwadrans z behawiorysta to najprostszy start. Dwa kwadranse porzadkuja temat szerzej, a Pelna konsultacja daje diagnoze i wsparcie wdrozenia.',
      ],
      requireBuildMarker: true,
    },
    {
      path: '/niezbednik',
      required: [
        'Praktyczne materiały, które naprawdę pomagają.',
        'Bezpłatne materiały',
        'Nie wiesz, co wybrać?',
        'Gotowe zestawy tematyczne',
        'Nowe materiały prosto na Twoją skrzynkę',
      ],
      requireBuildMarker: true,
    },
    {
      path: '/behawiorysta-online-polska',
      required: [
        'Behawiorysta online dla opiekunow psow i kotow',
        '3 wejscia online',
        'Wybierz wejscie, ktore pasuje do Twojej sytuacji.',
        'Jedna logika wyboru przed rezerwacja.',
        'Najczestsze pytania przed pierwszym ruchem.',
      ],
      requireBuildMarker: true,
    },
    {
      path: '/termin?problem=szczeniak',
      required: ['Wybierz termin', 'Szczeniak / mlody pies'],
      requireBuildMarker: true,
    },
    {
      path: '/polityka-prywatnosci',
      required: ['Polityka prywatnosci', 'Kontakt w sprawach danych osobowych'],
      requireBuildMarker: true,
    },
  ]
}
