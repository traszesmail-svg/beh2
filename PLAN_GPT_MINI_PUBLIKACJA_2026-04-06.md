# PLAN PUBLIKACJA I FINISZ

Data audytu: 2026-04-07
Status tego etapu: analiza i plan only, bez zmian w kodzie aplikacji
Ten dokument zastepuje poprzedni plan z 2026-04-06.

## 1. Decyzja na dzis

Nie puszczac jeszcze mocniejszego ruchu na te strone.

Powod jest prosty:
- 2026-04-07 publiczny funnel nie domyka nawet tworzenia rezerwacji.
- `POST /api/bookings` na live zwraca `409`.
- runtime report pokazuje blad produkcyjny: brak kolumny `qa_booking` w schemacie `bookings`.
- to jest nowy, twardszy blocker niz wczorajszy problem `manual payment -> pending`.

Najwazniejszy wniosek biznesowy:
- wczoraj problemem byl niestabilny etap platnosci recznej,
- dzisiaj problemem numer 1 jest to, ze klient moze odbic sie juz na tworzeniu rezerwacji,
- dopiero po przywroceniu tworzenia bookingow ma sens dyskusja o hero, copy, social proof i redesignie.

## 2. Co sprawdzilem

Twarde dowody z dzisiejszego audytu:
- live readiness: `qa-reports/live-readiness-20260407-061919.md`
- live clickthrough: `qa-reports/live-clickthrough-20260407-061928.md`
- poprzedni live clickthrough do porownania: `qa-reports/live-clickthrough-20260406-061636.md`
- screenshoty produkcyjne:
  - `qa-artifacts/review-20260407/home-desktop.png`
  - `qa-artifacts/review-20260407/home-mobile.png`
  - `qa-artifacts/review-20260407/koty-desktop.png`
  - `qa-artifacts/review-20260407/oferta-desktop.png`
  - `qa-artifacts/review-20260407/regulamin-desktop.png`
  - `qa-artifacts/review-20260407/kontakt-desktop.png`
- lokalne checki:
  - `npm test`
  - `npm run build`
  - `npm run ui-smoke`
  - `npm run payu-smoke`

Wyniki:
- live readiness: `3/4`, blockerem sa nadal maile klienta
- live clickthrough 2026-04-07: `10/19`, fail
- live clickthrough 2026-04-06: `18/19`, fail tylko na `manual payment -> pending`
- `npm run build`: PASS
- `npm run ui-smoke`: PASS
- `npm run payu-smoke`: PASS w sandboxie PayU
- `npm test`: 32/33 PASS, jedyny fail dotyczy hero assetu oczekiwanego przez test

## 3. Co udalo sie GPT Mini realnie dowiezc

To trzeba oddzielic od rzeczy, ktore tylko wygladaly na dowiezione.

### Dowiezione lub prawie dowiezione

1. Lokalny repo recovery juz nie jest dzis glownym problemem.
- W poprzednim planie recovery repo bylo P0.
- Dzis `npm run build` przechodzi.
- `npm run ui-smoke` przechodzi.
- lokalna sciezka room/payment/manual approval jest testowalna.

2. Sciezka pokoju rozmowy jest przygotowana sensownie po stronie kodu.
- room jest blokowany przed `paid`
- po potwierdzeniu ma waiting room, iframe i room state
- lokalny smoke sprawdza blokade przed approval, wejscie po approval i iframe config

3. QA checkout jako architektura zostal juz zrobiony w kodzie.
- istnieje flaga QA
- istnieje allowlista
- istnieje adminowa akcja `Potwierdz QA`
- istnieje osobna sciezka `/api/payments/mock`
- istnieje migracja `supabase/migrations/20260406_qa_checkout.sql`

4. PayU jako integracja nie jest martwe.
- produkcyjnie jest nadal OFF
- ale `npm run payu-smoke` przechodzi w sandboxie i zwraca order `SUCCESS`
- to znaczy: kod integracji zyje, problemem nie jest dzis sandboxowy flow, tylko kolejnosc rolloutu

5. Operacyjna warstwa KPI i admin jest bardziej dojrzala niz wczesniej.
- jest admin
- jest funnel ledger
- jest live readiness
- jest live clickthrough
- sa raporty QA

### Zrobione tylko czesciowo albo niedowiezione do produkcji

6. QA bypass jest wdrozony w kodzie, ale nie zostal poprawnie dowieziony na production.
- w kodzie booking API przyjmuje `qaBooking`
- store zapisuje `qa_booking`
- migracja dodaje kolumne `qa_booking`
- live runtime wali sie na braku tej kolumny

Wniosek:
- to nie jest brak implementacji
- to jest zly rollout: kod juz zaklada nowy schema shape, a production DB nie jest z nim zsynchronizowana

