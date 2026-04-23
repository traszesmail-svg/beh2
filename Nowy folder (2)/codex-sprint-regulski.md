# Sprint 14 dni — Codex prompty dla regulskibehawiorysta.pl
**Zasada**: Ty wdraża → ja sprawdzam → przechodzimy dalej.
Każdy prompt to jedno wdrożenie. Nie łącz kilku w jedno.

---

## DZIEŃ 1 — Krytyczne blokery (rano)

### PROMPT 1A — Odblokuj booking: znajdź i zweryfikuj istniejący system

```
Jesteś w repozytorium Next.js aplikacji regulskibehawiorysta.pl.

ZADANIE: Znajdź istniejący system rezerwacji (booking).

1. Przeszukaj cały repo pod kątem:
   - plików w app/ lub pages/ zawierających słowa: booking, book, rezerwacja, reservation
   - komponentów z formularzem (form, useState dla imie/email/terminy/gatunek/opis)
   - action handlers / API routes w app/api/ lub pages/api/ obsługujących rezerwacje
   - tabel lub schematów w Supabase (szukaj migracji, types, schema.ts, database.types.ts)
   - emaili wysyłanych przez Resend (szukaj resend, sendEmail, createEmailClient)

2. Wypisz mi dokładnie:
   - pełne ścieżki plików związanych z bookingiem
   - nazwę tabeli Supabase gdzie trafiają rezerwacje
   - jak wygląda mail zwrotny do klienta i do właściciela (czy jest?)
   - co dokładnie się dzieje po submit formularza (console.log? insert do Supabase? send email?)

3. Nie zmieniaj żadnego kodu. Tylko raport.

Cel: zrozumieć co już działa, zanim cokolwiek naprawimy.
```

---

### PROMPT 1B — Usuń 3 krytyczne blokery zaufania

```
Jesteś w repozytorium Next.js aplikacji regulskibehawiorysta.pl.

ZADANIE: Usuń trzy rzeczy, które natychmiast psują zaufanie klienta.

--- BLOKER 1: Komunikat "brak terminów" ---
Znajdź i usuń/zamień z KAŻDEJ strony komunikat w stylu:
"Najblizszy wolny termin jest chwilowo niedostepny. Wroc za moment albo sprawdz /book"
lub jego warianty (szukaj też w polskich znakach: "niedostępny", "chwilowo").

Zamień na: NICZYM — po prostu usuń ten element. Jeśli to komponent, usuń jego wywołanie.
Sprawdź: app/page.tsx, app/psy/page.tsx, app/cennik/page.tsx, app/book/page.tsx
i wszystkie inne strony gdzie może się pojawić.

--- BLOKER 2: Dwa różne emaile ---
Znajdź WSZYSTKIE miejsca gdzie hardcodowany jest email kontaktowy.
Ustaw JEDEN email: kontakt@regulskibehawiorysta.pl

Zamień wszędzie coapebehawiorysta@gmail.com na kontakt@regulskibehawiorysta.pl
Szukaj w: wszystkich plikach tsx/ts/js, config/, constants/, i komponentach stopki/headera.
Jeśli jest env variable CONTACT_EMAIL — zaktualizuj .env.local i wszystkie referencje.

--- BLOKER 3: Fałszywy numer telefonu ---
Znajdź wszystkie wystąpienia "500 600 700" lub "500600700" lub tel:500600700.
Usuń całkowicie element z numerem telefonu wszędzie gdzie się pojawia (stopka, kontakt, regulamin).
Jeśli jest to pole które MUSI gdzieś być — zostaw puste lub schowane (display:none).

Po zmianach: sprawdź że żaden z trzech blokerów nie istnieje w żadnym pliku tsx/ts/js/mdx.
Nie zmieniaj nic innego.
```

---

## DZIEŃ 1 — Krytyczne blokery (po południu)

### PROMPT 1C — Napraw regulamin: usuń "TODO przed publikacją"

```
Jesteś w repozytorium Next.js aplikacji regulskibehawiorysta.pl.

ZADANIE: Napraw regulamin pełnej konsultacji — usuń placeholdery widoczne publicznie.

Znajdź plik odpowiadający za stronę /regulamin-pelna-konsultacja
(szukaj w app/regulamin-pelna-konsultacja/page.tsx lub podobnych ścieżkach).

1. Usuń CAŁĄ sekcję/element zawierający tekst:
   "Dane do uzupelnienia przed publikacja"
   lub "Dane do uzupełnienia przed publikacją"
   
2. Znajdź w treści regulaminu wszystkie wystąpienia "NIP/REGON: brak"
   Zamień na: "NIP/REGON: [DO UZUPEŁNIENIA]" — ale ukryj ten element za pomocą:
   <span className="hidden">...</span>  lub usuń z renderowania
   
   UWAGA: Właściciel uzupełni NIP ręcznie — na razie najważniejsze żeby
   "brak" i "Dane do uzupełnienia" NIE były widoczne dla klientów.

3. Znajdź w treści regulaminu element/sekcję z opisem "Uwaga wdrozeniowa" lub "uwaga implementacyjna"
   Usuń go całkowicie z renderowanego HTML.

4. Sprawdź też /regulamin (regulamin ogólny) — czy ma podobne placeholdery. Usuń jeśli tak.

Nie zmieniaj treści merytorycznej regulaminu. Tylko usuń deweloperskie notki.
```

---

## DZIEŃ 2 — Booking: "Kwadrans na już" + poprawka wysyłki

### PROMPT 2A — Dodaj usługę "Kwadrans na już" do bookingu

