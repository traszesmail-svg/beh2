export type QuizAnswerValue = string
export type QuizAnswers = Record<string, QuizAnswerValue>
export type QuizSpecies = 'pies' | 'kot'
export type QuizServiceKey = 'kwadrans' | 'dwa-kwadranse' | 'pelna-konsultacja'

export type QuizOption = {
  id: string
  label: string
  helper?: string
}

export type QuizQuestion = {
  id: string
  title: string
  helper?: string
  options: QuizOption[]
}

export type QuizResult = {
  serviceKey: QuizServiceKey
  title: string
  summary: string
  reasons: string[]
  note: string
  materialTitle: string
  materialHref: string
  materialCopy: string
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'species',
    title: 'Kogo dotyczy problem?',
    helper: 'Wybierz gatunek, z ktorym chcesz zaczac.',
    options: [
      { id: 'pies', label: 'Pies', helper: 'Spacer, separacja, pobudzenie, agresja, szczeniak.' },
      { id: 'kot', label: 'Kot', helper: 'Kuweta, stres, relacje miedzy kotami, nocna aktywnosc.' },
    ],
  },
  {
    id: 'main_topic',
    title: 'Jaki obszar jest najblizszy sytuacji?',
    helper: 'Wybierz najwazniejszy watek. Jesli jest ich kilka, zaznacz wariant zlozony.',
    options: [
      { id: 'single_behavior', label: 'Jedno zachowanie', helper: 'Np. szczekanie w jednym kontekscie, kuweta, ciagniecie, nocne miauczenie.' },
      { id: 'routine_stress', label: 'Stres w codziennej rutynie', helper: 'Problem wraca w domu, na spacerze, przy gosciach albo zmianach.' },
      { id: 'relationship', label: 'Relacje i konflikt', helper: 'Dotyczy ludzi, drugiego zwierzecia, zasobow albo kontaktu.' },
      { id: 'many_threads', label: 'Kilka watkow naraz', helper: 'Trudno wskazac jeden problem, bo rzeczy sie lacza.' },
    ],
  },
  {
    id: 'safety',
    title: 'Czy pojawia sie ryzyko bezpieczenstwa?',
    helper: 'Tu nie chodzi o straszenie, tylko o dobranie formatu bez skracania waznej analizy.',
    options: [
      { id: 'none', label: 'Nie widze takiego ryzyka', helper: 'Problem jest trudny, ale bez atakow, pogryzien albo paniki.' },
      { id: 'manageable', label: 'Sa silne reakcje, ale do opanowania', helper: 'Np. szczekanie, ucieczka, warczenie, napiecie przy dystansie.' },
      { id: 'serious', label: 'Bylo pogryzienie, atak albo realne zagrozenie', helper: 'Ludzie lub zwierzeta moga ucierpiec, sytuacja eskaluje.' },
    ],
  },
  {
    id: 'medical_change',
    title: 'Czy zachowanie zmienilo sie nagle albo widzisz objawy zdrowotne?',
    helper: 'Przy bolu, chorobie lub naglej zmianie behawior powinien isc rownolegle z lekarzem weterynarii.',
    options: [
      { id: 'no', label: 'Nie, obraz jest raczej staly', helper: 'Nie widze naglej zmiany zdrowia, apetytu, ruchu ani kuwety.' },
      { id: 'unclear', label: 'Nie jestem pewna/pewien', helper: 'Cos sie zmienilo, ale trudno powiedziec, czy to zdrowie czy zachowanie.' },
      { id: 'yes', label: 'Tak, sa czerwone flagi', helper: 'Nagla zmiana, bol, apatia, pragnienie, kuweta, agresja przy dotyku albo senior.' },
    ],
  },
  {
    id: 'duration',
    title: 'Jak dlugo to trwa?',
    helper: 'Czas trwania pomaga dobrac zakres, nie diagnoze.',
    options: [
      { id: 'fresh', label: 'Od niedawna', helper: 'Dni albo kilka tygodni.' },
      { id: 'returning', label: 'Wraca regularnie', helper: 'Sa lepsze i gorsze okresy.' },
      { id: 'long', label: 'Dluzej niz kilka miesiecy', helper: 'Problem utrwalil sie w codziennosci.' },
    ],
  },
  {
    id: 'frequency',
    title: 'Jak czesto problem sie pojawia?',
    helper: 'Czestotliwosc pokazuje, czy wystarczy instrukcja, czy potrzebny jest plan.',
    options: [
      { id: 'rare', label: 'Sporadycznie', helper: 'Raz na jakis czas albo w bardzo konkretnych sytuacjach.' },
      { id: 'weekly', label: 'Kilka razy w tygodniu', helper: 'Wraca regularnie, ale nie dominuje calego dnia.' },
      { id: 'daily', label: 'Codziennie lub prawie codziennie', helper: 'Wplywa na rytm domu, spacery, sen albo relacje.' },
    ],
  },
  {
    id: 'predictability',
    title: 'Czy umiesz przewidziec, kiedy to sie wydarzy?',
    helper: 'Im mniej przewidywalny obraz, tym wiecej trzeba dopytac.',
    options: [
      { id: 'clear', label: 'Tak, wyzwalacz jest jasny', helper: 'Wiem, kiedy zaczyna sie problem i co go uruchamia.' },
      { id: 'partial', label: 'Czesciowo', helper: 'Widze pewne schematy, ale nie wszystkie sytuacje pasuja.' },
      { id: 'unclear', label: 'Nie, to wyglada chaotycznie', helper: 'Problem pojawia sie nagle albo trudno polaczyc fakty.' },
    ],
  },
  {
    id: 'resources',
    title: 'Czy w tle sa zasoby, rutyna albo srodowisko?',
    helper: 'Dotyczy przestrzeni, spacerow, kuwety, karmienia, nudy, zmian w domu i relacji.',
    options: [
      { id: 'simple', label: 'Raczej jeden prosty element', helper: 'Np. miejsce kuwety, smycz, jedna pora dnia, jeden bodziec.' },
      { id: 'several', label: 'Kilka elementow naraz', helper: 'Rutyna, przestrzen, reakcje ludzi i emocje zwierzecia sie lacza.' },
      { id: 'multi_pet', label: 'W gre wchodzi kilka zwierzat lub domownikow', helper: 'Potrzebna jest analiza relacji i zarzadzania sytuacja.' },
    ],
  },
  {
    id: 'previous_attempts',
    title: 'Co juz probowaliscie?',
    helper: 'Jesli bylo duzo prob bez efektu, sama checklista zwykle nie wystarczy.',
    options: [
      { id: 'none', label: 'Jeszcze nic systematycznie', helper: 'Chcesz zaczac od dobrze ulozonych podstaw.' },
      { id: 'some', label: 'Kilka prostych zmian', helper: 'Byly drobne proby, ale bez jasnego planu.' },
      { id: 'many', label: 'Duzo prob i nadal brak poprawy', helper: 'Problem wraca mimo treningu, porad z internetu albo zmian w domu.' },
    ],
  },
  {
    id: 'goal',
    title: 'Jaki efekt bylby teraz najbardziej pomocny?',
    helper: 'Dzieki temu wynik nie pcha od razu w za duzy format.',
    options: [
      { id: 'material', label: 'Najpierw material lub PDF', helper: 'Chcesz sprobowac prostego, uporzadkowanego kroku samodzielnie.' },
      { id: 'priority', label: 'Ustalic pierwszy priorytet w rozmowie', helper: 'Chcesz szybko wiedziec, co robic jako pierwsze.' },
      { id: 'plan', label: 'Ulozyc plan na kilka krokow', helper: 'Potrzebujesz wiecej kontekstu i konkretnego kierunku.' },
      { id: 'diagnosis', label: 'Pelniej przeanalizowac sytuacje', helper: 'Sprawa jest zlozona, utrwalona albo dotyczy bezpieczenstwa.' },
    ],
  },
]

