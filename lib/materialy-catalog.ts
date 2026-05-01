// Catalog of downloadable PDF guides for the /materialy funnel.
// Three tiers:
//  - "free"     → lead magnets (email gate, instant download)
//  - "single"   → standalone PDF (19 or 29 zł, BLIK manual)
//  - "bundle"   → 3-PDF themed bundle (49 zł, BLIK manual)

export type MaterialyCategory = 'cat' | 'dog' | 'puppy'
export type MaterialyTier = 'free' | 'single' | 'bundle'
export type MaterialyPriceCode = 'free' | 'p19' | 'p29' | 'p49'

export type MaterialyGuide = {
  slug: string
  title: string
  subtitle: string
  category: MaterialyCategory
  tier: 'free' | 'single'
  priceCode: MaterialyPriceCode
  shortPromise: string
  forWhom: string
  pdfFile: string // filename inside content/guides/pdf/
  highlights: string[]
}

export type MaterialyBundle = {
  slug: string
  title: string
  subtitle: string
  category: MaterialyCategory
  priceCode: 'p49'
  guideSlugs: string[]
  shortPromise: string
}

export const PRICE_LABEL: Record<MaterialyPriceCode, string> = {
  free: 'Bezpłatne',
  p19: '19 zł',
  p29: '29 zł',
  p49: '49 zł',
}

export const PRICE_AMOUNT_PLN: Record<MaterialyPriceCode, number> = {
  free: 0,
  p19: 19,
  p29: 29,
  p49: 49,
}