```
Jesteś w repozytorium Next.js aplikacji regulskibehawiorysta.pl.

Na podstawie raportu z PROMPT 1A (który już masz) — teraz wdrażaj.

ZADANIE: Dodaj nową usługę "Kwadrans na już" do formularza rezerwacji.

KONTEKST:
- Formularz bookingu jest na /book
- Usługi są wybierane przez <select> lub radio buttons z wartościami jak:
  "szybka-konsultacja-15-min", "konsultacja-30-min", "konsultacja-behawioralna-online"
- URL params ?service= i ?species= pre-fillują formularz

ZMIANY:

1. Dodaj nową opcję do listy usług w formularzu:
   value: "kwadrans-na-juz"
   label: "Kwadrans na już / 69 zł → (pierwsza wolna chwila dziś)"
   
   Ta opcja powinna być PIERWSZA na liście, wyróżniona (np. bold lub badge "TERAZ").

2. Dodaj obsługę URL param: /book?service=kwadrans-na-juz
   Formularz powinien pre-wypełnić tę usługę gdy param jest obecny.

3. W sekcji "3 preferowane terminy" — gdy wybrana jest usługa "kwadrans-na-juz":
   Zastąp to pole tekstem statycznym (nie-edytowalnym):
   "Chcę termin jak najszybciej — proszę o kontakt w ciągu 15 minut."
   i schowaj (hidden/disabled) pole wpisywania terminów.

4. W mailu wysyłanym do właściciela (Resend) po submit — zaznacz wyraźnie
   SUBJECT: "🔴 PILNE — Kwadrans na już: [imię klienta]"
   zamiast standardowego tematu.

5. W potwierdzeniu dla klienta po submit — gdy wybrano "kwadrans-na-juz":
   Pokaż komunikat: "Twoja prośba o Kwadrans na już dotarła. 
   Odpisuję w ciągu 15 minut z numerem BLIK i terminem."

Znajdź istniejące pliki obsługujące booking i dokonaj zmian tam.
Nie twórz nowych stron ani routes.
```

---

### PROMPT 2B — Upewnij się że booking wysyła mail do właściciela

```
Jesteś w repozytorium Next.js aplikacji regulskibehawiorysta.pl.

ZADANIE: Upewnij się że po submit formularza rezerwacji właściciel ZAWSZE dostaje maila.

Na podstawie raportu z PROMPT 1A sprawdź API route obsługujące submit bookingu.

1. Zweryfikuj że po submit formularza /book wysyłany jest email do właściciela zawierający:
   - imię klienta
   - email klienta  
   - gatunek (pies/kot)
   - wybrana usługa + cena
   - opis sytuacji
   - proponowane terminy (lub "Kwadrans na już — PILNE")
   - zgody zaznaczone przez klienta

2. Email do właściciela wysyłaj NA: kontakt@regulskibehawiorysta.pl
   FROM: noreply@regulskibehawiorysta.pl lub przez Resend verified domain
   SUBJECT format: "[Rezerwacja] {usługa} — {imię} {gatunek}"
   Dla "kwadrans-na-juz": subject = "🔴 PILNE Kwadrans na już — {imię}"

3. Jeśli nie ma wysyłki do właściciela — DODAJ ją.
   Użyj istniejącego klienta Resend (już jest w projekcie).
   Wzorzec maila: plain text z danymi klienta, bez HTML, czytelny na telefonie.

4. Upewnij się że API route zwraca:
   - 200 + { success: true } gdy mail wysłany
   - 500 + { error: "..." } gdy błąd (żeby front mógł pokazać błąd użytkownikowi)

5. Sprawdź czy formularz na froncie obsługuje oba przypadki:
   - sukces: pokaż komunikat "Prośba wysłana! Odpiszę w ciągu 15 minut."
   - błąd: pokaż komunikat "Coś poszło nie tak. Napisz na kontakt@regulskibehawiorysta.pl"

Nie zmieniaj struktury bazy danych jeśli jest. Tylko mail delivery.
```

---

## DZIEŃ 3 — Nawigacja i spójność layoutu

### PROMPT 3A — Ujednolicenie nawigacji i stopki na wszystkich stronach

```
Jesteś w repozytorium Next.js aplikacji regulskibehawiorysta.pl.

ZADANIE: Upewnij się że WSZYSTKIE strony używają tego samego layoutu (header + footer).

PROBLEM: Strony /koty, /o-mnie, /kontakt używają innego headera/footera niż 
/psy, /book, /cennik, /faq. Powoduje to różne menu, różne linki w stopce.

1. Znajdź wszystkie pliki layout.tsx / Layout komponenty w repo.
   Prawdopodobnie są dwa: jeden "stary" i jeden "nowy".

2. Określ który layout jest "docelowy" (ten z linkami: Pies, Kot, Niezbędnik, O mnie, 
   Cennik, Kontakt, FAQ w nagłówku + pełna stopka z sekcjami Nawigacja / Start / Kontakt).

3. Upewnij się że KAŻDA strona w app/ używa TEGO SAMEGO layoutu.
   Szczególnie sprawdź: app/koty/page.tsx, app/o-mnie/page.tsx, app/kontakt/page.tsx,
   app/regulamin/page.tsx, app/polityka-prywatnosci/page.tsx, app/niezbednik/page.tsx.

4. Jeśli strony importują lokalny layout zamiast globalnego — przepnij je.

5. W nagłówku KAŻDEJ strony musi być ta sama lista linków:
   Pies | Kot | Niezbędnik | O mnie | FAQ | Kontakt | [CTA: Kwadrans / 69 zł →]
   
6. W stopce KAŻDEJ strony:
   - jeden email: kontakt@regulskibehawiorysta.pl (BEZ numeru telefonu)
   - linki: Polityka prywatności | Regulamin | Regulamin Pełnej konsultacji
   - © 2026 Krzysztof Regulski

Nie zmieniaj wyglądu ani treści komponentów. Tylko upewnij się że są używane wszędzie.
```

