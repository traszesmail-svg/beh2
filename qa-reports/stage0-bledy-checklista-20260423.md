# Etap 0 - checklista QA bledy 2026-04-23

- Data: 2026-04-23 Europe/Warsaw
- Status: READY BEFORE CODE CHANGES
- Zrodlo planu: `plan-poprawek-bledy-2026-04-23.md`
- Cel: miec jedna macierz PASS/FAIL przed Etapem 1, zeby nie naprawiac krytycznych bugow "w ciemno".

## Referencyjne brzmienie platnosci

- Publiczne copy referencyjne: `PayPal albo BLIK na telefon.`
- Operacyjna interpretacja:
  - `Po formularzu klient dostaje mail z dalszym krokiem platnosci: przyciskiem do PayPal albo instrukcja BLIK na telefon.`
  - `Numer telefonu do BLIK nie jest publikowany na stronie.`
  - `Techniczny link moze prowadzic do PayPal.me, ale copy frontowe nie musi eksponowac brzmienia PayPal.me.`

## Zasada oceny PASS/FAIL

- `PASS`: strona laduje poprawny wariant tresci, nie cofa uzytkownika do listingu, nie ma rozjazdu copy, a formularz lub CTA komunikuja wlasciwy stan.
- `FAIL`: jest redirect do zlego miejsca, generyczny stan zamiast wybranego wariantu, mojibake, niespojne brzmienie platnosci albo brak czytelnego przejscia do formularza.
- Dla kazdej proby zapisujemy: URL startowy, URL koncowy, status PASS/FAIL, krotka notatke i screenshot tylko jesli wynik jest FAIL.

## Blog routing

- Baseline przed zmianami: `FAIL` dla calej listy. Kazdy z tych slugow istnieje w `lib/blog.tsx`, ale nadal jest wpisany do redirectow w `next.config.mjs`.
- PASS dla kazdego URL:
  - finalny adres zostaje na tym samym slug-u,
  - wpis odpowiada `200`,
  - nie ma `301/308` do `/blog`,
  - H1 i tresc sa wpisem, a nie listingiem bloga.

| URL do sprawdzenia | Status |
| --- | --- |
| `/blog/jak-przygotowac-sie-do-konsultacji-behawioralnej-online` | FAIL baseline |
| `/blog/reaktywnosc-na-smyczy-cwiczenie-luznej-smyczy` | FAIL baseline |
| `/blog/jak-nagrac-psa-zostawionego-samemu` | FAIL baseline |
| `/blog/jak-wybrac-kuwete-i-zwirek-dla-kota` | FAIL baseline |
| `/blog/jak-zapoznac-dwa-koty` | FAIL baseline |

## Booking matrix

- Baseline przed zmianami:
  - `FAIL` dla `?service=konsultacja-30-min` i `?service=konsultacja-behawioralna-online`, bo metadata i hero pozostaja generyczne.
  - `CHECK IN RUNTIME` dla `#formularz`, bo markup wyglada sensownie, ale trzeba potwierdzic zachowanie w przegladarce.
- PASS dla calej macierzy:
  - wybrana usluga jest komunikowana juz w hero,
  - formularz nie zachowuje sie tak, jakby uzytkownik dopiero zaczynal od zera,
  - zmiana uslugi zostaje mozliwa, ale jako ruch wtorny,
  - `Przejdz do formularza` przewija i daje czytelny efekt.

| URL do sprawdzenia | Oczekiwany stan po fixie | Status bazowy |
| --- | --- | --- |
| `/book` | generyczny start dla osoby, ktora jeszcze wybiera format | CHECK |
| `/book?service=szybka-konsultacja-15-min` | `Kwadrans z behawiorysta` jako stan wybrany | CHECK |
| `/book?service=konsultacja-30-min` | `Dwa kwadranse` w hero, title i formularzu | FAIL baseline |
| `/book?service=konsultacja-behawioralna-online` | `Pelna konsultacja` w hero, title i formularzu | FAIL baseline |

## PDF matrix

- Wybor reprezentacyjny:
  - 1 pojedynczy PDF z normalnym flow zakupowym,
  - 1 pakiet PDF z osobnym flow zakupowym.
- Baseline przed zmianami: `FAIL` na stronach zamowienia, bo `app/zamow-pdf/page.tsx`, `components/PdfOrderForm.tsx` i `app/api/pdf-orders/route.ts` maja mojibake albo niespojne copy.
- PASS dla obu prob:
  - H1, lead, etykiety, checkboxy i CTA sa poprawnie po polsku,
  - komunikaty sukcesu lub bledu nie maja popsutego kodowania,
  - copy platnosci trzyma referencje `PayPal albo BLIK na telefon`.

| Typ | URL opisu | URL zamowienia | Status bazowy |
| --- | --- | --- | --- |
| PDF | `/oferta/poradniki-pdf/pies-zostaje-sam-plan-pierwszych-krokow` | `/zamow-pdf?guide=pies-zostaje-sam-plan-pierwszych-krokow` | FAIL baseline |
| Pakiet | `/oferta/poradniki-pdf/pakiety/pakiet-startowy-psa` | `/zamow-pdf?bundle=pakiet-startowy-psa` | FAIL baseline |

## Gotowe wyjscie z Etapu 0

- Mamy jedna checkliste PASS/FAIL dla bloga, bookingu i PDF.
- Mamy jedno publiczne brzmienie platnosci dla calego serwisu: `PayPal albo BLIK na telefon.`
- Etap 1 mozna robic po kolei bez zgadywania, co dokladnie ma przejsc QA po kazdej zmianie.
