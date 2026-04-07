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
        'Regulski | Terapia behawioralna',
        'Masz psa, kota albo temat mieszany? Zacznij od prostego wyboru.',
        'Prowadzę konsultacje osobiście',
        '3 r\u00f3wne wej\u015bcia',
        'Historie opiekun\u00f3w i efekty konsultacji',
        'Publiczne źr\u00f3dła',
        'Magazyn Weterynaryjny',
        'Zobacz pełną sekcję opinii',
        'Mam psa',
        'Mam kota',
        'Nie wiem, od czego zacz\u0105\u0107',
      ],
      forbidden: [
        'Udost\u0119pnij znajomemu',
        'Social media',
        'Wersja serwisu',
      ],
      ordered: [
        'Regulski | Terapia behawioralna',
        'Masz psa, kota albo temat mieszany? Zacznij od prostego wyboru.',
        '3 r\u00f3wne wej\u015bcia',
      ],
      requireBuildMarker: true,
    },
    {
      path: '/opinie',
      required: [
        'Historie opiekun\u00f3w i efekty konsultacji',
        'Publiczne źr\u00f3dła',
        'Zweryfikowane opinie pojawią się po ręcznej akceptacji',
        'Dodaj swoją opinię do ręcznej weryfikacji',
      ],
      forbidden: ['Udost\u0119pnij znajomemu', 'Wersja serwisu'],
      requireBuildMarker: true,
    },
    {
      path: '/book',
      required: [
        'Etap rezerwacji: wybór tematu',
        'Wybierz temat dla:',
        'Temat mieszany?',
        'Wybierz temat mieszany',
      ],
      forbidden: [
        'Cena konsultacji',
        'Podeślij tę stronę komuś, kto też potrzebuje szybkiego wsparcia dla pupila',
        'Kot i trudne zachowania',
      ],
      requireBuildMarker: true,
    },
    {
      path: '/koty',
      required: [
        'Wybierz temat dla kota i od razu przejdź do terminu.',
        'Kot i kuweta',
        'Konflikt miedzy kotami',
        'Dotyk, gryzienie i pielegnacja',
        'Kot lekowy, napiety albo wycofany',
        'Budzi dom po nocy / nocna wokalizacja',
      ],
      forbidden: ['Masz problem z kotem? Wybierz start.'],
      requireBuildMarker: true,
    },
    {
      path: '/slot?problem=szczeniak',
      required: [
        'Etap rezerwacji: wyb\u00f3r terminu',
        'Wybierz termin: Szczeniak i m\u0142ody pies',
      ],
      forbidden: ['Krok 2 z 6'],
      requireBuildMarker: true,
    },
    {
      path: '/form?problem=szczeniak&slotId=2026-03-24-11%3A20',
      required: [
        'Etap rezerwacji: dane do konsultacji',
        'Uzupełnij dane do rezerwacji',
        'To finalna kwota dla tej usługi przed przejściem do wpłaty ręcznej.',
      ],
      forbidden: ['Krok 3 z 6'],
      requireBuildMarker: true,
    },
    {
      path: '/regulamin',
      required: [
        'Zasady rezerwacji szybkiej konsultacji 15 min',
        'Napisz wiadomo\u015b\u0107',
        'Publiczny profil CAPBT / COAPE',
      ],
      forbidden: ['Koty', 'Pobyty', 'Telefon', 'Um\u00f3w konsultacj\u0119'],
      forbiddenRaw: ['tel:'],
      requireBuildMarker: true,
    },
    {
      path: '/polityka-prywatnosci',
      required: [
        'Jak przetwarzane s\u0105 dane w marce Regulski | Terapia behawioralna',
        'Napisz wiadomo\u015b\u0107',
        'Publiczny profil CAPBT / COAPE',
      ],
      forbidden: ['Koty', 'Pobyty', 'Telefon', 'Um\u00f3w konsultacj\u0119'],
      forbiddenRaw: ['tel:'],
      requireBuildMarker: true,
    },
  ]
}
