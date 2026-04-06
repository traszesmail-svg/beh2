# PLAN GPT MINI - PUBLIKACJA I NAPRAWY

Data audytu: 2026-04-06
Status tego etapu: analiza tylko, bez dalszych poprawek produktu
Ten dokument zastępuje wczesniejsze plany i handoffy.

## 1. Executive Summary

Najwazniejsze ustalenia:
- Live dziala i zostal przeklikany end-to-end. Wynik QA live to 18/19 krokow zaliczonych.
- Jedyny realny blad produkcyjny wykryty w przeplywie klienta dotyczy przejscia `manual payment -> pending manual review`.
- Live readiness jest `READY 4/4`, ale w praktyce oznacza to start na platnosci recznej. PayU jest celowo wylaczone, a maile klienta sa celowo wylaczone.
- Lokalny projekt nie jest obecnie wiarygodnym odpowiednikiem produkcji: `npm run build` pada, a `GET /` lokalnie zwraca `500`, bo `app/globals.css` jest uszkodzony i zaczyna sie od bajtow `NUL`.
- Na live hero nadal nie jest ustawione zdjecie z ciastkiem w rece. W lokalnej konfiguracji `lib/site.ts` hero wskazuje juz `public/branding/omnie.png`, ale ten stan nie jest obecnie opublikowany live.
- Najwieksze blokery zarabiania to nie layout, tylko: niestabilny reczny checkout, brak bezpiecznej sciezki testowej platnosci, brak maili klienta i brak zdrowego lokalnego repo do dalszej pracy.

## 2. Dowody i zrodla prawdy

Glowne zrodla:
- Live QA report: `qa-reports/live-clickthrough-20260406-061636.md`
- Latest live QA snapshot: `qa-reports/latest-report.md`
- Live readiness report: `qa-reports/live-readiness-20260406-062006.md`
- Hero config lokalnie: `lib/site.ts:18-20`
- Home hero render lokalnie: `app/page.tsx:212-218` oraz `app/page.tsx:298-303`
- Manual payment UI: `components/PaymentActions.tsx:57-88` i `components/PaymentActions.tsx:279-289`
- Confirmation state for manual review: `app/confirmation/page.tsx:126-156`
- PayU disabled intentionally: `lib/server/payment-options.ts:180` oraz `lib/server/go-live.ts:208-215`
- Prawny/copy mismatch o PayU: `app/regulamin/page.tsx:34-35` oraz `lib/data.ts:167-169`
- Krytyczny lokalny blocker: `app/globals.css`

Twarde fakty z audytu:
- Live QA: `18/19` krokow zaliczonych, runtime issues `0`.
- Krok failujacy na live: `manual payment -> pending`.
- W raporcie live zapisano:
  - `POST /api/payments/manual timed out; proceeding with canonical confirmation URL.`
  - `Pending manual review nie pojawil sie po kliknieciu...`
- Live readiness raport mowi wprost:
  - PayU online jest swiadomie wylaczone.
  - Checkout dziala przez wplate reczna i potwierdzenie na stronie.
  - Maile klienta sa swiadomie wylaczone.
- Lokalnie:
  - `npm run build` failuje na `app/globals.css Unknown word`.
  - `npm run dev` startuje, ale `GET /` konczy sie `500` z tym samym bledem CSS.
  - Pierwsze 64 bajty `app/globals.css` to `00`, czyli plik jest realnie uszkodzony.

## 3. Porownanie Live vs Local

| Obszar | Live | Local | Wniosek |
|---|---|---|---|
| Dostepnosc strony glownej | dziala | `500` | lokalne repo jest aktualnie zablokowane |
| Build produkcyjny | live dziala | `npm run build` fail | najpierw naprawic repo, potem wdrazac UX |
| Hero photo | nadal nie to zdjecie co chcesz | config wskazuje `omnie.png` | lokalne zmiany nie sa wiarygodnie gotowe do deployu bez recovery repo |
| Checkout | dziala, ale reczna platnosc ma niestabilne przejscie do `pending` | nie da sie rzetelnie odtworzyc przez broken CSS | analiza platnosci musi byc kontynuowana po naprawie repo |
| PayU | wylaczone celowo | logika jest w kodzie | uruchamiac dopiero po ustabilizowaniu manual payment |
| Maile klienta | wylaczone celowo | kod istnieje, ale stan lokalny jest niesprawny | po naprawie repo trzeba domknac trust layer |

Praktyczny wniosek:
- Dzisiaj produkcja jest bardziej uzywalna niz lokalne repo.
- GPT Mini ma zaczac nie od kosmetyki, tylko od odblokowania lokalnej bazy pracy.

## 4. Lista bledow i ryzyk do poprawy

