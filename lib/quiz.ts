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
    title: 'Kogo dotyczy sytuacja?',
    helper: 'Wybierz gatunek, z którym chcesz zacząć.',
    options: [
      { id: 'pies', label: 'Pies', helper: 'Spacer, zostawanie samemu, pobudzenie, napięcie, szczeniak.' },
      { id: 'kot', label: 'Kot', helper: 'Kuweta, stres, relacje między kotami, nocna aktywność.' },
    ],
  },
  {
    id: 'main_topic',
    title: 'Co najbardziej przypomina Waszą sytuację?',
    helper: 'Wybierz najważniejszy wątek. Jeśli jest ich kilka, zaznacz odpowiedź o kilku rzeczach naraz.',
    options: [
      { id: 'single_behavior', label: 'Jedno zachowanie', helper: 'Np. szczekanie w jednym kontekście, kuweta, ciągnięcie, nocne miauczenie.' },
      { id: 'routine_stress', label: 'Stres w codziennej rutynie', helper: 'Problem wraca w domu, na spacerze, przy gościach albo zmianach.' },
      { id: 'relationship', label: 'Relacje i konflikt', helper: 'Dotyczy ludzi, drugiego zwierzęcia, zasobów albo kontaktu.' },
      { id: 'many_threads', label: 'Kilka wątków naraz', helper: 'Trudno wskazać jedną rzecz, bo tematy się łączą.' },
    ],
  },
  {
    id: 'safety',
    title: 'Czy pojawia się ryzyko bezpieczeństwa?',
    helper: 'Tu nie chodzi o straszenie, tylko o dobranie formatu bez skracania ważnej analizy.',
    options: [
      { id: 'none', label: 'Nie widzę takiego ryzyka', helper: 'Problem jest trudny, ale bez ataków, pogryzień albo paniki.' },
      { id: 'manageable', label: 'Są silne reakcje, ale do opanowania', helper: 'Np. szczekanie, ucieczka, warczenie, napięcie przy dystansie.' },
      { id: 'serious', label: 'Było pogryzienie, atak albo realne zagrożenie', helper: 'Ludzie lub zwierzęta mogą ucierpieć, sytuacja eskaluje.' },
    ],
  },
  {
    id: 'medical_change',
    title: 'Czy zachowanie zmieniło się nagle albo widzisz objawy zdrowotne?',
    helper: 'Przy bólu, chorobie lub nagłej zmianie behawior powinien iść równolegle z lekarzem weterynarii.',
    options: [
      { id: 'no', label: 'Nie, obraz jest raczej stały', helper: 'Nie widzę nagłej zmiany zdrowia, apetytu, ruchu ani kuwety.' },
      { id: 'unclear', label: 'Nie jestem pewna/pewien', helper: 'Coś się zmieniło, ale trudno powiedzieć, czy to zdrowie czy zachowanie.' },
      { id: 'yes', label: 'Tak, są czerwone flagi', helper: 'Nagła zmiana, ból, apatia, pragnienie, kuweta, agresja przy dotyku albo senior.' },
    ],
  },
  {
    id: 'duration',
    title: 'Jak bardzo potrzebujesz teraz uporządkowania?',
    helper: 'Czas trwania pomaga dobrać zakres rozmowy, nie zastępuje diagnozy behawioralnej.',
    options: [
      { id: 'fresh', label: 'Chcę tylko wiedzieć, od czego zacząć', helper: 'Sytuacja jest świeża albo potrzebujesz pierwszego kierunku.' },
      { id: 'returning', label: 'To łączy się z kilkoma rzeczami', helper: 'Są lepsze i gorsze okresy, a temat wraca w różnych kontekstach.' },
      { id: 'long', label: 'To trwa długo albo wpływa na całe życie w domu', helper: 'Warto spokojniej zebrać dane i ułożyć plan działania.' },
    ],
  },
  {
    id: 'frequency',
    title: 'Jak często to się pojawia?',
    helper: 'Częstotliwość pokazuje, czy wystarczy instrukcja, czy potrzebny jest plan.',
    options: [
      { id: 'rare', label: 'Sporadycznie', helper: 'Raz na jakiś czas albo w bardzo konkretnych sytuacjach.' },
      { id: 'weekly', label: 'Kilka razy w tygodniu', helper: 'Wraca regularnie, ale nie dominuje całego dnia.' },
      { id: 'daily', label: 'Codziennie lub prawie codziennie', helper: 'Wpływa na rytm domu, spacery, sen albo relacje.' },
    ],
  },
  {
    id: 'predictability',
    title: 'Czy umiesz przewidzieć, kiedy to się wydarzy?',
    helper: 'Im mniej przewidywalny obraz, tym więcej trzeba dopytać.',
    options: [
      { id: 'clear', label: 'Tak, wyzwalacz jest jasny', helper: 'Wiem, kiedy zaczyna się zachowanie i co je uruchamia.' },
      { id: 'partial', label: 'Częściowo', helper: 'Widzę pewne schematy, ale nie wszystkie sytuacje pasują.' },
      { id: 'unclear', label: 'Nie, to wygląda chaotycznie', helper: 'Problem pojawia się nagle albo trudno połączyć fakty.' },
    ],
  },
  {
    id: 'resources',
    title: 'Czy w tle są zasoby, rutyna albo środowisko?',
    helper: 'Dotyczy przestrzeni, spacerów, kuwety, karmienia, nudy, zmian w domu i relacji.',
    options: [
      { id: 'simple', label: 'Raczej jeden prosty element', helper: 'Np. miejsce kuwety, smycz, jedna pora dnia, jeden bodziec.' },
      { id: 'several', label: 'Kilka elementów naraz', helper: 'Rutyna, przestrzeń, reakcje ludzi i emocje zwierzęcia się łączą.' },
      { id: 'multi_pet', label: 'W grę wchodzi kilka zwierząt lub domowników', helper: 'Potrzebna jest analiza relacji i zarządzania sytuacją.' },
    ],
  },
  {
    id: 'previous_attempts',
    title: 'Co już próbowaliście?',
    helper: 'Jeśli było dużo prób bez efektu, sama checklista zwykle nie wystarczy.',
    options: [
      { id: 'none', label: 'Jeszcze nic systematycznie', helper: 'Chcesz zacząć od dobrze ułożonych podstaw.' },
      { id: 'some', label: 'Kilka prostych zmian', helper: 'Były drobne próby, ale bez jasnego planu.' },
      { id: 'many', label: 'Dużo prób i nadal brak poprawy', helper: 'Problem wraca mimo treningu, porad z internetu albo zmian w domu.' },
    ],
  },
  {
    id: 'goal',
    title: 'Jaki efekt byłby teraz najbardziej pomocny?',
    helper: 'Dzięki temu wynik nie pcha od razu w za duży format.',
    options: [
      { id: 'material', label: 'Najpierw materiał lub PDF', helper: 'Chcesz spróbować prostego, uporządkowanego kroku samodzielnie.' },
      { id: 'priority', label: 'Ustalić pierwszy priorytet w rozmowie', helper: 'Chcesz szybko wiedzieć, co robić jako pierwsze.' },
      { id: 'plan', label: 'Ułożyć plan na kilka kroków', helper: 'Potrzebujesz więcej kontekstu i konkretnego kierunku.' },
      { id: 'diagnosis', label: 'Pełniej przeanalizować sytuację', helper: 'Sprawa jest złożona, utrwalona albo dotyczy bezpieczeństwa.' },
    ],
  },
]

