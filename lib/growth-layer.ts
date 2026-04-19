export type GrowthSpecies = 'pies' | 'kot' | 'oba'
export type LeadMagnetAsset =
  | {
      kind: 'pdf'
      relativeFilePath: string
      fileName: string
      mimeType: 'application/pdf'
    }
  | {
      kind: 'text'
      fileName: string
      mimeType: 'text/plain; charset=utf-8'
      body: string
    }

export type LeadMagnet = {
  slug: string
  title: string
  shortTitle: string
  subtitle: string
  h1: string
  lead: string
  bullets: string[]
  benefitCards: Array<{ title: string; copy: string }>
  faq: Array<{ question: string; answer: string }>
  ctaLabel: string
  note: string
  thankYouTitle: string
  thankYouBody: string
  thankYouHint: string
  followUpTitle: string
  followUpBody: string
  nextStepCopy: string
  nextStepHref: string
  categoryHref: string
  categoryLabel: string
  relatedLinks: Array<{ href: string; label: string }>
  asset: LeadMagnetAsset
}

export type LocalSeoFaqItem = {
  question: string
  answer: string
}

export type LocalSeoPage = {
  path: string
  title: string
  description: string
  h1: string
  intro: string[]
  problemCards: Array<{ title: string; copy: string; href?: string }>
  supportTitle: string
  supportBody: string[]
  firstStepCards: Array<{ title: string; copy: string }>
  faq: LocalSeoFaqItem[]
  relatedLinks: Array<{ href: string; label: string; copy: string }>
}