### P0 - krytyczne

1. Lokalny projekt jest uszkodzony i nie przechodzi builda.
- Objaw: `app/globals.css` zawiera bajty `NUL` i psuje kazda strone.
- Skutek biznesowy: nie da sie bezpiecznie rozwijac, testowac ani porownywac local vs live.
- Pliki: `app/globals.css`
- Akceptacja naprawy:
  - `npm run build` przechodzi
  - `GET /` lokalnie daje `200`
  - home, payment, confirmation, oferta ladują sie bez 500

2. Live manual payment nie daje stabilnego przejscia do `pending manual review`.
- Objaw: klikniecie `Zaplacilem, czekam na potwierdzenie` nie daje stabilnego efektu, API timeoutuje albo UI nie pokazuje oczekiwanego stanu.
- Skutek biznesowy: klient traci zaufanie dokladnie w miejscu, gdzie ma zaplacic.
- Pliki do analizy:
  - `components/PaymentActions.tsx`
  - `app/api/payments/manual/route.ts`
  - `lib/server/manual-payments.ts`
  - `app/confirmation/page.tsx`
  - `components/AdminBookingActions.tsx`
- Akceptacja naprawy:
  - 10/10 prob recznej platnosci konczy sie czytelnym statusem w max 5 s
  - brak duplikatow zgloszen po odswiezeniu lub ponownym kliknieciu
  - admin approve/reject zawsze odbija sie na confirmation

### P1 - bardzo wazne dla publikacji i sprzedazy

3. Brak bezpiecznej, kontrolowanej sciezki testowania platnosci.
- Uzytkownik slusznie chce testowac bez realnego placenia.
- Nie wolno dawac publicznego `0 zl` bez zabezpieczen.
- Rekomendacja biznesowa:
  - wariant zalecany: `TEST-0ZL` albo `QA-100` tylko dla allowlisty emaili/telefonow albo tylko przy `TEST_CHECKOUT_ENABLED=true`
  - wariant zapasowy: ukryta akcja admina `mark as paid for QA` tylko dla rezerwacji z etykieta/testowym emailem
  - wariant najmniej ryzykowny na juz: testy recznej platnosci + reczne potwierdzenie przez Ciebie na stagingu lub na zamknietej allowliscie
- Akceptacja naprawy:
  - da sie przejsc caly funnel bez realnego obciazenia klienta
  - sciezka testowa nie jest publicznie widoczna dla zwyklego ruchu
  - kazdy test jest oznaczony jako QA i mozna go odfiltrowac w adminie

4. Hero na live nie uzywa zdjecia z ciastkiem w rece.
- Wymaganie biznesowe od Ciebie jest jasne: glowny hero ma byc zdjeciem `omnie.png`.
- Lokalny config juz wskazuje `public/branding/omnie.png`, ale live nadal pokazuje szeroki kadr z kotem.
- Dodatkowo `omnie.png` ma duzy rozmiar (~2.46 MB), wiec przed publikacja trzeba zrobic wersje zoptymalizowana.
- Pliki:
  - `lib/site.ts:18-20`
  - `app/page.tsx:212-218`
  - `app/page.tsx:298-303`
  - asset: `public/branding/omnie.png`
- Akceptacja naprawy:
  - home desktop i mobile pokazuja to samo, wlasciwe zdjecie
  - alt opisuje Krzysztofa z kotem i ciastkiem
  - asset jest odchudzony (WebP/AVIF albo zoptymalizowany PNG/JPG)

5. Trust layer po zakupie jest oslabiony, bo maile klienta sa wylaczone.
- Dzis klient po platnosci zalezy tylko od ekranu confirmation.
- To jest dopuszczalne tymczasowo, ale zle dla zarabiania i support loadu.
- Pliki / obszary:
  - konfiguracja maili klienta
  - confirmation flow
  - ewentualne szablony powiadomien
- Akceptacja naprawy:
  - klient dostaje minimum: potwierdzenie rezerwacji, status platnosci, link do pokoju po paid

6. Teksty prawne i FAQ nadal sprzedaja PayU jako aktywne, mimo ze live jest manual-only.
- To jest mismatch obietnicy z realnym checkoutem.
- Pliki:
  - `app/regulamin/page.tsx:34-35`
  - `lib/data.ts:167-169`
- Akceptacja naprawy:
  - copy zalezy od realnie dostepnych metod platnosci
  - gdy PayU off, strona nie sugeruje klientowi, ze PayU jest teraz dostepne

### P2 - wazne porzadkowanie i przygotowanie do wzrostu

