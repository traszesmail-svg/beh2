# Paczka #6 — SEO + Open Graph + Structured Data

**Cel:** Pełna optymalizacja SEO dla regulskibehawiorysta.pl — meta tags per strona, Open Graph (ładne podglądy w social), Twitter Cards, structured data (LocalBusiness, Service, FAQPage, BreadcrumbList), sitemap.xml, robots.txt, canonical URLs.

## Stack
- **Next.js Metadata API** (App Router) — natywne, type-safe
- **next-sitemap** — auto-generated sitemap
- **schema-dts** (TypeScript types dla Schema.org) — opcjonalnie
- **OG image generator** — dynamiczny w runtime

## Struktura paczki

```
handoff-6/
├── README.md
├── PROMPT-FOR-CLAUDE-CLI.md
├── lib/
│   ├── seo.config.ts              ← centralna konfiguracja
│   ├── metadata-helpers.ts        ← buildPageMetadata()
│   └── structured-data.ts         ← Schema.org generators
├── app/
│   ├── opengraph-image.tsx        ← dynamiczny OG image
│   ├── sitemap.ts                 ← Next.js sitemap.ts
│   ├── robots.ts                  ← Next.js robots.ts
│   └── manifest.ts                ← PWA manifest
└── components/
    └── Breadcrumbs.tsx            ← breadcrumbs + JSON-LD
```

## Co dostajesz

### 1. Meta tags per strona (16+ stron)
- `<title>` — unikalny, do 60 znaków, zawiera słowo kluczowe + brand
- `<meta description>` — do 160 znaków, CTA, słowa kluczowe
- `<link rel="canonical">` — zapobiega duplicate content
- `<meta robots>` — kontrola indeksowania
- Język + region (`lang="pl"`, `pl_PL`)

### 2. Open Graph (Facebook, LinkedIn, Slack)
- `og:title`, `og:description`, `og:url`, `og:type`
- `og:image` (1200×630, dynamicznie generowany)
- `og:locale` = `pl_PL`
- `og:site_name` = "Regulski Behawiorysta"

### 3. Twitter Cards
- `twitter:card` = `summary_large_image`
- `twitter:title`, `twitter:description`, `twitter:image`

### 4. Structured Data (JSON-LD)
- **LocalBusiness** — globalnie w layout
- **Service** — strona oferty/cennika
- **FAQPage** — strona FAQ
- **BreadcrumbList** — wszystkie podstrony
- **Article** — wpisy bloga
- **Person** — strona /o-mnie
- **Review + AggregateRating** (z paczki #3)

### 5. Sitemap.xml + robots.txt
Automatycznie generowane przez Next.js. Zawiera priorytety i częstotliwość zmian.

### 6. Dynamiczny OG image
Każda strona dostaje własny obrazek Open Graph (1200×630) z tytułem strony, generowany przez `next/og`.

## Słowa kluczowe — strategia

**Główne (high-volume):**
- behawiorysta psów online
- behawiorysta kotów
- konsultacja behawioralna online
- pies ciągnie na smyczy
- lęk separacyjny u psa
- kot sika poza kuwetą

**Long-tail (niskoa konkurencja, wysoka konwersja):**
- behawiorysta online polska
- konsultacja behawioralna 15 minut
- jak nauczyć psa zostawania samemu
- agresja u psa konsultacja
- konflikt między kotami pomoc

**Lokalne (jeśli świadczy też lokalnie):**
- behawiorysta [miasto]
- trener psów [miasto]

Mapowanie strona → słowa kluczowe znajdziesz w `lib/seo.config.ts`.