export const LEAD_MAGNETS: LeadMagnet[] = [
  {
    slug: 'pies-reaktywnosc-5-krokow',
    title: '5 pierwszych kroków, gdy pies szczeka na spacerach',
    shortTitle: '5 kroków dla reaktywnego psa',
    subtitle: 'Praktyczny przewodnik dla opiekunów, którzy chcą zrozumieć, co się dzieje, zanim zaczną ćwiczyć technikę.',
    h1: '5 pierwszych kroków, gdy pies szczeka na spacerach',
    lead: 'Jeśli twój pies reaguje na innych psów, ludzi albo rowerzystów i kolejne próby nic nie zmieniają, ten przewodnik jest po to, żeby uporządkować pierwszy tydzień obserwacji i pierwszych decyzji.',
    bullets: [
      'jak zidentyfikować wyzwalacze konkretnie, a nie „na wszystko”',
      'czym jest próg reakcji i dlaczego to od niego zaczyna się sensowna praca',
      'jak zmienić trasę spaceru i środowisko, zanim wrócisz do ćwiczeń',
      'prosta tabela obserwacyjna i granica: kiedy materiał nie wystarcza już sam',
    ],
    benefitCards: [
      {
        title: 'Zamiast kolejnej techniki',
        copy: 'Materiał pomaga zrozumieć wyzwalacze, próg reakcji i środowisko zanim zaczniesz cokolwiek wdrażać.',
      },
      {
        title: 'Do użycia od razu',
        copy: 'Masz pięć pierwszych kroków i prostą tabelę obserwacyjną, które porządkują pierwszy tydzień spacerów.',
      },
      {
        title: 'Jasny moment na rozmowę',
        copy: 'Przewodnik pokazuje też granicę: kiedy sam materiał jeszcze wystarcza, a kiedy warto przejść do 15 min audio.',
      },
    ],
    faq: [
      {
        question: 'Czy ten materiał zastępuje konsultację?',
        answer:
          'Nie. To materiał startowy do uporządkowania obserwacji i pierwszych decyzji. Przy głębszej reaktywności może być potrzebna rozmowa.',
      },
      {
        question: 'Czy przewodnik ma sens, jeśli pies reaguje nie tylko na psy?',
        answer:
          'Tak. Najważniejsze jest zrozumienie wyzwalaczy, progu i sposobu zarządzania środowiskiem, a nie sam typ bodźca.',
      },
      {
        question: 'Kiedy po materiale przejść do 15 min audio?',
        answer:
          'Gdy po kilku spacerach nadal nie widzisz wzorca, temat jest szerszy niż myślałeś albo kolejne próby nic nie zmieniają.',
      },
    ],
    ctaLabel: 'Pobierz bezpłatny przewodnik',
    note: 'Piszę raz na jakiś czas, tylko kiedy mam coś konkretnego. Możesz wypisać się w każdej chwili.',
    thankYouTitle: 'Przewodnik jest na twojej skrzynce',
    thankYouBody: 'Możesz pobrać materiał od razu. Jeśli po lekturze temat okaże się bardziej złożony, 15 min audio jest naturalnym kolejnym krokiem.',
    thankYouHint: 'Jeśli wiadomość nie dotarła, sprawdź folder spam. Link do pobrania zostaje też tutaj jako spokojny punkt startu.',
    followUpTitle: 'Jak idzie obserwacja reaktywności?',
    followUpBody:
      'Jeśli po kilku spacerach widzisz, że wyzwalacze twojego psa są bardziej złożone niż myślałeś, 15 min audio pomoże ustalić dalszy kierunek.',
    nextStepCopy: 'Po przejrzeniu materiału najbliższy kolejny krok prowadzi do 15 min audio albo do landingu o reaktywności na smyczy.',
    nextStepHref: '/psy/reaktywnosc-na-smyczy',
    categoryHref: '/psy',
    categoryLabel: 'Psy',
    relatedLinks: [
      { href: '/psy/reaktywnosc-na-smyczy', label: 'Landing: reaktywność na smyczy' },
      { href: '/blog/dlaczego-moj-pies-szczeka-na-inne-psy', label: 'Blog: dlaczego mój pies szczeka na inne psy' },
      { href: '/psy', label: 'Pomoc dla opiekunów psów' },
    ],
    asset: {
      kind: 'pdf',
      relativeFilePath: 'content/guides/pdf/pies-reaktywny-na-spacerze.pdf',
      fileName: '5-pierwszych-krokow-pies-szczeka-na-spacerach.pdf',
      mimeType: 'application/pdf',
    },
  },
  {
    slug: 'kot-kuweta-checklista',
    title: 'Co sprawdzić, zanim uznasz, że kot załatwia się poza kuwetą złośliwie',
    shortTitle: 'Checklista kuweta',
    subtitle: 'Lista kontrolna dla opiekunów w odpowiedniej kolejności, zanim zaczniesz cokolwiek zmieniać.',
    h1: 'Co sprawdzić, zanim uznasz, że kot załatwia się poza kuwetą złośliwie',
    lead: 'Kot nie robi tego ze złośliwości. Ten materiał prowadzi krok po kroku przez zdrowie, kuwetę, środowisko i zmiany w domu.',
    bullets: [
      'kiedy najpierw iść do weterynarza i dlaczego to naprawdę jest pierwszy krok',
      'checklista kuwety, żwirku i lokalizacji, zanim zmienisz wszystko naraz',
      'co miejsce „wypadków” mówi o napięciu, terytorium i układzie domu',
      'kiedy po checkliście warto przejść do krótkiej rozmowy',
    ],
    benefitCards: [
      {
        title: 'Właściwa kolejność',
        copy: 'Checklista zaczyna od zdrowia, a dopiero potem przechodzi do kuwety, środowiska i relacji w domu.',
      },
      {
        title: 'Mniej przypadkowych zmian',
        copy: 'Zamiast zmieniać żwirek i ustawienie wszystkiego naraz, dostajesz prosty porządek sprawdzania.',
      },
      {
        title: 'Bez mitu o złośliwości',
        copy: 'Materiał pomaga oddzielić interpretację od realnych przyczyn zachowania kota.',
      },
    ],
    faq: [
      {
        question: 'Czy checklista zastępuje weterynarza?',
        answer:
          'Nie. Przy nagłej zmianie zachowania toaletowego pierwszym krokiem jest weterynarz, nie materiał do samodzielnej pracy.',
      },
      {
        question: 'Czy ten materiał ma sens, jeśli kot ma kilka kuwet i problem nadal wraca?',
        answer:
          'Tak. Sama liczba kuwet nie rozwiązuje wszystkiego. Checklista pomaga sprawdzić też lokalizację, środowisko i relacje w domu.',
      },
      {
        question: 'Kiedy po checkliście przejść do rozmowy?',
        answer:
          'Gdy zdrowie zostało sprawdzone, a nadal nie wiesz, co napędza problem albo jak ustawić kolejność zmian w domu.',
      },
    ],
    ctaLabel: 'Pobierz bezpłatną listę kontrolną',
    note: 'Piszę raz na jakiś czas, kiedy mam coś naprawdę użytecznego. Bez spamu, bez codziennych kampanii.',
    thankYouTitle: 'Lista jest na twojej skrzynce',
    thankYouBody: 'Możesz pobrać materiał od razu. Jeśli po przejrzeniu nadal nie wiesz, co stoi za problemem albo weterynarz wykluczył już zdrowie, 15 min audio pomoże ustalić kierunek.',
    thankYouHint: 'To materiał startowy. Nie zastępuje diagnostyki weterynaryjnej przy nagłej zmianie zachowania kota.',
    followUpTitle: 'Co wyszło z listy kontrolnej?',
    followUpBody:
      'Jeśli po sprawdzeniu zdrowia, kuwety i środowiska nadal nie wiesz, co napędza problem, rozmowa pomoże ustalić kolejność dalszych zmian.',
    nextStepCopy: 'Po checkliście najbliższe przejście prowadzi do landingu o kuwecie albo do 15 min audio.',
    nextStepHref: '/koty/zalatwianie-poza-kuweta',
    categoryHref: '/koty',
    categoryLabel: 'Koty',
    relatedLinks: [
      { href: '/koty/zalatwianie-poza-kuweta', label: 'Landing: załatwianie poza kuwetą' },
      { href: '/blog/kot-zalatwia-sie-poza-kuweta', label: 'Blog: kot załatwia się poza kuwetą' },
      { href: '/koty', label: 'Pomoc dla opiekunów kotów' },
    ],
    asset: {
      kind: 'pdf',
      relativeFilePath: 'content/guides/pdf/kot-i-kuweta-pierwszy-plan-dzialania.pdf',
      fileName: 'checklista-kot-kuweta-pierwszy-plan.pdf',
      mimeType: 'application/pdf',
    },
  },
  {
    slug: 'przygotowanie-do-konsultacji-online',
    title: 'Jak przygotować się do konsultacji behawioralnej online',
    shortTitle: 'Przygotowanie do konsultacji',
    subtitle: 'Co warto wiedzieć, co zebrać i czego na pewno nie musisz robić przed rozmową.',
    h1: 'Jak przygotować się do konsultacji behawioralnej online',
    lead: 'Nie musisz przychodzić z gotową diagnozą. Ten materiał pokazuje, co warto mieć, a czego na pewno nie musisz przygotowywać przed 15 min audio albo pełną konsultacją.',
    bullets: [
      'czym jest konsultacja behawioralna, a czym nie jest',
      'co wystarczy przed 15 min audio i co warto mieć przed 60 min',
      'jak opisać problem w kilku zdaniach bez terminologii',
      'czego naprawdę nie musisz przygotowywać przed rozmową',
    ],
    benefitCards: [
      {
        title: 'Mniej napięcia przed rozmową',
        copy: 'Materiał porządkuje, co warto mieć pod ręką, a czego wcale nie musisz przygotowywać.',
      },
      {
        title: 'Lepszy opis bez przegrzewania',
        copy: 'Dostajesz prostą formułę opisu problemu, która wystarcza zarówno do 15 min audio, jak i do 60 min.',
      },
      {
        title: 'Szybsze przejście do konkretu',
        copy: 'Dzięki temu rozmowa zaczyna się od sensownego kontekstu, a nie od zgadywania, od czego w ogóle zacząć.',
      },
    ],
    faq: [
      {
        question: 'Czy muszę mieć nagrania i idealny opis problemu?',
        answer:
          'Nie. Materiał porządkuje przygotowanie, ale nie wymaga pełnej dokumentacji. Wystarczy to, co dziś realnie masz.',
      },
      {
        question: 'Czy ten materiał jest tylko przed 60 min?',
        answer:
          'Nie. Przydaje się zarówno przed 15 min audio, jak i przed pełną konsultacją, bo skraca drogę do konkretu.',
      },
      {
        question: 'Czy po materiale mogę od razu wejść w rozmowę?',
        answer:
          'Tak. To pomocniczy materiał, nie osobna usługa. Jego rolą jest skrócić przygotowanie do sensownego kontaktu.',
      },
    ],
    ctaLabel: 'Pobierz bezpłatny przewodnik',
    note: 'To lekki materiał przygotowujący. Po zapisie możesz go pobrać od razu, bez budowania ciężkiej automatyki marketingowej.',
    thankYouTitle: 'Przewodnik jest na twojej skrzynce',
    thankYouBody: 'Możesz pobrać materiał od razu. Jeśli po lekturze jesteś gotowy na rozmowę, 15 min audio zostaje najprostszym startem.',
    thankYouHint: 'To materiał pomocniczy, nie nowa usługa. Ma skrócić drogę do sensownej rozmowy.',
    followUpTitle: 'Gotowy/gotowa na rozmowę?',
    followUpBody:
      'Jeśli po materiale wiesz już, co chcesz omówić, 15 min audio jest najprostszym kolejnym krokiem. Jeśli nie, to też normalne: na rozmowie doprecyzujemy resztę razem.',
    nextStepCopy: 'Najbliższy kolejny krok prowadzi do opisu konsultacji online albo bezpośrednio do 15 min audio.',
    nextStepHref: '/konsultacja-behawioralna-online',
    categoryHref: '/konsultacja-behawioralna-online',
    categoryLabel: 'Konsultacja online',
    relatedLinks: [
      { href: '/konsultacja-behawioralna-online', label: 'Jak wygląda konsultacja online' },
      { href: '/cennik', label: 'Cennik i porównanie 15 min vs 60 min' },
      { href: '/kontakt', label: 'Krótka wiadomość przed rezerwacją' },
    ],
    asset: {
      kind: 'text',
      fileName: 'jak-przygotowac-sie-do-konsultacji-online.txt',
      mimeType: 'text/plain; charset=utf-8',
      body: [
        'Jak przygotować się do konsultacji behawioralnej online',
        '',
        '1. Czym jest konsultacja',
        '- To rozmowa diagnostyczna i planująca, nie trening przez kamerę.',
        '- Twoja rola: opisać, co widzisz. Moja: zadać właściwe pytania i ustalić kierunek.',
        '',
        '2. Przed 15 min audio',
        '- Wystarczy kilka zdań: gatunek, wiek, co się dzieje, od kiedy i jeden konkretny przykład.',
        '- Nie musisz mieć nagrania ani gotowej diagnozy.',
        '',
        '3. Przed 60 min',
        '- Warto mieć krótki opis historii problemu i tego, co już było próbowane.',
        '- Przydatne są informacje o środowisku, rytmie dnia i zmianach w domu.',
        '- Nagranie jest opcjonalne, nie obowiązkowe.',
        '',
        '4. Czego nie musisz robić',
        '- Nie musisz znać terminologii behawioralnej.',
        '- Nie musisz przygotowywać prezentacji ani wielostronicowego opisu.',
        '- Nie musisz idealnie umieć nazwać problemu.',
        '',
        '5. Prosta formuła opisu',
        '[Co robi pies/kot] + [kiedy] + [od kiedy] + [co już było próbowane].',
        '',
        '6. Jak wygląda rozmowa',
        '- Przy 15 min audio: opisujesz sytuację, odpowiadasz na pytania i dostajesz jeden priorytet.',
        '- Przy 60 min: pełna rozmowa online z planem i podsumowaniem pisemnym.',
        '',
        'Jeśli po tym materiale chcesz przejść dalej:',
        '- 15 min audio: https://regulskibehawiorysta.pl/call',
        '- opis konsultacji: https://regulskibehawiorysta.pl/konsultacja-behawioralna-online',
      ].join('\n'),
    },
  },
] as const

