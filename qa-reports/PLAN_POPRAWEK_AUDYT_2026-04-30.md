# Plan poprawek po audycie

Data: 2026-04-30  
Zakres: publiczne strony `regulskibehawiorysta.pl`, flow rezerwacji, copy, SEO i techniczne porzadki po audycie.

## Ocena uwag z audytu

### 1. Niespójne ceny i zakres usług
- **Czescowo trafne.**
- Same kwoty sa juz spójne w kodzie i na aktualnym deployu: `69 / 99 / 169 / 470`.
- Trafna jest natomiast uwaga o rozjechanym **zakresie Kwadransu**: w publicznym copy nadal pojawia sie diagnoza i PDF w miejscach, gdzie Kwadrans powinien byc tylko pierwszym krokiem.

### 2. Kwadrans jako pierwszy krok vs diagnoza + PDF
- **Trafne.**
- To jest realna niespojnosc produktu i copy.
- Najpierw trzeba ujednolicic publiczna obietnice dla Kwadransu, a potem przepiac te same tresci w `book`, `cennik`, home, FAQ i helperach ofertowych.

### 3. Za duzo CTA i sciezek naraz
- **Trafne jako uwaga UX.**
- To nie jest awaria techniczna, ale rzeczywiscie utrudnia szybki wybor osobie zestresowanej problemem psa albo kota.
- Najbardziej sensowny kierunek to prostszy wybor: jeden pierwszy krok i jeden wyrazny wariant dla spraw zlozonych.

### 4. Polskie znaki i literowki
- **Trafne.**
- W repo nadal sa realne artefakty mojibake i mieszane teksty w publicznym copy, mailach i helperach.
- To nie jest pojedynczy blad, tylko rozlana do naprawy warstwa tekstowa.

### 5. Widoczne honeypoty
- **Raczej nie trafne jako bug wizualny.**
- Obecnie pola antyspamowe sa schowane offscreen i oznaczone `aria-hidden`.
- Warto je tylko zweryfikowac pod accessibility i czy nie wyplywaja w zadnym kanale mailowym / debugowym.

### 6. Title tagi, schema, sitemap, robots
- **Czescowo trafne jako audyt, ale nie jako pilny bug.**
- `robots.txt`, `sitemap.ts` i schema sa juz w repo.
- Tu proponuje najpierw weryfikacje, a dopiero potem ewentualne poprawki.

## Plan prac

### Etap 1. Ujednolicic prawde o ofercie
Pliki:
- `lib/offers.ts`
- `lib/public-offer-copy.ts`
- `lib/public-offer-faq.ts`
- `components/BookRequestForm.tsx`
- `app/book/page.tsx`
- `app/cennik/page.tsx`
- `app/page.tsx`
- `app/oferta/page.tsx`
- `components/OfferCards.tsx`
- `components/FAQSection.tsx`

Cel:
- Jeden spójny opis Kwadransu.
- Jedna logika: `Kwadrans` jako pierwszy krok, `Kwadrans na juz` jako priorytet, `Dwa kwadranse` jako szerszy start, `Pelna konsultacja` jako format dla spraw zlozonych.
- Usunac rozjazd typu "Kwadrans = diagnoza + PDF" tam, gdzie to kłóci sie z reszta oferty.

Status:
- **Wykonane 2026-04-30** w publicznych powierzchniach opartych o `lib/offers.ts` i formularz rezerwacji. Kwadrans nie obiecuje juz diagnozy ani PDF.

### Etap 2. Wyczyscic copy z mojibake i zlamanych znakow
Pliki priorytetowe:
- `lib/blog.tsx`
- `lib/server/notifications.ts`
- `components/ContactLeadForm.tsx`
- `components/BookRequestForm.tsx`
- `components/MaterialyOrderForm.tsx`
- `components/ThemeToggle.tsx`
- `app/book/page.tsx`
- `app/cennik/page.tsx`
- `app/kontakt/page.tsx`
- `app/faq/page.tsx`
- `app/page.tsx`

Cel:
- Widoczne UI, formularze i maile maja pokazywac poprawny polski tekst.
- Usunac resztki `Ä`, `Ĺ`, `â` i podobnych z widocznych tresci.
- Po naprawie odpalic szybki `rg` na mojibake i sprawdzic, czy nie zostaly publiczne wycieki.

### Etap 3. Przyciac nadmiar CTA
Pliki:
- `app/page.tsx`
- `app/behawiorysta-online-polska/page.tsx`
- `app/cennik/page.tsx`
- `app/kontakt/page.tsx`
- `app/oferta/page.tsx`
- `app/psy/page.tsx`
- `app/koty/page.tsx`

Cel:
- Na starcie pokazac mniej rownorzednych decyzji.
- Gorny poziom: `Kwadrans` i `Pelna konsultacja` albo `Kwadrans` i `Niezbednik`, zaleznosc od strony.
- Reszte przeniesc nizej albo do blokow pomocniczych.

### Etap 4. Weryfikacja SEO technicznego
Pliki:
- `app/robots.ts`
- `app/sitemap.ts`
- `next-sitemap.config.js`
- `lib/schema.ts`
- `lib/seo.ts`
- `lib/seo.config.ts`

Cel:
- Potwierdzic canonicale, sitemap i indexability.
- Sprawdzic, czy title tagi sa opisowe i spójne.
- Nie przepisywac schema bez potrzeby, tylko uzupelnic tam, gdzie audyt albo live crawl pokazza realna luke.

### Etap 5. Formularze i UX techniczny
Pliki:
- `components/ContactLeadForm.tsx`
- `components/BookRequestForm.tsx`
- `components/MaterialyOrderForm.tsx`
- `components/SlotPicker.tsx`
- `components/NextSlot.tsx`

Cel:
- Potwierdzic, ze honeypoty sa niewidoczne i nie psuja UX.
- Uproscic teksty pomocnicze w kalendarzu i formularzach.
- Doprowadzic rezerwacje do bardziej ludzkiego i mniej technicznego brzmienia.

Status:
- **Wykonane 2026-04-30** w formularzach rezerwacji, kontaktu i materialow. Honeypoty sa ukryte, a teksty kalendarza i CTA sa uproszczone.

## Kolejnosc wdrozenia

1. Oferta i Kwadrans.
2. Mojibake i widoczny text cleanup.
3. CTA hierarchy.
4. SEO verification.
5. Formularze, honeypoty i dopieszczanie kalendarza.

## Kryteria akceptacji

- Brak rozjazdu miedzy homepage, cennikiem i rezerwacja w opisie Kwadransu.
- Brak widocznych znakow mojibake w publicznym UI i mailach.
- Mniej rownorzednych CTA na stronach startowych.
- `robots`, `sitemap` i schema potwierdzone na aktualnym deployu.
- Honeypoty ukryte technicznie, bez widocznego efektu dla uzytkownika.