---

### PROMPT 3B — Napraw polskie znaki na home page

```
Jesteś w repozytorium Next.js aplikacji regulskibehawiorysta.pl.

ZADANIE: Znajdź i napraw brakujące polskie diakrytyki.

PROBLEM: Na stronie głównej (/) i kilku innych stronach wyświetla się tekst bez 
polskich znaków: "uslug" zamiast "usług", "nazwac" zamiast "nazwać", itd.

1. Sprawdź app/page.tsx (home) i znajdź tekst bez diakrytyków.
   Konkretne przypadki z audytu (wyszukaj te stringi):
   - "uslug" → "usług"
   - "nazwac" → "nazwać"  
   - "polacz" → "połącz"
   - "klikajac" → "klikając"
   Użyj grep -r do znalezienia wszystkich wystąpień.

2. Sprawdź czy problem jest w:
   a) Statycznym tekście w TSX/JSX — popraw ręcznie
   b) Danych w Supabase / CMS — wypisz mi które pola wymagają edycji przez panel admina
   c) Osobnym pliku z treściami (constants, content, data) — popraw tam

3. Po poprawieniu home — sprawdź te same problemy w:
   app/book/page.tsx, app/faq/page.tsx, app/behawiorysta-online-polska/page.tsx

4. Upewnij się że <html lang="pl"> jest w app/layout.tsx (root layout).
   Jeśli nie ma — dodaj.

5. Sprawdź czy charset="utf-8" jest w <head> (Next.js dodaje automatycznie, 
   ale upewnij się że nie ma nic co by to nadpisywało).
```

---

## DZIEŃ 4 — SEO: Sitemap, Robots, OG Tags

### PROMPT 4A — Sitemap.xml i robots.txt

```
Jesteś w repozytorium Next.js aplikacji regulskibehawiorysta.pl (App Router).

ZADANIE: Wygeneruj sitemap.xml i robots.txt żeby Google mogło zaindeksować stronę.

UWAGA: Strona NIE POJAWIA SIĘ w Google — to najprawdopodobniej brak sitemapy lub 
błąd w robots.txt. To jest absolutny priorytet SEO.

1. Sprawdź czy istnieje app/robots.ts lub public/robots.txt
   Jeśli robots.txt blokuje cokolwiek (Disallow: /) — usuń blokadę.
   Docelowy robots.txt:
   ```
   User-agent: *
   Allow: /
   Sitemap: https://regulskibehawiorysta.pl/sitemap.xml
   ```

2. Sprawdź czy istnieje app/sitemap.ts
   Jeśli nie — stwórz go.

   Sitemap musi zawierać WSZYSTKIE publiczne URL-e:
   - / (home) — priority: 1.0, changefreq: weekly
   - /psy — priority: 0.9
   - /psy/reaktywnosc-na-smyczy — priority: 0.8
   - /psy/lek-separacyjny — priority: 0.8
   - /koty — priority: 0.9
   - /o-mnie — priority: 0.7
   - /cennik — priority: 0.8
   - /faq — priority: 0.7
   - /blog — priority: 0.8
   - /blog/[każdy slug] — priority: 0.7 (pobierz dynamicznie z systemu bloga lub FS)
   - /bezplatne-materialy/pies-reaktywnosc-5-krokow — priority: 0.6
   - /bezplatne-materialy/kot-kuweta-checklista — priority: 0.6
   - /bezplatne-materialy/przygotowanie-do-konsultacji-online — priority: 0.6
   - /behawiorysta-online-polska — priority: 0.8
   - /oferta/poradniki-pdf/pies-reaktywny-na-spacerze — priority: 0.7
   - /oferta/poradniki-pdf/pies-boi-sie-gosci-i-dzwiekow — priority: 0.7
   - /oferta/poradniki-pdf/pakiety/pakiet-spacerowy-pies — priority: 0.6
   
   NIE dodawaj do sitemaps: /book, /kontakt, /regulamin, /polityka-prywatnosci

3. Po zmianach powiedz mi dokładnie co zrobiłeś i jaki jest URL sitemaps
   żebym mógł go ręcznie zweryfikować w przeglądarce.
```

---

### PROMPT 4B — Open Graph i Title tags

```
Jesteś w repozytorium Next.js aplikacji regulskibehawiorysta.pl (App Router).

ZADANIE: Dodaj/napraw Open Graph meta tagi i unikalne title tagi dla każdej strony.

PROBLEM 1 — Title tagi nie różnicują się przy URL params.
Strona /book?service=konsultacja-behawioralna-online nadal ma title "Rezerwacja Kwadransa".

Znajdź generateMetadata() w app/book/page.tsx (lub gdzie jest).
Dodaj logikę:
```typescript
export async function generateMetadata({ searchParams }) {
  const service = searchParams?.service
  const titles = {
    'konsultacja-behawioralna-online': 'Rezerwacja pełnej konsultacji behawioralnej | Regulski',
    'konsultacja-30-min': 'Rezerwacja Dwóch Kwadransów | Regulski',
    'kwadrans-na-juz': '🔴 Kwadrans na już — rezerwacja | Regulski',
  }
  return {
    title: titles[service] ?? 'Rezerwacja Kwadransa z behawiorystą | Regulski',
    // + og tags poniżej
  }
}
```

PROBLEM 2 — Brak og:image na każdej stronie.
Sprawdź czy istnieje app/opengraph-image.tsx lub app/opengraph-image.png
Jeśli nie — stwórz app/opengraph-image.tsx jako fallback OG image:
- tło: kremowe lub ciemne (brand color z projektu)
- tekst: "Regulski. Behawiorysta psów i kotów online."
- podtytuł: "Kwadrans z behawiorystą / 69 zł"
Użyj Next.js ImageResponse API.

PROBLEM 3 — Sprawdź każdą kluczową stronę czy ma unikalne:
- <title> — nie "Behawiorysta psów i kotów online | Regulski" na każdej
- og:title, og:description, og:url, og:type
Strony do sprawdzenia: /, /psy, /koty, /o-mnie, /cennik, /blog, /behawiorysta-online-polska

Dla każdej brakującej — dodaj generateMetadata() z unikalnymi wartościami.
Opisy max 155 znaków, zawierające główne słowo kluczowe strony.
```

