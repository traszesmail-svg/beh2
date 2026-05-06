export type ReferenceFaqCategory = 'wspolpraca' | 'konsultacje' | 'pies' | 'kot' | 'platnosci' | 'techniczne'

export type ReferenceFaqItem = {
  id: string
  category: ReferenceFaqCategory
  question: string
  answer: string
}

export const referenceFaqCategories: Array<{
  id: ReferenceFaqCategory
  label: string
  countLabel: string
  icon: 'message' | 'calendar' | 'paw' | 'cat' | 'payment' | 'screen'
}> = [
  { id: 'wspolpraca', label: 'Współpraca', countLabel: '10 pytań', icon: 'message' },
  { id: 'konsultacje', label: 'Konsultacje', countLabel: '8 pytań', icon: 'calendar' },
  { id: 'pies', label: 'Pies', countLabel: '12 pytań', icon: 'paw' },
  { id: 'kot', label: 'Kot', countLabel: '10 pytań', icon: 'cat' },
  { id: 'platnosci', label: 'Płatności', countLabel: '6 pytań', icon: 'payment' },
  { id: 'techniczne', label: 'Technicznie', countLabel: '6 pytań', icon: 'screen' },
]

export const referenceFaqItems: ReferenceFaqItem[] = [
  {
    id: 'krotka-wiadomosc-zamiast-konsultacji',
    category: 'wspolpraca',
    question: 'Kiedy wybrać krótką wiadomość zamiast konsultacji?',
    answer:
      'Gdy nie chcesz rezerwować od razu, masz jedno konkretne pytanie albo chcesz krótko doprecyzować temat. W wiadomości opiszesz sytuację, a ja podpowiem, czy lepszy będzie Kwadrans, pełna konsultacja online czy jeszcze doprecyzowanie tematu.',
  },
  {
    id: 'czy-wiadomosc-zastepuje-konsultacje',
    category: 'wspolpraca',
    question: 'Czy krótka wiadomość zastępuje konsultację?',
    answer:
      'Nie. Wiadomość pomaga wybrać dobry pierwszy krok i ocenić, czy temat nadaje się do Kwadransu, Dwóch kwadransów albo pełnej konsultacji.',
  },
  {
    id: 'diagnoza-lub-weterynarz',
    category: 'konsultacje',
    question: 'Czy muszę mieć diagnozę lub opinię weterynarza?',
    answer:
      'Nie musisz. Przy nagłej zmianie zachowania, bólu, problemach z jedzeniem, załatwianiem albo poruszaniem się mogę jednak poprosić o konsultację weterynaryjną równolegle z pracą behawioralną.',
  },
  {
    id: 'kwadrans',
    category: 'konsultacje',
    question: 'Jak wygląda Kwadrans z behawiorystą?',
    answer:
      'To 15 minut rozmowy audio bez kamery. Służy do nazwania problemu, uporządkowania priorytetu i ustalenia pierwszego konkretnego kroku.',
  },
  {
    id: 'pelna-konsultacja',
    category: 'konsultacje',
    question: 'Jak wygląda pełna konsultacja behawioralna online?',
    answer:
      'To szersza rozmowa online audio albo audio/video, analiza sytuacji, diagnoza behawioralna, plan poprawy i 7 dni konsultacji tekstowych przez WhatsApp.',
  },
  {
    id: 'problemy-kot',
    category: 'kot',
    question: 'Dla jakich problemów mogę zgłosić się z kotem?',
    answer:
      'Najczęściej z kuwetą, stresem, wycofaniem, konfliktem między kotami, nadmierną wokalizacją, napięciem po zmianach w domu albo trudnością z dotykiem.',
  },
  {
    id: 'problemy-pies',
    category: 'pies',
    question: 'Dla jakich problemów mogę zgłosić się z psem?',
    answer:
      'Najczęściej ze spacerami, reaktywnością, rozłąką, pobudzeniem, szczeniakiem, niszczeniem w domu, obroną zasobów albo trudnym startem po adopcji.',
  },
  {
    id: 'czy-tylko-online',
    category: 'techniczne',
    question: 'Czy pracujesz tylko online?',
    answer:
      'Publiczna oferta serwisu jest online. Taki format wystarcza do wielu pierwszych decyzji i pozwala spokojnie omówić sytuację bez stresu dla zwierzęcia.',
  },
  {
    id: 'czas-odpowiedzi',
    category: 'techniczne',
    question: 'Jak szybko otrzymam odpowiedź?',
    answer:
      'Na zwykłą wiadomość odpowiadam zwykle w ciągu 1-2 dni roboczych. Przy wybranym terminie i płatności komunikacja dotyczy już konkretnej rezerwacji.',
  },
  {
    id: 'przygotowanie',
    category: 'konsultacje',
    question: 'Jak się przygotować do konsultacji?',
    answer:
      'Przygotuj krótki opis sytuacji, wiek zwierzęcia, czas trwania problemu i to, co już było próbowane. Nagrania są pomocne, ale nie są warunkiem rozpoczęcia.',
  },
  {
    id: 'plan-pracy',
    category: 'wspolpraca',
    question: 'Czy dostanę plan pracy po konsultacji?',
    answer:
      'Po pełnej konsultacji otrzymujesz plan poprawy i 7 dni kontaktu tekstowego. Po Kwadransie dostajesz przede wszystkim priorytet i najbliższy sensowny krok.',
  },
  {
    id: 'nie-zachowanie',
    category: 'wspolpraca',
    question: 'Co jeśli problem nie dotyczy zachowania?',
    answer:
      'Powiem to wprost. Jeśli sytuacja wygląda na zdrowotną, techniczną albo organizacyjną, wskażę, jaki specjalista lub jaki krok ma większy sens.',
  },
  {
    id: 'weterynarz',
    category: 'wspolpraca',
    question: 'Czy współpracujesz z weterynarzem?',
    answer:
      'Tak, gdy sprawa tego wymaga. Konsultacja behawioralna nie zastępuje diagnostyki weterynaryjnej, ale może pomóc uporządkować obserwacje i pytania.',
  },
  {
    id: 'nagrywanie',
    category: 'techniczne',
    question: 'Czy mogę nagrywać konsultację?',
    answer:
      'Nagrywanie wymaga wcześniejszego uzgodnienia. Możesz natomiast robić notatki i wracać do najważniejszych ustaleń w dalszej korespondencji.',
  },
  {
    id: 'metody-pracy',
    category: 'pies',
    question: 'Jakie metody pracy stosujesz?',
    answer:
      'Pracuję bez przemocy i bez straszenia. Najpierw szukam przyczyny napięcia, potem dobieram kroki, które da się wdrożyć w konkretnym domu.',
  },
]
