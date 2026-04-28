# Prompt do Claude CLI — Paczka #2 (Ilustracje)

## Założenie
Paczka #1 (ikony Lucide) jest już wdrożona. Teraz dodajemy boczne ilustracje hero do każdej strony.

---

```
Wdróż paczkę "Regulski Ilustracje Hero" z folderu ./handoff-2/.

Wykonaj kolejno:

1. Przeczytaj ./handoff-2/README.md — szczególnie sekcję "Mapowanie stron → ilustracje Storyset"
2. Skopiuj komponenty z ./handoff-2/components/ do src/components/
3. Utwórz folder public/illustrations/ — ilustracje SVG zostaną tam wrzucone ręcznie przez właściciela ze Storyset.com (zgodnie z mapą w README). Komponent <HeroIllustration> ma fallback z emoji więc nie zepsuje się jeśli SVG jeszcze nie istnieje.
4. Na każdej stronie hero podmień obecny układ na <HeroLayout slug="..."> z odpowiednim slug-iem zgodnie z mapą:
   - / → slug="home"
   - /psy → slug="psy"
   - /psy/reaktywnosc-na-smyczy → slug="psy-reaktywnosc"
   - /psy/lek-separacyjny → slug="psy-separacja"
   - /koty → slug="koty"
   - /koty/zalatwianie-poza-kuweta → slug="koty-kuweta"
   - /koty/konflikt-miedzy-kotami → slug="koty-konflikt"
   - /o-mnie → slug="o-mnie"
   - /cennik → slug="cennik"
   - /book → slug="book"
   - /faq → slug="faq"
   - /blog → slug="blog"
   - /niezbednik → slug="niezbednik"
   - /kontakt → slug="kontakt"

5. Każdy hero ma dostać <HeroLayout slug="..." emoji="🐕"> (wybierz odpowiednie emoji jako fallback)
6. TrustBar (z paczki #1) ma być WEWNĄTRZ HeroLayout — pierwszy element children
7. Zrób npm run build i napraw błędy TypeScript
8. Pokaż listę zmienionych stron

Pamiętaj: ilustracje SVG (~14 plików) zostaną dodane przez właściciela później do public/illustrations/. Komponent ma fallback i wyświetli kolorowy gradient + emoji jeśli pliku nie ma.
```

---

## Po wdrożeniu — pobranie ilustracji

Właściciel musi:

1. Wejść na [storyset.com](https://storyset.com)
2. Wybrać styl — sugerujemy **Pana** (line-art)
3. Skonfigurować kolory:
   - Primary: `#4a8d7a`
   - Secondary: `#1c1a18`
   - Background: transparent
4. Wyszukać i pobrać 14 ilustracji wg listy w `README.md` (kolumna "Search query")
5. Eksport SVG → wrzucić do `public/illustrations/` z nazwami z `pageHeroes.config.ts`

## Lista plików SVG do dostarczenia

```
public/illustrations/home.svg
public/illustrations/psy-main.svg
public/illustrations/psy-reaktywnosc.svg
public/illustrations/psy-separacja.svg
public/illustrations/psy-szczeniak.svg
public/illustrations/koty-main.svg
public/illustrations/koty-kuweta.svg
public/illustrations/koty-stres.svg
public/illustrations/koty-konflikt.svg
public/illustrations/o-mnie.svg
public/illustrations/cennik.svg
public/illustrations/book.svg
public/illustrations/faq.svg
public/illustrations/blog.svg
public/illustrations/niezbednik.svg
public/illustrations/kontakt.svg
```

Każdy SVG ~5-30KB, łącznie cała paczka <500KB.