const LEAD_MAGNET_BY_SLUG = new Map(LEAD_MAGNETS.map((item) => [item.slug, item] as const))

export const LOCAL_SEO_PAGES: LocalSeoPage[] = [
  {
    path: '/behawiorysta-online-polska',
    title: 'Behawiorysta online dla psa i kota - cała Polska',
    description: 'Konsultacje behawioralne online dla opiekunów psów i kotów z całej Polski. 15 min audio na start, pełna konsultacja przy sprawach szerszych.',
    h1: 'Behawiorysta online dla opiekunów psów i kotów',
    intro: [
      'Pracuję online z opiekunami psów i kotów z całej Polski.',
      'Nie prowadzę wizyt domowych ani konsultacji stacjonarnych. Pracujemy zdalnie, na podstawie opisu sytuacji, historii problemu i tego, jak wygląda codzienność zwierzęcia.',
      'Na początek najprościej wybrać 15 min audio. Jeśli temat od razu jest szerszy, możesz przejść do pełnej konsultacji online.',
    ],
    problemCards: [
      { title: 'Problem dotyczy psa', copy: 'Spacery, reaktywność, rozłąka, pobudzenie albo trudne zachowania w domu.', href: '/psy' },
      { title: 'Problem dotyczy kota', copy: 'Kuweta, stres, wycofanie, napięcie w domu albo relacje między kotami.', href: '/koty' },
      { title: 'Chcesz ustalić pierwszy krok', copy: 'Masz jedno pytanie albo potrzebujesz spokojnie uporządkować temat przed dalszym działaniem.' },
      { title: 'Sprawa jest szersza', copy: 'Problem trwa dłużej, wraca albo obejmuje kilka wątków naraz i wymaga dłuższej rozmowy.' },
    ],
    supportTitle: 'Jak wygląda taka pomoc online',
    supportBody: [
      'W pracy behawioralnej najważniejsze są kontekst, historia problemu, środowisko i codzienne sytuacje, w których zachowanie wraca. To właśnie porządkujemy na rozmowie.',
      'Do startu wystarczy krótki opis. Nagrania bywają pomocne, ale nie są warunkiem, a kamera nie jest potrzebna przy 15 min audio.',
      'Online oznacza też prostszy kontakt: bez dojazdu, bez szukania specjalisty w swoim mieście i bez dokładania dodatkowego zamieszania na start.',
    ],
    firstStepCards: [
      { title: '15 min audio', copy: 'Krótka rozmowa głosowa bez kamery. Dobra na jedno pytanie, pierwszy ogląd sytuacji i ustalenie priorytetu.' },
      { title: 'Niezbędnik', copy: 'Materiały startowe, jeśli chcesz najpierw coś spokojnie przeczytać i uporządkować obserwacje.' },
      { title: 'Konsultacja 60 min', copy: 'Dłuższa rozmowa online dla spraw złożonych, utrwalonych albo wielowątkowych.' },
    ],
    faq: [
      { question: 'Czy konsultacja online jest dostępna dla całej Polski?', answer: 'Tak. Pracuję online z opiekunami z całej Polski, w tej samej formule niezależnie od miejsca.' },
      { question: 'Czy potrzebuję kamery albo specjalnego sprzętu?', answer: 'Nie. Przy 15 min audio wystarcza rozmowa głosowa. Przy konsultacji 60 min wideo może pomóc, ale nie jest obowiązkowe.' },
      { question: 'Czy mogę zgłosić temat przed adopcją albo przed zmianą w domu?', answer: 'Tak. Możesz omówić przygotowanie domu, plan działania i rzeczy, które warto sprawdzić wcześniej.' },
      { question: 'Od czego najlepiej zacząć?', answer: 'Jeśli nie wiesz jeszcze, jak duży jest temat, zacznij od 15 min audio. Jeśli problem jest złożony i trwa od dawna, wybierz konsultację 60 min.' },
      { question: 'Gdzie sprawdzić dostępne terminy?', answer: 'Aktualną dostępność najłatwiej sprawdzić w kalendarzu przy rezerwacji.' },
    ],
    relatedLinks: [
      { href: '/psy', label: 'Pomoc dla opiekunów psów', copy: 'Jeśli problem dotyczy psa, tutaj znajdziesz szerszy opis najczęstszych tematów.' },
      { href: '/koty', label: 'Pomoc dla opiekunów kotów', copy: 'Jeśli problem dotyczy kota, tutaj znajdziesz szerszy opis najczęstszych tematów.' },
      { href: '/cennik', label: 'Cennik', copy: 'Porównanie 15 min audio i konsultacji 60 min.' },
      { href: '/o-mnie', label: 'O mnie', copy: 'Styl pracy, kwalifikacje i publiczne punkty odniesienia.' },
      { href: '/kontakt', label: 'Kontakt', copy: 'Krótka wiadomość, jeśli chcesz coś doprecyzować przed rezerwacją.' },
    ],
  },
] as const

