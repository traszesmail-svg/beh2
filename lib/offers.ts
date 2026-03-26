import { DEFAULT_PRICE_PLN, formatPricePln } from './pricing'

export type OfferKind = 'booking' | 'inquiry' | 'resource'

export type Offer = {
  slug: string
  title: string
  shortTitle: string
  eyebrow: string
  kind: OfferKind
  priceLabel: string | null
  cardSummary: string
  heroSummary: string
  descriptions: string[]
  bestFor: string[]
  outcomes: string[]
  primaryCtaLabel: string
  primaryHref: string
  secondaryCtaLabel?: string
  secondaryHref?: string
  imageSrc: string
  imageAlt: string
  note?: string
}

export type PdfTopic = {
  id: string
  animal: 'Pies' | 'Kot'
  title: string
  summary: string
}

const quickStartPriceLabel = `Od ${formatPricePln(DEFAULT_PRICE_PLN)}`

export const OFFERS: Offer[] = [
  {
    slug: 'szybka-konsultacja-15-min',
    title: 'Szybka konsultacja 15 min',
    shortTitle: '15 min',
    eyebrow: 'Pierwszy krok',
    kind: 'booking',
    priceLabel: quickStartPriceLabel,
    cardSummary:
      'Najniższy próg wejścia. Krótka rozmowa audio dla psów i kotów, kiedy chcesz zacząć bez presji wideo i bez rozbudowanego procesu.',
    heroSummary:
      'To nadal ważna, fachowa rozmowa. Forma audio ma ułatwić start, a nie spłycać pomoc. Jeśli problem okaże się szerszy, kolejnym krokiem będzie lepiej dobrana forma pracy.',
    descriptions: [
      'Szybka konsultacja 15 min została w systemie jako lekki start dla opiekunów, którzy chcą najpierw spokojnie opisać sytuację i usłyszeć pierwszy sensowny kierunek działania.',
      'To dobra ścieżka wtedy, gdy potrzebujesz fachowego spojrzenia bez pełnej rozmowy wideo, bez rozbudowanego przygotowania i bez dużego ryzyka po stronie opiekuna.',
    ],
    bestFor: [
      'gdy chcesz zacząć od małego kroku i szybko sprawdzić kierunek dalszej pracy',
      'gdy forma audio jest dla Ciebie wygodniejsza niż pełna konsultacja wideo',
      'gdy problem trzeba uporządkować, ale jeszcze nie wiesz, czy potrzebna będzie szersza terapia',
    ],
    outcomes: [
      'wstępne rozpoznanie sytuacji',
      'pierwszy plan działania na najbliższe dni',
      'jasną decyzję, czy wystarczy praca domowa, czy potrzebna jest kolejna ścieżka wsparcia',
    ],
    primaryCtaLabel: 'Umów konsultację 15 min',
    primaryHref: '/book',
    secondaryCtaLabel: 'Zobacz pozostałe formy pracy',
    secondaryHref: '/oferta',
    imageSrc: '/images/hero-main.png',
    imageAlt: 'Krzysztof Regulski na zdjęciu portretowym do strony marki Regulski Terapia behawioralna',
    note: 'Osobny landing i osobny flow bookingowy pozostają oparte o aktualny proces rezerwacji.',
  },
  {
    slug: 'konsultacja-30-min',
    title: 'Konsultacja 30 min',
    shortTitle: '30 min',
    eyebrow: 'Rozszerzony start',
    kind: 'inquiry',
    priceLabel: '119 zł',
    cardSummary:
      'Rozszerzona konsultacja wstępna dla sytuacji, w których 15 minut może być zbyt małym oknem, ale nie potrzebujesz jeszcze pełnej konsultacji behawioralnej.',
    heroSummary:
      'To pomost między lekkim wejściem a pełną konsultacją online. Daje więcej przestrzeni na uporządkowanie wątku, ale nadal pozostaje czytelnym pierwszym etapem pracy.',
    descriptions: [
      'Konsultacja 30 min nie jest „tańszą wersją” pełnej konsultacji. Jej rolą jest spokojniejsze wejście w sytuacje, które wymagają nieco więcej czasu na opis i rozpoznanie.',
      'Ten format sprawdza się, kiedy potrzebujesz dokładniejszego startu niż w 15 minut, ale nadal chcesz zacząć od zwięzłej, konkretnej rozmowy.',
    ],
    bestFor: [
      'gdy problem jest mieszany i trudno go opisać w bardzo krótkiej formule',
      'gdy potrzebujesz rozszerzonej konsultacji wstępnej przed dalszą terapią',
      'gdy zależy Ci na spokojniejszym tempie rozmowy bez wchodzenia od razu w pełną konsultację',
    ],
    outcomes: [
      'dokładniejsze rozpoznanie sytuacji wejściowej',
      'wstępną ocenę, czy kolejnym krokiem ma być konsultacja online, terapia, wizyta domowa czy pobyt',
      'konkretny plan pierwszych działań i obserwacji',
    ],
    primaryCtaLabel: 'Zapytaj o konsultację 30 min',
    primaryHref: '/kontakt?service=konsultacja-30-min',
    secondaryCtaLabel: 'Porównaj formy współpracy',
    secondaryHref: '/oferta',
    imageSrc: '/branding/specialist-krzysztof-about.png',
    imageAlt: 'Krzysztof Regulski podczas pracy z psem jako ilustracja rozszerzonej konsultacji wstępnej',
  },
  {
    slug: 'konsultacja-behawioralna-online',
    title: 'Konsultacja behawioralna online',
    shortTitle: 'Online',
    eyebrow: 'Pogłębiona konsultacja',
    kind: 'inquiry',
    priceLabel: '350 zł',
    cardSummary:
      'Pełniejsza konsultacja wideo bez sztywnego limitu czasu, prowadzona tak długo, jak wymaga tego przypadek i realne rozpoznanie problemu.',
    heroSummary:
      'To ścieżka dla sytuacji, w których potrzebna jest pełniejsza analiza tła, historii problemu, materiałów wideo i organizacji pracy domowej.',
    descriptions: [
      'Konsultacja behawioralna online jest wyraźnie inną formą pracy niż szybki start. Służy do pogłębionego rozpoznania problemu i zaplanowania dalszej terapii, jeśli jest potrzebna.',
      'Spotkanie odbywa się w formule wideo i ma osobny terminarz, aby czas był dopasowany do przypadku, a nie odwrotnie.',
    ],
    bestFor: [
      'gdy problem trwa dłużej, wraca albo dotyczy kilku obszarów jednocześnie',
      'gdy potrzebujesz pełniejszej analizy historii zwierzęcia i środowiska domowego',
      'gdy od początku wiesz, że szybka konsultacja byłaby tylko wstępem do szerszej pracy',
    ],
    outcomes: [
      'pogłębione rozpoznanie sytuacji',
      'plan dalszej pracy domowej lub terapeutycznej',
      'jasne wskazanie, czy potrzebna jest wizyta domowa, terapia ciągła albo konsultacja weterynaryjna',
    ],
    primaryCtaLabel: 'Umów konsultację online',
    primaryHref: '/kontakt?service=konsultacja-behawioralna-online',
    secondaryCtaLabel: 'Zacznij od 15 minut',
    secondaryHref: '/book',
    imageSrc: '/branding/specialist-krzysztof-vet.jpg',
    imageAlt: 'Krzysztof Regulski pracujący z kotem przy stole jako ilustracja pełnej konsultacji behawioralnej online',
  },
  {
    slug: 'konsultacja-domowa-wyjazdowa',
    title: 'Konsultacja domowa / wyjazdowa',
    shortTitle: 'Domowa',
    eyebrow: 'Praca w środowisku zwierzęcia',
    kind: 'inquiry',
    priceLabel: null,
    cardSummary:
      'Wizyta prowadzona wtedy, gdy kontekst miejsca ma znaczenie dla oceny sytuacji albo gdy przypadek wymaga pracy poza standardową konsultacją online.',
    heroSummary:
      'Ta forma jest ustalana indywidualnie. Obejmuje konsultacje na miejscu oraz wyjazdy organizowane według realnych potrzeb przypadku i możliwości dojazdu.',
    descriptions: [
      'Konsultacja domowa lub wyjazdowa jest możliwa w Olsztynie i po ustaleniu także na terenie Polski. Nie jest to usługa katalogowa z jedną sztywną ceną, bo zakres pracy i logistyka zależą od przypadku.',
      'Jeśli problem najlepiej ocenić w środowisku zwierzęcia, ta ścieżka pozwala pracować na tym, co dzieje się realnie w domu lub w konkretnej przestrzeni.',
    ],
    bestFor: [
      'gdy kluczowe znaczenie ma układ mieszkania, ogrodu lub spacerów',
      'gdy zachowanie trudno rzetelnie ocenić wyłącznie online',
      'gdy potrzebna jest bardziej bezpośrednia praca z organizacją środowiska',
    ],
    outcomes: [
      'ocenę zachowania w realnym kontekście',
      'dopasowane zalecenia środowiskowe i organizacyjne',
      'ustalenie dalszej ścieżki terapii lub pracy domowej',
    ],
    primaryCtaLabel: 'Zapytaj o konsultację domową',
    primaryHref: '/kontakt?service=konsultacja-domowa-wyjazdowa',
    secondaryCtaLabel: 'Zobacz formy pracy',
    secondaryHref: '/oferta',
    imageSrc: '/branding/case-dog-home.jpg',
    imageAlt: 'Pies w domowym otoczeniu jako ilustracja konsultacji prowadzonej w środowisku zwierzęcia',
  },
  {
    slug: 'indywidualna-terapia-behawioralna',
    title: 'Indywidualna terapia behawioralna',
    shortTitle: 'Terapia',
    eyebrow: 'Dalsza praca',
    kind: 'inquiry',
    priceLabel: null,
    cardSummary:
      'Dalsza, prowadzona indywidualnie praca wtedy, gdy problem wymaga więcej niż jednej konsultacji i potrzebuje spokojnego procesu, a nie pojedynczej porady.',
    heroSummary:
      'Zakres, forma i organizacja terapii są ustalane po rozpoznaniu sytuacji. To nie jest pakiet z półki, ale dalsza praca dopasowana do konkretnego przypadku.',
    descriptions: [
      'Indywidualna terapia behawioralna pojawia się wtedy, gdy po konsultacji widać, że problem wymaga dłuższej pracy, monitorowania postępów lub etapowego wprowadzania zmian.',
      'Forma terapii jest dobierana po rozpoznaniu sytuacji. Dzięki temu opiekun nie kupuje w ciemno „pakietu”, tylko adekwatną ścieżkę pomocy.',
    ],
    bestFor: [
      'gdy problem jest utrwalony albo złożony',
      'gdy potrzeba monitorowania postępów i korekt planu',
      'gdy szybka konsultacja była dopiero pierwszym etapem rozpoznania',
    ],
    outcomes: [
      'indywidualnie ustalony plan terapii',
      'ciągłość opieki i prowadzenia procesu',
      'większą spójność działań opiekuna, specjalisty i w razie potrzeby lekarza weterynarii',
    ],
    primaryCtaLabel: 'Zapytaj o terapię',
    primaryHref: '/kontakt?service=indywidualna-terapia-behawioralna',
    secondaryCtaLabel: 'Umów pierwszy krok',
    secondaryHref: '/book',
    imageSrc: '/branding/specialist-krzysztof-vet.jpg',
    imageAlt: 'Krzysztof Regulski podczas spokojnej pracy z kotem jako ilustracja prowadzonej terapii behawioralnej',
  },
  {
    slug: 'pobyty-socjalizacyjno-terapeutyczne',
    title: 'Pobyty socjalizacyjno-terapeutyczne',
    shortTitle: 'Pobyty',
    eyebrow: 'Wyróżnik marki',
    kind: 'inquiry',
    priceLabel: null,
    cardSummary:
      'Jedna z kluczowych form pracy w marce. Pobyty są organizowane po kwalifikacji i służą wtedy, gdy taka forma naprawdę wspiera proces socjalizacji lub terapii.',
    heroSummary:
      'Pobyt nie jest przechowaniem ani „produktem hotelowym”. To element pracy prowadzonej wtedy, gdy sytuacja zwierzęcia uzasadnia taką organizację wsparcia.',
    descriptions: [
      'Pobyty socjalizacyjno-terapeutyczne są ważnym filarem marki i wyraźnym wyróżnikiem oferty. Kwalifikacja pozwala ustalić, czy ta ścieżka ma realny sens dla konkretnego psa, a w przyszłości także dla kolejnych obszarów pracy.',
      'To rozwiązanie dla przypadków, w których sama konsultacja nie wystarcza i potrzebna jest bardziej zorganizowana forma prowadzenia procesu.',
    ],
    bestFor: [
      'gdy potrzebna jest intensywniejsza organizacja pracy lub socjalizacji',
      'gdy sytuacja wymaga dalszego prowadzenia po rozpoznaniu konsultacyjnym',
      'gdy opiekun potrzebuje bezpiecznej, jasno opisanej ścieżki dalszego wsparcia',
    ],
    outcomes: [
      'ustalenie, czy pobyt jest właściwą formą pomocy',
      'plan organizacyjny pobytu i kolejnych kroków',
      'spójną ścieżkę między konsultacją, terapią a dalszą opieką',
    ],
    primaryCtaLabel: 'Zapytaj o pobyt',
    primaryHref: '/kontakt?service=pobyty-socjalizacyjno-terapeutyczne',
    secondaryCtaLabel: 'Przeczytaj o całym systemie pracy',
    secondaryHref: '/oferta',
    imageSrc: '/branding/case-dog-home.jpg',
    imageAlt: 'Pies odpoczywający w spokojnym otoczeniu jako ilustracja pobytów socjalizacyjno-terapeutycznych',
    note: 'Kwalifikacja do pobytu odbywa się po rozmowie i ocenie sytuacji.',
  },
  {
    slug: 'poradniki-pdf',
    title: 'Poradniki PDF',
    shortTitle: 'PDF',
    eyebrow: 'Materiały wspierające',
    kind: 'resource',
    priceLabel: null,
    cardSummary:
      'Praktyczne materiały dla opiekunów psów i kotów, którzy chcą zacząć od konkretnego planu działania albo potrzebują uzupełnienia po konsultacji.',
    heroSummary:
      'Poradniki PDF nie zastępują diagnozy ani terapii, ale mogą być dobrym pierwszym materiałem porządkującym temat lub spokojnym uzupełnieniem po konsultacji.',
    descriptions: [
      'Sekcja PDF jest częścią lejka marki. Daje miejsce dla osób, które nie są jeszcze gotowe na konsultację albo po pierwszej rozmowie potrzebują materiału uporządkowanego pod konkretny temat.',
      'To realny element ścieżki pomocy, a nie dodatek dekoracyjny. Tematy obejmują zarówno psy, jak i koty.',
    ],
    bestFor: [
      'gdy chcesz zacząć od uporządkowanego materiału w jednym temacie',
      'gdy po konsultacji potrzebujesz prostego materiału do dalszej pracy domowej',
      'gdy nie chcesz jeszcze rezerwować rozmowy, ale zależy Ci na merytorycznym pierwszym kroku',
    ],
    outcomes: [
      'czytelny plan pierwszych działań w konkretnym problemie',
      'materiał wspierający rozmowę lub pracę domową',
      'subtelne przejście do konsultacji, jeśli temat okaże się szerszy',
    ],
    primaryCtaLabel: 'Zobacz tematy PDF',
    primaryHref: '/oferta/poradniki-pdf',
    secondaryCtaLabel: 'Skontaktuj się w sprawie PDF',
    secondaryHref: '/kontakt?service=poradniki-pdf',
    imageSrc: '/branding/topic-cards/cat-in-arms.jpg',
    imageAlt: 'Kot na rękach opiekunki jako ilustracja materiałów edukacyjnych dla opiekunów zwierząt',
  },
]