7. Manual payment nie zostal zamkniety jako stabilny live flow.
- 2026-04-06 byl jedynym wykrytym publicznym fail
- 2026-04-07 nie dalo sie nawet dojsc do tego kroku, bo funnel peka wczesniej
- lokalnie smoke przechodzi, wiec produkcja nie daje jeszcze wiarygodnosci

8. Hero nie zostal dowieziony tak, jak chcesz.
- test lokalny oczekuje `omnie-hero.webp`
- aktualny config dalej wskazuje `specialist-krzysztof-portrait.jpg`
- live nie odzwierciedla Twojego wymagania: specjalista z kotem na rekach, niebieski kitel, mocny hero kadr

9. Maile klienta nadal nie sa wlaczone na live.
- readiness raport wprost trzyma to jako blocker
- dzis klient nadal zalezy od confirmation page

## 4. Co jest nowym albo wiekszym problemem niz wczoraj

### P0 - blocker zarabiania

1. Produkcyjna baza nie nadaza za wdrozonym kodem.
- Dowod:
  - live report 2026-04-07
  - `POST /api/bookings` = `409`
  - blad: `Could not find the 'qa_booking' column of 'bookings' in the schema cache`
- Skutek:
  - publiczny klient nie przejdzie pewnie z `/form` do `/payment`
  - nie da sie rzetelnie sprawdzic pokoju i platnosci na production, bo funnel peka za wczesnie

2. Produkcja cofnela sie wzgledem 2026-04-06.
- Wczoraj: `18/19`
- Dzisiaj: `10/19`
- To nie jest kosmetyka. To jest regres wdrozeniowy.

### P1 - nadal bardzo wazne

3. Customer email dalej OFF.
- readiness nadal to blokuje
- confirmation page wciaz nosi zbyt duzy ciezar zaufania

4. Hero nadal jest niezgodny z Twoja decyzja i z testem.
- technicznie: asset mismatch
- biznesowo: nie ta twarz, nie ten kadr, nie to pierwsze wrazenie

5. Polish/copy quality nadal ciagnie strone w dol.
- `119 zl`, `350 zl`
- `Krotki opis sytuacji`
- `Ty i zwierz?`
- `sika poza kuweta`
- `zyje w napieciu`
- `pielegnacji`
- to nie sa drobiazgi, bo stoja dokladnie na sciezce decyzji zakupowej

6. Kontakt nadal jest tarciem.
- publiczna strona kontaktowa prowadzi przez `mailto:`
- brak normalnego formularza leadowego

### P2 - wazne, ale dopiero po P0/P1

7. Home wymaga skrocenia i lepszego tempa czytania.
- CTA juz jest
- gorne menu juz jest
- zdjecia juz sa
- ale komunikat nadal jest za szeroki i miejscami dubluje zaufanie / prowadzenie / proof

8. Social proof istnieje w kodzie, ale nie pracuje na glowna konwersje.
- komponent opinii istnieje
- komponent/formularz opinii istnieje
- ale to trzeba sensownie wpuscic na publiczna sciezke, nie jako ozdobnik

9. SEO jest obecne, ale nie domkniete lokalnie.
- meta description nie jest puste
- ale opis i title nie wykorzystuja mocno lokalizacji `Olsztyn`
- nadal wisi problem domeny `vercel.app`

## 5. Uwagi Gemini - co biore, co odrzucam jako priorytet

Uwagi Gemini, ktore biore do planu:
- skrocic i uproscic copy
- ujednolicic ceny i zapis waluty
- poprawic proofreading i polskie znaki
- mocniej pokazac twarz specjalisty i zaufanie
- dodac lub wyeksponowac social proof
- rozwazyc prosty formularz kontaktowy zamiast samego `mailto:`
- przejsc na wlasna domene
- dopiac lokalne SEO

Uwagi Gemini, ktore sa dzis niepelne albo wtorne:
- `brak CTA` - nieaktualne, CTA juz jest na home
- `brak menu` - nieprecyzyjne, menu juz istnieje, tylko nie jest idealne
- `zero zdjec` - nieaktualne, zdjecia sa; problemem jest dobor i hero, nie ich calkowity brak

Wniosek:
- Gemini dobrze czuje warstwe marketingowa,
- ale nie widzi najwazniejszego P0:
  - production booking regression
  - migration gap
  - rollout mismatch miedzy kodem a DB

## 6. Nowy plan etapowy do finiszu

Kolejnosc jest twarda. Nie skakac od razu do redesignu.

### ETAP 0 - Freeze i prawda o stanie production

Cel:
- przestac zgadywac, co jest "w kodzie", a co realnie dziala publicznie

