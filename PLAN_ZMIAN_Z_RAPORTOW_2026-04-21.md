# Plan zmian z raportów SEO/copy dla `beh2`

Data opracowania: 2026-04-21  
Źródła:
- `C:\projekt\rap\Raport SEO i copy dla regulskibehawiorysta.pl oraz preview Vercel.pdf`
- `C:\projekt\rap\Raport SEO i copy dla regulskibehawiorysta.pl oraz preview Vercel.docx`

## Tryb pracy

Plan został przygotowany w trybie planowania i zderzony z aktualnym stanem repo po czyszczeniu.  
Nie kopiuję raportu 1:1. Odfiltrowałem zalecenia, które są już częściowo wdrożone, oraz dopisałem brakujące decyzje techniczne pod ten konkretny kod.

## Narzędzia użyte do analizy

- `Python 3.14`
- zainstalowany lokalnie `pypdf`
- standardowa biblioteka Pythona do odczytu `docx` przez `zipfile/xml`

Dodatkowa instalacja nie była potrzebna.

## Co w repo już istnieje

- Techniczne odcięcie większości ścieżek bookingowych od indeksacji w `app/robots.ts`.
- Globalne metadata i JSON-LD w `app/layout.tsx` oraz `lib/schema.ts`.
- Wygenerowana `public/sitemap.xml` i generator `scripts/gen-sitemap.ts`.
- Widoczne `H1` na `/`, `/psy` i `/koty`.
- Osobne money pages i topical pages:
  - `/behawiorysta-online-polska`
  - `/konsultacja-behawioralna-online`
  - `/psy/reaktywnosc-na-smyczy`
  - `/psy/lek-separacyjny`
  - `/koty/zalatwianie-poza-kuweta`
  - `/koty/konflikt-miedzy-kotami`
- Centralizacja części copy ofertowej w `lib/copy-governance.ts`, `lib/offers.ts`, `components/OfferEntrySection.tsx`.

## Luki, które nadal pokrywają się z raportem

1. Strona główna nadal ma brand-first metadata zamiast mocniejszego pozycjonowania usługowego.
   Pliki: `lib/site.ts`, `lib/seo.ts`, `app/layout.tsx`.

2. `/book` jest blokowane przez `robots.txt`, ale metadata tej ścieżki nadal są budowane przez `buildBookMetadata()` jako strona marketingowa, a nie techniczna.
   Pliki: `lib/seo.ts`, `app/book/page.tsx`.

3. Kontakt publiczny nie ma jednego źródła prawdy na poziomie całego serwisu i schema.
   Dziś `lib/site.ts` używa fallbacku `kontakt@regulskibehawiorysta.pl`, a `lib/schema.ts` wpisuje fallback wprost do JSON-LD.

4. Powstały już 3 warstwy stron usługowych o podobnej intencji:
   - `/behawiorysta-online-polska`
   - `/konsultacja-behawioralna-online`
   - techniczne/noindex: `/behawiorysta-psow`, `/behawiorysta-kotow`
   Raport sugeruje jeszcze jedną stronę docelową pod wysoką intencję. Bez decyzji kanonicznej łatwo tu o overlap i kanibalizację.

5. Sitemap jest statycznym artefaktem z generatora. To jest dobre, ale wymaga dyscypliny regeneracji po każdej zmianie architektury i po czyszczeniu tras.

6. Niespójność nazewnictwa usługi jest mniejsza niż w raporcie, ale nadal istnieje na poziomie semantyki:
   - marka i CTA promują `Kwadrans z behawiorystą`
   - część ekranów sprzedażowo-objaśniających opisuje to jako `15 minut rozmowy audio`
   To nie jest błąd krytyczny, ale wymaga jednej reguły redakcyjnej.

7. Repo ma dużo przygotowanego contentu pomocniczego w `content/`, ale plan wdrożeniowy nie jest jeszcze spięty z aktualnym stanem money pages, linkowania i sitemap.

## Decyzja główna przed wdrożeniem

Najpierw trzeba zdecydować, która strona ma być głównym landingiem wysokiej intencji dla usługi.

Rekomendacja:
- preferowany canonical money page: `/behawiorysta-online-polska` albo nowy `/behawiorysta-psow-kotow-online`
- nie utrzymywać równolegle dwóch pełnych landingów o tej samej intencji bez jasnego podziału
- jeśli wybierzemy nowy slug z raportu, stary `/behawiorysta-online-polska` powinien dostać `301` albo zostać sprowadzony do roli pomocniczej z canonicalem