export const HOME_HELP_AREAS = [
  {
    title: 'Problemy psów w codziennym życiu',
    description:
      'Reaktywność na spacerze, trudne zostawanie samemu, pobudzenie, szczenięcy chaos, zachowania obronne i trudności w wyciszeniu.',
  },
  {
    title: 'Problemy kotów jako pełnoprawny obszar pracy',
    description:
      'Problemy kuwetowe, stres, wycofanie, konfliktowość, relacje między kotami oraz trudne zachowania przy dotyku lub pielęgnacji.',
  },
  {
    title: 'Sytuacje wymagające szerszego rozpoznania',
    description:
      'Przypadki, w których objaw nie wyjaśnia wszystkiego i trzeba połączyć zachowanie, środowisko domowe oraz tło weterynaryjne.',
  },
  {
    title: 'Dalsza praca i ciągłość opieki',
    description:
      'Od pierwszej konsultacji po terapię indywidualną, pobyty socjalizacyjno-terapeutyczne i materiały wspierające pracę opiekuna.',
  },
] as const

export const HOME_PROCESS_STEPS = [
  {
    step: '01',
    title: 'Zaczynamy od właściwego progu wejścia',
    description:
      'Możesz wejść małym krokiem: przez 15 minut, konsultację 30 min albo pełniejszą konsultację online, zależnie od sytuacji.',
  },
  {
    step: '02',
    title: 'Rozpoznaję, czego naprawdę wymaga przypadek',
    description:
      'Nie chodzi o sprzedaż przypadkowej porady. Najpierw trzeba ustalić, czy wystarczy pierwszy plan, czy temat wymaga dalszej pracy.',
  },
  {
    step: '03',
    title: 'Dobieramy dalszą ścieżkę pomocy',
    description:
      'Jeśli potrzeba więcej niż jednej rozmowy, przechodzimy do konsultacji pogłębionej, terapii, wizyty domowej albo pobytu.',
  },
  {
    step: '04',
    title: 'Prowadzę proces spokojnie i odpowiedzialnie',
    description:
      'W uzasadnionych przypadkach pracuję także we współpracy z lekarzem weterynarii, aby nie rozdzielać zachowania od zdrowia i dobrostanu zwierzęcia.',
  },
] as const