Zakres:
1. Zamrozic nowe publiczne wdrozenia do czasu zielonego funnelu.
2. Sprawdzic i zapisac:
   - aktualny commit live
   - aktualny schema state produkcyjnej bazy
   - ktore migracje sa wykonane, a ktore nie
3. Potwierdzic brakujace migracje dla QA checkoutu i funnel events.
4. Po kazdym kroku uruchomic:
   - `npm run live-readiness -- --report-only`
   - `npm run live-clickthrough-report -- --url https://coapebehawiorysta.vercel.app`

Definition of done:
- production DB i produkcyjny kod sa zsynchronizowane
- `POST /api/bookings` nie zwraca juz `409`
- nowy live report nie ma bledu `qa_booking`

### ETAP 1 - Odblokowanie monetizacji: booking creation

Cel:
- przywrocic dzialanie publicznego funnelu do poziomu minimum sprzedazowego

Zakres:
1. Naprawic `form -> POST /api/bookings -> payment`.
2. Dolozyc jawne user-visible error states, jesli schema albo zapis znow sie rozjedzie.
3. Zweryfikowac slot locking i conflict path.
4. Sprawdzic 10 prob publicznego bookingu na production.

Definition of done:
- `/form` przechodzi do `/payment` 10/10
- brak `409` przy poprawnym flow
- klient widzi jasny komunikat, jesli termin zostal zajety lub zapis padl

### ETAP 2 - Stabilizacja manual payment na production

Cel:
- domknac najblizsza sciezke do zarabiania bez wlaczania PayU

Zakres:
1. Zweryfikowac na production:
   - klik CTA manual
   - `POST /api/payments/manual`
   - redirect
   - confirmation pending
   - admin reject
   - admin approve
2. Sprawdzic timeouty, admin notice, auto-refresh statusu i duplicate click.
3. Wymusic czytelne fallbacki dla klienta, bez cichych failow.

Definition of done:
- manual `payment -> pending -> approve/reject` dziala stabilnie
- ten etap jest zrozumialy dla klienta bez kontaktu awaryjnego

### ETAP 3 - Bezpieczny QA bypass bez realnej platnosci

Cel:
- miec pelna sciezke testowa bez publicznego `0 zl`

Zakres:
1. Dowozyc do production to, co juz jest w kodzie:
   - flaga QA
   - env gate
   - allowlista emaili/telefonow
   - admin `Potwierdz QA`
2. Jesli potrzebny jest kod promocyjny 100 procent, to tylko:
   - dla QA allowlisty
   - poza ruchem publicznym
   - z jawna etykieta QA
3. Odetchnac z testami pokoju, confirmation i prep materials przez QA path, a nie przez realna platnosc.

Definition of done:
- da sie przejsc caly funnel bez realnego obciazenia klienta
- bookingi QA nie mieszaja sie z prawdziwa sprzedaza
- da sie przetestowac pokoj i confirmation end-to-end bez kombinowania

### ETAP 4 - Warstwa zaufania po platnosci

Cel:
- klient ma miec pewnosc po zaplacie, a nie tylko jedna strone z linkiem

Zakres:
1. Wlaczyc customer email delivery.
2. Zweryfikowac:
   - reservation received
   - payment pending manual review
   - payment confirmed
   - reject / cancel
3. Dopiac sendera, domene i operacyjny fallback.

Definition of done:
- readiness nie blokuje juz przez customer email
- klient dostaje potwierdzenie poza confirmation page

### ETAP 5 - Hero, brand i pierwsze 5 sekund

Cel:
- dopiero teraz wejsc w mocniejsze poprawki marketingowe

Wymaganie wlasciciela:
- hero ma pokazac specjaliste z kotem na rekach w niebieskim kitlu

Zakres:
1. Podmienic hero asset na docelowy, zoptymalizowany plik, zgodny z testem i decyzja wlasciciela.
2. Uporzadkowac asset pipeline:
   - jeden glowny hero asset
   - jasne nazwy
   - mobilny i desktopowy crop
3. Skrocic hero copy i wywalic powtorzenia typu `bez zgadywania`.
4. Zostawic jedna mocna sekcje zaufania zamiast duplikowania podobnych blokow.
5. Finalnie doprowadzic do zgodnosci testu hero i realnego live assetu.

Definition of done:
- live home pokazuje wlasciwe zdjecie
- local test dla hero przechodzi
- mobile i desktop maja dobry kadr

### ETAP 6 - Proofreading, ceny, legal i kontakt

Cel:
- zlikwidowac wrazenie "prawie gotowe"

Zakres:
1. Jeden pass po publicznym copy:
   - polskie znaki
   - ortografia
   - interpunkcja
   - krotsze teksty
