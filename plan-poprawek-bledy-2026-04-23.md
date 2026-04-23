# Plan poprawek etapami - 2026-04-23

## Cel

Naprawic bledy wskazane w audycie bez rozwalania obecnej architektury serwisu.
Priorytetem sa bugi produkcyjne, ktore psuja wejscie w tresc, rezerwacje albo skladanie zamowien.

## Status analizy

### Potwierdzone zrodla problemow

1. Blog routing - potwierdzone
- Problem: czesc slugow wpisow istnieje w `lib/blog.tsx`, ale jest recznie przekierowywana na `/blog`.
- Root cause: `next.config.mjs` ma liste `legacyBlogRedirects`, ktora mapuje kilka prawidlowych URL-i wpisow na listing bloga.
- Skutek: klik z listingu albo z linku wewnetrznego moze wracac na `/blog` bez komunikatu.

2. Booking - niespojny stan i metadata - potwierdzone
- Problem: `/book`, `/book?service=konsultacja-30-min` i `/book?service=konsultacja-behawioralna-online` uzywaja tej samej generycznej strony i tego samego formularza wyboru uslugi.
- Root cause:
  - `app/book/page.tsx` ma statyczny `metadata.title = "Rezerwacja Kwadransa z behawiorysta"`.
  - hero pozostaje generyczne niezaleznie od wybranego wariantu.
  - `components/BookRequestForm.tsx` dalej pokazuje globalne `Wybierz usluge` zamiast trybu "wybrales juz usluge X".
- Skutek: slabsza pewnosc uzytkownika, gorsza analityka i nieprecyzyjne SEO.

3. Mikro-CTA `Przejdz do formularza` - do weryfikacji runtime
- Problem zgloszony w audycie jest sensowny UX-owo, ale w obecnym kodzie obie akcje sa linkami `Link`.
- Stan kodu: `app/book/page.tsx` ma realny anchor do `#formularz`.
- Wniosek: ten punkt trzeba sprawdzic w przegladarce przed zmianami, bo moze byc juz naprawiony albo blokowany stylem, a nie markupem.

4. Formularze PDF - mojibake / kodowanie - potwierdzone
- Problem: etykiety i komunikaty w `zamow-pdf` sa uszkodzone i renderuja sie z blednym kodowaniem.
- Root cause:
  - `app/zamow-pdf/page.tsx` ma popsute stringi w metadata i tresci.
  - `components/PdfOrderForm.tsx` ma popsute stringi w labelach, feedbacku i CTA.
  - `app/api/pdf-orders/route.ts` ma popsute komunikaty bledow.
- Skutek: spadek zaufania dokladnie w formularzu sprzedazowym.

5. Platnosci i warstwa prawna - niespojne - potwierdzone
- Problem: strony sprzedazowe i booking komunikuja `PayPal.me albo BLIK na telefon`, a `app/regulamin/page.tsx` komunikuje publicznie tylko BLIK.
- Root cause:
  - marketing i formularze sa juz przestawione na dwa warianty platnosci,
  - regulamin ogolny nie zostal dograny do tej samej logiki,
  - regulamin pelnej konsultacji ma z kolei inna, szersza wersje tego samego komunikatu.
- Skutek: niespojnosc w obszarze finansowym i zakupowym.

6. Nawigacja i szablony - niespojne - potwierdzone
- Problem: serwis dziala jak kilka minisystemow z rozna top nawigacja.
- Root cause:
  - aktywne sa co najmniej dwa systemy nawigacyjne: `components/Header.tsx` i `NotatnikPageShell` / `NotatnikTopbar`.
  - poszczegolne strony definiuja lokalne `navItems` niezaleznie od siebie.
- Skutek: slabsza spojnosc marki, trudniejsza orientacja i gorsza powtarzalnosc UX.

7. Niezbednik - rozszczepiona architektura oferty materialow - potwierdzone jako debt IA
- Problem: z top poziomu widac glownie kilka startowych materialow, ale glebiej istnieja PDF-y, pakiety i osobne formularze.
- Root cause:
  - `app/niezbednik/page.tsx` eksponuje przede wszystkim lead magnety i rekomendacje,
  - zamowienia i sciezki PDF sa rozrzucone po `niezbednik`, `oferta/poradniki-pdf` i `zamow-pdf`.
- Skutek: niepelna widocznosc oferty materialow z poziomu glownego menu.

8. Kontakt / urgent - pies vs kot - czesciowo potwierdzone, wymaga QA runtime
- Co jest potwierdzone:
  - `components/ContactLeadForm.tsx` obsluguje dynamiczne przelaczanie tematow po gatunku.
  - `app/urgent/UrgentForm.tsx` tez ma osobne zestawy tematow dla psa i kota.
- Ryzyko:
  - oba formularze startuja psim defaultem, wiec pierwszy ekran moze byc zbyt psi.
  - trzeba sprawdzic runtime, czy po zmianie gatunku wszystkie helpery i opcje sa spojne.

