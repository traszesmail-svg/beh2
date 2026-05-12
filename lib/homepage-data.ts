export type HomepageSelectorQuestionId = 'animal' | 'problem' | 'urgency'
export type HomepageSelectorAnimal = 'dog' | 'cat'
export type HomepageSelectorRecommendationKey = 'quarter' | 'double' | 'full'

export type HomepageSelectorAnswers = Partial<Record<HomepageSelectorQuestionId, string>>

export type HomepageSelectorOption = {
  id: string
  label: string
  helper?: string
}

export type HomepageSelectorQuestion = {
  id: HomepageSelectorQuestionId
  label: string
  title: string
  helper: string
  options: HomepageSelectorOption[]
}

export const homepageTrustBadges = [
  { title: 'COAPE / CAPBT', helper: 'certyfikowany behawiorysta' },
  { title: 'Technik weterynarii', helper: 'wiedza medyczna w praktyce' },
  { title: 'Psy i koty', helper: 'praca z oboma gatunkami' },
  { title: 'Bez kar i przymusu', helper: 'etyczne podejście' },
  { title: 'Online', helper: 'wygodnie i bez stresu' },
] as const

export const homepageAnimalQuestion: HomepageSelectorQuestion = {
  id: 'animal',
  label: '1',
  title: 'Kogo dotyczy problem?',
  helper: 'Wybierz zwierzę, a potem najbliższy temat.',
  options: [
    { id: 'dog', label: 'Pies', helper: 'Spacer, separacja, szczeniak, agresja, pobudzenie.' },
    { id: 'cat', label: 'Kot', helper: 'Kuweta, stres, konflikt, wokalizacja, zmiana w domu.' },
  ],
}

export const homepageProblemOptionsByAnimal: Record<HomepageSelectorAnimal, HomepageSelectorOption[]> = {
  dog: [
    { id: 'dog_walk', label: 'Spacer / reaktywność', helper: 'Ciągnięcie, szczekanie, napięcie na bodźce.' },
    { id: 'dog_separation', label: 'Separacja', helper: 'Pies źle znosi zostawanie samemu.' },
    { id: 'puppy', label: 'Szczeniak', helper: 'Gryzienie, skakanie, nauka zasad.' },
    { id: 'dog_aggression', label: 'Agresja', helper: 'Gryzienie, ataki, obrona, silne reakcje.' },
    { id: 'dog_barking_arousal', label: 'Szczekanie / pobudzenie', helper: 'Trudność z wyciszeniem, niszczenie, chaos.' },
    { id: 'dog_other', label: 'Inne', helper: 'Problem nie pasuje do jednej kategorii.' },
  ],
  cat: [
    { id: 'cat_litter', label: 'Kuweta', helper: 'Sikanie albo kupa poza kuwetą.' },
    { id: 'cat_stress', label: 'Stres', helper: 'Chowanie, napięcie, unikanie kontaktu.' },
    { id: 'cat_conflict', label: 'Konflikt między kotami', helper: 'Gonitwy, blokowanie, syczenie.' },
    { id: 'cat_vocalization', label: 'Wokalizacja', helper: 'Miauczenie, nawoływanie, budzenie w nocy.' },
    { id: 'cat_change', label: 'Zmiana w domu', helper: 'Przeprowadzka, nowy domownik, nowy rytm.' },
    { id: 'cat_other', label: 'Inne', helper: 'Problem trudno nazwać jednym słowem.' },
  ],
}

export const homepageUrgencyQuestion: HomepageSelectorQuestion = {
  id: 'urgency',
  label: '3',
  title: 'Jak pilna albo złożona jest sytuacja?',
  helper: 'To pomaga dobrać zakres rozmowy i sposób postawienia diagnozy.',
  options: [
    { id: 'starter', label: 'Szybki pierwszy kierunek', helper: 'Chcę wiedzieć, od czego zacząć.' },
    { id: 'multi', label: 'Kilka wątków', helper: 'Problem łączy się z kilkoma sytuacjami.' },
    { id: 'complex', label: 'Problem złożony lub przewlekły', helper: 'Trwa długo, wraca albo dotyczy bezpieczeństwa.' },
  ],
}

export const homepageSelectorRecommendations: Record<
  HomepageSelectorRecommendationKey,
  {
    title: string
    summary: string
    ctaLabel: string
    service: string
    price: string
    duration: string
  }
> = {
  quarter: {
    title: 'Kwadrans',
    summary: 'Szybki pierwszy krok: na podstawie uzyskanych informacji dostajesz diagnozę i kierunek działania.',
    ctaLabel: 'Umów Kwadrans',
    service: 'szybka-konsultacja-15-min',
    price: '69 zł',
    duration: '15 min audio',
  },
  double: {
    title: 'Dwa kwadranse',
    summary: 'Dobry wybór, gdy temat ma kilka wątków i potrzebuje diagnozy z większą ilością kontekstu.',
    ctaLabel: 'Umów Dwa kwadranse',
    service: 'konsultacja-30-min',
    price: '169 zł',
    duration: '30 min online',
  },
  full: {
    title: 'Pełna konsultacja',
    summary: 'Dla spraw złożonych: diagnoza, prawdopodobna etiologia, możliwy przebieg problemu i plan pracy.',
    ctaLabel: 'Umów pełną konsultację',
    service: 'konsultacja-behawioralna-online',
    price: '470 zł',
    duration: 'pełny zakres online',
  },
}

export const homepageProcessSteps = [
  {
    step: '1',
    title: 'Opisujesz sytuację',
    copy: 'Wypełniasz krótki formularz albo opowiadasz o problemie.',
  },
  {
    step: '2',
    title: 'Rozmowa audio lub video',
    copy: 'Audio przy krótszych konsultacjach, video przy pełnej konsultacji.',
  },
  {
    step: '3',
    title: 'Dostajesz diagnozę i pierwszy krok',
    copy: 'W krótkim formacie dostajesz diagnozę na podstawie rozmowy, a w pełnej konsultacji także szersze omówienie przyczyn i przebiegu problemu.',
  },
] as const

export function resolveHomepageSelectorRecommendation(answers: HomepageSelectorAnswers): HomepageSelectorRecommendationKey {
  const problem = answers.problem
  const urgency = answers.urgency

  if (urgency === 'complex') {
    return 'full'
  }

  if (problem === 'dog_aggression' && urgency !== 'starter') {
    return 'full'
  }

  if (problem === 'cat_conflict') {
    return urgency === 'starter' ? 'double' : 'full'
  }

  if (urgency === 'multi') {
    return 'double'
  }

  return 'quarter'
}