---

## DZIEŃ 5 — Cookie banner + Niezbędnik

### PROMPT 5A — Cookie consent banner (RODO)

```
Jesteś w repozytorium Next.js aplikacji regulskibehawiorysta.pl.

ZADANIE: Dodaj prosty cookie consent banner wymagany przez RODO.

KONTEKST: Strona używa Google Analytics (potwierdzone w Polityce prywatności).
GA musi być załadowane DOPIERO po wyrażeniu zgody.

1. Sprawdź jak GA jest załadowane w projekcie:
   - czy jest w app/layout.tsx jako <Script>?
   - czy jest przez @next/third-parties/google?
   - czy jest w _document.tsx?
   Znajdź i pokaż mi kod.

2. Stwórz komponent CookieBanner:
   - pojawia się na dole ekranu przy pierwszej wizycie
   - prosty, minimalistyczny, pasujący do stylu marki (kremowe tło, ciemny tekst)
   - tekst: "Ta strona używa Google Analytics po wyrażeniu zgody. 
     Szczegóły w Polityce prywatności."
   - dwa przyciski: "Akceptuję" i "Odmawiam"
   - stan zapisywany w localStorage: 'cookie-consent' = 'accepted' | 'rejected'
   - banner nie pojawia się ponownie po wyborze

3. Warunkowe ładowanie GA:
   - GA ładuje się TYLKO gdy consent = 'accepted'
   - Użyj istniejącego kodu GA i opakuj go w sprawdzenie consentu

4. Jeśli używasz @next/third-parties — zamiast tego użyj ręcznego Script z:
   strategy="afterInteractive" i warunkowym renderowaniem

5. Dodaj CookieBanner do root layout (app/layout.tsx) jako ostatni element <body>.

NIE instaluj zewnętrznych bibliotek consent. Prosty własny komponent wystarczy.
```

---

### PROMPT 5B — Napraw Niezbędnik: podlinkuj sklep PDF

```
Jesteś w repozytorium Next.js aplikacji regulskibehawiorysta.pl.

ZADANIE: Niezbędnik jest pusty — napraw go żeby pokazywał istniejące produkty PDF.

PROBLEM: /niezbednik jest placeholder'em, ale produkty PDF istnieją pod /oferta/poradniki-pdf/.
Klienci wchodzą na Niezbędnik z menu i widzą pustą stronę.

1. Znajdź app/niezbednik/page.tsx

2. ZACHOWAJ istniejące sekcje tekstowe (opisy co będzie, ton marki, itd.)
   NIE zmieniaj copy.

3. W sekcji "PDF-y" — zamiast opisu co "będzie" — pokaż już istniejące produkty:

   Stwórz lub zaktualizuj tę sekcję żeby zawierała karty dla:

   PRODUKT 1:
   - Tytuł: "Pies reaktywny na spacerze"
   - Opis: "Pierwszy plan pracy przy szczekaniu, spinaniu się i trudnych mijankach"
   - Cena: 59 zł | 8 stron | 13 min czytania
   - Link do: /oferta/poradniki-pdf/pies-reaktywny-na-spacerze

   PRODUKT 2:
   - Tytuł: "Pies boi się gości i dźwięków"  
   - Opis: "Jak ustawić bezpieczny plan przy lęku domowym, dzwonku i trudnych wizytach"
   - Cena: bezpłatnie
   - Link do: /oferta/poradniki-pdf/pies-boi-sie-gosci-i-dzwiekow

   PRODUKT 3 (jeśli istnieje strona):
   - Tytuł: "Pies zostaje sam — plan pierwszych kroków"
   - Opis: "Plan stopniowego oswajania z samotnością — bez pośpiechu i bez cofania"
   - Link do: /oferta/poradniki-pdf/pies-zostaje-sam-plan-pierwszych-krokow

   PAKIET 1:
   - Tytuł: "Pakiet Spacery bez napięcia"
   - Opis: "2 materiały do jednego obszaru pracy"
   - Cena: 69 zł (oszczędzasz 49 zł)
   - Link do: /oferta/poradniki-pdf/pakiety/pakiet-spacerowy-pies

4. Karty powinny mieć styl pasujący do reszty strony. 
   Nie wymyślaj nowego design systemu — użyj klas które już są w projekcie.

5. Sprawdź czy strony docelowe produktów (ww. URL-e) naprawdę istnieją w app/.
   Jeśli któraś nie istnieje — zaraportuj to, nie twórz jej samodzielnie.
```

---

## DZIEŃ 6 — Produkty PDF: zamów przez formularz (nie Stripe)

### PROMPT 6A — Formularz zakupu PDF przez BLIK (bez Stripe)

