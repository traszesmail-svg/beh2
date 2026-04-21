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
        'Behawiorysta psów i kotów online. Zacznij od spokojnej rozmowy.',
        'Wybierz stronę dla psa albo kota',
        'Zacznij od Kwadransu z behawiorystą',
        'Co opiekunowie mówią o konsultacjach',
        'Najczęstsze pytania przed pierwszym kontaktem',
      ],
      requireBuildMarker: true,
    },
    {
      path: '/oferta',
      required: [
        'Najprostszy start to Kwadrans z behawiorystą.',
        'Konsultacja 60 min zostaje szerszą opcją',
        'Trzy czytelne sposoby rozpoczęcia',
        'Kwadrans czy 60 minut',
      ],
      requireBuildMarker: true,
    },
    {
      path: '/niezbednik',
      required: [
        'Niezbednik do spokojnej pracy z psem lub kotem',
        'Najpierw wybierz problem, dopiero potem format',
        'Wybrane ksiazki, ktore realnie sa na Amazon.pl',
        'Przybory, ktore moga wspierac plan pracy',
        'Najczestsze pytania przed wyborem rekomendacji albo rozmowy',
      ],
      requireBuildMarker: true,
    },
    {
      path: '/opinie',
      required: [
        'Co opiekunowie mówią o konsultacjach',
        'Nie same cytaty, tylko krótki obraz sytuacji, etapu współpracy i pierwszego efektu',
        'Przy kartach zostają też typ problemu, format kontaktu, etap współpracy i przybliżony czas pierwszych zmian.',
        'Krótki kontekst problemu, pierwszy ruch i kierunek dalszej pracy',
        'Źródło kontekstu i pierwszy efekt',
        'Co najczęściej daje pierwsza rozmowa',
        'Jeśli widzisz w tych głosach coś bliskiego swojej sytuacji, zrób pierwszy spokojny krok',
      ],
      requireBuildMarker: true,
    },
    {
      path: '/faq',
      required: [
        'Najczęstsze pytania przed kontaktem',
        'Przejdź do pytań z Twojego obszaru',
        'Jeśli nie widzisz tu swojego pytania, napisz wiadomość',
        'Jeśli chcesz uporządkować sytuację, odezwij się',
      ],
      requireBuildMarker: true,
    },
    {
      path: '/kontakt',
      required: [
        'Skontaktuj się, jeśli chcesz krótko opisać temat albo zadać pytanie.',
        'Kwadrans, konsultacja 60 min albo krótka wiadomość',
        'Najważniejsze informacje o kontakcie',
        'Najczęstsze pytania przed kontaktem',
      ],
      requireBuildMarker: true,
    },
    {
      path: '/behawiorysta-online-polska',
      required: [
        'Behawiorysta psow i kotow online',
        'Wybierz wlasciwa sciezke wejscia',
        'Najprostszy start to Kwadrans z behawiorysta',
        'Najczestsze pytania przed rezerwacja',
        'Przejdz dalej tam, gdzie to ma sens',
      ],
      requireBuildMarker: true,
    },
    {
      path: '/o-mnie',
      required: [
        'Krzysztof Regulski - behawiorysta psów i kotów',
        'To, co warto wiedzieć przed pierwszą rozmową',
        'Jak prowadzę konsultację, żeby była spokojna i konkretna',
        'Co opiekunowie cenią w moim sposobie pracy',
        'Najczęstsze pytania o współpracę i sposób pracy',
      ],
      requireBuildMarker: true,
    },
    {
      path: '/book',
      required: [
        'Wybierz, czy konsultacja dotyczy psa czy kota',
        'Kwadrans z behawiorystą',
        'Konsultacja 60 min',
        'Pies',
        'Kot',
      ],
      requireBuildMarker: true,
    },
    {
      path: '/koty',
      required: [
        'Behawiorysta kotów online dla opiekunów z całej Polski',
        'Zacznij od Kwadransu z behawiorystą.',
        'Z jakimi trudnościami najczęściej zgłaszają się opiekunowie kotów',
        'Jak wygląda konsultacja dotycząca kota',
        'Co dostajesz po konsultacji dotyczącej kota',
      ],
      requireBuildMarker: true,
    },
    {
      path: '/slot?problem=szczeniak',
      required: ['Etap rezerwacji: wybór terminu', 'Wybierz termin: Szczeniak / młody pies'],
      requireBuildMarker: true,
    },
    {
      path: '/form?problem=szczeniak&slotId=2026-03-24-11%3A20',
      required: [
        'Etap rezerwacji: dane do konsultacji',
        'Uzupełnij dane',
        'To finalna kwota dla tej usługi przed przejściem do płatności.',
      ],
      requireBuildMarker: true,
    },
    {
      path: '/regulamin',
      required: ['Regulamin świadczenia usług', 'Kontakt w sprawach regulaminu'],
      requireBuildMarker: true,
    },
    {
      path: '/polityka-prywatnosci',
      required: ['Polityka prywatności', 'Kontakt w sprawach danych osobowych'],
      requireBuildMarker: true,
    },
  ]
}