9. Cookie banner - realny problem UX, wymaga doprecyzowania runtime
- Problem: komponent `AnalyticsConsent` renderuje wlasny baner przy braku Cookiebot i aktywnym GA.
- Co wiadomo:
  - overlay istnieje w `components/AnalyticsConsent.tsx`.
  - jest montowany globalnie w `app/layout.tsx`.
- Wniosek: trzeba sprawdzic runtime na live i dopiero zdecydowac, czy fix ma byc czysto CSS-owy, pozycjonujacy, czy logiczny.

### Dodatkowe niespojnosci wykryte przy analizie

1. `app/blog/page.tsx` ma dodatkowe mojibake w metadata i copy listingu bloga.
2. `app/psy/page.tsx` i `app/koty/page.tsx` nadal komunikuja `Kwadrans na juz` jako pelnoprawny frontowy etap oferty.
3. To oznacza, ze nawet po naprawie wskazanych bugow zostana jeszcze miejsca, gdzie stara architektura oferty przecieka do live copy.

## Etapy wdrozenia

## Etap 0 - zabezpieczenie i checklista QA

Cel: zminimalizowac ryzyko przypadkowych regresji podczas napraw krytycznych.

Zakres:
- przygotowac liste URL-i do sprawdzenia dla bloga:
  - `/blog/jak-przygotowac-sie-do-konsultacji-behawioralnej-online`
  - `/blog/reaktywnosc-na-smyczy-cwiczenie-luznej-smyczy`
  - `/blog/jak-nagrac-psa-zostawionego-samemu`
  - `/blog/jak-wybrac-kuwete-i-zwirek-dla-kota`
  - `/blog/jak-zapoznac-dwa-koty`
- przygotowac macierz bookingu:
  - `/book`
  - `/book?service=szybka-konsultacja-15-min`
  - `/book?service=konsultacja-30-min`
  - `/book?service=konsultacja-behawioralna-online`
- przygotowac macierz PDF:
  - min. 1 PDF
  - min. 1 pakiet
- ustalic jedno referencyjne brzmienie platnosci dla calego serwisu.

Kryterium wyjscia:
- mamy liste scenariuszy PASS/FAIL przed pierwsza zmiana.

## Etap 1 - naprawy krytyczne produkcyjnie

Cel: usunac bledy, ktore psuja wejscie w tresc, rezerwacje albo skladanie zamowienia.

### 1A. Blog routing

Zakres:
- usunac lub zawezic z `next.config.mjs` te redirecty, ktore dzis koliduja z istniejacymi wpisami.
- zostawic tylko redirecty faktycznie potrzebne dla slugow historycznych lub literowek.
- sprawdzic linki wewnetrzne w `lib/blog.tsx`, zeby nie prowadzily do slugow dalej mapowanych na listing.

Pliki:
- `next.config.mjs`
- `lib/blog.tsx`

Kryterium odbioru:
- kazdy slug z listy problematycznej otwiera wpis 200, a nie robi 301 do `/blog`.

### 1B. PDF mojibake

Zakres:
- naprawic stringi w:
  - `app/zamow-pdf/page.tsx`
  - `components/PdfOrderForm.tsx`
  - `app/api/pdf-orders/route.ts`
- przy okazji ujednolicic copy formularza i potwierdzenia.

Pliki:
- `app/zamow-pdf/page.tsx`
- `components/PdfOrderForm.tsx`
- `app/api/pdf-orders/route.ts`

Kryterium odbioru:
- wszystkie etykiety, checkboxy, CTA i komunikaty bledow wyswietlaja sie poprawnie po polsku.

### 1C. Booking - stan wybranej uslugi i metadata

Zakres:
- wprowadzic dynamiczne metadata zalezne od `searchParams.service`.
- zmienic gore strony tak, by po wejsciu przez wariant 30 albo 60 minut bylo jasne, ze to jest booking tej konkretnej uslugi.
- ograniczyc w formularzu generyczne `Wybierz usluge` tam, gdzie uzytkownik wszedl juz z konkretnego wariantu.
- zostawic mozliwosc zmiany uslugi, ale jako wtorny ruch, nie jako glowny stan wejscia.
- sprawdzic runtime `Przejdz do formularza`; jesli jest slabo odbierane, poprawic styl / affordance, a nie tylko markup.

Pliki:
- `app/book/page.tsx`
- `components/BookRequestForm.tsx`
- ewentualnie `lib/seo.ts` lub pomocnicze mapowanie nazw uslug, jesli bedzie potrzebne.

Kryterium odbioru:
- `/book?service=konsultacja-30-min` komunikuje `Dwa kwadranse`,
- `/book?service=konsultacja-behawioralna-online` komunikuje `Pelna konsultacja`,
- title i description nie udaja juz zawsze samego Kwadransu.

### 1D. Platnosci - ujednolicenie marketingu i regulaminow

Zakres:
- podjac jedna publiczna decyzje:
  - albo wszedzie publicznie `PayPal.me albo BLIK na telefon`,
  - albo wszedzie publicznie tylko `BLIK na telefon`,
  - a drugi kanal zostaje tylko fallbackiem mailowym i nie jest komunikowany na stronie.
