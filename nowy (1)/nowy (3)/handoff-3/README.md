# Paczka #3 — Opinie + Google Reviews

**Cel:** Wzmocnić **social proof** na stronie. Pokazać prawdziwe opinie klientów Krzysztofa, automatycznie pobrać oceny z Google Business Profile, dodać Schema.org Review markup (gwiazdki w wynikach Google).

## Strategia: hybrydowa (zalecana)

```
Google Places API  →  pobiera live opinie (cache 24h)
        ↓
   Plik fallback   →  jeśli API nie działa lub brak budżetu
        ↓
   Komponent       →  wyświetla najlepsze (filtruje po ocenie ≥4)
        ↓
  Schema.org       →  Google indeksuje → gwiazdki w SERP
```

**Dlaczego hybrydowa:**
- Live API kosztuje (Google Places API: $17 / 1000 requestów po darmowym 200$/mies)
- Manualna lista daje pełną kontrolę (możesz wybrać najlepsze, anonimizować imiona)
- Schema.org daje SEO boost niezależnie od źródła

## Struktura paczki

```
handoff-3/
├── README.md
├── PROMPT-FOR-CLAUDE-CLI.md
├── components/
│   ├── ReviewCard.tsx              ← pojedyncza opinia
│   ├── ReviewsCarousel.tsx         ← karuzela (główna sekcja)
│   ├── ReviewsGrid.tsx             ← grid (alternatywa)
│   ├── GoogleRatingBadge.tsx       ← duży badge "4.9 ⭐ z Google"
│   └── ReviewsSection.tsx          ← kompletna sekcja (full-width)
├── lib/
│   ├── reviews.config.ts           ← manualna lista (fallback)
│   ├── googlePlaces.ts             ← integracja Google Places API
│   └── reviewsSchema.ts            ← generator Schema.org JSON-LD
└── api/
    └── reviews.ts                  ← Next.js API route (cache 24h)
```

## Wdrożenie krok po kroku

### 1. Manualna lista opinii (bez API — zacznij tu!)

Otwórz `lib/reviews.config.ts` i wypełnij listę 8-12 opinii. Możesz:
- Skopiować z Google Maps (wyszukaj profil Krzysztofa)
- Skopiować z formularzy kontaktowych / maili
- Dodać świeże opinie po każdej konsultacji (pytanie w follow-upie)

### 2. Google Places API (opcjonalnie)

**Wymagania:**
1. [Google Cloud Console](https://console.cloud.google.com) — utwórz projekt
2. Włącz **Places API (New)**
3. Utwórz API key, zabezpiecz domeną (regulskibehawiorysta.pl)
4. Znajdź **Place ID** Krzysztofa: [Place ID Finder](https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder)
5. Dodaj do `.env.local`:
   ```
   GOOGLE_PLACES_API_KEY=AIza...
   GOOGLE_PLACE_ID=ChIJ...
   ```

**Koszt:** Place Details = $17/1000 requestów. Z cache 24h to ~30 requestów/mies = praktycznie gratis (mieści się w darmowym tier).

### 3. Schema.org Review markup

W layoucie strony głównej dodaj:

```tsx
import { generateReviewsSchema } from '@/lib/reviewsSchema';
import { reviews, aggregateRating } from '@/lib/reviews.config';

export default function HomePage() {
  return (
    <>
      <Script
        id="reviews-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateReviewsSchema(reviews, aggregateRating))
        }}
      />
      {/* reszta strony */}
    </>
  );
}
```

Po publikacji sprawdź w [Google Rich Results Test](https://search.google.com/test/rich-results) czy Google widzi gwiazdki.

### 4. Wdrożenie sekcji

Na stronie głównej (i opcjonalnie podstronach) dodaj:

```tsx
import { ReviewsSection } from '@/components/ReviewsSection';

<ReviewsSection
  variant="carousel"     // lub "grid"
  showBadge              // pokaż "4.9 z Google"
  limit={6}
/>
```

## Best practices dla tej kategorii (behawiorystyka)

- **Wybieraj opinie konkretne, nie ogólne.** "Pies przestał ciągnąć po 2 sesjach" > "Polecam!"
- **Pokaż różne problemy.** Reaktywność, lęk separacyjny, konflikt kotów, szczeniak.
- **Inicjały + miasto** zamiast pełnych imion (RODO + dyskrecja klientów).
- **Cytat + nazwa zwierzaka** — "Marta K. (właścicielka Burka)" — ludzkie, ciepłe.
- **Nie wszystkie 5⭐.** Czasami 4⭐ z konstruktywną opinią buduje wiarygodność.

## Co zrobić ze starymi opiniami

Jeśli Krzysztof ma już opinie w Google Maps:
1. Wejdź na profil firmowy
2. Zrób screenshoty top 10 opinii
3. Wpisz je ręcznie do `reviews.config.ts` (z imieniem inicjałami)
4. Dodaj `source: 'google'` do każdej

Po tym nawet bez API masz "opinie z Google" na stronie.
