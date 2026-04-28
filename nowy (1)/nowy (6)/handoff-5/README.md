# Paczka #5 — Dark mode

**Cel:** Pełny przełącznik dzień/noc na regulskibehawiorysta.pl. Zapis preferencji w localStorage + respektowanie systemowego ustawienia (`prefers-color-scheme`). Wszystkie komponenty z paczek #1–#4 dostają warianty dark.

## Stack
- **next-themes** — standard branżowy dla Next.js (3KB, SSR-safe, no flash)
- **Tailwind dark: variant** — `class` strategy
- **CSS custom properties** — dla kolorów akcentu

## Co dostajesz

```
handoff-5/
├── README.md
├── PROMPT-FOR-CLAUDE-CLI.md
├── components/
│   ├── ThemeProvider.tsx           ← wrapper next-themes
│   ├── ThemeToggle.tsx             ← przełącznik słońce/księżyc
│   └── ThemeScript.tsx             ← anti-flash inline script
├── styles/
│   └── theme-tokens.css            ← CSS custom properties
└── tailwind.dark.config.ts         ← rozszerzenie Tailwind
```

## Kluczowe decyzje

### 1. Domyślny tryb: **system**
Strona respektuje ustawienie OS użytkownika. Jeśli ma dark mode w systemie → strona też.

### 2. Brak "flash of light theme" (FOIT)
Inline script w `<head>` ustawia klasę przed pierwszym renderem.

### 3. Trzy stany przełącznika
- ☀️ Light (na sztywno jasny)
- 🌙 Dark (na sztywno ciemny)
- 💻 System (auto)

### 4. Kolory dark mode

```
Light mode:                     Dark mode:
--bg: #faf9f7 (cream)          --bg: #0f0e0c (deep ink)
--surface: #ffffff             --surface: #1c1a18
--ink: #1c1a18                 --ink: #f5f4f0
--muted: #5a5650               --muted: #a8a39c
--accent: #4a8d7a              --accent: #6db89e (jaśniejsze!)
--accent-light: #e8f3f0        --accent-light: #1f3530
--border: #e5e2dc              --border: #2d2a27
```

**Ważne:** w dark mode accent musi być **jaśniejszy** (#6db89e zamiast #4a8d7a) żeby zachować kontrast WCAG AA.

## Lokalizacja przełącznika

Sugerowane miejsce: **prawy górny róg navigation bar**, obok linku Kontakt.

```tsx
<nav>
  <Logo />
  <NavLinks />
  <ThemeToggle />        {/* ← tutaj */}
  <CTAButton />
</nav>
```

Na mobile: w menu hamburger lub jako floating button bottom-right.

## Co potrzebuje warianty dark

Wszystkie komponenty z paczek #1–#4. Konkretnie:
- TrustBar / CredBadge — `dark:bg-neutral-900 dark:border-neutral-800`
- HowItWorksSteps — karty kroków
- OfferCards — w tym highlighted card (środkowy)
- FAQSection — accordion
- Testimonial / ReviewCard / ReviewsCarousel
- HeroLayout — gradient ilustracji
- KwadransNaJuzBadge — accent box
- GoogleRatingBadge

Wszystkie dostają poprawki w PROMPT-FOR-CLAUDE-CLI.md.

## Ważne uwagi

⚠️ **Obrazy / ilustracje Storyset** — większość ilustracji ma jasne tło. W dark mode dodaj filtr `dark:invert dark:hue-rotate-180` lub przygotuj osobne wersje SVG.

⚠️ **Logo** — jeśli czarne logo, w dark mode podmień na białą wersję. Dodaj `<picture>` z `media="(prefers-color-scheme: dark)"`.

⚠️ **Schema.org JSON-LD** — bez zmian, niezależne od trybu.

⚠️ **Accessibility** — przełącznik musi mieć `aria-label`, `role="button"`. WCAG kontrast min 4.5:1 dla tekstu, 3:1 dla UI.