const LOCAL_SEO_PAGE_BY_PATH = new Map(LOCAL_SEO_PAGES.map((page) => [page.path, page] as const))

export const NEWSLETTER_SIGNUP_COPY = {
  title: 'Newsletter dla opiekunów psów i kotów',
  lead: 'Piszę raz na jakiś czas, tylko kiedy mam coś konkretnego. Głównie o tym, co napędza zachowanie zwierząt i co z tym zrobić bez nadmiaru teorii.',
  buttonLabel: 'Zapisz się',
  note: 'Raz na 1-2 tygodnie. Możesz wypisać się w każdej chwili.',
  successTitle: 'Dziękuję za zapis',
  successBody: 'Na liście zostajesz po to, żeby dostawać praktyczne treści, a nie częste kampanie sprzedażowe.',
} as const

export function listLeadMagnetPaths() {
  return LEAD_MAGNETS.map((item) => `/bezplatne-materialy/${item.slug}`)
}

export function getLeadMagnetBySlug(slug: string) {
  return LEAD_MAGNET_BY_SLUG.get(slug) ?? null
}

export function listLocalSeoPaths() {
  return LOCAL_SEO_PAGES.map((page) => page.path)
}

export function getLocalSeoPageByPath(pathname: string) {
  return LOCAL_SEO_PAGE_BY_PATH.get(pathname) ?? null
}

export function getProblemLandingLeadMagnetSlug(routePath: string) {
  if (routePath === '/psy/reaktywnosc-na-smyczy') {
    return 'pies-reaktywnosc-5-krokow'
  }

  if (routePath === '/koty/zalatwianie-poza-kuweta') {
    return 'kot-kuweta-checklista'
  }

  return 'przygotowanie-do-konsultacji-online'
}
