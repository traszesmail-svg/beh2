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
    eyebrow: 'Reaktywnosc na spacerze',
    headline: 'Spacery, ktore przestaly byc przewidywalne',
    summary:
      'Pies reagowal na inne psy szczekaniem, szarpaniem smyczy i dlugim pobudzeniem po mijance. Opiekun mial za soba kilka prob treningowych, ale bez jasnosci, czy chodzi o lek, frustracje czy przeciazenie spaceru.',
    firstStepLabel: 'Pierwszy krok',
    firstStepText:
      'Najpierw nazwalismy wyzwalacze, dystans i prog reakcji. To pozwolilo odsunac przypadkowe techniki i ustalic, czego nie dokladac psu na spacerze.',
    nextStepLabel: 'Dalszy kierunek',
    nextStepText:
      'Dalsza praca opiera sie na przewidywalnym rytmie spaceru, zarzadzaniu odlegloscia i obserwacji momentu, w ktorym pies jeszcze moze wrocic do kontaktu.',
    metaDescription:
      'Anonimowa sytuacja startowa psa reagujacego na spacerze: wyzwalacze, prog reakcji, pierwszy krok i dalszy kierunek konsultacji.',
    proof: {
      problemType: 'reaktywnosc na smyczy i pobudzenie spacerowe',
      serviceFormat: 'Kwadrans + pelna konsultacja online',
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
    headline: 'Pies, ktory nie dawal rady zostac sam',
    summary:
      'Po zmianie rytmu dnia pies zaczal wyc po wyjsciu opiekuna, chodzil za nim po mieszkaniu i napinal sie juz przy szykowaniu do wyjscia. Proste rady typu ignorowanie lub wlaczony telewizor nie porzadkowaly tematu.',
    firstStepLabel: 'Pierwszy krok',
    firstStepText:
      'Oddzielilismy zwykly protest od realnego napiecia przy rozstaniu. Pierwszym zadaniem bylo sprawdzic rytual wyjscia i to, czy pies potrafi odpoczac bez opiekuna obok.',
    nextStepLabel: 'Dalszy kierunek',
    nextStepText:
      'Plan pracy zaczyna sie od bardzo krotkich prob, monitoringu i budowania spokojnej bazy. Celem pierwszego etapu jest mniej paniki, nie szybkie zostawianie psa na wiele godzin.',
    metaDescription:
      'Anonimowa sytuacja startowa psa z problemami separacyjnymi: napiecie przy wyjsciu, zostawanie samemu i pierwszy bezpieczny krok.',
    proof: {
      problemType: 'problemy separacyjne i napiecie przy rozstaniu',
      serviceFormat: 'Kwadrans + pelna konsultacja online',
      cooperationStage: 'po rozroznieniu protestu i realnego napiecia',
      timeHorizon: 'pierwszy etap rozpisany na kolejne tygodnie spokojnej pracy',
      sourceContext: 'anonimizowany opis po zmianie trybu pracy opiekuna',
      outcomeSnapshot: 'stabilniejsza baza i mniej chaosu przy wychodzeniu',
    },
    images: [
      {
        src: '/branding/topic-cards/dog-window-alone.jpg',
        alt: 'Pies wygladajacy przez okno podczas pozostania w domu.',
      },
      {
        src: '/images/cutover/dog-separation.png',
        alt: 'Pies szukajacy spokojnego miejsca po wyjsciu opiekuna.',
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
    headline: 'Spacer zamienial sie w holowanie',
    summary:
      'Pies ciagnal od szczeniaka. Opiekunka probowala zatrzymywania, zmiany kierunku i nagradzania kontaktu, ale kazda metoda dzialala tylko chwilowo. Pod spodem bylo duzo pobudzenia jeszcze przed wyjsciem.',
    firstStepLabel: 'Pierwszy krok',
    firstStepText:
      'Najpierw oddzielilismy nawyk od pobudzenia. Praca miala zaczac sie przed drzwiami, a nie dopiero wtedy, gdy smycz byla juz napieta.',
    nextStepLabel: 'Dalszy kierunek',
    nextStepText:
      'Opiekunka dostala jeden punkt startu, prostszy rytm wyjscia i kryterium, kiedy temat wymaga dluzszej konsultacji zamiast kolejnej metody z internetu.',
    metaDescription:
      'Anonimowa sytuacja startowa psa ciagnacego na smyczy: pobudzenie, rytm spaceru i pierwszy kierunek pracy.',
    proof: {
      problemType: 'ciagniecie na smyczy i wysokie pobudzenie',
      serviceFormat: 'start od Kwadransa',
      cooperationStage: 'po pierwszym ustawieniu cwiczenia i kryteriow dalszej pracy',
      timeHorizon: 'pierwszy ruch od razu, dalsze decyzje po obserwacji',
      sourceContext: 'anonimizowany opis po wielu krotkotrwalych probach treningowych',
      outcomeSnapshot: 'jeden punkt startu zamiast kolejnych desperackich prob',
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
    headline: 'Nowy pies, nowy dom, duzo pytan',
    summary:
      'Suczka po adopcji w pierwszych dniach malo jadla, chowala sie i nie reagowala na wolanie. Opiekunka nie wiedziala, czy to typowa adaptacja, czy sygnal wiekszego problemu.',
    firstStepLabel: 'Pierwszy krok',
    firstStepText:
      'Ustalilismy, co miesci sie w spokojnej adaptacji, a co byloby sygnalem alarmowym. Najwazniejsze byly pierwsze 72 godziny, nie szybkie oswajanie.',
    nextStepLabel: 'Dalszy kierunek',
    nextStepText:
      'Plan obejmowal mniej stymulacji, bezpieczna przestrzen i obserwacje apetytu, snu oraz reakcji na kontakt. Pierwsze dni dostaly jasne ramy.',
    metaDescription:
      'Anonimowa sytuacja startowa po adopcji psa: pierwsze dni, bezpieczna przestrzen i sygnaly do obserwacji.',
    proof: {
      problemType: 'start po adopcji i trudna adaptacja',
      serviceFormat: 'start od Kwadransa',
      cooperationStage: 'po ustawieniu pierwszych 72 godzin',
      timeHorizon: 'najwazniejsze decyzje podjete na poczatku adaptacji',
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
    headline: 'Kot, ktory zaczal omijac kuwete',
    summary:
      'Po przeprowadzce kot zaczal zalatwiac sie na dywanie mimo wczesniejszego korzystania z kuwety. Najpierw trzeba bylo oddzielic zdrowie, stres, ustawienie kuwety i nowe bodzce w mieszkaniu.',
    firstStepLabel: 'Pierwszy krok',
    firstStepText:
      'Pierwsza rozmowa uporzadkowala, czego nie zmieniac losowo i jakie informacje przygotowac do dalszej analizy: zdrowie, mapa kuwet, rytm dnia i miejsca napiecia.',
    nextStepLabel: 'Dalszy kierunek',
    nextStepText:
      'Dalsza praca skupia sie na srodowisku i zasobach. Przy naglej zmianie zachowania temat zdrowotny zostaje traktowany jako rownolegly priorytet.',
    metaDescription:
      'Anonimowa sytuacja startowa kota zalatwiajacego sie poza kuweta: zdrowie, stres, kuweta i srodowisko.',
    proof: {
      problemType: 'zalatwianie poza kuweta po zmianie w domu',
      serviceFormat: 'Kwadrans + pelna konsultacja online',
      cooperationStage: 'po uporzadkowaniu tla i wejsciu w analize srodowiska',
      timeHorizon: 'pierwsze decyzje po rozmowie, korekty po obserwacji',
      sourceContext: 'anonimizowany opis po zmianach zwirku i ustawienia kuwety',
      outcomeSnapshot: 'mniej losowych zmian i jasniejsza kolejnosc sprawdzania',
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
    headline: 'Dwa koty, jedno mieszkanie, duzo napiecia',
    summary:
      'Po zmianie w domu jeden kot zaczal blokowac dostep do miski i kuwety, a drugi wycofal sie do jednego pokoju. Opiekunowie probowali przeczekac sytuacje albo rozdzielac koty dopiero po incydentach.',
    firstStepLabel: 'Pierwszy krok',
    firstStepText:
      'Najpierw nazwalismy, ze to nie jest temat "same sie dogadaja", tylko uklad terytorialny i zasoby, ktore trzeba zabezpieczyc.',
    nextStepLabel: 'Dalszy kierunek',
    nextStepText:
      'Plan opiera sie na rozdzieleniu zasobow, spokojniejszych strefach i reintrodukcji przez zapach. Celem jest spadek napiecia, nie wymuszenie przyjazni.',
    metaDescription:
      'Anonimowa sytuacja startowa konfliktu miedzy kotami: zasoby, przestrzen i spokojny plan pierwszego etapu.',
    proof: {
      problemType: 'konflikt miedzy kotami i blokowanie zasobow',
      serviceFormat: 'pelna konsultacja online',
      cooperationStage: 'po pierwszej analizie przestrzeni i zasad kontaktu',
      timeHorizon: 'pierwszy etap rozpisany na tygodnie spokojnej pracy',
      sourceContext: 'anonimizowany opis konfliktu przy misce, kuwecie i przejsciach',
      outcomeSnapshot: 'jasniejsze zasady przestrzeni i mniej eskalacji w domu',
    },
    images: [
      {
        src: '/branding/topic-cards/cats/cat-intercat-conflict.jpg',
        alt: 'Dwa koty spotykajace sie w napietej domowej sytuacji.',
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
    eyebrow: 'Lek i goscie',
    headline: 'Kot, ktory chowal sie przez cale wizyty',
    summary:
      'Kotka po przeprowadzce przy kazdej wizycie chowala sie na wiele godzin. Proby oswajania przez zapraszanie gosci do jej pokoju zwiekszaly napiecie zamiast je zmniejszac.',
    firstStepLabel: 'Pierwszy krok',
    firstStepText:
      'Ustalilismy, ze pierwszym celem nie jest kontakt z goscmi, tylko bezpieczna strefa i zmiana oczekiwan wobec kota oraz ludzi.',
    nextStepLabel: 'Dalszy kierunek',
    nextStepText:
      'Dalsza praca polega na kontroli bodzcow, przewidywalnym rytmie wizyt i mozliwosci wyjscia z ukrycia bez presji na interakcje.',
    metaDescription:
      'Anonimowa sytuacja startowa kota chowajacego sie przed goscmi: bezpieczna strefa, stres i spokojny plan.',
    proof: {
      problemType: 'lek kota przy goscich i po przeprowadzce',
      serviceFormat: 'start od Kwadransa',
      cooperationStage: 'po ustawieniu bezpiecznej strefy',
      timeHorizon: 'pierwsze decyzje po rozmowie, obserwacja przy kolejnych wizytach',
      sourceContext: 'anonimizowany opis nieudanych prob oswajania z goscmi',
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
    eyebrow: 'Nocna aktywnosc',
    headline: 'Kot, ktory budzil dom w srodku nocy',
    summary:
      'Mlody kot biegal po mieszkaniu, atakowal nogi i domagal sie uwagi w nocy. Problem wygladal jak zlosliwosc albo agresja, ale wymagal sprawdzenia rytmu dnia, zabawy, jedzenia, stresu i zdrowia.',
    firstStepLabel: 'Pierwszy krok',
    firstStepText:
      'Zaczelismy od mapy dnia: kiedy kot spi, kiedy je, jak wyglada zabawa i co dzieje sie wieczorem. To pokazalo, gdzie powstaje napiecie.',
    nextStepLabel: 'Dalszy kierunek',
    nextStepText:
      'Dalsza praca porzadkuje wieczorny rytm, wzbogacenie srodowiska i bezpieczne ujscie energii. Nie chodzi o karanie kota, tylko o zmiane ukladu dnia.',
    metaDescription:
      'Anonimowa sytuacja startowa kota budzacego w nocy: aktywnosc, rytm dnia, zabawa i pierwszy kierunek pracy.',
    proof: {
      problemType: 'nocne pobudzenie i atakowanie opiekuna',
      serviceFormat: 'pelna konsultacja online',
      cooperationStage: 'po analizie srodowiska i rytmu dnia',
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