```
Jesteś w repozytorium Next.js aplikacji regulskibehawiorysta.pl.

ZADANIE: Dodaj możliwość zamówienia PDF przez prosty formularz — tak samo jak booking.
(Właściciel używa BLIK na telefon, bez bramki płatności.)

MODEL: identyczny jak /book — klient wysyła prośbę, właściciel odpisuje z numerem BLIK.

1. Sprawdź strony produktów PDF (np. app/oferta/poradniki-pdf/[slug]/page.tsx)
   Znajdź CTA "Napisz w sprawie zakupu" — aktualnie linki na /kontakt.

2. Na każdej stronie produktu PDF zastąp link do /kontakt 
   małym inline formularzem zakupu LUB nowym dedykowanym komponentem PdfOrderForm.

   Formularz zakupu PDF zawiera TYLKO:
   - Email (required)
   - Imię (required)  
   - Pole hidden: produkt (pre-wypełnione slugiem produktu z URL lub props)
   - Pole hidden: cena (pre-wypełnione ceną produktu)
   - Przycisk: "Zamów — dostanę numer BLIK w ciągu 15 minut"
   - Mini-regulamin: checkbox "Akceptuję regulamin" (link do /regulamin)

3. Po submit — wysyłaj email do właściciela przez istniejącego klienta Resend:
   TO: kontakt@regulskibehawiorysta.pl
   SUBJECT: "[PDF] Zamówienie: {nazwa produktu} — {imię}"
   BODY: imię, email, produkt, cena, data+godzina
   
   Dla zamówień pilnych ("Pies zostaje sam") — użyj prefiksu "🔴 PILNE".

4. Potwierdzenie dla klienta:
   "Zamówienie przyjęte! W ciągu 15 minut wyślę Ci numer BLIK 
   na {email}. Po wpłacie dostaniesz PDF na ten sam adres."

5. Obsługa błędów: jeśli mail nie poszedł — "Spróbuj napisać bezpośrednio: 
   kontakt@regulskibehawiorysta.pl — temat: PDF {nazwa produktu}".

NIE instaluj żadnej nowej biblioteki. Użyj Resend który już jest.
```

---

## DZIEŃ 7 — Trust signals

### PROMPT 7A — Sekcja opinii: struktura dla prawdziwych testimonialów

```
Jesteś w repozytorium Next.js aplikacji regulskibehawiorysta.pl.

ZADANIE: Przygotuj strukturę sekcji opinii na home page żeby można było 
wkleić prawdziwe opinie z imieniem, miastem i gatunkiem.

PROBLEM: Aktualne opinie są anonimowe ("Opiekunka psa reaktywnego"). 
Wyglądają jak wygenerowane. Właściciel zbierze prawdziwe opinie.

1. Znajdź komponent Opinions / Testimonials na home page (app/page.tsx lub osobny plik).

2. Zmień strukturę danych dla każdej opinii z:
   { quote: string, attribution: string }
   na:
   { 
     quote: string,       // treść opinii
     name: string,        // imię (np. "Agnieszka M.")
     city: string,        // miasto (np. "Warszawa")
     petType: 'pies' | 'kot',  // gatunek
     petName?: string,    // imię zwierzaka (opcjonalne, np. "Max")
     date?: string,       // "kwiecień 2026" (opcjonalne)
     service?: string,    // "Kwadrans z behawiorystą" (opcjonalne)
   }

3. Zaktualizuj rendering żeby wyświetlał:
   - treść opinii w cudzysłowach
   - imię + miasto (np. "Agnieszka M., Warszawa")
   - ikona lub emoji psa/kota obok imienia
   - datę jeśli jest (mały szary tekst)

4. Wypełnij placeholderami żeby page się budowała bez błędów:
   name: "Ania K.", city: "Warszawa", petType: "pies",
   quote: "Po rozmowie wiedziałam, co zrobić od razu i co spokojnie odłożyć."
   
   (Właściciel zamieni placeholdery na prawdziwe opinie po zebraniu)

5. Nie zmieniaj wyglądu/stylu opinii. Tylko dodaj pola i wypełnij placeholderami.
```

---

### PROMPT 7B — Sekcja "Liczby" i gwarancja zwrotu na home

```
Jesteś w repozytorium Next.js aplikacji regulskibehawiorysta.pl.

ZADANIE: Dodaj dwa trust signals na home page które zwiększają konwersję.

--- TRUST 1: Sekcja z liczbami ---
Znajdź sekcję "O mnie" na home page (krótki opis specjalisty).
Dodaj tuż pod nią lub obok malutką sekcję z 3 liczbami:

[ Certyfikat COAPE ] [ Online / cała Polska ] [ Zwrot w 24h ]

Lub jeśli właściciel dostarczy liczby konsultacji:
[ X+ konsultacji ] [ Certyfikat COAPE ] [ Zwrot w 24h ]

Użyj prostych kart z ikonami (możesz użyć ikon które już są w projekcie / Lucide).
Styl: minimalistyczny, pasuje do reszty home page.

--- TRUST 2: Baner gwarancji ---
Na stronie /book (pod lub nad formularzem rezerwacji) oraz na /cennik:
Dodaj mały element informacyjny:

"💚 Gwarancja spokoju: jeśli po Kwadransie uznasz, że rozmowa nie była warta 69 zł, 
zwrócę pieniądze w ciągu 24h. Bez pytań, wystarczy mail."

Styl: zielona ramka lub ikona check, mały tekst (small/muted), nie agresywny.
Nie dodawaj tego na żadnej innej stronie na razie.

Oba trust signals powinny być komponentami które łatwo edytować / ukryć,
nie wbudowanymi inline stringami.
```

---

## DZIEŃ 8 — Schema.org (SEO)

