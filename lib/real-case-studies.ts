export type RealCaseImage = {
  src: string
  remoteSrc?: string
  alt: string
}

export type RealCaseProof = {
  problemType: string
  serviceFormat: string
  cooperationStage: string
  timeHorizon: string
  sourceContext: string
  outcomeSnapshot: string
}

export type RealCaseStudy = {
  id: string
  slug: string
  species: 'pies' | 'kot'
  breed: string
  age: string
  eyebrow: string
  headline: string
  summary: string
  firstStepLabel: string
  firstStepText: string
  nextStepLabel: string
  nextStepText: string
  metaDescription: string
  proof: RealCaseProof
  images: RealCaseImage[]
}

export const REAL_CASE_STUDIES = [
  {
    id: 'case-01',
    slug: 'reaktywnosc-na-spacerze-pies',
    species: 'pies',
    breed: 'mieszaniec',
    age: '3 lata',
    eyebrow: 'Reaktywność na spacerze',
    headline: 'Spacery, które przestały być przewidywalne',
    summary:
      'Pies reagował na inne psy szczekaniem, szarpaniem smyczy i długim pobudzeniem po mijance. Opiekun miał za sobą kilka prób treningowych, ale bez jasności, czy chodzi o lęk, frustrację czy przeciążenie spaceru.',
    firstStepLabel: 'Pierwszy krok',
    firstStepText:
      'Najpierw nazwalismy wyzwalacze, dystans i prog reakcji. To pozwolilo odsunac przypadkowe techniki i ustalić, czego nie dokladac psu na spacerze.',
    nextStepLabel: 'Dalszy kierunek',
    nextStepText:
      'Dalsza praca opiera się na przewidywalnym rytmie spaceru, zarzadzaniu odlegloscia i obserwacji momentu, w którym pies jeszcze może wróćic do kontaktu.',
    metaDescription:
      'Anonimowa sytuacja startowa psa reagujacego na spacerze: wyzwalacze, prog reakcji, pierwszy krok i dalszy kierunek konsultacji.',
    proof: {
      problemType: 'reaktywność na smyczy i pobudzenie spacerowe',
      serviceFormat: 'Kwadrans + pełna konsultacja online',
      cooperationStage: 'po uporzadkowaniu pierwszego etapu',
      timeHorizon: 'pierwsze decyzje po rozmowie, dalsza praca w kolejnych tygodniach',
      sourceContext: 'anonimizowany opis sytuacji startowej opiekuna',
      outcomeSnapshot: 'mniej chaosu przy mijankach i jasniejszy plan spacerow',
    },
    images: [
      {
        src: '/branding/case-studies/Border_Collie.jpg',
        alt: 'Pies stojacy na zewnatrz i obserwujacy otoczenie.',
      },
      {
        src: '/branding/topic-cards/french-bulldog-leash.jpg',
        alt: 'Pies na smyczy podczas spaceru w miejskim otoczeniu.',
      },
    ],
  },
  {
    id: 'case-02',
    slug: 'problemy-separacyjne-pies',
    species: 'pies',
    breed: 'mieszaniec',
    age: '4 lata',
    eyebrow: 'Problemy separacyjne',
    headline: 'Pies, który nie dawal rady zostac sam',
    summary:
      'Po zmianie rytmu dnia pies zaczal wyc po wyjściu opiekuna, chodzil za nim po mieszkaniu i napinal się już przy szykowaniu do wyjścia. Proste rady typu ignorowanie lub włączony telewizor nie porzadkowaly tematu.',
    firstStepLabel: 'Pierwszy krok',
    firstStepText:
      'Oddzieliliśmy zwykły protest od realnego napięcia przy rozstaniu. Pierwszym zadaniem było sprawdzić rytuał wyjścia i to, czy pies potrafi odpocząć bez opiekuna obok.',
    nextStepLabel: 'Dalszy kierunek',
    nextStepText:
      'Plan pracy zaczyna się od bardzo krótkich prób, monitoringu i budowania spokojnej bazy. Celem pierwszego etapu jest mniej paniki, nie szybkie zostawianie psa na wiele godzin.',
    metaDescription:
      'Anonimowa sytuacja startowa psa z problemami separacyjnymi: napięcie przy wyjściu, zostawanie samemu i pierwszy bezpieczny krok.',
    proof: {
      problemType: 'problemy separacyjne i napięcie przy rozstaniu',
      serviceFormat: 'Kwadrans + pełna konsultacja online',
      cooperationStage: 'po rozroznieniu protestu i realnego napiecia',
      timeHorizon: 'pierwszy etap rozpisany na kolejne tygodnie spokojnej pracy',
      sourceContext: 'anonimizowany opis po zmianie trybu pracy opiekuna',
      outcomeSnapshot: 'stabilniejsza baza i mniej chaosu przy wychodzeniu',
    },
    images: [
      {
        src: '/branding/topic-cards/dog-window-alone.jpg',
        alt: 'Pies wyglądający przez okno podczas pozostania w domu.',
      },
      {
        src: '/images/cutover/dog-separation.png',
        alt: 'Pies szukajacy spokojnego miejsca po wyjściu opiekuna.',
      },
    ],
  },
  {
    id: 'case-03',
    slug: 'pies-ciagnie-na-smyczy',
    species: 'pies',
    breed: 'labrador',
    age: '2 lata',
    eyebrow: 'Luzna smycz',
    headline: 'Spacer zamienial się w holowanie',
    summary:
      'Pies ciągnął od szczeniaka. Opiekunka próbowała zatrzymywania, zmiany kierunku i nagradzania kontaktu, ale każda metoda działała tylko chwilowo. Pod spodem było dużo pobudzenia jeszcze przed wyjściem.',
    firstStepLabel: 'Pierwszy krok',
    firstStepText:
      'Najpierw oddzieliliśmy nawyk od pobudzenia. Praca miała zacząć się przed drzwiami, a nie dopiero wtedy, gdy smycz była już napięta.',
    nextStepLabel: 'Dalszy kierunek',
    nextStepText:
      'Opiekunka dostala jeden punkt startu, prostszy rytm wyjścia i kryterium, kiedy temat wymaga dłuższej konsultacji zamiast kolejnej metody z internetu.',
    metaDescription:
      'Anonimowa sytuacja startowa psa ciagnacego na smyczy: pobudzenie, rytm spaceru i pierwszy kierunek pracy.',
    proof: {
      problemType: 'ciągnięcie na smyczy i wysokie pobudzenie',
      serviceFormat: 'start od Kwadransa',
      cooperationStage: 'po pierwszym ustawieniu cwrócićzenia i kryteriow dalszej pracy',
      timeHorizon: 'pierwszy ruch od razu, dalsze decyzje po obserwacji',
      sourceContext: 'anonimizowany opis po wielu krótkotrwałych próbach treningowych',
      outcomeSnapshot: 'jeden punkt startu zamiast kolejnych desperackich prób',
    },
    images: [
      {
        src: '/branding/case-studies/labrador_luksi01.jpg',
        alt: 'Labrador w portretowym kadrze na zewnatrz.',
      },
      {
        src: '/branding/topic-cards/dog-resting-home.jpg',
        alt: 'Pies odpoczywajacy w spokojnym domowym wnetrzu.',
      },
    ],
  },
  {
    id: 'case-04',
    slug: 'start-po-adopcji-psa',
    species: 'pies',
    breed: 'suczka mix',
    age: '2-3 lata',
    eyebrow: 'Start po adopcji',
    headline: 'Nowy pies, nowy dom, dużo pytań',
    summary:
      'Suczka po adopcji w pierwszych dniach mało jadła, chowała się i nie reagowała na wołanie. Opiekunka nie wiedziała, czy to typowa adaptacja, czy sygnał większego problemu.',
    firstStepLabel: 'Pierwszy krok',
    firstStepText:
      'Ustaliliśmy, co mieści się w spokojnej adaptacji, a co byłoby sygnałem alarmowym. Najważniejsze były pierwsze 72 godziny, nie szybkie oswajanie.',
    nextStepLabel: 'Dalszy kierunek',
    nextStepText:
      'Plan obejmował mniej stymulacji, bezpieczną przestrzeń i obserwacje apetytu, snu oraz reakcji na kontakt. Pierwsze dni dostały jasne ramy.',
    metaDescription:
      'Anonimowa sytuacja startowa po adopcji psa: pierwsze dni, bezpieczna przestrzeń i sygnały do obserwacji.',
    proof: {
      problemType: 'start po adopcji i trudna adaptacja',
      serviceFormat: 'start od Kwadransa',
      cooperationStage: 'po ustawieniu pierwszych 72 godzin',
      timeHorizon: 'najważniejsze decyzje podjete na początku adaptacji',
      sourceContext: 'anonimizowany opis pierwszych dni po adopcji',
      outcomeSnapshot: 'mniej presji i jasne ramy pierwszego etapu',
    },
    images: [
      {
        src: '/branding/topic-cards/dog-resting-home.jpg',
        alt: 'Pies odpoczywajacy na kanapie w spokojnym swietle.',
      },
      {
        src: '/images/cutover/dog-puppy-home.png',
        alt: 'Pies w domowym wnetrzu blisko opiekuna.',
      },
    ],
  },
  {
    id: 'case-05',
    slug: 'kot-poza-kuweta',
    species: 'kot',
    breed: 'kot kastrowany',
    age: '4 lata',
    eyebrow: 'Kuweta po zmianie',
    headline: 'Kot, który zaczął omijać kuwetę',
    summary:
      'Po przeprowadzce kot zaczął załatwiać się na dywanie mimo wcześniejszego korzystania z kuwety. Najpierw trzeba było oddzielić zdrowie, stres, ustawienie kuwety i nowe bodźce w mieszkaniu.',
    firstStepLabel: 'Pierwszy krok',
    firstStepText:
      'Pierwsza rozmowa uporzadkowala, czego nie zmieniać losowo i jakie informacje przygotowac do dalszej analizy: zdrowie, mapa kuwet, rytm dnia i miejsca napiecia.',
    nextStepLabel: 'Dalszy kierunek',
    nextStepText:
      'Dalsza praca skupia się na środowisku i zasobach. Przy nagłej zmianie zachowania temat zdrowotny zostaje traktowany jako równoległy priorytet.',
    metaDescription:
      'Anonimowa sytuacja startowa kota załatwiającego się poza kuwetą: zdrowie, stres, kuweta i środowisko.',
    proof: {
      problemType: 'załatwianie poza kuwetą po zmianie w domu',
      serviceFormat: 'Kwadrans + pełna konsultacja online',
      cooperationStage: 'po uporzadkowaniu tla i wejściu w analize źrodowiska',
      timeHorizon: 'pierwsze decyzje po rozmowie, korekty po obserwacji',
      sourceContext: 'anonimizowany opis po zmianach zwirku i ustawienia kuwety',
      outcomeSnapshot: 'mniej losowych zmian i jaśniejsza kolejność sprawdzania',
    },
    images: [
      {
        src: '/branding/case-cat-sofa.jpg',
        alt: 'Kot odpoczywajacy na sofie w domowym wnetrzu.',
      },
      {
        src: '/branding/topic-cards/cats/cat-litter-box.jpg',
        alt: 'Kot w poblizu kuwety w mieszkaniu.',
      },
    ],
  },
  {
    id: 'case-06',
    slug: 'konflikt-miedzy-kotami',
    species: 'kot',
    breed: 'dwa koty',
    age: '3 i 5 lat',
    eyebrow: 'Relacje w domu',
    headline: 'Dwa koty, jedno mieszkanie, dużo napięcia',
    summary:
      'Po zmianie w domu jeden kot zaczął blokować dostęp do miski i kuwety, a drugi wycofał się do jednego pokoju. Opiekunowie próbowali przeczekać sytuację albo rozdzielać koty dopiero po incydentach.',
    firstStepLabel: 'Pierwszy krok',
    firstStepText:
      'Najpierw nazwaliśmy, że to nie jest temat "same się dogadają", tylko układ terytorialny i zasoby, które trzeba zabezpieczyć.',
    nextStepLabel: 'Dalszy kierunek',
    nextStepText:
      'Plan opiera się na rozdzieleniu zasobów, spokojniejszych strefach i reintrodukcji przez zapach. Celem jest spadek napiecia, nie wymuszenie przyjazni.',
    metaDescription:
      'Anonimowa sytuacja startowa konfliktu między kotami: zasoby, przestrzeń i spokojny plan pierwszego etapu.',
    proof: {
      problemType: 'konflikt między kotami i blokowanie zasobów',
      serviceFormat: 'pełna konsultacja online',
      cooperationStage: 'po pierwszej analizie przestrzeni i zasad kontaktu',
      timeHorizon: 'pierwszy etap rozpisany na tygodnie spokojnej pracy',
      sourceContext: 'anonimizowany opis konfliktu przy misce, kuwecie i przejśćiach',
      outcomeSnapshot: 'jasniejsze zasady przestrzeni i mniej eskalacji w domu',
    },
    images: [
      {
        src: '/branding/topic-cards/cats/cat-intercat-conflict.jpg',
        alt: 'Dwa koty spotykajace się w napietej domowej sytuacji.',
      },
      {
        src: '/branding/case-cat-snow.jpg',
        alt: 'Kot w zimowym swietle w portretowym ujeciu.',
      },
    ],
  },
  {
    id: 'case-07',
    slug: 'kot-boi-sie-gosci',
    species: 'kot',
    breed: 'kotka',
    age: '5 lat',
    eyebrow: 'Lęk i goscie',
    headline: 'Kot, który chowal się przez cale wizyty',
    summary:
      'Kotka po przeprowadzce przy kazdej wizycie chowala się na wiele godzin. Proby oswajania przez zapraszanie gosci do jej pokoju zwiekszaly napięcie zamiast je zmniejszac.',
    firstStepLabel: 'Pierwszy krok',
    firstStepText:
      'Ustalilismy, że pierwszym celem nie jest kontakt z goscmi, tylko bezpieczna strefa i zmiana oczekiwan wobec kota oraz ludzi.',
    nextStepLabel: 'Dalszy kierunek',
    nextStepText:
      'Dalsza praca polega na kontroli bodzcow, przewidywalnym rytmie wizyt i możliwosci wyjścia z ukrycia bez presji na interakcje.',
    metaDescription:
      'Anonimowa sytuacja startowa kota chowajacego się przed goscmi: bezpieczna strefa, stres i spokojny plan.',
    proof: {
      problemType: 'lęk kota przy gościach i po przeprowadzce',
      serviceFormat: 'start od Kwadransa',
      cooperationStage: 'po ustawieniu bezpiecznej strefy',
      timeHorizon: 'pierwsze decyzje po rozmowie, obserwacja przy kolejnych wizytach',
      sourceContext: 'anonimizowany opis nieudanych prób oswajania z gośćmi',
      outcomeSnapshot: 'mniej presji na kontakt i bezpieczniejszy rytm wizyt',
    },
    images: [
      {
        src: '/branding/topic-cards/cats/cat-anxious-hiding.jpg',
        alt: 'Kot obserwujacy otoczenie z bezpiecznej kryjowki.',
      },
      {
        src: '/branding/case-cat-scratcher.jpg',
        alt: 'Kot przy drapaku w spokojnym domowym otoczeniu.',
      },
    ],
  },
  {
    id: 'case-08',
    slug: 'kot-budzi-w-nocy',
    species: 'kot',
    breed: 'kocur',
    age: '1,5 roku',
    eyebrow: 'Nocna aktywność',
    headline: 'Kot, który budzil dom w srodku nocy',
    summary:
      'Mlody kot biegal po mieszkaniu, atakowal nogi i domagal się uwagi w nocy. Problem wygladal jak zlosliwosc albo agresja, ale wymagal sprawdzenia rytmu dnia, zabawy, jedzenia, stresu i zdrowia.',
    firstStepLabel: 'Pierwszy krok',
    firstStepText:
      'Zaczelismy od mapy dnia: kiedy kot spi, kiedy je, jak wygląda zabawa i co dzieje się wieczorem. To pokazalo, gdzie powstaje napięcie.',
    nextStepLabel: 'Dalszy kierunek',
    nextStepText:
      'Dalsza praca porządkuje wieczorny rytm, wzbogacenie środowiska i bezpieczne ujście energii. Nie chodzi o karanie kota, tylko o zmianę układu dnia.',
    metaDescription:
      'Anonimowa sytuacja startowa kota budzącego w nocy: aktywność, rytm dnia, zabawa i pierwszy kierunek pracy.',
    proof: {
      problemType: 'nocne pobudzenie i atakowanie opiekuna',
      serviceFormat: 'pełna konsultacja online',
      cooperationStage: 'po analizie źrodowiska i rytmu dnia',
      timeHorizon: 'pierwsze zmiany po uporzadkowaniu wieczoru',
      sourceContext: 'anonimizowany opis nocnych pobudek i codziennego rytmu kota',
      outcomeSnapshot: 'bardziej przewidywalny wieczor i mniej chaosu w nocy',
    },
    images: [
      {
        src: '/branding/topic-cards/cats/cat-night-meowing.jpg',
        alt: 'Kot aktywny noca w mieszkaniu.',
      },
      {
        src: '/branding/case-cat-sofa.jpg',
        alt: 'Kot lezacy na sofie w domowym wnetrzu.',
      },
    ],
  },
] satisfies RealCaseStudy[]

export function getRealCaseProofPills(caseStudy: RealCaseStudy) {
  return [
    caseStudy.proof.problemType,
    caseStudy.proof.serviceFormat,
    caseStudy.proof.cooperationStage,
    caseStudy.proof.timeHorizon,
  ]
}

export function getRealCaseStudyPath(caseStudy: RealCaseStudy) {
  return `/historie/${caseStudy.slug}`
}

export function getRealCaseStudyBySlug(slug: string) {
  return REAL_CASE_STUDIES.find((caseStudy) => caseStudy.slug === slug) ?? null
}

export function listRealCaseStudyPaths() {
  return ['/historie', ...REAL_CASE_STUDIES.map(getRealCaseStudyPath)]
}

export function getRealCaseSpeciesLabel(species: RealCaseStudy['species']) {
  return species === 'pies' ? 'Pies' : 'Kot'
}
