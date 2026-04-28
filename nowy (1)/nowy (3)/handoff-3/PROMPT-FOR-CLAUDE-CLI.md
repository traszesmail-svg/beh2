# Prompt do Claude CLI — Paczka #3 (Opinie + Google Reviews)

## Założenie
Paczki #1 (Lucide) i #2 (ilustracje) są wdrożone. Teraz dodajemy sekcję opinii + Schema.org + integrację Google Places API (opcjonalnie).

---

```
Wdróż paczkę "Regulski Reviews" z folderu ./handoff-3/.

Wykonaj kolejno:

1. Przeczytaj ./handoff-3/README.md — szczególnie sekcję "Strategia hybrydowa"

2. Skopiuj pliki:
   - ./handoff-3/components/*.tsx  →  src/components/
   - ./handoff-3/lib/*.ts          →  src/lib/
   - ./handoff-3/api/reviews.ts    →  src/app/api/reviews/route.ts (Next.js App Router)

3. Zainstaluj jeśli nie ma: lucide-react (z paczki #1) — pomiń jeśli już jest

4. Sprawdź czy projekt ma definicje kolorów Tailwind:
   - accent: #4a8d7a
   - accent-light: #e8f3f0
   - accent-dark: #2d5f52
   - ink: #1c1a18
   - cream: #faf9f7
   Jeśli nie — dodaj do tailwind.config.ts (były w paczce #1, sprawdź)

5. Dodaj Schema.org JSON-LD do src/app/layout.tsx (root layout):
   ```
   import Script from 'next/script';
   import { generateReviewsSchema } from '@/lib/reviewsSchema';
   import { reviews, aggregateRating } from '@/lib/reviews.config';

   <Script
     id="reviews-schema"
     type="application/ld+json"
     strategy="afterInteractive"
     dangerouslySetInnerHTML={{
       __html: JSON.stringify(generateReviewsSchema(reviews, aggregateRating))
     }}
   />
   ```

6. Wstaw <ReviewsSection> na stronie głównej src/app/page.tsx (sekcja przed footerem):
   ```
   import { ReviewsSection } from '@/components/ReviewsSection';

   <ReviewsSection
     variant="carousel"
     showBadge
     limit={8}
     googleProfileUrl="https://www.google.com/maps/place/REGULSKI_BUSINESS_ID"
   />
   ```
   ⚠️ URL profilu Google podmień na prawdziwy gdy będzie znany.

7. Opcjonalnie wstaw <GoogleRatingBadge variant="compact"> w nawigacji lub TrustBar (pod hero) — dla większego social proof.

8. Skonfiguruj .env.local (template):
   ```
   GOOGLE_PLACES_API_KEY=<wygeneruj_w_Google_Cloud_Console>
   GOOGLE_PLACE_ID=<znajdź_przez_Place_ID_Finder>
   ```
   Jeśli env vars są puste — komponent automatycznie użyje manualnej listy z reviews.config.ts.

9. Wykonaj npm run build i napraw błędy TypeScript

10. Po deployu sprawdź:
    - https://search.google.com/test/rich-results — czy Schema.org jest widoczny
    - https://regulskibehawiorysta.pl/api/reviews — czy API zwraca poprawny JSON
    - Czy karuzela działa (auto-scroll, swipe na mobile, klawiatura ←→)

Pokaż listę zmienionych plików + status działania API.
```

---

## Po wdrożeniu — TODO dla Krzysztofa

### Bez Google API (start)
1. Otwórz `src/lib/reviews.config.ts`
2. Edytuj listę 8-12 opinii — zastąp przykładowe prawdziwymi
3. Deploy → opinie żyją

### Z Google API (premium)
1. Wejdź na [Google Cloud Console](https://console.cloud.google.com)
2. Utwórz projekt "Regulski Behawiorysta"
3. APIs & Services → Library → włącz **Places API (New)**
4. Credentials → Create API Key → ogranicz do domeny `regulskibehawiorysta.pl/*`
5. Znajdź Place ID: [Place ID Finder](https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder) (wpisz swoje imię/firmę)
6. Dodaj zmienne do Vercel/Netlify env:
   - `GOOGLE_PLACES_API_KEY`
   - `GOOGLE_PLACE_ID`
7. Redeploy → automatyczny pull live opinii z 24h cache

### Test Schema.org
1. Po deployu wejdź na [Google Rich Results Test](https://search.google.com/test/rich-results)
2. Wpisz `https://regulskibehawiorysta.pl`
3. Sprawdź czy widzi **LocalBusiness** + **AggregateRating** + listę **Review**
4. Po 1-2 tygodniach od indeksowania → gwiazdki w SERP