Pragmatycznie dla tego repo:
- etap 1: nie tworzyć czwartej strony od razu
- etap 1: najpierw doprecyzować rolę istniejących stron
- etap 2: dopiero wtedy zdecydować, czy robimy nowy slug i przekierowanie

## Plan wdrożenia

### Etap 1. Uporządkowanie SEO technicznego i źródeł prawdy

Cel:
Domknąć rzeczy, które wpływają na indeksację, wiarygodność i interpretację serwisu przez Google.

Zakres:
- zmienić home metadata na bardziej usługowe, bez utraty marki
- przerobić metadata dla `/book`, żeby odpowiadały roli strony technicznej/noindex
- sprawdzić wszystkie strony funnelowe i potwierdzić spójność `robots`, `canonical`, sitemap
- ujednolicić publiczny e-mail w jednym źródle prawdy
- sprawdzić, czy preview/staging jest zawsze blokowane przez `shouldBlockSearchIndexing()`
- po zmianach wygenerować nową sitemapę

Docelowe pliki:
- `lib/site.ts`
- `lib/seo.ts`
- `app/book/page.tsx`
- `app/robots.ts`
- `lib/schema.ts`
- `lib/server/env.ts`
- `scripts/gen-sitemap.ts`
- `public/sitemap.xml`

Definition of done:
- home ma tytuł i opis zgodny z intencją usługową
- `/book`, `/slot`, `/form`, `/payment`, `/confirmation` nie wysyłają mieszanych sygnałów SEO
- schema i UI używają tego samego e-maila
- sitemap zawiera tylko strony kanoniczne

Priorytet: bardzo wysoki

### Etap 2. Kanoniczna architektura money pages

Cel:
Usunąć overlap między istniejącymi stronami usługowymi i nadać każdej jednej roli.

Zakres:
- przypisać role:
  - `/` = strona marki i wejście szerokie
  - `/psy` i `/koty` = strony kategorii problemów
  - jedna strona = główny landing transakcyjny wysokiej intencji
  - `/konsultacja-behawioralna-online` = landing usługi 60 min
- zdecydować, czy:
  - wzmacniamy `/behawiorysta-online-polska`, albo
  - przenosimy ją na `/behawiorysta-psow-kotow-online`
- ograniczyć rolę stron technicznych/noindex `/behawiorysta-psow` i `/behawiorysta-kotow` do zaplecza pomocniczego albo wycofać je z aktywnego rozwoju

Docelowe pliki:
- `app/behawiorysta-online-polska/page.tsx`
- ewentualnie nowy landing w `app/.../page.tsx`
- `app/konsultacja-behawioralna-online/page.tsx`
- `app/behawiorysta-psow/page.tsx`
- `app/behawiorysta-kotow/page.tsx`
- `lib/growth-layer.ts`
- `scripts/gen-sitemap.ts`

Definition of done:
- jedna strona niesie główną frazę usługową
- nie ma dwóch pełnych landingów o tej samej intencji w sitemapie
- linkowanie wewnętrzne prowadzi do strony kanonicznej, nie do konkurujących wersji

Priorytet: bardzo wysoki

### Etap 3. Nazewnictwo oferty i CTA governance

Cel:
Utrzymać jedną nazwę handlową usługi, a opis techniczny stosować tylko jako doprecyzowanie.

Zakres:
- przyjąć regułę:
  - nazwa sprzedażowa: `Kwadrans z behawiorystą`
  - opis pomocniczy: `15 min audio bez kamery`
- przejrzeć CTA, sekcje porównawcze, booking i opisy usług
- poprawić miejsca, gdzie opis techniczny zaczyna zastępować nazwę handlową

Docelowe pliki:
- `lib/copy-governance.ts`
- `lib/offers.ts`
- `lib/booking-services.ts`
- `components/OfferEntrySection.tsx`
- `components/BookingServiceInfoCard.tsx`
- `app/page.tsx`
- `app/psy/page.tsx`
- `app/koty/page.tsx`
- `app/kontakt/page.tsx`
- `app/book/page.tsx`

Definition of done:
- CTA i sekcje ofertowe brzmią jednolicie
- nazwa usługi nie „pływa” między stronami
- porównanie `Kwadrans` vs `60 min` jest stałe i zrozumiałe

Priorytet: wysoki

### Etap 4. Wzmocnienie głównej strony i stron kategorii

Cel:
Podnieść trafność `/`, `/psy` i `/koty` pod frazy usługowo-problemowe bez rozwalania obecnego spokojnego tonu marki.

Zakres:
- dopracować `title`, `description`, leady i sekcje above-the-fold
- dopisać mocniejszy trust strip i bardziej jawny blok „kiedy 15 min, kiedy 60 min”
- poprawić anchory do money page i do landingów problemowych
- upewnić się, że `/psy` i `/koty` linkują do strony kanonicznej usługi, a nie tylko do bookingu