### PROMPT 8A — Schema.org: LocalBusiness + Service + FAQPage

```
Jesteś w repozytorium Next.js aplikacji regulskibehawiorysta.pl (App Router).

ZADANIE: Dodaj schema.org structured data dla lepszego SEO i rich snippets.

1. Na home page (app/page.tsx) dodaj schema `LocalBusiness` + `Person`:
```json
{
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "ProfessionalService"],
  "name": "Regulski — Behawiorysta psów i kotów online",
  "url": "https://regulskibehawiorysta.pl",
  "description": "Terapia behawioralna online dla psów i kotów. Kwadrans z behawiorystą 69 zł. Konsultacje dla opiekunów z całej Polski.",
  "areaServed": "PL",
  "serviceType": "Behawiorystyka zwierząt",
  "employee": {
    "@type": "Person",
    "name": "Krzysztof Regulski",
    "jobTitle": "Behawiorysta COAPE",
    "sameAs": ["https://behawioryscicoape.pl/behawiorysta/Regulski", "https://www.instagram.com/coapebehawiorysta/"]
  },
  "priceRange": "69-350 PLN"
}
```
Użyj <script type="application/ld+json"> wewnątrz <head> przez Next.js metadata lub 
bezpośrednio w JSX jako dangerouslySetInnerHTML.

2. Na /cennik i /book dodaj schema `Service` dla każdej usługi:
   - Kwadrans: name, description, price: "69", priceCurrency: "PLN"
   - Dwa Kwadranse: price: "129"
   - Pełna konsultacja: price: "350"

3. Na /faq, /psy#faq, /koty#faq dodaj schema `FAQPage`:
   Zbierz pytania i odpowiedzi z tych stron i opakuj w strukturę:
```json
{
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "...", "acceptedAnswer": { "@type": "Answer", "text": "..." } }
  ]
}
```

4. Stwórz helper utility `lib/schema.ts` z funkcjami generateServiceSchema(), generateFAQSchema()
   żeby nie duplikować kodu.

NIE instaluj żadnych bibliotek. Czyste JSON-LD w script tagach.
```

---

## DZIEŃ 9 — Blog: wewnętrzne linkowanie

### PROMPT 9A — Powiązane artykuły na blogu + CTA pod każdym postem

```
Jesteś w repozytorium Next.js aplikacji regulskibehawiorysta.pl.

ZADANIE: Każdy post na blogu powinien mieć:
(a) 3 powiązane artykuły na końcu
(b) CTA do Kwadransu po artykule

1. Znajdź gdzie renderowany jest pojedynczy post bloga:
   prawdopodobnie app/blog/[slug]/page.tsx

2. Na końcu każdego artykułu (po treści, przed stopką) dodaj sekcję:
   
   --- SEKCJA: Powiązane artykuły ---
   Tytuł: "Przeczytaj też"
   Treść: 3 linki do powiązanych artykułów.
   
   Logika doboru powiązanych:
   - Jeśli post ma tag "pies" — pokaż 3 inne posty z tagiem "pies"
   - Jeśli tag "kot" — 3 posty z tagiem "kot"  
   - Jeśli tag "konsultacja" — mix
   - Jeśli nie ma tagów lub za mało — pokaż 3 ostatnie posty
   
   Implementacja: prosty algorytm na podstawie pola `tags` lub `category` 
   które pewnie już jest w danych posta. Jeśli nie ma — dodaj do struktury.

3. Pod sekcją powiązanych artykułów dodaj CTA blok:
   
   Tło: lekko wyróżnione (szare lub kremowe)
   Tekst: "Jeśli ten temat dotyczy Twojego psa lub kota — 
   jeden Kwadrans z behawiorystą pomoże ustawić pierwszy krok."
   Przycisk: "Zarezerwuj Kwadrans / 69 zł →" → /book?service=szybka-konsultacja-15-min
   Mały tekst pod: "15 min audio, bez kamery. BLIK po potwierdzeniu."
   
4. Nie dodawaj nic więcej. Nie zmieniaj treści artykułów.
5. Sprawdź że nowe sekcje renderują się na 3 losowych postach (podaj mi URL-e do sprawdzenia).
```

---

## DZIEŃ 10 — Brakujące podstrony problemowe (/psy)

### PROMPT 10A — Dokończ architekturę /psy: podstrony dla 6 brakujących problemów

```
Jesteś w repozytorium Next.js aplikacji regulskibehawiorysta.pl.

ZADANIE: Na /psy jest 8 kategorii. Tylko 2 mają dedykowane strony.
Pozostałe 6 linkują bezpośrednio na /book — co jest słabe SEO i UX.

KONTEKST: Istnieje już:
- /psy/reaktywnosc-na-smyczy (bardzo dobra strona, użyj jako template)
- /psy/lek-separacyjny (bardzo dobra strona, użyj jako template)

ZADANIE: Stwórz 4 priorytetowe podstrony (nie wszystkie 6 naraz):

Priorytet 1: /psy/pobudzenie-wyciszenie
Priorytet 2: /psy/mlody-pies  
Priorytet 3: /psy/szczekanie-czujnosc
Priorytet 4: /psy/strach-fobie

Dla każdej strony użyj DOKŁADNIE tej samej struktury co /psy/reaktywnosc-na-smyczy:
- H1 z nazwą problemu
- Sekcja "Jak to wygląda w praktyce" (5-6 punktów "Znasz to, jeśli...")
- Sekcja "Co napędza [problem]" (3-4 akapity)
- Sekcja "Co najczęściej nie działa" (lista)
- Sekcja "Od czego zacząć" (3 kroki)
- Sekcja "Kiedy warto porozmawiać z behawiorystą"
- FAQ (3-4 pytania)
- CTA "Zarezerwuj Kwadrans"
- Sekcja "Przykładowa historia"
- Lead magnet form

Treść: napisz sensowną, merytoryczną treść dla każdego tematu.
Nie używaj ChatGPT filler. Pisz jak ekspert.

Zaktualizuj /psy/page.tsx żeby te 4 kategorie linkały na nowe strony 
zamiast bezpośrednio na /book.

Po wdrożeniu podaj mi URL-e do sprawdzenia.
```