export const QUIZ_SERVICE_LABELS: Record<QuizServiceKey, { label: string; price: string; duration: string }> = {
  kwadrans: {
    label: 'Kwadrans',
    price: '69 zl',
    duration: '15 min audio',
  },
  'dwa-kwadranse': {
    label: 'Dwa kwadranse',
    price: '169 zl',
    duration: '30 min online',
  },
  'pelna-konsultacja': {
    label: 'Pelna konsultacja',
    price: '470 zl',
    duration: 'pelny zakres online',
  },
}

export function resolveQuizResult(answers: QuizAnswers): QuizResult {
  const mainTopic = answers.main_topic
  const safety = answers.safety
  const medicalChange = answers.medical_change
  const duration = answers.duration
  const frequency = answers.frequency
  const predictability = answers.predictability
  const resources = answers.resources
  const previousAttempts = answers.previous_attempts
  const goal = answers.goal
  const species = answers.species === 'kot' ? 'kot' : 'pies'
  const materialTitle =
    species === 'kot'
      ? 'Najpierw PDF albo material o kuwecie, stresie lub relacjach kotow'
      : 'Najpierw PDF albo material o spacerach, emocjach lub rutynie psa'
  const materialHref = '/niezbednik'

  let score = 0
  const reasons: string[] = []

  if (mainTopic === 'relationship') score += 2
  if (mainTopic === 'many_threads') score += 3
  if (safety === 'manageable') score += 2
  if (safety === 'serious') score += 6
  if (medicalChange === 'unclear') score += 2
  if (medicalChange === 'yes') score += 5
  if (duration === 'returning') score += 1
  if (duration === 'long') score += 2
  if (frequency === 'weekly') score += 1
  if (frequency === 'daily') score += 2
  if (predictability === 'partial') score += 1
  if (predictability === 'unclear') score += 2
  if (resources === 'several') score += 2
  if (resources === 'multi_pet') score += 3
  if (previousAttempts === 'some') score += 1
  if (previousAttempts === 'many') score += 2
  if (goal === 'plan') score += 2
  if (goal === 'diagnosis') score += 4

  if (safety === 'serious') {
    reasons.push('pojawia sie realne ryzyko bezpieczenstwa')
  }
  if (medicalChange === 'yes' || medicalChange === 'unclear') {
    reasons.push('warto rownolegle sprawdzic warstwe zdrowotna')
  }
  if (mainTopic === 'many_threads' || resources === 'several' || resources === 'multi_pet') {
    reasons.push('problem laczy kilka obszarow, a nie jedna prosta wskazowke')
  }
  if (duration === 'long' || frequency === 'daily') {
    reasons.push('wzorzec jest utrwalony albo czesto wraca')
  }
  if (predictability === 'unclear' || previousAttempts === 'many') {
    reasons.push('trzeba najpierw uporzadkowac fakty i dotychczasowe proby')
  }

  if (score >= 8) {
    return {
      serviceKey: 'pelna-konsultacja',
      title: 'Najblizej pasuje pelna konsultacja',
      summary:
        'To format dla spraw zlozonych, utrwalonych, wielowatkowych albo dotyczacych bezpieczenstwa. Najpierw warto zebrac kontekst, a dopiero potem ukladac plan.',
      reasons: reasons.length > 0 ? reasons.slice(0, 4) : ['sprawa wymaga szerszego zebrania informacji'],
      note:
        medicalChange === 'yes'
          ? 'Przy naglej zmianie zachowania, bolu albo objawach zdrowotnych zacznij rownolegle od lekarza weterynarii.'
          : 'Przed rozmowa przydadza sie nagrania, opis rutyny i krotka lista tego, co bylo juz probowane.',
      materialTitle,
      materialHref,
      materialCopy: 'Materialy moga pomoc przygotowac dane do konsultacji, ale nie powinny zastapic analizy przy czerwonych flagach.',
    }
  }

  if (score >= 4) {
    return {
      serviceKey: 'dwa-kwadranse',
      title: 'Najblizej pasuja Dwa kwadranse',
      summary:
        'To spokojniejszy start, gdy temat ma kilka elementow albo 15 minut moze byc za krotkie. Nadal zaczynasz od pierwszego sensownego kroku, bez przeskakiwania do za duzego formatu.',
      reasons:
        reasons.length > 0
          ? reasons.slice(0, 4)
          : ['jest czas na dopytanie o rytm dnia i tlo problemu', 'mozna uporzadkowac 2-3 watki bez pelnej konsultacji'],
      note: 'Jesli w trakcie rozmowy wyjdzie, ze problem jest szerszy, latwiej bedzie zdecydowac o dalszym kroku.',
      materialTitle,
      materialHref,
      materialCopy: 'Zacznij od PDF-u lub checklisty, jesli chcesz przygotowac obserwacje przed rozmowa.',
    }
  }

  return {
    serviceKey: 'kwadrans',
    title: goal === 'material' ? 'Najpierw material lub PDF, potem Kwadrans jesli trzeba' : 'Najblizej pasuje Kwadrans',
    summary:
      'To dobry pierwszy krok, gdy temat jest waski, swiezy albo da sie go uporzadkowac jedna decyzja. Material z Niezbednika moze byc pierwszym przygotowaniem, a Kwadrans pomaga sprawdzic, czy idziesz w dobra strone.',
    reasons: [
      duration === 'fresh' ? 'problem wyglada na swiezy' : 'problem nie wymaga od razu pelnej analizy',
      predictability === 'clear' ? 'wyzwalacz jest dosc czytelny' : 'potrzebujesz przede wszystkim pierwszego priorytetu',
      'mozna zaczac od materialu lub krotkiej rozmowy audio bez kamery',
    ],
    note: 'Kwadrans nie musi zamykac sprawy. Ma pomoc wybrac najprostszy nastepny krok.',
    materialTitle,
    materialHref,
    materialCopy: 'Jesli chcesz zaczac samodzielnie, wybierz PDF lub checkliste. Gdy po materiale temat nadal jest niejasny, zarezerwuj Kwadrans.',
  }
}