Docelowe pliki:
- `app/page.tsx`
- `app/psy/page.tsx`
- `app/koty/page.tsx`
- `components/FunnelPrimaryActions.tsx`
- `components/HeroAudioSoftCta.tsx`
- `components/OfferEntrySection.tsx`

Definition of done:
- home lepiej komunikuje „behawiorysta psów i kotów online”
- `/psy` i `/koty` wspierają główny landing zamiast konkurować z nim
- użytkownik rozumie różnicę między ścieżką edukacyjną, bookingiem i pełną konsultacją

Priorytet: wysoki

### Etap 5. Linkowanie tematyczne i topical authority

Cel:
Wykorzystać to, co repo już ma: problem landingi, blog MVP i lead magnety.

Zakres:
- spiąć tematami:
  - reaktywność psa
  - lęk separacyjny
  - kot sika poza kuwetą
  - konflikt między kotami
- do każdej z osi dodać przewidywalny układ linków:
  - problem landing
  - 1-3 wpisy blogowe
  - lead magnet
  - CTA do kanonicznej usługi
- sprawdzić, czy wszystkie indeksowalne treści są uwzględnione w sitemapie i linkowaniu

Docelowe pliki:
- `content/blog-mvp/*`
- `content/landings-mvp/*`
- `content/money-pages/*`
- `lib/growth-layer.ts`
- `scripts/gen-sitemap.ts`

Definition of done:
- każdy główny problem ma pełną ścieżkę wejścia organicznego
- content edukacyjny nie kończy się tylko na lead magnecie
- linkowanie wzmacnia topical clusters zamiast przypadkowych przejść

Priorytet: wysoki

### Etap 6. Trust layer i opinie

Cel:
Podnieść wiarygodność bez ciężkiego redesignu.

Zakres:
- uporządkować opis kwalifikacji i statusu publicznego
- rozwinąć opinie o kontekst: typ problemu, etap pracy, format usługi, przybliżony czas
- zsynchronizować sekcje trust z `schema`

Docelowe pliki:
- `lib/site.ts`
- `lib/trust-layer.ts`
- `content/cases.json`
- `app/opinie/page.tsx`
- `components/SocialProofSection.tsx`
- `components/TrustSignalSection.tsx`

Definition of done:
- status ekspercki brzmi spójnie w całym serwisie
- opinie są bardziej weryfikowalne
- trust section wspiera decyzję, a nie jest tylko ozdobą

Priorytet: średni

### Etap 7. QA i walidacja po wdrożeniu

Cel:
Potwierdzić, że plan faktycznie poprawia serwis, a nie tylko porządkuje copy.

Zakres:
- uruchomić:
  - `npm test`
  - `npm run build`
  - `npm run gen-sitemap`
- po wdrożeniu na preview/production sprawdzić:
  - `robots.txt`
  - `sitemap.xml`
  - canonicale
  - JSON-LD
  - Lighthouse mobile
- dopisać krótki raport powdrożeniowy do `qa-reports/`

Priorytet: wysoki

## Kolejność realizacji

1. Etap 1: SEO techniczne i źródła prawdy.
2. Etap 2: decyzja kanoniczna dla money page.
3. Etap 3: nazewnictwo oferty i CTA governance.
4. Etap 4: wzmocnienie `/`, `/psy`, `/koty`.
5. Etap 5: topical authority i linkowanie.
6. Etap 6: trust layer i opinie.
7. Etap 7: QA końcowe.

## Czego nie robić teraz

- Nie wdrażać od razu czwartej strony usługowej tylko dlatego, że raport sugeruje nowy landing.
- Nie mieszać prac copy/SEO z kolejnym dużym redesignem UI.
- Nie ruszać płatności jako osobnego priorytetu, dopóki nie pojawi się realny problem produktowy; po czyszczeniu repo główny dług przesunął się na architekturę SEO i spójność serwisu.

## Najkrótsza ścieżka do wdrożenia

Jeśli celem jest szybki, pragmatyczny postęp po czyszczeniu, bierzemy ten zakres:

1. metadata + canonical + book noindex consistency
2. jeden publiczny e-mail i jedna warstwa schema
3. decyzja o głównym landing page
4. ujednolicenie `Kwadrans z behawiorystą` w CTA i copy
5. linkowanie z `/`, `/psy`, `/koty` do głównej strony usługowej
6. regeneracja sitemap i QA

To da największy zwrot bez rozlewania prac na cały content backlog.