// 23 guides total. 2 free lead magnets + 6 flagship singles (29 zł) + 15 standard singles (19 zł).
const RAW_GUIDES: MaterialyGuide[] = [
  // ─── FREE LEAD MAGNETS ─────────────────────────────────────────────────
  {
    slug: 'kot-zyje-w-napieciu',
    title: 'Kot żyje w napięciu',
    subtitle: 'Jak rozpoznać kota w długim stresie i co naprawdę ma znaczenie',
    category: 'cat',
    tier: 'free',
    priceCode: 'free',
    shortPromise: 'Mapa codziennych sygnałów napięcia i pierwsza reakcja środowiskowa.',
    forWhom: 'Dla opiekuna kota, który zauważa, że coś jest nie tak — wycofanie, czujność, drobne objawy somatyczne — ale nie wie, od czego zacząć.',
    pdfFile: 'kot-zyje-w-napieciu.pdf',
    highlights: ['mapa stresorów domowych', 'co realnie pomaga w pierwszych 14 dniach', 'kiedy iść do lekarza'],
  },
  {
    slug: 'pies-ile-ruchu-potrzebuje',
    title: 'Czy Twój pies naprawdę potrzebuje więcej ruchu?',
    subtitle: 'Kiedy „dodaj ruchu" pogarsza sprawę i jak to rozpoznać',
    category: 'dog',
    tier: 'free',
    priceCode: 'free',
    shortPromise: 'Prosty filtr: czy psu brakuje ruchu, czy odpoczynku.',
    forWhom: 'Dla opiekuna psa, który słyszy „dodaj mu ruchu" jako odpowiedź na wszystko, ale widzi, że to nie pomaga albo szkodzi.',
    pdfFile: 'pies-ile-ruchu-potrzebuje.pdf',
    highlights: ['cztery scenariusze przeciążenia', 'jak ustawić dzień bez maratonów', 'sygnały, że pies potrzebuje wyciszenia, nie więcej spacerów'],
  },

  // ─── FLAGSHIPS (29 zł) ────────────────────────────────────────────────
  {
    slug: 'kot-i-kuweta-pierwszy-plan-dzialania',
    title: 'Kot i kuweta — pierwszy plan działania',
    subtitle: 'Pierwszy plan przy sikaniu lub załatwianiu się poza kuwetą',
    category: 'cat',
    tier: 'single',
    priceCode: 'p29',
    shortPromise: 'Szczegółowy poradnik porządkujący diagnozę wstępną, środowisko, kuwetę, lokalizacje i plan monitorowania.',
    forWhom: 'Dla opiekuna kota z problemami około-kuwetowymi, który chce uporządkować temat bez przypadkowych rad z internetu.',
    pdfFile: 'kot-i-kuweta-pierwszy-plan-dzialania.pdf',
    highlights: ['diagnoza wstępna i audyt kuwety', 'plan monitorowania i działań na 14 dni', 'kiedy lekarz, kiedy zmiana środowiska'],
  },
  {
    slug: 'kot-problem-poza-kuweta',
    title: 'Problem poza kuwetą',
    subtitle: 'Pełny przewodnik diagnostyczny — od bólu po napięcie społeczne',
    category: 'cat',
    tier: 'single',
    priceCode: 'p29',
    shortPromise: 'Najszerszy materiał kuwetowy: różnicowanie, audyt, plan i routing do kolejnych kroków.',
    forWhom: 'Dla opiekuna, u którego problem trwa dłużej niż tydzień, wraca falami albo łączy się z napięciem w domu.',
    pdfFile: 'kot-problem-poza-kuweta.pdf',
    highlights: ['cztery warstwy problemu (medycznie / kuweta / środowisko / społeczna)', 'audyt kuwety i plan na 14 dni', 'kiedy konsultacja, kiedy lekarz'],
  },
  {
    slug: 'pies-zostaje-sam',
    title: 'Pies zostaje sam i wpada w panikę?',
    subtitle: 'Jak odróżnić separację od frustracji, protestu i chaosu po wyjściu',
    category: 'dog',
    tier: 'single',
    priceCode: 'p29',
    shortPromise: 'Cztery ścieżki problemu, plan pierwszych 72 godzin i 14 dni, co podpowiada nagranie.',
    forWhom: 'Dla opiekuna psa, który podejrzewa, że to nie jest tylko nuda albo protest, lecz realna panika.',
    pdfFile: 'pies-zostaje-sam.pdf',
    highlights: ['różnicowanie paniki, frustracji, protestu i przeciążenia', 'plan 72 godzin + 14 dni', 'co nagrywać i na co patrzeć'],
  },
  {
    slug: 'pies-reaktywny-na-spacerze',
    title: 'Pies reaktywny na spacerze',
    subtitle: 'Pierwszy plan pracy przy szczekaniu, spinaniu się i trudnych mijankach',
    category: 'dog',
    tier: 'single',
    priceCode: 'p29',
    shortPromise: 'Krótki poradnik porządkujący pierwsze decyzje przy reaktywności spacerowej.',
    forWhom: 'Dla opiekuna psa, które źle znoszą mijanie psów, ludzi albo innych bodźców na spacerze.',
    pdfFile: 'pies-reaktywny-na-spacerze.pdf',
    highlights: ['diagnoza reaktywności spacerowej', 'plan dystansu i separacji', 'kiedy specjalista'],
  },
  {
    slug: 'pies-trudny-spacer',
    title: 'Trudny spacer',
    subtitle: 'Pies reaktywny, ciągnący, spięty — od czego zacząć układanie',
    category: 'dog',
    tier: 'single',
    priceCode: 'p29',
    shortPromise: 'Mapa wyzwalaczy spacerowych i pierwszy plan dystansu, rytmu i regeneracji.',
    forWhom: 'Dla opiekuna psa, dla którego spacer to seria mijanek, pobudzenia i uczenia się reaktywności.',
    pdfFile: 'pies-trudny-spacer.pdf',
    highlights: ['mapa wyzwalaczy', 'praca z dystansem zamiast „odczulania siłą"', 'kiedy potrzebny jest specjalista'],
  },
  {
    slug: 'kot-broni-sie-przy-pielegnacji',
    title: 'Kot broni się przy pielęgnacji',
    subtitle: 'Czesanie, obcinanie pazurów, transporter, łapanie — bez walki',
    category: 'cat',
    tier: 'single',
    priceCode: 'p29',
    shortPromise: 'Plan stopniowego oswajania kota z procedurami, których nie da się pominąć.',
    forWhom: 'Dla opiekuna kota, który po każdym czesaniu albo obcinaniu pazurów ma w domu walkę i ranę zaufania.',
    pdfFile: 'kot-broni-sie-przy-pielegnacji.pdf',
    highlights: ['protokół na obcinanie pazurów', 'transporter bez walki', 'czego nie robić, jeśli kot syczy'],
  },

  // ─── STANDARDS 19 zł — koty ───────────────────────────────────────────
  {
    slug: 'kot-boi-sie-kuwety',
    title: 'Kot boi się kuwety?',
    subtitle: 'Jak rozpoznać lęk kuwetowy i odbudować poczucie bezpieczeństwa',
    category: 'cat',
    tier: 'single',
    priceCode: 'p19',
    shortPromise: '5 sygnałów ostrzegawczych, audyt kuwety i plan na 14 dni.',
    forWhom: 'Dla opiekuna kota, który widzi wahanie przy wejściu, ucieczkę po mikcji albo nocne korzystanie z kuwety.',
    pdfFile: 'kot-boi-sie-kuwety.pdf',
    highlights: ['5 sygnałów ostrzegawczych', 'plan na 14 dni', 'kiedy lekarz, kiedy zmiana środowiska'],
  },
  {
    slug: 'konflikt-miedzy-kotami',
    title: 'Czy to jeszcze zabawa?',
    subtitle: '7 cichych oznak konfliktu między kotami',
    category: 'cat',
    tier: 'single',
    priceCode: 'p19',
    shortPromise: 'Starter, który pomaga rozpoznać presję społeczną, blokowanie zasobów i pierwszy plan zmian.',
    forWhom: 'Dla opiekuna 2+ kotów, gdzie napięcie jest „ciche", ale w domu coś nie gra.',
    pdfFile: 'konflikt-miedzy-kotami.pdf',
    highlights: ['7 cichych oznak napięcia', 'mapa zasobów i przejść', 'plan zmian na 14 dni'],
  },
  {
    slug: 'kot-budzi-dom-po-nocy',
    title: 'Kot budzi dom po nocy',
    subtitle: 'Wokalizacje, bieganie i atak o 5 rano — co naprawdę się dzieje',
    category: 'cat',
    tier: 'single',
    priceCode: 'p19',
    shortPromise: 'Diagnostyka nocnej aktywności i plan zmiany rytmu dnia kota.',
    forWhom: 'Dla opiekuna, który nie śpi, bo kot żyje nocą.',
    pdfFile: 'kot-budzi-dom-po-nocy.pdf',
    highlights: ['cztery typy nocnej aktywności', 'jak ustawić wieczór, by kot spał', 'kiedy iść do lekarza'],
  },
  {
    slug: 'kot-chowa-sie-po-zmianach',
    title: 'Kot chowa się po zmianach',
    subtitle: 'Remont, gość, nowy dom — jak pomóc kotu wrócić do siebie',
    category: 'cat',
    tier: 'single',
    priceCode: 'p19',
    shortPromise: 'Plan pierwszych dni i tygodni po zmianie, której kot się boi.',
    forWhom: 'Dla opiekuna kota, który po przeprowadzce, remoncie albo zmianie w domu zniknął na całe dni.',
    pdfFile: 'kot-chowa-sie-po-zmianach.pdf',
    highlights: ['protokół „bezpiecznego pokoju"', 'kiedy się martwić', 'co realnie pomaga, a co pogarsza'],
  },
  {
    slug: 'kot-gryzie-przy-glaskaniu',
    title: 'Kot gryzie przy głaskaniu',
    subtitle: 'Petting-induced aggression — jak czytać próg i go nie przekraczać',
    category: 'cat',
    tier: 'single',
    priceCode: 'p19',
    shortPromise: 'Jak nauczyć się czytać kota tak, by nie kończyć interakcji ugryzieniem.',
    forWhom: 'Dla opiekuna kota, który wchodzi na kolana i po chwili gryzie albo drapie.',
    pdfFile: 'kot-gryzie-przy-glaskaniu.pdf',
    highlights: ['mapa sygnałów wczesnego napięcia', 'gdzie i jak głaskać', 'jak przerwać interakcję bez urazy'],
  },
  {
    slug: 'koty-zabawa-czy-napiecie',
    title: 'Koty: zabawa czy napięcie?',
    subtitle: 'Jak odróżnić zdrową gonitwę od konfliktu pod przykrywką',
    category: 'cat',
    tier: 'single',
    priceCode: 'p19',
    shortPromise: 'Filtr diagnostyczny dla domu wielokotowego: zabawa czy konflikt.',
    forWhom: 'Dla opiekuna 2+ kotów, który nie wie, czy ich gonitwy to zabawa, czy realny problem.',
    pdfFile: 'koty-zabawa-czy-napiecie.pdf',
    highlights: ['7 sygnałów konfliktu pod przykrywką zabawy', 'kiedy interweniować', 'co notować'],
  },
  {
    slug: 'miauczenie-o-swicie',
    title: 'Miauczenie o świcie',
    subtitle: 'Kot, który budzi cię o 4:30 — co stoi za wokalizacją',
    category: 'cat',
    tier: 'single',
    priceCode: 'p19',
    shortPromise: 'Diagnostyka „świcącego" kota i jak nie utrwalać wzorca.',
    forWhom: 'Dla opiekuna, który próbował już wszystkiego — od ignorowania po dolewanie karmy — i nic nie pomaga.',
    pdfFile: 'miauczenie-o-swicie.pdf',
    highlights: ['cztery przyczyny świtającej wokalizacji', 'czego nie robić', 'jak realnie zmienić rytm'],
  },

  // ─── STANDARDS 19 zł — psy ────────────────────────────────────────────
  {
    slug: 'pies-szczeka-na-gosci',
    title: 'Pies szczeka na gości i dzwonek',
    subtitle: 'Plan na codzienną wizytę kuriera, sąsiada, rodziny',
    category: 'dog',
    tier: 'single',
    priceCode: 'p19',
    shortPromise: 'Cztery typy szczekania i plan, który nie polega na karaniu.',
    forWhom: 'Dla opiekuna psa, dla którego dzwonek do drzwi to katastrofa.',
    pdfFile: 'pies-szczeka-na-gosci.pdf',
    highlights: ['typy szczekania na ludzi', 'plan z dzwonkiem i bez', 'kiedy interweniować, kiedy zignorować'],
  },
  {
    slug: 'pies-niszczy-w-domu',
    title: 'Pies niszczy w domu',
    subtitle: 'Co stoi za demolką: nuda, frustracja, separacja, zdrowie',
    category: 'dog',
    tier: 'single',
    priceCode: 'p19',
    shortPromise: 'Filtr czterech przyczyn niszczenia i pierwszy plan działania.',
    forWhom: 'Dla opiekuna psa, który po powrocie zastaje rozprute kanapy, kable, buty.',
    pdfFile: 'pies-niszczy-w-domu.pdf',
    highlights: ['cztery główne przyczyny niszczenia', 'co podpowiada nagranie', 'co podać psu zamiast walki'],
  },
  {
    slug: 'pies-broni-zasobow',
    title: 'Pies broni zasobów',
    subtitle: 'Resource guarding — od warknięcia po realny problem',
    category: 'dog',
    tier: 'single',
    priceCode: 'p19',
    shortPromise: 'Jak rozpoznać guarding wcześnie i nie utrwalić go karą.',
    forWhom: 'Dla opiekuna psa, który warczy nad miską, kością albo kanapą.',
    pdfFile: 'pies-broni-zasobow.pdf',
    highlights: ['skala intensywności guardingu', 'plan wymiany zasobu', 'czego nigdy nie robić'],
  },
  {
    slug: 'pies-pogon-i-hamulce',
    title: 'Pogoń, demolka i brak hamulców',
    subtitle: 'Pies, który nie umie się zatrzymać — co naprawdę można zrobić',
    category: 'dog',
    tier: 'single',
    priceCode: 'p19',
    shortPromise: 'Praca z impulsami i regulacją — dla psów, które nie umieją odpuścić.',
    forWhom: 'Dla opiekuna psa, dla którego każdy bodziec jest sygnałem do biegu.',
    pdfFile: 'pies-pogon-i-hamulce.pdf',
    highlights: ['skąd biorą się impulsy', 'plan pracy z hamulcami', 'kiedy specjalista'],
  },
  {
    slug: 'pies-glupieje-na-smyczy',
    title: 'Dlaczego pies głupieje na smyczy',
    subtitle: 'Frustracja smyczowa, brak hamulców, błędy z linki',
    category: 'dog',
    tier: 'single',
    priceCode: 'p19',
    shortPromise: 'Jak nie pomylić frustracji smyczowej z reaktywnością.',
    forWhom: 'Dla opiekuna psa, który na smyczy jest „inny" — spięty, ciągnący, łatwo wyprowadzany z równowagi.',
    pdfFile: 'pies-glupieje-na-smyczy.pdf',
    highlights: ['filtr: frustracja czy reaktywność', 'jak prowadzić spacer „spadkowy"', 'czego unikać'],
  },
  {
    slug: 'pies-do-pracy-z-ludzmi',
    title: 'Pies do pracy z ludźmi',
    subtitle: 'Psy interwencyjne, terapeutyczne, asystujące — czego się spodziewać',
    category: 'dog',
    tier: 'single',
    priceCode: 'p19',
    shortPromise: 'Co naprawdę oznacza „pies do pracy" i kiedy to nie jest dobry pomysł.',
    forWhom: 'Dla opiekuna, który myśli o pracy z psem albo ma psa o silnej motywacji do kontaktu.',
    pdfFile: 'pies-do-pracy-z-ludzmi.pdf',
    highlights: ['kiedy pies nadaje się do pracy', 'czego potrzebuje opiekun', 'czerwone flagi'],
  },
  {
    slug: 'szczeniak-gryzie-i-skacze',
    title: 'Szczeniak gryzie i skacze',
    subtitle: 'Pierwsze tygodnie z psem — gryzienie, skakanie, brak granic',
    category: 'puppy',
    tier: 'single',
    priceCode: 'p19',
    shortPromise: 'Jak ustawić pierwsze tygodnie tak, by szczeniak nie nauczył się złych nawyków.',
    forWhom: 'Dla opiekuna szczeniaka, który gryzie ręce, ubrania i skacze po wszystkich.',
    pdfFile: 'szczeniak-gryzie-i-skacze.pdf',
    highlights: ['plan pierwszych 14 dni', 'jak reagować na gryzienie', 'czego nie robić'],
  },
  {
    slug: 'szczeniak-wyciszanie',
    title: 'Szczeniak nie umie się wyciszyć',
    subtitle: 'Plan dnia, sen i regulacja w pierwszych miesiącach',
    category: 'puppy',
    tier: 'single',
    priceCode: 'p19',
    shortPromise: 'Jak ułożyć dzień szczeniaka, żeby umiał odpoczywać.',
    forWhom: 'Dla opiekuna szczeniaka, który wieczorem jest „nie do wytrzymania", a mimo to nie potrafi zasnąć.',
    pdfFile: 'szczeniak-wyciszanie.pdf',
    highlights: ['rytm dnia młodego psa', 'sygnały zmęczenia', 'kiedy więcej snu, kiedy więcej ruchu'],
  },
]

