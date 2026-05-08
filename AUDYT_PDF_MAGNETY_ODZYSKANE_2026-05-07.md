# Audyt PDF, lead magnetow i folderu ODZYSKANE - 2026-05-07

Zakres: `C:\Users\chris\Desktop\ODZYSKANE` kontra aktualny kod w `C:\projekt\regulskibehawiorysta`.

Ten plik zaczal jako mapa decyzyjna. Stan ponizej dopisuje wynik wdrozenia: aktywnym zrodlem sa teraz materialy z `ODZYSKANE`, z wylaczeniem `p49`.

## 0. Stan po wdrozeniu

Wdrozone publicznie:

- `/materialy` pokazuje tylko 7 aktualnych PDF-ow z `ODZYSKANE`: `kot-zyje-w-napieciu`, `pies-ile-ruchu-potrzebuje`, `kwadrans-podstawy-kota`, `kwadrans-podstawy-psa`, `30-zachowan`, `pierwszy-tydzien-z-kotem`, `pies-sam-w-domu`.
- `/bezplatne-materialy/*` uzywa aktywnych slugow z `ODZYSKANE`: `pies-ile-ruchu-potrzebuje`, `kot-zyje-w-napieciu`, `30-zachowan`, `pierwszy-tydzien-z-kotem`, `pies-sam-w-domu`.
- Kazdy aktywny material ma miniaturke okladki i podglad pierwszych stron z `preview_pages`.
- Darmowe materialy tworza zamowienie za 0 zl, generuja kod dostepu i wysylaja e-mail z linkiem do pobrania.
- `prep-guides` z `ODZYSKANE` sa podmienione w `public/prep-guides`.

Wycofane z aktywnych CTA i sitemap:

- platne `p19` i `p29`, bo `ODZYSKANE` nie zawiera takich folderow jako zrodla prawdy;
- pakiety i materialy `p49`, bo uzytkownik wskazal, zeby wdrozyc wszystko oprocz `p49`;
- stare lead magnety `pies-reaktywnosc-5-krokow`, `kot-kuweta-checklista`, `przygotowanie-do-konsultacji-online`;
- stary lejek `/oferta/poradniki-pdf` i `/zamow-pdf` jako aktywne wejscie sprzedazowe.

Pozostawione technicznie:

- redirecty starych URL-i w `next.config.mjs`, zeby stare linki nie prowadzily w puste miejsce;
- wykluczenia starych sciezek w `next-sitemap.config.js`;
- archiwalne, niepodpiete moduly i skrypty starego katalogu PDF, ktore nie sa aktywnym katalogiem publicznym.

Weryfikacja po wdrozeniu:

- `npm.cmd run materialy-smoke` - PASS, 19/19.
- `npm.cmd test` - PASS, 47 testow, 13 pominietych, 0 bledow.
- `npm.cmd run build` - PASS, lint bez ostrzezen, build poprawny, sitemap wygenerowana.

Braki / swiadome wylaczenia:

- w `ODZYSKANE` nadal nie ma `p19` ani `p29`;
- `p49` istnieje w `ODZYSKANE`, ale jest wylaczone zgodnie z poleceniem;
- materialy starego katalogu bez odpowiednika w `ODZYSKANE` sa wycofane, nie migrowane;
- szybki audyt renderow PDF nie wykazal pustych stron, oczywistych najazdow ani rozjazdow, ale raporty OCR przy darmowych materialach nadal sugeruja finalny przeglad merytoryczny przed szeroka publikacja.

Dalsze sekcje 1-5 zostaja jako zapis audytu wejsciowego sprzed wdrozenia, zeby bylo widac, co zostalo zmienione.

## 1. Co jest w ODZYSKANE

Folder wyglada jak finalny eksport publikacji: kazdy material ma zwykle `publikacja_final.pdf`, `publikacja_final.html`, `assets/cover.jpg`, `preview_pages/page_*.png`, `style_guide.md` i `raport_zmian.md`.

| Grupa | Liczba PDF | Rola |
| --- | ---: | --- |
| `free` | 2 | darmowe materialy startowe: kot w napieciu, pies i ruch |
| `p49` | 18 | finalne eksporty PDF-ow uzytych w pakietach 49 zl; nie oznacza to ceny pojedynczego PDF-a |
| `podstawy` | 2 | podstawy dla Kwadransa: pies/kot |
| `poradniki` | 3 | stare/szerokie lead magnety: 30 zachowan, pierwszy tydzien z kotem, pies sam w domu |
| `prep-guides` | 4 | materialy przygotowawcze po rezerwacji terminu |