export const TRUST_SIGNAL_ITEMS = [
  {
    title: 'COAPE i kwalifikacje',
    description:
      'COAPE pokazuję jako ważny sygnał wiarygodności, ale nie jako tani slogan. Najpierw ma być widoczna jakość pracy i sposób prowadzenia sprawy.',
  },
  {
    title: 'Współpraca z lekarzem weterynarii',
    description:
      'Jeśli przypadek tego wymaga, terapia jest prowadzona z uwzględnieniem tła medycznego i we współpracy z lekarzem weterynarii.',
  },
  {
    title: 'Psychofarmakologia tylko jako wsparcie procesu',
    description:
      'W uzasadnionych przypadkach farmakoterapia może wspierać terapię, ale nie zastępuje pracy behawioralnej ani nie jest rozwiązaniem sama w sobie.',
  },
  {
    title: 'Jasne zasady i spokojny ton',
    description:
      'Bez obiecywania cudów, bez agresywnego marketingu i bez tonu taniego infoproduktu. Klient ma wiedzieć, czego się spodziewać.',
  },
] as const

export const CAT_SUPPORT_AREAS = [
  'problemy kuwetowe i house soiling',
  'napięcie, stres i wycofanie',
  'konflikty między kotami w domu',
  'trudności w codziennym funkcjonowaniu domowym',
  'zachowania przy dotyku, pielęgnacji i badaniu',
] as const

