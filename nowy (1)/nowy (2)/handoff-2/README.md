# Paczka #2 — Ilustracje hero (Wariant B)

**Cel:** Dodać boczne ilustracje line-art / flat na **każdej stronie** w hero, w stylu Wariantu B.

## Biblioteka: Storyset.com

**Dlaczego Storyset:**
- Darmowe (z atrybucją) lub licencja Pro ~$12/mies bez atrybucji
- Spójny styl ilustracji — łatwo trzymać konsystencję
- Można wybrać kolorystykę pod brand (zielony #4a8d7a)
- Format: SVG + PNG + animowany Lottie
- Kategoria "Animals" + "Pets" ma kilkadziesiąt ilustracji psów i kotów

**Alternatywy:**
- [unDraw.co](https://undraw.co) — darmowe, ale brak ilustracji konkretnie psów/kotów
- [Blush.design](https://blush.design) — composable, ładne, premium
- [Lukasz Adam Illustrations](https://lukaszadam.com/illustrations) — darmowe pakiety
- [Open Doodles](https://www.opendoodles.com) — sketch-style

## Mapowanie stron → ilustracje Storyset

Wybierz styl **Pana** (line + soft fill) lub **Bro** (flat color). Trzymaj się jednego stylu na całej stronie!

| Strona | Sugerowana ilustracja Storyset | Search query |
|---|---|---|
| `/` (główna) | Para z psem na spacerze | `dog walking owner` |
| `/psy` | Pies bawiący się z właścicielem | `playing with dog` |
| `/psy/reaktywnosc-na-smyczy` | Pies na smyczy | `dog leash` |
| `/psy/lek-separacyjny` | Smutny pies w domu | `lonely dog home` |
| `/koty` | Osoba z kotem | `petting cat` lub `cat owner` |
| `/koty/zalatwianie-poza-kuweta` | Kot przy kuwecie | `cat litter box` (jeśli brak — `cat home`) |
| `/koty/konflikt-miedzy-kotami` | Dwa koty | `two cats` |
| `/o-mnie` | Konsultacja online / weterynarz | `vet online consultation` |
| `/cennik` | Kalkulacja / wycena | `price plans` |
| `/book` | Kalendarz rezerwacji | `online booking` |
| `/faq` | Pytania / chat | `questions chat` |
| `/blog` | Czytanie artykułów | `reading blog` |
| `/niezbednik` | Pobieranie materiałów | `download files` |
| `/kontakt` | Komunikacja | `contact email` |

## Konfiguracja kolorów Storyset

Przed pobraniem każdej ilustracji ustaw paletę:
- **Primary:** `#4a8d7a` (accent zielony marki)
- **Secondary:** `#1c1a18` (ink)
- **Tertiary:** `#e8f3f0` (accent-light)
- **Background:** `transparent`

Eksportuj jako **SVG** (skalowalne, lekkie) → ~5-30 KB każdy plik.

## Struktura plików w repo

```
public/
  illustrations/
    home.svg           ← /
    psy-main.svg       ← /psy
    psy-reaktywnosc.svg
    psy-separacja.svg
    psy-szczeniak.svg
    koty-main.svg      ← /koty
    koty-kuweta.svg
    koty-stres.svg
    koty-konflikt.svg
    o-mnie.svg
    cennik.svg
    book.svg
    faq.svg
    blog.svg
    niezbednik.svg
    kontakt.svg
```

## Komponenty

W `handoff-2/components/` znajdziesz:

| Plik | Opis |
|---|---|
| `HeroLayout.tsx` | Layout split — content po lewej, ilustracja po prawej. Responsywny. |
| `HeroIllustration.tsx` | Komponent ilustracji z fallbackiem (jeśli brak pliku — kolorowy placeholder gradient) |
| `pageHeroes.config.ts` | Mapa: ścieżka strony → plik ilustracji + alt text |

## Wdrożenie krok po kroku

### 1. Pobierz ilustracje ze Storyset

Przejdź na [storyset.com](https://storyset.com), w lewym menu wybierz:
- Style: **Pana** (rekomendacja — line-art z lekkim wypełnieniem)
- Color: **Custom** → ustaw paletę z sekcji wyżej
- Pobieraj jako **SVG**

Dla każdej z ~14 stron pobierz odpowiednią ilustrację (lista wyżej).

### 2. Wrzuć do `public/illustrations/`

```bash
mkdir -p public/illustrations
# Wrzuć wszystkie pobrane SVG z odpowiednimi nazwami
```

### 3. Skopiuj komponenty

Skopiuj zawartość `handoff-2/components/` do `src/components/`.

### 4. Zaktualizuj layouty stron

W każdej stronie hero zamień obecny układ na `<HeroLayout>`:

```tsx
import { HeroLayout } from '@/components/HeroLayout';
import { TrustBar } from '@/components/CredBadge';

export default function HomePage() {
  return (
    <HeroLayout slug="home">
      <TrustBar />
      <h1>Chcesz uporządkować zachowanie swojego psa lub kota?</h1>
      <p>Wybierz format konsultacji dopasowany do sytuacji...</p>
      {/* CTA */}
    </HeroLayout>
  );
}
```

`HeroLayout` automatycznie weźmie ilustrację z `pageHeroes.config.ts` na podstawie `slug`.

### 5. Build + sprawdź wszystkie strony

```bash
npm run build && npm run dev
```

## Ważne uwagi

⚠️ **Atrybucja Storyset (free):** Jeśli używasz darmowej wersji, dodaj w stopce:
```html
<a href="https://storyset.com">Illustrations by Storyset</a>
```

Jeśli klient nie chce atrybucji — kupić Pro za ~$12/mies (jednorazowy zakup zestawu też możliwy).

⚠️ **Spójność stylu:** Wszystkie ilustracje muszą być z **tego samego stylu Storyset** (Pana / Bro / Amico itd). Mieszanie stylów wygląda chaotycznie.

⚠️ **Optymalizacja:** SVG eksportowane ze Storyset bywają 50-200KB. Dla najlepszej wydajności przepuść przez [SVGOMG](https://jakearchibald.github.io/svgomg/) (zwykle redukcja 30-60%).