---

## DZIEŃ 11 — "Kwadrans na już" na home page + /psy + /koty

### PROMPT 11A — CTA "Kwadrans na już" w widocznym miejscu

```
Jesteś w repozytorium Next.js aplikacji regulskibehawiorysta.pl.

ZADANIE: Dodaj "Kwadrans na już" jako wyróżnione CTA w 3 kluczowych miejscach.

KONTEKST: Usługa "Kwadrans na już" (kwadrans-na-juz) istnieje już w formularzu 
(z DNIA 2). Teraz musi być widoczna na stronach przed dotarciem do /book.

MIEJSCE 1: Home page — sekcja hero (app/page.tsx)
Aktualny CTA hero: "Kwadrans z behawiorystą →" → /book
Zmień na dwa CTA obok siebie:
- Primary: "Zarezerwuj termin →" → /book
- Secondary (wyróżniony, może być z border/inny kolor): 
  "⚡ Kwadrans na już" → /book?service=kwadrans-na-juz
  Mały tekst pod: "Odpisuję w 15 minut"

MIEJSCE 2: /psy strona — sekcja hero
Pod komunikatem "Najblizszy wolny termin..." (który usunęliśmy) dodaj:
Dwa CTA jak wyżej, z species param:
- "Zarezerwuj →" → /book?service=szybka-konsultacja-15-min&species=pies
- "⚡ Kwadrans na już" → /book?service=kwadrans-na-juz&species=pies

MIEJSCE 3: /koty strona — sekcja hero
Analogicznie:
- "Zarezerwuj →" → /book?service=szybka-konsultacja-15-min&species=kot
- "⚡ Kwadrans na już" → /book?service=kwadrans-na-juz&species=kot

STYL "Kwadrans na już":
Nie rób go zbyt krzykliwym. Pasuj do ton marki (spokojny, konkretny).
Może być: bordowy/ciemnopomarańczowy kolor tła przycisku lub po prostu bold + ⚡ emoji.
Nie zmieniaj istniejących CTA. Dodajesz obok.
```

---

## DZIEŃ 12 — Kompletny audit linków i broken pages

### PROMPT 12A — Sprawdź wszystkie linki wewnętrzne

```
Jesteś w repozytorium Next.js aplikacji regulskibehawiorysta.pl.

ZADANIE: Znajdź wszystkie broken links — linki które prowadzą na nieistniejące strony.

1. Zbierz wszystkie wewnętrzne href z plików tsx/ts/mdx/js:
   grep -r "href=\"/" --include="*.tsx" --include="*.ts" --include="*.mdx" .
   
2. Dla każdego znalezionego href sprawdź czy odpowiadający plik/folder istnieje w app/:
   href="/konsultacja-behawioralna-online" → czy istnieje app/konsultacja-behawioralna-online/page.tsx?
   href="/oferta/poradniki-pdf/pies-zostaje-sam-plan-pierwszych-krokow" → czy istnieje?
   itd.

3. Wypisz listę:
   - DZIAŁA: [href] → [plik]
   - BROKEN: [href] → brak pliku app/...
   
4. Dla każdego BROKEN link zaproponuj jedno z:
   a) Zmień href na istniejącą stronę (np. /book zamiast /konsultacja-behawioralna-online)
   b) Usuń link jeśli jest zbędny
   c) Zaznacz "wymaga stworzenia strony" — podaj priorytet (wysoki/niski)

5. WDROŻENIE: Napraw wszystkie "łatwe" broken linki (przypadek a i b).
   Dla przypadku c — tylko raport.

6. Sprawdź też czy /blog/[slug] dla wszystkich slugów z listy na /blog naprawdę istnieje.
```

---

## DZIEŃ 13 — Testy end-to-end: cały booking flow

### PROMPT 13A — Napisz testy E2E dla krytycznych ścieżek

```
Jesteś w repozytorium Next.js aplikacji regulskibehawiorysta.pl.

ZADANIE: Napisz 5 testów dla najważniejszych user journeys.
Użyj Playwright (sprawdź czy jest w package.json) lub jeśli nie — opisz 
checklist testów ręcznych dla mnie (właściciela).

ŚCIEŻKI DO PRZETESTOWANIA:

TEST 1: Booking — Kwadrans standardowy
1. Wejdź na /
2. Kliknij "Zarezerwuj Kwadrans →"
3. Sprawdź że URL to /book, title to "Rezerwacja Kwadransa"
4. Formularz: wybierz "Kwadrans z behawiorystą / 69 zł"
5. Wypełnij: imię, email, gatunek: pies, opis, terminy
6. Zaznacz 3 checkboxy
7. Submit
8. Sprawdź: sukces message jest widoczny

TEST 2: Booking — Kwadrans na już
1. Wejdź na /book?service=kwadrans-na-juz
2. Sprawdź że formularz pre-wybrał "Kwadrans na już"
3. Sprawdź że pole terminów jest schowane/zastąpione
4. Sprawdź że subject maila zawierałby "PILNE"

TEST 3: Lead magnet
1. Wejdź na /bezplatne-materialy/pies-reaktywnosc-5-krokow
2. Wpisz email testowy
3. Kliknij "Pobierz bezpłatny przewodnik"
4. Sprawdź że pojawia się potwierdzenie

TEST 4: PDF order
1. Wejdź na /oferta/poradniki-pdf/pies-reaktywny-na-spacerze
2. Kliknij "Zamów" / formularz zakupu
3. Wypełnij email + imię
4. Submit
5. Sprawdź potwierdzenie

TEST 5: Cookie consent
1. Wejdź na / w trybie incognito
2. Sprawdź że banner cookie jest widoczny
3. Kliknij "Akceptuję"
4. Sprawdź że banner znika i GA jest załadowane
5. Odśwież stronę — sprawdź że banner nie wraca

Jeśli Playwright nie jest w projekcie — zamiast testów napisz mi dokładny 
CHECKLIST RĘCZNY który przeprowadzę w przeglądarce.
```