export const CAT_CONTENT_ROADMAP = [
  {
    slug: 'kot-sika-poza-kuweta',
    title: 'Kot sika poza kuwetą',
  },
  {
    slug: 'kot-poza-kuweta-behawior-czy-wet',
    title: 'Poza kuwetą: kiedy problem jest behawioralny, a kiedy weterynaryjny',
  },
  {
    slug: 'konflikt-miedzy-kotami',
    title: 'Konflikt między kotami w domu',
  },
  {
    slug: 'kot-lekowy-wycofany',
    title: 'Kot lękowy lub wycofany',
  },
  {
    slug: 'kot-agresywny-przy-dotyku',
    title: 'Kot agresywny przy dotyku lub pielęgnacji',
  },
] as const

export const PDF_TOPICS: PdfTopic[] = [
  {
    id: 'pies-ciagnie-na-smyczy',
    animal: 'Pies',
    title: 'Pies ciągnie na smyczy - 5 błędów, które utrwalają problem',
    summary: 'Materiał o najczęstszych błędach opiekuna i o tym, od czego zacząć spokojniejszą pracę spacerową.',
  },
  {
    id: 'pies-zostaje-sam',
    animal: 'Pies',
    title: 'Pies zostaje sam i szczeka lub wyje - od czego zacząć',
    summary: 'Pierwszy plan działań dla opiekuna, który chce ograniczyć chaos i lepiej rozpoznać napięcie po wyjściu.',
  },
  {
    id: 'pies-rzuca-sie-do-psow',
    animal: 'Pies',
    title: 'Pies rzuca się do innych psów na spacerze - pierwsze kroki',
    summary: 'Prosty materiał o zarządzaniu spacerem, bodźcami i pierwszym porządku działań.',
  },
  {
    id: 'szczeniak-gryzie',
    animal: 'Pies',
    title: 'Szczeniak gryzie i nie potrafi się wyciszyć',
    summary: 'Checklist dla opiekuna młodego psa, który potrzebuje uporządkowania rytmu dnia, granic i pracy nad pobudzeniem.',
  },
  {
    id: 'pies-boi-sie',
    animal: 'Pies',
    title: 'Pies boi się ludzi, gości lub dźwięków - jak pracować z lękiem',
    summary: 'Wprowadzenie do bezpiecznej pracy z lękiem bez przeciążania psa i opiekuna.',
  },
  {
    id: 'kot-poza-kuweta-plan',
    animal: 'Kot',
    title: 'Kot sika poza kuwetą - pierwszy plan działania',
    summary: 'Pierwszy porządek diagnostyczny i środowiskowy dla opiekuna, który chce zacząć bez przypadkowych porad.',
  },
  {
    id: 'kot-kuweta-wet-czy-behawior',
    animal: 'Kot',
    title: 'Kot załatwia się poza kuwetą - kiedy problem jest behawioralny, a kiedy weterynaryjny',
    summary: 'Materiał porządkujący sygnały alarmowe i decyzje o dalszej konsultacji.',
  },
  {
    id: 'konflikt-miedzy-kotami-pdf',
    animal: 'Kot',
    title: 'Konflikt między kotami w domu - jak zacząć pracę',
    summary: 'Przewodnik po pierwszych zmianach środowiskowych i organizacyjnych w domu wielokotowym.',
  },
  {
    id: 'kot-wycofany',
    animal: 'Kot',
    title: 'Kot lękowy lub wycofany - jak budować poczucie bezpieczeństwa',
    summary: 'Podstawy pracy z kotem, który unika kontaktu, kryje się lub funkcjonuje w stałym napięciu.',
  },
  {
    id: 'kot-przy-dotyku',
    animal: 'Kot',
    title: 'Kot agresywny przy dotyku lub pielęgnacji - co robić',
    summary: 'Materiał o bezpiecznym kontakcie, sygnałach ostrzegawczych i pierwszych zmianach w codziennej obsłudze kota.',
  },
] as const

