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
        'online / cała Polska',
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
      path: '/niezbednik',
      required: [
        'Niezbędnik - materiały do samodzielnej pracy',
        'Przegladaj Niezbednik',
        'Nie musisz przeglądać wszystkiego od razu.',
        'Materiały własne, książki i narzędzia - dobrane pod konkretne sytuacje.',
        'Niezbędnik ma wspierać decyzję, nie udawać nowej usługi',
        'Książki i publikacje mają wzmacniać kontekst Twoich PDF-ów, nie spychać ich na dalszy plan.',
        'Przybory pokazuję jako narzędzia do planu, a nie jako obowiązkowe zakupy.',
        'Krótki FAQ o Niezbędniku i materiałach',
        'Umów 15 min',
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
        'Niezbędnik - materiały do samodzielnej pracy',
        'Nie musisz przeglądać wszystkiego od razu.',
        'Niezbędnik ma wspierać decyzję, nie udawać nowej usługi',
        'Krótki FAQ o Niezbędniku i materiałach',
      ],
      requireBuildMarker: true,
    },
    {
      path: '/opinie',
      required: [
        'Najczęściej wracają trzy rzeczy: ulga, porządek i spokojny kierunek dalszej pracy',
        'Krótki kontekst problemu, kluczowy pierwszy ruch i kierunek dalszej pracy',
        'Jeśli chcesz, możesz zajrzeć też tutaj',
        'Co najczęściej daje pierwsza rozmowa',
        'Jeśli widzisz w tych głosach coś bliskiego swojej sytuacji, zrób pierwszy spokojny krok',
        'Krótka rozmowa wstępna 15 min audio',
      ],
      forbidden: ['Dodaj swoją opinię do ręcznej weryfikacji', 'Prawdziwe opinie i realne sytuacje opiekunów psów i kotów', 'Wersja serwisu'],
      requireBuildMarker: true,
    },
    {
      path: '/faq',
      required: [
        'Najczęstsze pytania przed rozpoczęciem współpracy',
        'Spokojnie - nie musisz wiedzieć wszystkiego przed pierwszym kontaktem',
        'Wybierz obszar, który najbardziej pasuje do Twojej sytuacji',
        'Pytania o rozpoczęcie współpracy',
        'Pytania o konsultację i przebieg współpracy',
        'Pytania o psy i typowe trudności',
        'Pytania o koty i typowe trudności',
        'Pytania o podejście, metodykę i styl pracy',
        'Nie widzisz tu dokładnie swojego pytania?',
        'Jeśli chcesz spokojnie uporządkować sytuację, zacznijmy od pierwszego kroku',
        'Krótka rozmowa wstępna 15 min audio',
        'bez potrzeby przygotowania kamery',
      ],
      forbidden: ['Oferta', 'Wersja serwisu', 'Umów 15 min'],
      ordered: [
        'Najczęstsze pytania przed rozpoczęciem współpracy',
        'Spokojnie - nie musisz wiedzieć wszystkiego przed pierwszym kontaktem',
        'Wybierz obszar, który najbardziej pasuje do Twojej sytuacji',
        'Pytania o rozpoczęcie współpracy',
        'Pytania o konsultację i przebieg współpracy',
        'Pytania o psy i typowe trudności',
        'Pytania o koty i typowe trudności',
        'Pytania o podejście, metodykę i styl pracy',
        'Nie widzisz tu dokładnie swojego pytania?',
        'Jeśli chcesz spokojnie uporządkować sytuację, zacznijmy od pierwszego kroku',
      ],
      requireBuildMarker: true,
    },
    {
      path: '/kontakt',
      required: [
        'Kontakt i rezerwacja konsultacji',
        'Zacznij od najprostszego pierwszego kroku',
        'Wybierz najwygodniejszy sposób rozpoczęcia',
        'Jak umówić konsultację krok po kroku',
        'Co warto przygotować przed pierwszą wiadomością lub rozmową',
        'Nie wiesz, od czego zacząć? Wybierz najprostszy wariant dla swojej sytuacji',
        'Spokojny pierwszy krok oparty na doświadczeniu i jasnym sposobie pracy',
        'Najczęstsze pytania przed kontaktem i rezerwacją',
        'Wybierz najprostszy sposób kontaktu i zacznijmy od pierwszego kroku',
        'Krótka rozmowa wstępna 15 min',
        'forma audio',
        'bez potrzeby przygotowania kamery',
      ],
      forbidden: ['Oferta', 'Wersja serwisu', 'Umów 15 min w top barze'],
      ordered: [
        'Kontakt i rezerwacja konsultacji',
        'Zacznij od najprostszego pierwszego kroku',
        'Wybierz najwygodniejszy sposób rozpoczęcia',
        'Jak umówić konsultację krok po kroku',
        'Co warto przygotować przed pierwszą wiadomością lub rozmową',
        'Nie wiesz, od czego zacząć? Wybierz najprostszy wariant dla swojej sytuacji',
        'Spokojny pierwszy krok oparty na doświadczeniu i jasnym sposobie pracy',
        'Najczęstsze pytania przed kontaktem i rezerwacją',
        'Wybierz najprostszy sposób kontaktu i zacznijmy od pierwszego kroku',
      ],
      requireBuildMarker: true,
    },
    {
      path: '/materialy',
      required: [
        'Materiały pomocnicze dla opiekunów psów i kotów',
        'Zacznij od spokojnego materiału, jeśli chcesz lepiej zrozumieć sytuację swojego psa albo kota',
        'Materiały PDF na spokojny początek',
        'Polecane książki i dalsze materiały',
        'Kiedy warto zacząć od materiału, a kiedy lepiej od razu umówić konsultację',
        'Materiały osadzone w praktyce, nie w przypadkowych poradach',
        'Najczęstsze pytania o materiały PDF i polecane książki',
        'Jeśli po lekturze materiałów chcesz przejść do konkretnego działania, zacznijmy od pierwszego kroku',
        'Krótka rozmowa wstępna 15 min audio',
        'bez potrzeby przygotowania kamery',
      ],
      forbidden: ['Oferta', 'Wersja serwisu', 'Umów 15 min w top barze'],
      ordered: [
        'Materiały pomocnicze dla opiekunów psów i kotów',
        'Zacznij od spokojnego materiału, jeśli chcesz lepiej zrozumieć sytuację swojego psa albo kota',
        'Materiały PDF na spokojny początek',
        'Polecane książki i dalsze materiały',
        'Kiedy warto zacząć od materiału, a kiedy lepiej od razu umówić konsultację',
        'Materiały osadzone w praktyce, nie w przypadkowych poradach',
        'Najczęstsze pytania o materiały PDF i polecane książki',
        'Jeśli po lekturze materiałów chcesz przejść do konkretnego działania, zacznijmy od pierwszego kroku',
      ],
      requireBuildMarker: true,
    },
    {
      path: '/o-mnie',
      required: [
        'Krzysztof Regulski - behawiorysta psów i kotów',
        'Publiczny profil CAPBT',
        'To, co warto wiedzieć przed pierwszą rozmową',
        'Jak prowadzę konsultację, żeby była spokojna i konkretna',
        'Co opiekunowie cenią w moim sposobie pracy',
        'Najczęstsze pytania o współpracę i sposób pracy',
        'Zobacz publiczny profil CAPBT',
      ],
      forbidden: ['Oferta', 'Dodaj swoją opinię do ręcznej weryfikacji', 'MHERA pomaga mi patrzeć szerzej', 'Wersja serwisu'],
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
        'Zasady rezerwacji i realizacji usług',
        'Masz pytanie o rezerwację albo płatność?',
        'Publiczny profil CAPBT / COAPE',
      ],
      forbidden: ['Pobyty'],
      requireBuildMarker: true,
    },
    {
      path: '/polityka-prywatnosci',
      required: [
        'Jak przetwarzane s\u0105 dane w marce Regulski | Terapia behawioralna',
        'Potrzebujesz sprawdzić dane albo proces kontaktu?',
        'Publiczny profil CAPBT / COAPE',
      ],
      forbidden: ['Pobyty'],
      requireBuildMarker: true,
    },
  ]
}