- dostosowac do tego:
  - booking,
  - cennik,
  - urgent,
  - PDF,
  - regulamin ogolny,
  - regulamin pelnej konsultacji.

Pliki:
- `app/book/page.tsx`
- `components/BookRequestForm.tsx`
- `app/cennik/page.tsx`
- `app/urgent/page.tsx`
- `app/zamow-pdf/page.tsx`
- `components/PdfOrderForm.tsx`
- `app/regulamin/page.tsx`
- `app/regulamin-pelna-konsultacja/page.tsx`
- opcjonalnie `lib/server/payment-options.ts` tylko jesli copy helper ma sterowac tym centralnie.

Kryterium odbioru:
- klient czyta ten sam model platnosci na wszystkich stronach publicznych i w regulaminach.

## Etap 2 - porzadki architektury informacji i nawigacji

Cel: zrobic z tego jeden serwis, a nie kilka sasiednich szablonow.

### 2A. Ujednolicenie top nawigacji

Zakres:
- zdefiniowac jeden referencyjny zestaw nav dla glownego serwisu i jeden dla sekcji specjalnych, jesli sa faktycznie potrzebne.
- ograniczyc lokalne `navItems` rozproszone po stronach.
- zdecydowac, czy `components/Header.tsx` zostaje:
  - wygaszony,
  - czy wpinany tylko do starszych landingow.

Pliki:
- `components/Header.tsx`
- `components/NotatnikA.tsx`
- strony z lokalnymi `navItems`

Kryterium odbioru:
- home, blog, kontakt, booking i niezbednik nie wygladaja jak osobne systemy.

### 2B. Niezbednik - pelniejsza ekspozycja oferty materialow

Zakres:
- pokazac z poziomu `Niezbednik` nie tylko darmowe starty, ale tez jasny katalog:
  - PDF-y,
  - pakiety,
  - ksiazki,
  - przybory.
- uproscic sciezke z top menu do platnych materialow.

Pliki:
- `app/niezbednik/page.tsx`
- `app/zamow-pdf/page.tsx`
- ewentualnie strony `oferta/poradniki-pdf/*`

Kryterium odbioru:
- uzytkownik z menu widzi pelny zakres materialow, nie tylko lead magnety.

### 2C. Domkniecie nowej architektury oferty

Zakres:
- usunac przedwczesne eksponowanie `Kwadrans na juz` z miejsc, gdzie jeszcze zostalo:
  - `app/psy/page.tsx`
  - `app/koty/page.tsx`
  - inne landingi, jesli wyjda z grep-a przy wdrozeniu.

Kryterium odbioru:
- na frontowych stronach wyboru zakresu sa trzy glowne formaty, a wariant priorytetowy pojawia sie dopiero nizej w lejku.

## Etap 3 - QA formularzy i mikro-UX

Cel: domknac rzeczy, ktore nie sa twardym bugiem w kodzie, ale sa ryzykiem w odbiorze live.

### 3A. Kontakt / urgent - pies i kot

Zakres:
- sprawdzic runtime dla kontaktu i urgent:
  - default state,
  - zmiana `Pies` -> `Kot`,
  - zestaw tematow,
  - helpery i copy.
- jesli pierwszy ekran jest zbyt psi, rozwazyc neutralny start albo czytelniejszy selector gatunku.

Pliki:
- `components/ContactLeadForm.tsx`
- `app/urgent/UrgentForm.tsx`
- `app/kontakt/page.tsx`

Kryterium odbioru:
- opiekun kota widzi od razu sensowna, kocia logike bez psiego przecieku w helperach i tematach.

### 3B. Cookie banner i pierwszy scroll

Zakres:
- sprawdzic live zachowanie banera przy czystej sesji.
- jesli zaslania hero / cennik / sekcje zaufania, zmienic:
  - pozycje,
  - rozmiar,
  - szerokosc,
  - breakpointy,
  - albo logike wyswietlania.

Pliki:
- `components/AnalyticsConsent.tsx`
- style globalne dla banera

Kryterium odbioru:
- pierwszy widok strony jest czytelny i nie ma wrazenia, ze overlay zaslania kluczowy content.

## Kolejnosc realizacji

1. Etap 0 - checklista QA i wspolne brzmienie platnosci
2. Etap 1A - blog routing
3. Etap 1B - PDF mojibake
4. Etap 1C - booking state + metadata
5. Etap 1D - platnosci i regulaminy
6. Etap 2A - nawigacja
7. Etap 2B - Niezbednik
8. Etap 2C - domkniecie architektury oferty
9. Etap 3A - kontakt / urgent runtime QA
10. Etap 3B - cookie banner

## Co warto zrobic od razu w pierwszym wdrozeniu

Jesli celem jest szybkie podniesienie jakosci live bez nowego sprintu, pierwszy rollout powinien objac tylko:

1. blog routing,
2. PDF mojibake,
3. booking metadata i stan wybranej uslugi,
4. platnosci w regulaminach i stronach sprzedazowych.

To sa bledy, ktore realnie uderzaja w klik, formularz, zakup i zaufanie.
