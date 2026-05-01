// Manualna lista opinii — fallback gdy brak Google API + źródło danych dla Schema.org
// Edytuj tę listę dodając/usuwając opinie

export interface Review {
  id: string;
  author: string;
  location?: string;
  petName?: string;
  petType: 'dog' | 'cat' | 'other';
  problem: string;
  rating: 1 | 2 | 3 | 4 | 5;
  date: string;
  text: string;
  source: 'file' | 'google' | 'direct' | 'email';
  consultationType?: 'kwadrans' | 'standardowa' | 'wyjazdowa';
  highlight?: boolean;
}

export const reviews: Review[] = [
  {
    id: 'rev-001',
    author: 'Marta K.',
    location: 'Kraków',
    petName: 'Burek',
    petType: 'dog',
    problem: 'reaktywność na smyczy',
    rating: 5,
    date: '2024-11-15',
    text: 'Burek po dwóch sesjach przestał ciągnąć i szczekać na inne psy. Krzysztof tłumaczy wszystko bardzo spokojnie i logicznie — żadnej presji, zero kar. Polecam każdemu komu się wydaje, że "już nic się nie da zrobić".',
    source: 'file',
    consultationType: 'standardowa',
    highlight: true,
  },
  {
    id: 'rev-002',
    author: 'Anna W.',
    location: 'Warszawa',
    petName: 'Mia',
    petType: 'cat',
    problem: 'załatwianie poza kuwetą',
    rating: 5,
    date: '2024-10-28',
    text: 'Po roku problemu z Mią (sikanie poza kuwetą), jedna konsultacja online z panem Krzysztofem rozwiązała sprawę. Okazało się, że problem był banalny, ale nikt wcześniej nie wpadł na właściwy trop.',
    source: 'file',
    consultationType: 'standardowa',
  },
  {
    id: 'rev-003',
    author: 'Piotr S.',
    location: 'Wrocław',
    petName: 'Luna',
    petType: 'dog',
    problem: 'lęk separacyjny',
    rating: 5,
    date: '2024-12-02',
    text: 'Luna wyła i niszczyła rzeczy gdy zostawała sama. Po 6 tygodniach pracy z planem od Krzysztofa — zostaje sama spokojnie nawet 4 godziny. Dziękuję!',
    source: 'direct',
    consultationType: 'standardowa',
    highlight: true,
  },
  {
    id: 'rev-004',
    author: 'Joanna M.',
    location: 'Gdańsk',
    petName: 'Tofik i Kropka',
    petType: 'cat',
    problem: 'konflikt między kotami',
    rating: 5,
    date: '2024-09-14',
    text: 'Dwa koty po 3 latach wreszcie się tolerują. Krzysztof podpowiedział co z resocjalizacją, jak rozłożyć zasoby w mieszkaniu, jak czytać sygnały. Teraz śpią razem. Bezcenne.',
    source: 'file',
    consultationType: 'standardowa',
  },
  {
    id: 'rev-005',
    author: 'Kamil B.',
    location: 'Poznań',
    petType: 'dog',
    problem: 'pierwsza pomoc — szczeniak',
    rating: 5,
    date: '2024-12-18',
    text: 'Wziąłem "kwadrans na już" bo szczeniak nie spał w nocy. 15 minut, konkretne wskazówki, problem rozwiązany w 3 dni. Idealny format dla osób bez czasu.',
    source: 'direct',
    consultationType: 'kwadrans',
  },
  {
    id: 'rev-006',
    author: 'Ewa D.',
    location: 'Łódź',
    petName: 'Diego',
    petType: 'dog',
    problem: 'agresja na przedmioty',
    rating: 4,
    date: '2024-08-22',
    text: 'Konsultacja merytoryczna i bardzo profesjonalna. Plan dostałam w mailu, krok po kroku. Nie wszystko wyszło od razu, ale Krzysztof odpowiedział na maile z dodatkowymi pytaniami i pomógł skorygować podejście.',
    source: 'file',
    consultationType: 'standardowa',
  },
  {
    id: 'rev-007',
    author: 'Tomasz P.',
    location: 'Katowice',
    petName: 'Whisky',
    petType: 'cat',
    problem: 'lęk przed wizytami',
    rating: 5,
    date: '2024-11-04',
    text: 'Whisky chowała się 2 dni po każdej wizycie znajomych. Krzysztof wytłumaczył mi mechanizm, dał konkretne ćwiczenia. Teraz wychodzi po godzinie. Profesjonalizm na najwyższym poziomie.',
    source: 'email',
    consultationType: 'standardowa',
  },
  {
    id: 'rev-008',
    author: 'Aleksandra R.',
    location: 'Szczecin',
    petName: 'Boris',
    petType: 'dog',
    problem: 'socjalizacja szczeniaka',
    rating: 5,
    date: '2025-01-10',
    text: 'Konsultacja online — opisałam środowisko, Krzysztof zadał trafne pytania i zaobserwował Borisa na nagraniu. Plan na pół roku rozłożony na etapy. Konkret, zero ogólników.',
    source: 'direct',
    consultationType: 'standardowa',
  },
];

export const aggregateRating = {
  ratingValue: reviews.reduce((s, r) => s + r.rating, 0) / reviews.length,
  reviewCount: reviews.length,
  bestRating: 5,
  worstRating: 1,
};

export const highlightedReviews = reviews.filter(r => r.highlight);
export const dogReviews = reviews.filter(r => r.petType === 'dog');
export const catReviews = reviews.filter(r => r.petType === 'cat');
export const fiveStarReviews = reviews.filter(r => r.rating === 5);