export const HOME_FAQ = [
  {
    q: 'Czy nadal mogę zacząć od krótkiej konsultacji 15 min?',
    a: 'Tak. Szybka konsultacja 15 min zostaje w systemie jako pierwszy krok o niskim progu wejścia. Różnica polega na tym, że nie jest już jedyną osią marki, tylko częścią szerszego systemu pracy.',
  },
  {
    q: 'Czy pracujesz także z kotami?',
    a: 'Tak. Koty są pełnoprawnym obszarem pracy: od problemów kuwetowych i stresu, przez konflikty między kotami, po trudne zachowania przy dotyku lub pielęgnacji.',
  },
  {
    q: 'Skąd mam wiedzieć, którą formę współpracy wybrać?',
    a: 'Najbezpieczniej zacząć od progu, który jest adekwatny do Twojej sytuacji i gotowości. Jeśli po pierwszym etapie okaże się, że temat wymaga więcej, wskażę kolejną ścieżkę zamiast zostawiać Cię z przypadkową poradą.',
  },
  {
    q: 'Czy każda sprawa kończy się terapią albo pobytem?',
    a: 'Nie. Część spraw wymaga tylko dobrego rozpoznania i pierwszego planu działania. Dalsza terapia, konsultacja domowa albo pobyt pojawiają się dopiero wtedy, gdy mają realny sens dla przypadku.',
  },
  {
    q: 'Jak wygląda kwestia farmakoterapii?',
    a: 'Jeśli sytuacja tego wymaga, pracuję we współpracy z lekarzem weterynarii. Farmakoterapia może wspierać proces, ale nie zastępuje terapii behawioralnej ani nie jest rozwiązaniem sama w sobie.',
  },
  {
    q: 'Czy ceny są jawne?',
    a: 'Publicznie pokazuję ceny dla ścieżek startowych i konsultacji online: szybka konsultacja 15 min, konsultacja 30 min oraz konsultacja behawioralna online. Wizyty domowe, terapia indywidualna i pobyty są ustalane po rozpoznaniu sytuacji.',
  },
] as const

export function getOfferBySlug(slug: string) {
  return OFFERS.find((offer) => offer.slug === slug) ?? null
}
