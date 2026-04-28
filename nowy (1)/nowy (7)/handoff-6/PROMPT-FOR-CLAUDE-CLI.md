# Prompt do Claude CLI — Paczka #6 (SEO + Open Graph + Structured Data)

## Założenie
Paczki #1-#5 wdrożone. Next.js App Router. Reviews schema (paczka #3) już jest.

---

```
Wdróż paczkę "Regulski SEO" z folderu ./handoff-6/.

Wykonaj kolejno:

1. Przeczytaj ./handoff-6/README.md i ./handoff-6/lib/seo.config.ts (przejrzyj słowa kluczowe)

2. Skopiuj pliki:
   - ./handoff-6/lib/seo.config.ts          →  src/lib/
   - ./handoff-6/lib/metadata-helpers.ts    →  src/lib/
   - ./handoff-6/lib/structured-data.ts     →  src/lib/
   - ./handoff-6/app/sitemap.ts             →  src/app/sitemap.ts
   - ./handoff-6/app/robots.ts              →  src/app/robots.ts
   - ./handoff-6/app/manifest.ts            →  src/app/manifest.ts
   - ./handoff-6/app/opengraph-image.tsx    →  src/app/opengraph-image.tsx
   - ./handoff-6/components/Breadcrumbs.tsx →  src/components/

3. W KAŻDEJ stronie src/app/**/page.tsx zamień (lub dodaj) export metadata:
   ```
   import { buildPageMetadata } from '@/lib/metadata-helpers';
   export const metadata = buildPageMetadata('/'); // ścieżka strony
   ```

   Mapowanie ścieżek → ścieżki w pageSeo (lib/seo.config.ts):
   - app/page.tsx                              → '/'
   - app/psy/page.tsx                          → '/psy'
   - app/psy/reaktywnosc-na-smyczy/page.tsx    → '/psy/reaktywnosc-na-smyczy'
   - app/psy/lek-separacyjny/page.tsx          → '/psy/lek-separacyjny'
   - app/koty/page.tsx                         → '/koty'
   - app/koty/zalatwianie-poza-kuweta/page.tsx → '/koty/zalatwianie-poza-kuweta'
   - app/koty/konflikt-miedzy-kotami/page.tsx  → '/koty/konflikt-miedzy-kotami'
   - app/o-mnie/page.tsx                       → '/o-mnie'
   - app/cennik/page.tsx                       → '/cennik'
   - app/book/page.tsx                         → '/book'
   - app/faq/page.tsx                          → '/faq'
   - app/blog/page.tsx                         → '/blog'
   - app/niezbednik/page.tsx                   → '/niezbednik'
   - app/kontakt/page.tsx                      → '/kontakt'
   - app/behawiorysta-online-polska/page.tsx   → '/behawiorysta-online-polska'

4. W src/app/layout.tsx dodaj LocalBusiness schema:
   ```
   import Script from 'next/script';
   import { localBusinessSchema, jsonLdScript } from '@/lib/structured-data';

   <head>
     {/* ... */}
     <Script
       id="ld-business"
       type="application/ld+json"
       strategy="afterInteractive"
       dangerouslySetInnerHTML={{ __html: jsonLdScript(localBusinessSchema()) }}
     />
   </head>
   ```

5. W src/app/o-mnie/page.tsx dodaj Person schema:
   ```
   import { personSchema, jsonLdScript } from '@/lib/structured-data';
   <Script id="ld-person" type="application/ld+json"
     dangerouslySetInnerHTML={{ __html: jsonLdScript(personSchema()) }} />
   ```

6. W src/app/cennik/page.tsx i src/app/book/page.tsx dodaj Service schema:
   ```
   import { serviceSchema, jsonLdScript } from '@/lib/structured-data';
   <Script id="ld-service" ... />
   ```

7. W src/app/faq/page.tsx dodaj FAQPage schema (zbierz z istniejących pytań FAQ):
   ```
   import { faqPageSchema, jsonLdScript } from '@/lib/structured-data';
   const faqs = [
     { question: '...', answer: '...' },
     // ...
   ];
   <Script id="ld-faq" ... dangerouslySetInnerHTML={{ __html: jsonLdScript(faqPageSchema(faqs)) }} />
   ```

8. Na każdej podstronie (poza /) dodaj <Breadcrumbs> pod nawigacją:
   ```
   import { Breadcrumbs } from '@/components/Breadcrumbs';

   <Breadcrumbs items={[
     { name: 'Psy', url: '/psy' },
     { name: 'Reaktywność na smyczy', url: '/psy/reaktywnosc-na-smyczy' },
   ]} />
   ```

9. Sprawdź /public/ — czy istnieją:
   - favicon.ico
   - icon-192.png (192×192)
   - icon-512.png (512×512)
   - icon-maskable-512.png (z paddingiem 20% dla Android)
   - apple-touch-icon.png (180×180)
   Jeśli brak — wygeneruj z logo (https://realfavicongenerator.net/)

10. Zrób npm run build i napraw błędy

11. Sprawdź wygenerowane:
    - https://localhost:3000/sitemap.xml — wszystkie strony obecne
    - https://localhost:3000/robots.txt — sitemap reference
    - https://localhost:3000/manifest.webmanifest
    - https://localhost:3000/opengraph-image — pojawia się obrazek
    - View source dowolnej strony → meta tags + JSON-LD

12. Pokaż listę zmienionych plików
```

---

## Po deployu — test SEO

### Walidatory
1. **Schema.org:** [Google Rich Results Test](https://search.google.com/test/rich-results) — wpisz `regulskibehawiorysta.pl` → powinieneś zobaczyć: LocalBusiness, FAQPage, Article, Person, BreadcrumbList, AggregateRating + Review
2. **OG image:** [opengraph.xyz](https://www.opengraph.xyz/) — wklej URL → zobacz podgląd Facebook, Twitter, LinkedIn
3. **Twitter Card:** [Card Validator](https://cards-dev.twitter.com/validator)
4. **PageSpeed:** [PageSpeed Insights](https://pagespeed.web.dev/) — cel 90+ na mobile, 95+ desktop
5. **Sitemap:** Submit do [Google Search Console](https://search.google.com/search-console)

### Google Search Console — setup
1. Dodaj domenę `regulskibehawiorysta.pl`
2. Zweryfikuj przez DNS TXT (najpewniejsza metoda)
3. Lub dodaj `verification.google` do `metadata.verification` w `metadata-helpers.ts`
4. Submit sitemap: `regulskibehawiorysta.pl/sitemap.xml`
5. Po 2-3 dniach → indeksowanie + raporty

## Kluczowe metryki do śledzenia (po 30 dniach)
- Liczba zaindeksowanych stron (cel: 16+)
- Pozycje na słowa kluczowe (`behawiorysta online`, `pies reaktywny`, `kot poza kuwetą`)
- CTR z SERP (Google Search Console)
- Bounce rate per landing page (GA4)