Wszystkie odzyskane `publikacja_final.pdf` roznia sie rozmiarem od obecnych plikow w repo. To oznacza, ze nie nalezy robic automatycznej podmiany bez decyzji, ktora wersja jest zrodlem prawdy.

Wazna korekta: `ODZYSKANE` nie ma folderow `p19` ani `p29`. Ceny `p19/p29` istnieja tylko w aktualnym katalogu aplikacji (`lib/materialy-catalog.ts`). Folder `p49` w `ODZYSKANE` zawiera pojedyncze PDF-y pogrupowane wedlug pakietow, a nie osobna cene kazdego PDF-a.

## 1A. Pokrycie obecnego katalogu `p19/p29`

Aktualny katalog `/materialy` ma 23 pozycje: 2 darmowe, 15 po `19 zl`, 6 po `29 zl`.

| Tier w aplikacji | Ile w aplikacji | Ile ma finalny eksport w ODZYSKANE | Braki w ODZYSKANE |
| --- | ---: | ---: | --- |
| `free` | 2 | 2 | brak |
| `p19` | 15 | 14 | `pies-do-pracy-z-ludzmi` |
| `p29` | 6 | 4 | `kot-i-kuweta-pierwszy-plan-dzialania`, `pies-reaktywny-na-spacerze` |

Czyli: z aktywnego katalogu `/materialy` brakuje w `ODZYSKANE` finalnych eksportow dla 3 obecnych produktow platnych:

- `pies-do-pracy-z-ludzmi` - obecnie `p19`, PDF jest w repo, ale nie ma go w `ODZYSKANE`.
- `kot-i-kuweta-pierwszy-plan-dzialania` - obecnie `p29`, PDF jest w repo, ale nie ma go w `ODZYSKANE`.
- `pies-reaktywny-na-spacerze` - obecnie `p29`, PDF jest w repo, ale nie ma go w `ODZYSKANE`.

W druga strone: `ODZYSKANE/podstawy/*` ma 2 PDF-y, ktore istnieja w repo jako pliki, ale nie sa wystawione w aktywnym katalogu `/materialy`:

- `kwadrans-podstawy-kota`
- `kwadrans-podstawy-psa`

## 2. Gdzie to pasuje

| Folder z ODZYSKANE | Docelowa warstwa w stronie | Aktualny stan |
| --- | --- | --- |
| `prep-guides/*` | po rezerwacji, link w mailu przygotowawczym | w repo istnieje `public/prep-guides/*.pdf` i `content/prep-guides/*.md`, ale pliki sa inne niz odzyskane |
| `free/kot-zyje-w-napieciu` | darmowy PDF w `/materialy` albo lead magnet | jest w `lib/materialy-catalog.ts` jako free, PDF istnieje w `content/guides/pdf`, ale nie jest w `/bezplatne-materialy` |
| `free/pies-ile-ruchu-potrzebuje` | darmowy PDF w `/materialy` albo lead magnet | jest w `lib/materialy-catalog.ts` jako free, PDF istnieje, ma okladke |
| `p49/*` | platne pojedyncze PDF-y i pakiety w `/materialy` | wiekszosc slugow jest w `lib/materialy-catalog.ts`, ale czesc pakietow ma inny sklad niz foldery odzyskane |
| `podstawy/*` | bonus/przygotowanie do Kwadransa albo osobny free tier | PDF-y istnieja w `content/guides/pdf`, ale nie sa wystawione w katalogu |
| `poradniki/*` | stare lead magnety / publiczne poradniki | PDF-y istnieja w `public/poradniki`, jest stary config `lib/lead-magnet.config.ts`, ale globalny popup/banner nie jest podlaczony w layout |

## 3. Najwieksze rozjazdy

1. Sa dwa rownolegle systemy PDF:
   - nowy: `/materialy` -> `/checkout` -> `/dostep` / `/pokoj`, oparty o `lib/materialy-catalog.ts` i `app/api/orders`;
   - stary: `/oferta/poradniki-pdf/...` -> `/zamow-pdf` -> `app/api/pdf-orders`, oparty o `lib/pdf-guides.ts`.

2. Stary katalog `content/guides/site/guides-site-data.json` wskazuje na brakujace PDF-y dla 10 slugow, m.in. `pies-zostaje-sam-plan-pierwszych-krokow.pdf`, `szczeniak-gryzienie-i-skakanie.pdf`, `kot-stres-srodowisko-i-bledy-opiekuna.pdf`, `konflikt-miedzy-kotami-w-domu.pdf`.