---

## DZIEŃ 14 — Deploy, GSC, monitoring

### PROMPT 14A — Production readiness checklist

```
Jesteś w repozytorium Next.js aplikacji regulskibehawiorysta.pl.

ZADANIE: Ostateczny przegląd przed zgłoszeniem strony do Google.
Sprawdź punkt po punkcie i raportuj STATUS każdego.

CHECKLIST:

BLOKERY SPRZEDAŻY:
[ ] Komunikat "brak terminów" — nie istnieje w żadnym pliku tsx
[ ] Jeden email wszędzie: kontakt@regulskibehawiorysta.pl
[ ] Fake telefon "500 600 700" — nie istnieje nigdzie
[ ] Booking form wysyła mail do właściciela ← sprawdź API route
[ ] "Kwadrans na już" działa i wysyła z prefiksem PILNE

LEGAL:
[ ] Regulamin pełnej konsultacji — brak "TODO przed publikacją" i "NIP/REGON: brak"
[ ] Cookie banner — wyświetla się przy pierwszej wizycie
[ ] GA nie ładuje się bez zgody

SEO:
[ ] robots.txt — Allow: * (brak Disallow: /)
[ ] sitemap.xml — dostępna pod /sitemap.xml
[ ] OG image — istnieje i renderuje się w debug.iframely.com lub og-playground

TRUST:
[ ] Opinie mają strukturę name/city/pet (nawet z placeholderami)
[ ] Gwarancja zwrotu — widoczna na /book i /cennik
[ ] Schema.org LocalBusiness — w source code /

NAWIGACJA:
[ ] Wszystkie strony: ten sam header i footer
[ ] /niezbednik — pokazuje produkty PDF
[ ] /psy — 6 kategorii linkuje na strony (nie na /book)

Dla każdego punktu odpowiedz: ✅ OK / ❌ FAIL + co konkretnie nie działa.

Następnie napraw wszystkie ❌ FAIL jeśli to proste (< 15 min na punkt).
Dla złożonych — wypisz jako "DO FOLLOW-UP".
```

---

### PROMPT 14B — Finalne: zrób build i sprawdź błędy

```
Jesteś w repozytorium Next.js aplikacji regulskibehawiorysta.pl.

ZADANIE: Uruchom build i napraw wszystkie błędy kompilacji.

1. Uruchom: npm run build (lub yarn build)

2. Zbierz wszystkie błędy i ostrzeżenia z outputu.

3. Napraw WSZYSTKIE:
   - TypeScript errors (type mismatch, missing props, itd.)
   - ESLint errors (nie ostrzeżenia — tylko errors)
   - Broken imports (moduły które nie istnieją)
   - Missing required props w komponentach

4. NIE naprawiaj ostrzeżeń ESLint (tylko errors).
   NIE zmieniaj logiki biznesowej żeby "obejść" błąd.

5. Po naprawieniu — uruchom build ponownie.
   Raport: "Build przeszedł ✅" lub "Pozostałe błędy: [lista]"

6. Jeśli build przechodzi — uruchom: npm run start (prod server)
   i sprawdź ręcznie 5 kluczowych URL-i:
   - / (home)
   - /psy
   - /book?service=kwadrans-na-juz
   - /niezbednik
   - /sitemap.xml
   
   Każdy powinien zwrócić 200, nie 404 ani 500.

Po tym kroku jesteś gotowy do deploy'u i zgłoszenia do Google Search Console.
```

---

## Instrukcja dla właściciela po każdym dniu

Po każdym prompt — wyślij mi:
1. **Co Codex zrobił** (krótki opis)
2. **Screenshoty lub URL-e** do sprawdzenia
3. **Ewentualne błędy** z konsoli/buildu

Ja sprawdzę i dam zielone światło do następnego promptu.

**Kolejność bezwzględna** — nie skacz do dnia 4 jeśli dzień 1 nie jest ✅.

---

## Quick wins poza Codex (Ty ręcznie, nie Codex)

Te rzeczy zrób sam, nie potrzebują kodu:

- [ ] **Google Search Console** — dodaj własność strony, wgraj sitemap po dniu 4
- [ ] **Uzupełnij NIP/REGON** w regulaminie (po uzyskaniu, edytuj przez CMS/bezpośrednio)
- [ ] **5 prawdziwych opinii** — zbierz od znajomych/pierwszych klientów, wklej po dniu 7
- [ ] **Wideo 60s** — nagraj selfie phone, wgraj jako /branding/hero-video.mp4
- [ ] **Outreach do weterynarzy** — 10 maili, nie potrzeba kodu
- [ ] **IG 3x/tydz** — reels o konkretnych problemach, CTA w bio
- [ ] **Meta Ads** — kampania na lead magnet, 30 zł/dzień (po dniu 5, gdy banner cookie działa)
```
