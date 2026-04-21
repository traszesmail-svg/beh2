# Plan migracji `Regulski redesign.html` -> wariant `A / Notatnik`

Data checkpointu: `2026-04-21`
Zakres decyzji od usera:
- wybrany kierunek: `A`
- priorytet: zachowac uklad z redesignu
- warunek: strona ma dzialac, wiec linki i formularze maja byc realne, nie makietowe
- booking ma byc koniecznie w nowym layoucie
- oferta ma byc opisana jako:
  - `Kwadrans z behawiorysta`
  - `Dwa kwadranse z behawiorysta`
  - `Pelna konsultacja behawioralna` z czasem `ok. 2 h`
  - pelna konsultacja ma zawierac `wstepny Kwadrans z behawiorysta` dla rozpoznania problematyki i wstepnych zalecen

## Cel

Przeniesc obecny layout marketingowy do wariantu `A / Notatnik` z pliku:
- `C:\Users\chris\Desktop\Regulski redesign.html`

Nie robimy slepego kopiowania makiety. Zachowujemy uklad i charakter wizualny, ale podpinamy:
- realne trasy
- realne CTA
- istniejace formularze i flow
- lokalne assety zamiast placeholderow, tam gdzie to potrzebne

## Co juz zrobione

### 1. Wspolna baza redesignu A

Dodane / zmienione:
- `app/layout.tsx`
- `app/notatnik-a.css`
- `components/NotatnikA.tsx`
- `components/NotatnikEssentialsTable.tsx`

Stan:
- dodane font variables pod wariant A:
  - `--font-body`
  - `--font-display`
  - `--font-mono`
- dodany osobny namespacowany plik styli `app/notatnik-a.css`
- dodane wspolne komponenty:
  - topbar
  - section head
  - final CTA
  - footer
- dodana klientowa tabela filtrowania dla `Niezbednika`

### 2. Homepage przepiety na wariant A

Zmienione:
- `app/page.tsx`

Stan:
- homepage jest juz przepisany na layout `A / Landing`
- sa podlaczone realne trasy:
  - `/psy`
  - `/koty`
  - `/niezbednik`
  - `/kontakt#formularz`
  - booking CTA
- sa podlaczone lokalne assety zamiast makietowych placeholderow

### 3. Strony gatunkowe, kontakt i Niezbednik przepiete

Zmienione:
- `app/psy/page.tsx`
- `app/koty/page.tsx`
- `app/kontakt/page.tsx`
- `app/niezbednik/page.tsx`

Stan:
- wszystkie te strony siedza juz w layoucie `A / Notatnik`
- korzystaja z realnych linkow, CTA i formularzy
- copy zostalo zaktualizowane pod nowa hierarchie uslug

### 4. Booking przepiety i rozszerzony o nowa hierarchie uslug

Zmienione:
- `app/book/page.tsx`
- `app/slot/page.tsx`
- `app/form/page.tsx`
- `components/BookingServiceInfoCard.tsx`
- `components/BookingForm.tsx`
- `app/api/bookings/route.ts`
- `lib/funnel.ts`
- `lib/booking-services.ts`
- `lib/offers.ts`
- `lib/copy-governance.ts`

Stan:
- booking korzysta z wariantu `A / Notatnik` na:
  - `/book`
  - `/slot`
  - `/form`
- publicznie dostepne sa juz trzy uslugi:
  - `Kwadrans z behawiorysta`
  - `Dwa kwadranse z behawiorysta`
  - `Pelna konsultacja behawioralna`
- `konsultacja-30-min` nie jest juz ukryta legacy-only, tylko dziala w flow rezerwacji
- `Pelna konsultacja behawioralna` ma ustawiony czas operacyjny `120 min` i `slotSpan = 6`
- copy bookingu i kart uslug zostalo zaktualizowane pod:
  - `Dwa kwadranse`
  - `Pelna konsultacja`
  - opis `ok. 2 h`
  - wzmianke o wstepnym Kwadransie

### 5. Glowne strony ofertowe pod nowa oferte

Zmienione:
- `app/page.tsx`
- `app/oferta/page.tsx`
- `app/cennik/page.tsx`
- `app/konsultacja-behawioralna-online/page.tsx`
- `app/faq/page.tsx`
- `app/behawiorysta-online-polska/page.tsx`
- `components/OfferEntrySection.tsx`
- `components/ServiceDecisionSection.tsx`
- `components/CallRoom.tsx`

Stan:
- najwazniejsze publiczne wejscia nie powinny juz pokazywac starego `60 min` jako glownej nazwy uslugi
- pozostaly jeszcze starsze tresci i archiwalne copy w innych czesciach repo, ale glowne wejscia marketingowe i booking sa juz przepiete

## Co zostalo do zrobienia

### Etap 6. Dodatkowy sweep copy po calym repo

Zakres:
- starsze strony eksperckie
- zbiory FAQ / trust-layer
- starsze onboardingowe i opiniowe landingi
- smoke testy / raporty z tekstami asercji

Cel:
- wyczyscic resztki starego nazewnictwa `60 min`, ktore nie sa juz na glownej sciezce publicznej
- doprowadzic wszystkie poboczne tresci do tej samej hierarchii uslug

## Kolejnosc wznowienia po awarii

1. Otworzyc ten plik:
   - `PLAN_MIGRACJI_REGULSKI_REDESIGN_A_2026-04-21.md`
2. Sprawdzic stan repo:
   - `git status --short`
3. Otworzyc juz zmienione pliki:
   - `app/layout.tsx`
   - `app/notatnik-a.css`
   - `components/NotatnikA.tsx`
   - `components/NotatnikEssentialsTable.tsx`
   - `app/page.tsx`
4. Sprawdzic nowe jadro oferty:
- `lib/funnel.ts`
- `lib/booking-services.ts`
- `lib/offers.ts`
- `lib/copy-governance.ts`
5. Sprawdzic booking:
- `app/book/page.tsx`
- `app/slot/page.tsx`
- `app/form/page.tsx`
- `app/api/bookings/route.ts`
6. Jesli trzeba kontynuowac sweep copy:
- `app/oferta/page.tsx`
- `app/cennik/page.tsx`
- `app/konsultacja-behawioralna-online/page.tsx`
- `app/faq/page.tsx`
- potem starsze strony z `rg -n "60 min|konsultacja 60|pelna konsultacja" app components lib`
7. Na koncu odpalic weryfikacje:
   - `npm run build`
   - ewentualnie `npm run lint`

## Ryzyka i uwagi

- `app/page.tsx`, `app/psy/page.tsx`, `app/koty/page.tsx`, `app/kontakt/page.tsx` byly juz w dirty worktree przed checkpointem, ale te zmiany sa bezposrednio zwiazane z obecnym zadaniem, wiec sa nadpisywane w ramach redesignu.
- prototyp z pulpitu ma placeholdery i puste linki `href="#"`, wiec trzeba swiadomie podmieniac je na realne trasy
- layout `A` ma sticky topbar i mocno edytorialny rytm spacings, wiec trzeba sprawdzic mobile po wdrozeniu

## Szybki status

Zrobione:
- baza wariantu A
- homepage
- strony gatunkowe
- kontakt
- Niezbednik
- booking `/book`
- booking `/slot`
- booking `/form`
- publiczne uruchomienie `Dwa kwadranse z behawiorysta`
- przestawienie pelnej konsultacji na `ok. 2 h`

W toku:
- sweep resztkowego copy poza glowna sciezka publiczna

Nastepne:
- build
- poprawki po ewentualnych bledach kompilacji
