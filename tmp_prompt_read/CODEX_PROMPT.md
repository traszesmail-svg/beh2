# Codex task: wdrożenie zdjęcia na zakładce Kontakt — kierunek 1

## Kontekst

Pracujemy nad stroną regulskibehawiorysta.pl / Behawior 15. Trzeba poprawić podstronę Kontakt według kierunku 1: fotografia jako główny element ocieplający formularz.

Aktualny kierunek strony: jasny, spokojny, premium, beżowo-brązowy, dużo przestrzeni, miękkie panele, delikatny behawioralny ton.

## Cel zadania

Dodaj na podstronie Kontakt sekcję ze zdjęciem / kartą wizualną, która:
- zwiększa zaufanie przed wysłaniem formularza,
- pokazuje realną relację człowiek–pies,
- nie dominuje formularza,
- wygląda spokojnie, profesjonalnie i premium,
- pasuje do obecnego stylu strony.

## Zakres zmian

1. Znajdź plik podstrony Kontakt.
   - Szukaj po tekście: `Napisz, zanim zarezerwujesz`, `Co stanie się dalej`, `Kontakt`.
   - Jeśli podstrona jest w `app/contact`, `app/kontakt`, `app/(...)`, zachowaj obecną strukturę i logikę formularza.

2. Dodaj wizualny blok fotograficzny w kierunku 1.
   - Desktop: zdjęcie powinno być obok formularza albo jako część lewej kolumny nad / pod wprowadzeniem.
   - Mobile: zdjęcie ma pojawić się nad formularzem, ale nie może spychać formularza zbyt nisko.
   - Zdjęcie powinno zajmować ok. 36–44% szerokości głównej sekcji na desktopie.
   - Formularz pozostaje głównym elementem konwersji.

3. Użyj `next/image`, jeżeli projekt korzysta z Next.js.
   - Preferowana ścieżka assetu:
     `/public/images/contact/contact-consultation.webp`
   - Alt:
     `Spokojna konsultacja behawioralna z opiekunem psa`
   - Jeśli pliku jeszcze nie ma, dodaj bezpieczny placeholder / TODO i przygotuj miejsce pod finalny plik.

4. Dodaj krótką podpisową warstwę zaufania pod zdjęciem albo na zdjęciu:
   - `Spokojna rozmowa przed decyzją`
   - `Najpierw rozumiemy sytuację, potem dobieramy kolejny krok.`
   - Opcjonalnie małe chipy:
     `Bez oceniania`
     `Z uważnością na psa`
     `Konkretny następny krok`

5. Nie zmieniaj działania formularza.
   - Nie ruszaj walidacji.
   - Nie zmieniaj endpointów.
   - Nie zmieniaj wysyłki wiadomości.
   - Nie przebudowuj całej strony.

## Proponowany układ

Desktop:

[ Lewa kolumna ]
- breadcrumb / etykieta
- nagłówek: `Napisz, zanim zarezerwujesz.`
- krótki opis
- karta ze zdjęciem, podpisem i chipami zaufania

[ Środkowa / prawa kolumna ]
- formularz kontaktowy

[ Prawa kolumna ]
- `Co stanie się dalej?`
- kontakt e-mail / telefon / lokalizacja / social media
- karta `Kwadrans z behawiorystą`

Jeżeli obecny layout jest dwukolumnowy, nie dokładaj chaosu. Wtedy zdjęcie umieść:
- nad formularzem jako poziomy baner,
- albo po lewej stronie formularza jako pionowa karta.

## Styl CSS

Użyj istniejących tokenów CSS, jeśli są dostępne:
- `--bg`
- `--bg-soft`
- `--panel`
- `--text`
- `--muted`
- `--border`
- `--accent`
- `--accent-2`
- `--shadow`

Dodaj klasy tylko dla tej sekcji, np.:
- `.contact-visual-card`
- `.contact-photo-wrap`
- `.contact-photo`
- `.contact-photo-caption`
- `.contact-trust-row`
- `.contact-trust-chip`

Styl:
- border-radius: 26–32px
- delikatny border
- miękki shadow
- zdjęcie z `object-fit: cover`
- naturalne proporcje: 4:3 lub 16:10 na desktopie, 4:3 na mobile
- bez mocnego overlayu
- bez pomarańczowych agresywnych akcentów

## Copy do wdrożenia

Podpis pod zdjęciem:

`Spokojna rozmowa przed decyzją`

Opis:

`Nie musisz od razu wiedzieć, jaki rodzaj pomocy będzie najlepszy. Napisz krótko, co się dzieje — pomożemy uporządkować sytuację i wybrać kolejny krok.`

Chipy:

- `Bez oceniania`
- `Z uważnością na psa`
- `Konkretny następny krok`

## Asset

Docelowy plik:
`public/images/contact/contact-consultation.webp`

Jeśli trzeba dodać placeholder, niech ma neutralny gradient i miejsce na zdjęcie, ale kod powinien być gotowy na finalne zdjęcie.

## Testy i weryfikacja

Po zmianach uruchom:
- `npm run lint`, jeśli jest dostępne,
- `npm run build`,
- ewentualne testy / smoke testy, jeśli repo je zawiera.

Sprawdź:
- `/kontakt` albo właściwą ścieżkę Kontakt,
- desktop ok. 1440 px,
- tablet ok. 1024 px,
- mobile ok. 390 px.

## Kryterium sukcesu

Strona Kontakt wygląda cieplej i bardziej wiarygodnie, ale nadal minimalistycznie. Użytkownik ma poczuć: „mogę spokojnie opisać problem, ktoś to zrozumie i powie mi, co dalej”.