7. Audit assetow jest nieuporzadkowany.
- `public/branding/specialist-krzysztof-about.png` nie odpowiada temu, czym sugeruje nazwa; to mylacy asset i nie powinien trafic na strone przez przypadek.
- Trzeba zrobic przeglad nazw, przeznaczenia i cropow wszystkich zdjec w `public/branding`.
- Akceptacja naprawy:
  - kazdy asset ma zgodna nazwe i przeznaczenie
  - nie ma plikow mylacych do przyszlego reuse

8. Platnosci sa gotowe operacyjnie tylko w modelu pol-manualnym.
- Obecny model jest akceptowalny na start, ale musi miec SLA i czytelne statusy.
- Potrzebne:
  - powtarzalny admin workflow
  - czytelne komunikaty pending/rejected/confirmed
  - monitoring duplikatow i timeoutow

9. QA powinno miec jedna prawde i zero falszywych odczytow.
- Wczesniejszy raport potrafil falszywie oznaczyc `payuVisible=true` na podstawie tekstu, nie realnego przycisku.
- GPT Mini powinien sprawdzic, czy finalny skrypt QA wykrywa metody platnosci tylko po realnych selektorach UI.
- Plik: `scripts/live-clickthrough-report.ts`

### P3 - wzrost i optymalizacja po odblokowaniu P0/P1

10. Brak domknietego planu mierzenia konwersji.
- Po naprawie checkoutu trzeba mierzyc co najmniej:
  - wejscie na home
  - klik CTA
  - wejscie na slot
  - wejscie na form
  - wejscie na payment
  - sukces pending manual / paid / confirmed
  - porzucenie na kazdym etapie

11. Po wdrozeniu poprawki potrzebna jest codzienna mini-regresja.
- Minimum: home, /koty, /book, /slot, /form, /payment, /confirmation, /oferta, /kontakt, /regulamin, /polityka-prywatnosci, admin manual payment approve/reject.

## 5. Plan pracy etapami dla GPT Mini

### ETAP 0 - Recovery repo i freeze stanu
Cel: przywrocic lokalne srodowisko do stanu, w ktorym ma sens dalsza praca.

Zakres:
1. Odtworzyc `app/globals.css` z poprawnego zrodla.
2. Uruchomic:
- `npm run build`
- lokalny smoke home/payment/confirmation
3. Zweryfikowac, ktore lokalne diffy sa intencjonalne, a ktore sa efektem uszkodzenia repo.
4. Dopiero po tym zrobic nowy `local vs live`.

Definition of done:
- brak `NUL` w `app/globals.css`
- build green
- local home i payment bez 500

### ETAP 1 - Stabilizacja platnosci recznej
Cel: usunac jedyny realny live blocker w funnelu.

Zakres:
1. Rozbic problem na granice:
- klik w UI
- `POST /api/payments/manual`
- zapis statusu bookingu
- redirect
- render `pending-manual-review`
2. Dodac idempotencje dla ponownego zgloszenia.
3. Dodac jasny fallback UI, jesli admin notification opoznia odpowiedz.
4. Dodac polling albo pewny refresh stanu na confirmation.
5. Przetestowac approve i reject w adminie.

Definition of done:
- live i local przechodza manual payment -> pending -> approve/reject bez niejasnych timeoutow

### ETAP 2 - Test checkout bez realnego placenia
Cel: dac bezpieczna sciezke QA i demo.

Rekomendacja glowna:
1. Wprowadzic kontrolowany tryb testowy:
- env gated
- allowlista emaili/telefonow
- jawne oznaczenie bookingu jako QA
2. Dodac kod promocyjny 100 procent tylko dla allowlisty lub tylko poza produkcyjnym ruchem publicznym.
3. Dodac adminowa akcje do recznego potwierdzania bookingow QA.

Czego nie robic:
- nie wystawiac publicznego `0 zl` bez zabezpieczen
- nie mieszac bookingow testowych z prawdziwa sprzedaza bez flagi QA

Definition of done:
- mozna odpalic pelny test funnelu bez realnej platnosci i bez ryzyka dla klienta

### ETAP 3 - Hero, zdjecia i warstwa zaufania
Cel: poprawic pierwsze 5 sekund strony i zgodnosc z Twoja wizja.

Zakres:
1. Opublikowac hero z `omnie.png` jako glowny kadr.
2. Zoptymalizowac plik hero pod performance.
3. Sprawdzic crop desktop/mobile.
4. Uporzadkowac branding assets.
5. Dodac mocniejszy trust block blisko CTA i checkoutu:
- kto prowadzi konsultacje
- jak wyglada proces
- kiedy klient dostaje pokoj
- co sie dzieje po wplacie recznej

Definition of done:
- live home uzywa wlasciwego zdjecia i szybciej sie laduje
- klient w 5 sekund rozumie kto, co, za ile i co dalej