const RAW_BUNDLES: MaterialyBundle[] = [
  {
    slug: 'pakiet-kuweta',
    title: 'Pakiet „Kuweta"',
    subtitle: 'Trzy materiały kuwetowe w jednej cenie',
    category: 'cat',
    priceCode: 'p49',
    guideSlugs: ['kot-problem-poza-kuweta', 'kot-boi-sie-kuwety', 'konflikt-miedzy-kotami'],
    shortPromise: 'Pełna ścieżka kuwetowa: od pierwszego objawu po napięcie społeczne w domu wielokotowym.',
  },
  {
    slug: 'pakiet-kocie-napiecie',
    title: 'Pakiet „Kocie napięcie"',
    subtitle: 'Wycofanie, nocne pobudzenie, zmiana — co kot przeżywa pod skórą',
    category: 'cat',
    priceCode: 'p49',
    guideSlugs: ['kot-chowa-sie-po-zmianach', 'kot-budzi-dom-po-nocy', 'koty-zabawa-czy-napiecie'],
    shortPromise: 'Trzy materiały o napięciu kota: jak je rozpoznać, jak nie pogarszać.',
  },
  {
    slug: 'pakiet-trudny-pies',
    title: 'Pakiet „Trudny pies"',
    subtitle: 'Spacer, dzwonek, smycz — codzienność, która rozpada plan',
    category: 'dog',
    priceCode: 'p49',
    guideSlugs: ['pies-trudny-spacer', 'pies-glupieje-na-smyczy', 'pies-szczeka-na-gosci'],
    shortPromise: 'Trzy materiały o psie, który „się nie nadaje do miasta" — i jak to naprawdę zmienić.',
  },
  {
    slug: 'pakiet-szczeniak-start',
    title: 'Pakiet „Szczeniak start"',
    subtitle: 'Pierwsze tygodnie z psem bez chaosu',
    category: 'puppy',
    priceCode: 'p49',
    guideSlugs: ['szczeniak-gryzie-i-skacze', 'szczeniak-wyciszanie', 'pies-glupieje-na-smyczy'],
    shortPromise: 'Trzy materiały dla nowego opiekuna szczeniaka — jak nie uczyć go rzeczy do odkręcania.',
  },
  {
    slug: 'pakiet-pies-zostaje-sam',
    title: 'Pakiet „Pies zostaje sam"',
    subtitle: 'Samotność, niszczenie, dzwonek — codzienność po wyjściu z domu',
    category: 'dog',
    priceCode: 'p49',
    guideSlugs: ['pies-zostaje-sam', 'pies-niszczy-w-domu', 'pies-szczeka-na-gosci'],
    shortPromise: 'Trzy materiały o psie, który nie potrafi zostać sam — i jak to czytać szerzej niż tylko separacja.',
  },
  {
    slug: 'pakiet-kocia-pielegnacja',
    title: 'Pakiet „Kocia pielęgnacja"',
    subtitle: 'Czesanie, dotyk, kontakt — bez wojny',
    category: 'cat',
    priceCode: 'p49',
    guideSlugs: ['kot-broni-sie-przy-pielegnacji', 'kot-gryzie-przy-glaskaniu', 'kot-budzi-dom-po-nocy'],
    shortPromise: 'Trzy materiały o pracy z kotem, który nie chce być dotykany — i jak go czytać.',
  },
]

