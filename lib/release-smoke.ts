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
        'Konsultacje dla psów i kotów',
        'Spokojny pierwszy krok przy problemach psa lub kota',
        '15 minut na start',
        'Zobacz materiały PDF',
        'Umów 15 min',
        'Konsultacja 30 min / pełna',
        'COAPE / CAPBT',
        'osobiste konsultacje',
        'online',
        'Dwa obrazkowe kierunki, bez napięcia',
        'Opinie opiekunów',
        'Kilka głosów po pierwszym kroku',
        'Poradniki PDF',
        'PDF będzie obok jako materiał pomocniczy.',
        'Potrzebujesz pomocy przy problemach psa lub kota?',
      ],
      forbidden: [
        'Masz psa, kota albo sprawę złożoną? Zacznij od prostego wyboru.',
        'Udostępnij znajomemu',
        'Social media',
        'Wersja serwisu',
        'Nie wiem, od czego zacząć',
        'Olsztyn / online',
        'quote-panel',
        'home-choice-grid-two',
        'Subtelny problem',
        'story-final-cta',
        'Najczęstsze sytuacje, od których zaczynamy',
        'Jak pracuję',
        'Bezpłatny materiał PDF',
        'Pobierz PDF',
        'Pierwszy krok bez stresu',
      ],
      ordered: [
        'Regulski | Terapia behawioralna',
        'Konsultacje dla psów i kotów',
        'Spokojny pierwszy krok przy problemach psa lub kota',
        'Umów 15 min',
        'Zobacz materiały PDF',
        'Opinie opiekunów',
        'Kilka głosów po pierwszym kroku',
        'Poradniki PDF',
        'PDF będzie obok jako materiał pomocniczy.',
        'Potrzebujesz pomocy przy problemach psa lub kota?',
      ],
      requireBuildMarker: true,
    },
    {
      path: '/oferta',
      required: [
        'Zacznij od 15 min. PDF zostaje drugim krokiem, a dłuższy format trzecim.',
        'Konsultacja 15 min',
        'PDF jako drugi krok',
        '30 min / pełna jako upgrade',
        'Dalsze opcje',
        'Poradniki PDF',
        'Najprostszy pierwszy krok to konsultacja 15 min.',
        'Zobacz materiały PDF',
      ],
      forbidden: [
        'PDF jako nurture',
        'Najpierw porządkujemy sytuację w PDF, potem wybierasz format.',
        'Najprostszy pierwszy ruch to spokojny materiał PDF.',
      ],
      ordered: [
        'Zacznij od 15 min. PDF zostaje drugim krokiem, a dłuższy format trzecim.',
        'Najprostszy pierwszy krok to konsultacja 15 min.',
        'Zobacz materiały PDF',
        'Konsultacja 15 min',
        '30 min / pełna jako upgrade',
        'Dalsze opcje',
      ],
      requireBuildMarker: true,
    },
    {
      path: '/oferta/poradniki-pdf',
      required: [
        'Poradniki PDF',
        'Materiały PDF do uporządkowania tematu.',
        'Po konsultacji 15 min',
        'Między krokami',
        'Pakiety gdy potrzebujesz szerzej',
        'Książki jako uzupełnienie',
        'Kocia półka PDF',
        'Psia półka PDF',
        'Pakiety dla kotów',
        'Polecane książki papierowe',
        'Kot boi się kuwety?',
        'Koty: zabawa czy napięcie?',
        'Problem poza kuwetą',
        'Miauczenie o świcie',
        'Kot gryzie przy głaskaniu?',
        'Kot broni się przy pielęgnacji albo noszeniu?',
        'Zobacz materiały PDF',
        'Konsultacja 15 min',
      ],
      forbidden: [
        'pdf-stage-hero-grid',
        'pdf-stage-entry-grid',
        'offer-section-block-start',
        'offer-section-block-moretime',
        'offer-section-block-further',
        'Reszta katalogu po grupach',
        '1 poradnik PDF',
        'Najpierw wybierz typ wejścia',
        'Pozostałe tematy',
        'PDF-y dla psów',
        'PDF-y dla kotów',
      ],
      ordered: [
        'Kocia półka PDF',
        'Psia półka PDF',
        'Pakiety dla kotów',
        'Polecane książki papierowe',
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
        'Start: smycz i pobudzenie',
        'Start: kuweta po zmianie',
      ],
      forbidden: ['Udost\u0119pnij znajomemu', 'Wersja serwisu'],
      requireBuildMarker: true,
    },
    {
      path: '/book',
      required: [
        'Etap rezerwacji: wybór tematu',
        'Wybierz temat na 15 min',
        'Wybierz temat najbliższy sytuacji.',
        'Szczeniak i młody pies',
        'Problemy separacyjne',
        'Spacer i reakcje',
        'Pobudzenie i pogoń',
        'Agresja i obrona zasobów',
        'Inny problem lub temat pokrewny',
        'Nie musisz znać dokładnej nazwy problemu.',
        'Następny krok',
        'Najpierw wybierasz temat.',
        'Potem pokazuję terminy i kolejny krok.',
      ],
      forbidden: [
        'Cena konsultacji',
        'Podeślij tę stronę komuś, kto też potrzebuje szybkiego wsparcia dla pupila',
        'Kot i trudne zachowania',
        'Wybierz temat mieszany',
        'Temat mieszany?',
        'Dogoterapia',
      ],
      requireBuildMarker: true,
    },
    {
      path: '/koty',
      required: [
        'Spokojny pierwszy krok przy problemach kota',
        'Zacznij od krótkiej konsultacji i sprawdź, co będzie najlepszym kolejnym krokiem',
        'Umów 15 min',
        'Zobacz materiały PDF',
        'Materiały PDF do spokojnego powrotu do zaleceń.',
        'Polecane książki papierowe',
        'Konsultacja 30 min / pełna',
        'Kuweta i zachowania toaletowe',
        'Konflikt między kotami',
        'Dotyk, pielęgnacja i obrona',
        'Lęk, stres i wycofanie',
        'Nocna aktywność i rytm dnia',
      ],
      forbidden: [
        'Wybierz temat dla kota i od razu przejdź do terminu.',
        'Kuweta i dom',
        'Relacja i przestrzeń',
        'Kot i kuweta',
        'Dotyk, gryzienie i pielęgnacja',
        'Kot lękowy, napięty albo wycofany',
        'Budzi dom po nocy',
      ],
      ordered: [
        'Spokojny pierwszy krok przy problemach kota',
        'Zacznij od krótkiej konsultacji i sprawdź, co będzie najlepszym kolejnym krokiem',
        'Umów 15 min',
        'Zobacz materiały PDF',
        'Tematy do rozmowy',
        'Kuweta i zachowania toaletowe',
        'Konflikt między kotami',
        'Dotyk, pielęgnacja i obrona',
        'Lęk, stres i wycofanie',
        'Nocna aktywność i rytm dnia',
      ],
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