3. `/materialy` ma komplet istniejacych PDF-ow dla swoich 23 pozycji, ale widoczne okladki sa tylko dla czesci katalogu. Odzyskany folder ma okladki i preview dla wszystkich 29 publikacji.

4. Aktywne `/bezplatne-materialy` to tylko 3 materialy z `lib/growth-layer.ts`:
   - `pies-reaktywnosc-5-krokow`
   - `kot-kuweta-checklista`
   - `przygotowanie-do-konsultacji-online`
   Te materialy nie pokrywaja sie 1:1 z `ODZYSKANE/poradniki`.

5. `public/poradniki/*.pdf` plus `lib/lead-magnet.config.ts` wygladaja jak starszy system popup/banner. Komponenty istnieja, ale `LeadMagnetGlobal` nie jest zamontowany w `app/layout.tsx`, wiec ta warstwa jest praktycznie osierocona.

6. `app/sitemap.ts` dodaje stare trasy z `listPdfRoutePaths()` z `lib/pdf-guides.ts`, ale nie dodaje dynamicznych stron `/materialy/[slug]` i `/materialy/pakiet/[slug]`. Dla SEO aktywny katalog PDF jest slabiej wystawiony niz stary katalog.

7. `/niezbednik` miesza etykiety: sekcja mowi o bezplatnych materialach, ale czesc kart prowadzi do platnych `/materialy/...`. Trzeba rozdzielic "bezplatne", "PDF od 19 zl" i "pakiety".

## 4. Decyzja zrodla prawdy

Docelowo jako zrodlo prawdy dla PDF-ow powinien zostac nowy system:

- katalog: `lib/materialy-catalog.ts`
- strony: `/materialy`, `/materialy/[slug]`, `/materialy/pakiet/[slug]`
- zamowienie: `/checkout`
- dostep po platnosci: `/dostep` i `/pokoj`
- pliki PDF: `content/guides/pdf`

Stary system `/oferta/poradniki-pdf` i `/zamow-pdf` powinien zostac przekierowany albo usuniety z wewnetrznych CTA. Inaczej beda dwa lejki i dwa rozne modele platnosci.

## 5. Plan naprawy

### Etap 1 - uporzadkowac routing i jeden checkout

- Uznac `/materialy` za jedyny aktywny katalog PDF.
- Przekierowac stare `/oferta/poradniki-pdf/*` na odpowiadajace `/materialy/*`.
- Usunac lub przekierowac `/zamow-pdf`, bo omija nowy checkout online/BLIK.
- Zaktualizowac linki w blogu, problem landingach, `/niezbednik`, `/psy`, `/koty`.

### Etap 2 - ujednolicic dostep po zakupie

- Zostawic `/dostep` i `/pokoj` jako docelowy dostep.
- Wycofac publiczna instrukcje `/materialy/pobranie` albo jasno oznaczyc jako legacy.
- Upewnic sie, ze maile z kodem i komunikaty po darmowym PDF-ie wskazuja jedna sciezke.

### Etap 3 - podpiac assety z ODZYSKANE

- Przeniesc wybrane `preview_pages/page_01.png` lub `assets/cover.jpg` do `public/branding/pdf-covers`.
- Rozszerzyc `MATERIALY_GUIDE_COVER_SLUGS`, zeby wszystkie aktywne karty mialy miniatury.
- Dopiero po wizualnym porownaniu podmieniac same PDF-y w `content/guides/pdf`.

### Etap 4 - rozstrzygnac lead magnety

- Zostawic aktywne `/bezplatne-materialy` jako lekka warstwe, bez popup-spamu.
- Zdecydowac, czy `public/poradniki/*.pdf` wraca jako nowe slugowe `/bezplatne-materialy`, czy zostaje archiwum.
- Usunac albo swiadomie podlaczyc stary `LeadMagnetGlobal`, ale nie zostawiac martwego systemu.

### Etap 5 - poprawic `/niezbednik` i sitemap

- `/niezbednik` ma byc showroomem: darmowe materialy, PDF od 19 zl, pakiety 49 zl, przygotowanie do konsultacji.
- Karty musza miec prawdziwe ceny/CTA zamiast wszedzie "Pobierz PDF".
- `app/sitemap.ts` powinien wystawiac aktywne `/materialy/*`, a nie stare, brakujace PDF route'y.