const guidesBySlug = new Map(RAW_GUIDES.map((g) => [g.slug, g] as const))
const bundlesBySlug = new Map(RAW_BUNDLES.map((b) => [b.slug, b] as const))

export function listMaterialyGuides(): MaterialyGuide[] {
  return RAW_GUIDES
}

export function listMaterialyBundles(): MaterialyBundle[] {
  return RAW_BUNDLES
}

export function getMaterialyGuideBySlug(slug: string): MaterialyGuide | null {
  return guidesBySlug.get(slug) ?? null
}

export function getMaterialyBundleBySlug(slug: string): MaterialyBundle | null {
  return bundlesBySlug.get(slug) ?? null
}

const MATERIALY_GUIDE_COVER_SLUGS = new Set([
  'konflikt-miedzy-kotami',
  'kot-boi-sie-kuwety',
  'kot-budzi-dom-po-nocy',
  'kot-chowa-sie-po-zmianach',
  'kot-zyje-w-napieciu',
  'pies-ile-ruchu-potrzebuje',
])

export function getMaterialyGuideCoverSrc(guide: Pick<MaterialyGuide, 'slug'>): string | null {
  return MATERIALY_GUIDE_COVER_SLUGS.has(guide.slug) ? `/branding/pdf-covers/${guide.slug}.png` : null
}

export function listMaterialyByTier(tier: MaterialyTier): (MaterialyGuide | MaterialyBundle)[] {
  if (tier === 'free') return RAW_GUIDES.filter((g) => g.tier === 'free')
  if (tier === 'bundle') return RAW_BUNDLES
  return RAW_GUIDES.filter((g) => g.tier === 'single')
}

export function listMaterialyByCategory(cat: MaterialyCategory): MaterialyGuide[] {
  return RAW_GUIDES.filter((g) => g.category === cat)
}

export function bundleSavings(bundle: MaterialyBundle): number {
  const sum = bundle.guideSlugs
    .map((slug) => guidesBySlug.get(slug))
    .filter((g): g is MaterialyGuide => g !== undefined)
    .reduce((acc, g) => acc + PRICE_AMOUNT_PLN[g.priceCode], 0)
  return Math.max(0, sum - PRICE_AMOUNT_PLN[bundle.priceCode])
}

export function categoryLabel(cat: MaterialyCategory): string {
  if (cat === 'cat') return 'Kot'
  if (cat === 'dog') return 'Pies'
  return 'Szczeniak'
}
