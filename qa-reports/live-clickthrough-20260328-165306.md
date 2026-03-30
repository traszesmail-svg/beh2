# Raport QA Live Clickthrough

- Data: 2026-03-28 16:53:06 Europe/Warsaw
- URL: https://beh2.vercel.app
- Wynik ogólny: FAIL
- Kroki zaliczone: 15/16
- Liczba zebranych issue z runtime: 9
- Booking QA identity: QA LIVE 20260328-165306 / qa-live-20260328-165306@example.com
- Bezpiecznik płatności: bez realnej płatności PayU i bez fałszywego approve na produkcji; test manual zakończony reject w adminie

## Najważniejsze ustalenia
- Confirmation live: stan po odrzuceniu: locator.waitFor: Timeout 20000ms exceeded.
Call log:
[2m  - waiting for getByRole('heading', { name: /Nie znaleziono wpłaty do tej rezerwacji/i, level: 1 }) to be visible[22m


## Kroki
### PASS - Home hero + CTA do oferty
- Start URL: about:blank
- End URL: https://beh2.vercel.app/oferta
- Note: CTA hero "Zobacz formy pracy" prowadzi poprawnie do /oferta.

### PASS - Home hero + CTA do bookingu
- Start URL: https://beh2.vercel.app/oferta
- End URL: https://beh2.vercel.app/book
- Note: CTA hero "Umów konsultację" otwiera osobny flow bookingowy.

### PASS - Header: Oferta
- Start URL: https://beh2.vercel.app/book
- End URL: https://beh2.vercel.app/oferta
- Note: Link w headerze działa.

### PASS - Header: Koty
- Start URL: https://beh2.vercel.app/oferta
- End URL: https://beh2.vercel.app/koty
- Note: Link w headerze działa.

### PASS - Header: Pobyty
- Start URL: https://beh2.vercel.app/koty
- End URL: https://beh2.vercel.app/oferta/pobyty-socjalizacyjno-terapeutyczne
- Note: Link w headerze działa.

### PASS - Header: Kontakt + href mailto/tel
- Start URL: https://beh2.vercel.app/oferta/pobyty-socjalizacyjno-terapeutyczne
- End URL: https://beh2.vercel.app/kontakt
- Note: mailto ok: mailto:coapebehawiorysta@gmail.com?subject=Zapytanie+-+Regulski+%7C+Terapia+behawioralna&body=Dzie%C5%84+dobry%2C%0A%0Aopisuj%C4%99+kr%C3%B3tko+swoj%C4%85+sytuacj%C4%99%3A%0A%0A-+gatunek%3A%0A-+problem%3A%0A-+od+kiedy+trwa%3A%0A-+interesuj%C4%85cy+mnie+materia%C5%82+PDF%3A%0A-+interesuj%C4%85ca+mnie+forma+pracy%3A+%0A%0ANajwygodniejsza+forma+kontaktu+zwrotnego%3A%0A
- Note: tel ok: tel:512992026

### PASS - Oferta -> detal konsultacji 30 min -> kontakt
- Start URL: https://beh2.vercel.app/kontakt
- End URL: https://beh2.vercel.app/kontakt?service=konsultacja-30-min
- Note: Detail page i CTA do /kontakt działają poprawnie.

### PASS - PDF listing -> poradnik -> kontakt
- Start URL: https://beh2.vercel.app/kontakt?service=konsultacja-30-min
- End URL: https://beh2.vercel.app/kontakt?service=poradniki-pdf&guide=pies-zostaje-sam-plan-pierwszych-krokow
- Note: Poradnik: Pies zostaje sam (/oferta/poradniki-pdf/pies-zostaje-sam-plan-pierwszych-krokow)

### PASS - PDF listing -> pakiet -> kontakt
- Start URL: https://beh2.vercel.app/kontakt?service=poradniki-pdf&guide=pies-zostaje-sam-plan-pierwszych-krokow
- End URL: https://beh2.vercel.app/kontakt?service=poradniki-pdf&bundle=pakiet-startowy-psa
- Note: Pakiet: Pakiet Startowy Psa (/oferta/poradniki-pdf/pakiety/pakiet-startowy-psa)

### PASS - Footer: polityka prywatności i regulamin
- Start URL: https://beh2.vercel.app/kontakt?service=poradniki-pdf&bundle=pakiet-startowy-psa
- End URL: https://beh2.vercel.app/regulamin
- Note: Polityka prywatności: Jak przetwarzane są dane w marce Regulski | Terapia behawioralna
- Note: Regulamin: Zasady rezerwacji szybkiej konsultacji 15 min

### PASS - Booking live: wybór tematu i slotu
- Start URL: https://beh2.vercel.app/regulamin
- End URL: https://beh2.vercel.app/form?problem=kot&slotId=2026-03-29-11%3A00
- Note: Wybrany temat: kot
- Note: Wybrany slot: 11:00

### PASS - Booking live: formularz -> payment
- Start URL: https://beh2.vercel.app/form?problem=kot&slotId=2026-03-29-11%3A00
- End URL: https://beh2.vercel.app/payment?bookingId=dd545c9f-f577-45ce-a287-401ddade7c55&access=zLR-C-r7ht1HkkFPdzyUUtRZIE2It9xH
- Note: manualVisible=true
- Note: payuVisible=true

### PASS - Booking live: pokój zablokowany przed paid
- Start URL: https://beh2.vercel.app/payment?bookingId=dd545c9f-f577-45ce-a287-401ddade7c55&access=zLR-C-r7ht1HkkFPdzyUUtRZIE2It9xH
- End URL: https://beh2.vercel.app/payment?bookingId=dd545c9f-f577-45ce-a287-401ddade7c55&access=zLR-C-r7ht1HkkFPdzyUUtRZIE2It9xH
- Note: Pokój nie wpuszcza przed statusem paid.

### PASS - Booking live: zgłoszenie manual payment -> pending
- Start URL: https://beh2.vercel.app/payment?bookingId=dd545c9f-f577-45ce-a287-401ddade7c55&access=zLR-C-r7ht1HkkFPdzyUUtRZIE2It9xH
- End URL: https://beh2.vercel.app/confirmation?bookingId=dd545c9f-f577-45ce-a287-401ddade7c55&manual=reported&access=zLR-C-r7ht1HkkFPdzyUUtRZIE2It9xH
- Note: Rezerwacja przeszła do pending manual review.

### PASS - Admin live: odrzucenie testowej wpłaty QA
- Start URL: https://beh2.vercel.app/confirmation?bookingId=dd545c9f-f577-45ce-a287-401ddade7c55&manual=reported&access=zLR-C-r7ht1HkkFPdzyUUtRZIE2It9xH
- End URL: https://beh2.vercel.app/confirmation?bookingId=dd545c9f-f577-45ce-a287-401ddade7c55&manual=reported&access=zLR-C-r7ht1HkkFPdzyUUtRZIE2It9xH
- Note: Testowa wpłata została odrzucona zamiast potwierdzenia, żeby nie zostawić sztucznie opłaconej rezerwacji.

### FAIL - Confirmation live: stan po odrzuceniu
- Start URL: https://beh2.vercel.app/confirmation?bookingId=dd545c9f-f577-45ce-a287-401ddade7c55&manual=reported&access=zLR-C-r7ht1HkkFPdzyUUtRZIE2It9xH
- End URL: https://beh2.vercel.app/confirmation?bookingId=dd545c9f-f577-45ce-a287-401ddade7c55&manual=reported&access=zLR-C-r7ht1HkkFPdzyUUtRZIE2It9xH
- Note: locator.waitFor: Timeout 20000ms exceeded.
Call log:
[2m  - waiting for getByRole('heading', { name: /Nie znaleziono wpłaty do tej rezerwacji/i, level: 1 }) to be visible[22m


## Runtime issues
- [requestfailed] public | https://beh2.vercel.app/_next/image?url=%2Fbranding%2Fspecialist-krzysztof-wide.jpg&w=640&q=75 | net::ERR_ABORTED
- [console] public | https://beh2.vercel.app/oferta/poradniki-pdf | Failed to fetch RSC payload for https://beh2.vercel.app/oferta/poradniki-pdf/kot-stres-srodowisko-i-bledy-opiekuna. Falling back to browser navigation. TypeError: Failed to fetch at f (https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:45433) at https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:58959 at Object.u [as task] (https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:31834) at c.s (https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:32539) at Object.u [as task] (https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:31896)
- [console] public | https://beh2.vercel.app/oferta/poradniki-pdf | Failed to fetch RSC payload for https://beh2.vercel.app/kontakt?service=poradniki-pdf&guide=kot-stres-srodowisko-i-bledy-opiekuna. Falling back to browser navigation. TypeError: Failed to fetch at f (https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:45433) at https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:58959 at Object.u [as task] (https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:31834) at c.s (https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:32539) at Object.u [as task] (https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:31896)
- [console] public | https://beh2.vercel.app/oferta/poradniki-pdf | Failed to fetch RSC payload for https://beh2.vercel.app/oferta/poradniki-pdf/kot-i-kuweta-pierwszy-plan-dzialania. Falling back to browser navigation. TypeError: Failed to fetch at f (https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:45433) at https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:58959 at Object.u [as task] (https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:31834) at c.s (https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:32539) at Object.u [as task] (https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:31896)
- [console] public | https://beh2.vercel.app/kontakt?service=poradniki-pdf&guide=pies-zostaje-sam-plan-pierwszych-krokow | Failed to fetch RSC payload for https://beh2.vercel.app/oferta/konsultacja-domowa-wyjazdowa. Falling back to browser navigation. TypeError: Failed to fetch at f (https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:45433) at https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:58959 at Object.u [as task] (https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:31834) at c.s (https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:32539) at c.enqueue (https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:31964) at s (https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:58922) at i (https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:58462) at a (https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:65251) at f (https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:75111) at Object.action (https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:2:7082)
- [console] public | https://beh2.vercel.app/kontakt?service=poradniki-pdf&guide=pies-zostaje-sam-plan-pierwszych-krokow | Failed to fetch RSC payload for https://beh2.vercel.app/oferta/szybka-konsultacja-15-min. Falling back to browser navigation. TypeError: Failed to fetch at f (https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:45433) at https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:58959 at Object.u [as task] (https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:31834) at c.s (https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:32539) at c.enqueue (https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:31964) at s (https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:58922) at i (https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:58462) at a (https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:65251) at f (https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:75111) at Object.action (https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:2:7082)
- [console] public | https://beh2.vercel.app/kontakt?service=poradniki-pdf&guide=pies-zostaje-sam-plan-pierwszych-krokow | Failed to fetch RSC payload for https://beh2.vercel.app/oferta/poradniki-pdf. Falling back to browser navigation. TypeError: Failed to fetch at f (https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:45433) at https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:58959 at Object.u [as task] (https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:31834) at c.s (https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:32539) at Object.u [as task] (https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:31896)
- [console] public | https://beh2.vercel.app/kontakt?service=poradniki-pdf&guide=pies-zostaje-sam-plan-pierwszych-krokow | Failed to fetch RSC payload for https://beh2.vercel.app/oferta/konsultacja-behawioralna-online. Falling back to browser navigation. TypeError: Failed to fetch at f (https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:45433) at https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:58959 at Object.u [as task] (https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:31834) at c.s (https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:32539) at c.enqueue (https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:31964) at s (https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:58922) at i (https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:58462) at a (https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:65251) at f (https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:75111) at Object.action (https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:2:7082)
- [console] public | https://beh2.vercel.app/kontakt?service=poradniki-pdf&guide=pies-zostaje-sam-plan-pierwszych-krokow | Failed to fetch RSC payload for https://beh2.vercel.app/oferta/konsultacja-30-min. Falling back to browser navigation. TypeError: Failed to fetch at f (https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:45433) at https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:58959 at Object.u [as task] (https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:31834) at c.s (https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:32539) at c.enqueue (https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:31964) at s (https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:58922) at i (https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:58462) at a (https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:65251) at f (https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:75111) at Object.action (https://beh2.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:2:7082)

## Uwagi
- `mailto:` i `tel:` zostały zweryfikowane po href-ach; nie otwierałem zewnętrznego klienta poczty ani dialera.
- Flow bookingowy na produkcji został doprowadzony do `pending manual review`, a następnie odrzucony w adminie, żeby nie zostawić sztucznie opłaconej rezerwacji.
- Nie wykonywałem realnej płatności PayU ani fałszywego potwierdzenia wpłaty na live.