2. Jeden formatter cen we wszystkich komponentach.
3. Poprawic:
   - `119 zl`, `350 zl`
   - `Ty i zwierz?`
   - `Krotki opis sytuacji`
   - kocie i psie copy w `lib/data.ts` i `lib/offers.ts`
4. Dopiac legal i payment copy do realnie aktywnych metod.
5. Zmienic kontakt z samego `mailto:` na prosty formularz leadowy albo przynajmniej wyzszy quality action panel.

Definition of done:
- nie ma juz widocznych tekstowych fuszerek na publicznej sciezce
- ceny wszedzie sa z jednego formattera
- kontakt nie wymaga klientowi klepania maila recznie

### ETAP 7 - Social proof, SEO i domena

Cel:
- podniesc wiarygodnosc i jakosc ruchu

Zakres:
1. Wyeksponowac prawdziwy social proof.
2. Wpiac lub wykorzystac juz istniejace komponenty opinii.
3. Ustawic wlasna domene `.pl`.
4. Dopisac lokalne SEO:
   - `Olsztyn`
   - miasto / region w meta
   - spojny opis og i title

Definition of done:
- strona nie wyglada jak tymczasowy deploy
- lokalny ruch i brand trust maja lepszy fundament

### ETAP 8 - PayU production rollout

Cel:
- wlaczyc online checkout dopiero wtedy, gdy manual i QA sa juz zielone

Zakres:
1. Zostawic PayU OFF do czasu ukonczenia etapow 0-7.
2. Wykonac produkcyjne przygotowanie:
   - klucze
   - webhook
   - return flow
   - idempotencja
   - final status sync
3. Przed publicznym wlaczeniem:
   - `npm run payu-smoke`
   - finalny controlled validation path po stronie wlasciciela, nie agenta
4. Manual payment zostaje backupem.

Definition of done:
- PayU mozna wlaczyc bez rozwalenia manual fallbacku
- status po checkoutcie odbija sie poprawnie w confirmation i pokoju

### ETAP 9 - Guard synchronizacji schematu

Cel:
- pilnowac, zeby canonical Supabase schema i kluczowe migracje nie odjechaly od aktualnego code path

Zakres:
1. Dodac audyt `supabase/schema.sql` i rollout migracji do checklisty release.
2. Zapisac prosty wynik `schema-audit` w repo.
3. Miec jawny krok w docs przed kolejnym rolloutem DB.

Definition of done:
- `npm run schema-audit` przechodzi
- brak rozjazdu booking/payment/QA columns
- live readiness pozostaje zielony

### ETAP 10 - Readiness gate dla schema sync

Cel:
- zrobic z audytu schematu formalny release gate, a nie tylko osobny skrypt diagnostyczny

Zakres:
1. Wpiac `schema-sync` do `getGoLiveChecks()`.
2. Pokazac schema status w `/admin` i w raportach readiness.
3. Utrzymac `schema-audit` jako osobny szybki check dla operatora.

Definition of done:
- `npm run live-readiness -- --report-only` uwzglednia schema sync
- `schema-sync` blokuje release przy dryfie schema/migracji
- admin pokazuje jednoznaczny status schema

## 7. Priorytet na najblizszy sprint

Jeden sprint ma dowiezc tylko to:
1. produkcyjny sync kod + migracje
2. powrot `form -> payment` na live
3. stabilny manual pending na live
4. end-to-end QA bypass bez realnej platnosci
5. swiezy zielony live report po naprawie

W tym sprincie nie robic jeszcze:
- duzego redesignu
- pelnego przepisywania home
- wlaczania publicznego PayU

## 8. Konkretna ocena stanu na 2026-04-07

### Produkcja
- dzis nie jest gotowa na mocniejszy ruch
- ma regres wzgledem 2026-04-06
- glowny blocker: booking creation

### Repo lokalne
- jest w duzo lepszym stanie niz w poprzednim planie
- build, ui smoke i sandbox PayU daja podstawe do dalszej pracy
- jedyny czerwony test dotyczy hero assetu, co zgadza sie z Twoim zarzutem biznesowym

### Pokoj rozmowy
- po stronie kodu i lokalnego smoke wyglada sensownie
- produkcyjnie nie dalo sie go dzis rzetelnie przetestowac, bo funnel peka za wczesnie
- po naprawie booking + QA bypass pokoj powinien byc sprawdzany jako jeden z pierwszych dowodow gotowosci

### Najkrotsza droga do zarabiania
1. naprawic production DB / migration mismatch
2. przywrocic live booking creation
3. ustabilizowac manual payment
4. dowiezc QA bypass bez realnej platnosci
5. wlaczyc customer email
6. dopiero potem dopieszczac hero, copy, SEO i social proof