### ETAP 4 - Copy i legal zgodne z realna platnoscia
Cel: zero rozjazdu miedzy obietnica a checkoutem.

Zakres:
1. Ukryc / warunkowac wzmianki o PayU tam, gdzie PayU jest off.
2. Dopasowac FAQ i regulamin do realnie dostepnych metod.
3. Ujednolicic komunikaty manual payment w home, payment, confirmation, regulaminie i FAQ.

Definition of done:
- klient nigdzie nie czyta o opcji, ktorej teraz nie moze uzyc

### ETAP 5 - Wlaczenie maili klienta
Cel: obnizyc niepokoj po zakupie i liczbę wiadomosci supportowych.

Zakres:
1. Potwierdzenie rezerwacji.
2. Potwierdzenie `pending manual review`.
3. Potwierdzenie `paid/confirmed`.
4. Komunikat po reject/cancel.

Definition of done:
- klient nie jest zalezny tylko od jednej strony confirmation

### ETAP 6 - PayU production go-live
Cel: dopiero po ustabilizowaniu recznej platnosci uruchomic online checkout.

Zakres:
1. Produkcyjne klucze PayU.
2. Smoke checkout bez expose dla wszystkich, jesli to mozliwe.
3. Webhook notify, return URL, final status sync.
4. Manual payment zostaje jako backup.

Definition of done:
- co najmniej jeden poprawny checkout PayU produkcyjny potwierdzony end-to-end
- manual payment dalej dziala jako fallback

### ETAP 7 - Analityka i operacje
Cel: wiedziec, gdzie znika kasa.

Zakres:
1. Funnel analytics.
2. Dashboard prostych KPI:
- wejscia na home
- CTA clicks
- slot selected
- payment opened
- manual pending
- paid
- confirmed
- rejects/cancels
3. Prosty rytual QA przed kazdym deployem.

### ETAP 8 - Finalny szlif wizualny
Cel: przestac wygladac jak stockowy szablon i domknac spójny brand feel.

Zakres:
1. Dopracowanie hierarchii typografii i spacingu na home, payment i confirmation.
2. Ostatni pass po hero, trust cards, CTA oraz kartach ofertowych.
3. Usuniecie ostatnich "templateowych" komponentow i zastapienie ich wyrazniejszym jezykiem wizualnym.
4. Sprawdzenie mobile i desktop screenshots przed finalnym deployem.

Definition of done:
- kluczowe strony nie wygladaja juz jak generyczny layout z 2005
- finalne screenshoty trafiaja do qa-reports jako before/after
- status wizualny jest jednoznacznie lepszy bez psucia flow i konwersji

## 6. Kolejnosc wdrazania bez dyskusji

Rekomendowana kolejnosc prac:
1. `app/globals.css` recovery i zdrowy build
2. manual payment reliability
3. bezpieczny test checkout / QA bypass
4. hero z ciastkiem + optymalizacja assetu
5. copy/legal zgodne z realna platnoscia
6. maile klienta
7. PayU production
8. analytics i operacje
9. finalny szlif wizualny

## 7. Konkretne zadania dla GPT Mini na pierwszy sprint

Sprint 1 ma dowiezc tylko to:
1. Naprawic `app/globals.css` i przywrocic zielony build.
2. Powtorzyc local smoke i porownanie z live.
3. Naprawic manual payment -> pending.
4. Dodac bezpieczna sciezke testowa platnosci QA.
5. Spisac co z lokalnych diffow idzie do deployu, a co wymaga osobnej decyzji.

Nie rozpraszac sprintu 1 na pelny redesign.
Najpierw ma byc stabilny funnel i zdrowe repo.

## 8. Decyzje biznesowe, ktore warto przyjac od razu

1. Start publiczny moze isc na manual payment, ale tylko jesli pending state jest niezawodny.
2. PayU wlaczac dopiero po odblokowaniu testow i po stabilnym local buildzie.
3. Hero z `omnie.png` jest decyzja zatwierdzona przez wlasciciela i ma trafic live po recovery repo.
4. Publiczne `0 zl` bez guardow odrzucic. Tylko allowlista / env gate / admin QA.

## 9. Koncowa ocena stanu na 2026-04-06

- Produkcja: prawie gotowa do sprzedaży, ale ma jeden bardzo niebezpieczny blad w manual payment transition.
- Repo lokalne: obecnie niezdrowe, nie nadaje sie do wiarygodnego wdrazania bez recovery.
- Najblizsza droga do zarabiania:
  1. odblokowac lokalne repo
  2. naprawic reczna platnosc
  3. dodac bezpieczne testy checkoutu
  4. dopiero potem domykac hero, maile i PayU