export const QUIZ_SERVICE_LABELS: Record<QuizServiceKey, { label: string; price: string; duration: string }> = {
  kwadrans: {
    label: 'Kwadrans',
    price: '69 zł',
    duration: '15 min audio',
  },
  'dwa-kwadranse': {
    label: 'Dwa kwadranse',
    price: '169 zł',
    duration: '30 min online',
  },
  'pelna-konsultacja': {
    label: 'Pełna konsultacja',
    price: '470 zł',
    duration: 'pełny zakres online',
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
      ? 'Najpierw PDF albo materiał o kuwecie, stresie lub relacjach kotów'
      : 'Najpierw PDF albo materiał o spacerach, emocjach lub rutynie psa'
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
    reasons.push('pojawia się realne ryzyko bezpieczeństwa')
  }
  if (medicalChange === 'yes' || medicalChange === 'unclear') {
    reasons.push('warto równolegle sprawdzić warstwę zdrowotną')
  }
  if (mainTopic === 'many_threads' || resources === 'several' || resources === 'multi_pet') {
    reasons.push('sytuacja łączy kilka obszarów, a nie jedną prostą wskazówkę')
  }
  if (duration === 'long' || frequency === 'daily') {
    reasons.push('wzorzec jest utrwalony albo czesto wraca')
  }
  if (predictability === 'unclear' || previousAttempts === 'many') {
    reasons.push('trzeba najpierw uporządkować fakty i dotychczasowe próby')
  }

  if (score >= 8) {
    return {
      serviceKey: 'pelna-konsultacja',
      title: 'Na podstawie odpowiedzi najrozsądniejszy pierwszy krok to: pełna konsultacja',
      summary:
        'To rozmowa dla sytuacji utrwalonych, wielowątkowych albo dotyczących bezpieczeństwa. Najpierw warto zebrać kontekst, a dopiero potem układać plan działania.',
      reasons: reasons.length > 0 ? reasons.slice(0, 4) : ['sprawa wymaga szerszego zebrania informacji'],
      note:
        medicalChange === 'yes'
          ? 'Przy nagłej zmianie zachowania, bólu albo objawach zdrowotnych zacznij równolegle od lekarza weterynarii.'
          : 'Przed rozmową przydadzą się nagrania, opis rutyny i krótka lista tego, co było już próbowane.',
      materialTitle,
      materialHref,
        materialCopy: 'Materiały mogą pomóc przygotować dane do konsultacji, ale nie powinny zastąpić analizy przy czerwonych flagach.',
    }
  }

  if (score >= 4) {
    return {
      serviceKey: 'dwa-kwadranse',
      title: 'Na podstawie odpowiedzi najrozsądniejszy pierwszy krok to: Dwa kwadranse',
      summary:
        'To spokojniejszy start, gdy temat ma kilka elementów albo 15 minut może być za krótkie. Nadal zaczynasz od pierwszego sensownego kroku, bez przeskakiwania za daleko.',
      reasons:
        reasons.length > 0
          ? reasons.slice(0, 4)
          : ['jest czas na dopytanie o rytm dnia i tło sytuacji', 'można uporządkować 2-3 wątki bez pełnej konsultacji'],
    note: 'Jeśli w trakcie rozmowy wyjdzie, że sytuacja jest szersza, łatwiej będzie zdecydować o dalszym kroku.',
      materialTitle,
      materialHref,
      materialCopy: 'Zacznij od PDF-u lub checklisty, jeśli chcesz przygotować obserwacje przed rozmową.',
    }
  }

  return {
    serviceKey: 'kwadrans',
    title: goal === 'material' ? 'Na podstawie odpowiedzi najrozsądniejszy pierwszy krok to: materiał lub PDF, potem Kwadrans jeśli trzeba' : 'Na podstawie odpowiedzi najrozsądniejszy pierwszy krok to: Kwadrans',
    summary:
      'To dobry pierwszy krok, gdy temat jest wąski, świeży albo da się go uporządkować jedną decyzją. Materiał z Niezbędnika może być pierwszym przygotowaniem, a Kwadrans pomaga sprawdzić, czy idziesz w dobrą stronę.',
    reasons: [
      duration === 'fresh' ? 'sytuacja wygląda na świeżą' : 'sytuacja nie wymaga od razu pełnej analizy',
      predictability === 'clear' ? 'wyzwalacz jest dość czytelny' : 'potrzebujesz przede wszystkim pierwszego priorytetu',
      'można zacząć od materiału lub krótkiej rozmowy audio bez kamery',
    ],
    note: 'Kwadrans nie musi zamykać sprawy. Ma pomóc wybrać najprostszy następny krok.',
    materialTitle,
    materialHref,
    materialCopy: 'Jeśli chcesz zacząć samodzielnie, wybierz PDF lub checklistę. Gdy po materiale temat nadal jest niejasny, umów Kwadrans.',
  }
}
