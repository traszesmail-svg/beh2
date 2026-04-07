# Raport QA Live Clickthrough

- Data: 2026-03-31 22:02:13 Europe/Warsaw
- URL: https://coapebehawiorysta.vercel.app
- Wynik ogólny: FAIL
- Kroki zaliczone: 14/17
- Liczba zebranych issue z runtime: 0
- Booking QA identity: QA LIVE 20260331-220213 / qa-live-20260331-220213@example.com
- Bezpiecznik płatności: bez realnej płatności PayU i bez fałszywego approve na produkcji; test manual zakończony reject w adminie

## Najważniejsze ustalenia
- Booking live: zgłoszenie manual payment -> pending: page.waitForResponse: Timeout 60000ms exceeded while waiting for event "response"
- Admin live: odrzucenie testowej wpłaty QA: locator.waitFor: Timeout 60000ms exceeded.
Call log:
[2m  - waiting for locator('.booking-row').filter({ hasText: 'qa-live-20260331-220213@example.com' }).first().getByRole('button', { name: /Odrzuć wpłatę/i }) to be visible[22m

- Confirmation live: stan po odrzuceniu: Brak URL confirmation do odświeżenia.

## Kroki
### PASS - Home hero + CTA do wyboru pierwszego kroku
- Start URL: about:blank
- End URL: https://coapebehawiorysta.vercel.app/#pierwszy-krok
- Note: CTA hero "Dobierz pierwszy krok" przewija poprawnie do sekcji wyboru.

### PASS - Home szybki wybór psa -> booking
- Start URL: https://coapebehawiorysta.vercel.app/#pierwszy-krok
- End URL: https://coapebehawiorysta.vercel.app/book
- Note: Szybki wybór "Mam psa" otwiera ścieżkę rezerwacji.

### PASS - Header: Oferta
- Start URL: https://coapebehawiorysta.vercel.app/book
- End URL: https://coapebehawiorysta.vercel.app/oferta
- Note: Link w headerze działa.

### PASS - Header: Koty ukryte
- Start URL: https://coapebehawiorysta.vercel.app/oferta
- End URL: https://coapebehawiorysta.vercel.app/
- Note: Link "Koty" nie jest już pokazywany w głównym pasku.

### PASS - Header: Pobyty ukryte
- Start URL: https://coapebehawiorysta.vercel.app/
- End URL: https://coapebehawiorysta.vercel.app/
- Note: Link "Pobyty" nie jest już pokazywany w głównym pasku.

### PASS - Header: Kontakt + href mailto
- Start URL: https://coapebehawiorysta.vercel.app/
- End URL: https://coapebehawiorysta.vercel.app/kontakt
- Note: mailto ok: mailto:coapebehawiorysta@gmail.com?subject=Zapytanie+-+Regulski+%7C+Terapia+behawioralna&body=Dzie%C5%84+dobry%2C%0A%0Aopisuj%C4%99+kr%C3%B3tko+swoj%C4%85+sytuacj%C4%99%3A%0A%0A-+gatunek%3A%0A-+problem%3A%0A-+od+kiedy+trwa%3A%0A-+interesuj%C4%85cy+mnie+materia%C5%82+PDF%3A%0A-+chc%C4%99+zacz%C4%85%C4%87+od%3A+%0A%0ANajwygodniejsza+forma+kontaktu+zwrotnego%3A%0A
- Note: brak publicznego tel: ok

### PASS - Deep routes usług: bezpośrednie wejścia do detali i kontaktu
- Start URL: https://coapebehawiorysta.vercel.app/kontakt
- End URL: https://coapebehawiorysta.vercel.app/kontakt?service=pobyty-socjalizacyjno-terapeutyczne
- Note: detail ok: /oferta/szybka-konsultacja-15-min
- Note: detail ok: /oferta/konsultacja-30-min
- Note: contact ok: /kontakt?service=konsultacja-30-min
- Note: detail ok: /oferta/konsultacja-behawioralna-online
- Note: contact ok: /kontakt?service=konsultacja-behawioralna-online
- Note: detail ok: /oferta/konsultacja-domowa-wyjazdowa
- Note: contact ok: /kontakt?service=konsultacja-domowa-wyjazdowa
- Note: detail ok: /oferta/indywidualna-terapia-behawioralna
- Note: contact ok: /kontakt?service=indywidualna-terapia-behawioralna
- Note: detail ok: /oferta/pobyty-socjalizacyjno-terapeutyczne
- Note: contact ok: /kontakt?service=pobyty-socjalizacyjno-terapeutyczne

### PASS - Oferta -> detal konsultacji 30 min -> kontakt
- Start URL: https://coapebehawiorysta.vercel.app/kontakt?service=pobyty-socjalizacyjno-terapeutyczne
- End URL: https://coapebehawiorysta.vercel.app/kontakt?service=konsultacja-30-min
- Note: Detail page i CTA do /kontakt działają poprawnie.

### PASS - PDF listing -> poradnik -> kontakt
- Start URL: https://coapebehawiorysta.vercel.app/kontakt?service=konsultacja-30-min
- End URL: https://coapebehawiorysta.vercel.app/kontakt?service=poradniki-pdf&guide=pies-zostaje-sam-plan-pierwszych-krokow
- Note: Poradnik: Pies zostaje sam (/oferta/poradniki-pdf/pies-zostaje-sam-plan-pierwszych-krokow)

### PASS - PDF listing -> pakiet -> kontakt
- Start URL: https://coapebehawiorysta.vercel.app/kontakt?service=poradniki-pdf&guide=pies-zostaje-sam-plan-pierwszych-krokow
- End URL: https://coapebehawiorysta.vercel.app/kontakt?service=poradniki-pdf&bundle=pakiet-startowy-psa
- Note: Pakiet: Pakiet Startowy Psa (/oferta/poradniki-pdf/pakiety/pakiet-startowy-psa)

### PASS - Footer: polityka prywatności i regulamin
- Start URL: https://coapebehawiorysta.vercel.app/kontakt?service=poradniki-pdf&bundle=pakiet-startowy-psa
- End URL: https://coapebehawiorysta.vercel.app/regulamin
- Note: Polityka prywatności: Jak przetwarzane są dane w marce Regulski | Terapia behawioralna
- Note: Regulamin: Zasady rezerwacji szybkiej konsultacji 15 min

### PASS - Booking live: wybór tematu i slotu
- Start URL: https://coapebehawiorysta.vercel.app/regulamin
- End URL: https://coapebehawiorysta.vercel.app/form?problem=kot&slotId=2026-04-01-09%3A00
- Note: Wybrany temat: kot
- Note: Wybrany slot: 09:00

### PASS - Booking live: formularz -> payment
- Start URL: https://coapebehawiorysta.vercel.app/form?problem=kot&slotId=2026-04-01-09%3A00
- End URL: https://coapebehawiorysta.vercel.app/payment?bookingId=04b2d8a0-09df-47a4-b9fe-6d340de0cacc&access=2WUM7dMmC42u5m2g6wzOeN665etwNgA4
- Note: manualVisible=true
- Note: payuVisible=true

### PASS - Booking live: pokój zablokowany przed paid
- Start URL: https://coapebehawiorysta.vercel.app/payment?bookingId=04b2d8a0-09df-47a4-b9fe-6d340de0cacc&access=2WUM7dMmC42u5m2g6wzOeN665etwNgA4
- End URL: https://coapebehawiorysta.vercel.app/payment?bookingId=04b2d8a0-09df-47a4-b9fe-6d340de0cacc&access=2WUM7dMmC42u5m2g6wzOeN665etwNgA4
- Note: Pokój nie wpuszcza przed statusem paid.

### FAIL - Booking live: zgłoszenie manual payment -> pending
- Start URL: https://coapebehawiorysta.vercel.app/payment?bookingId=04b2d8a0-09df-47a4-b9fe-6d340de0cacc&access=2WUM7dMmC42u5m2g6wzOeN665etwNgA4
- End URL: https://coapebehawiorysta.vercel.app/payment?bookingId=04b2d8a0-09df-47a4-b9fe-6d340de0cacc&access=2WUM7dMmC42u5m2g6wzOeN665etwNgA4
- Note: page.waitForResponse: Timeout 60000ms exceeded while waiting for event "response"

### FAIL - Admin live: odrzucenie testowej wpłaty QA
- Start URL: https://coapebehawiorysta.vercel.app/payment?bookingId=04b2d8a0-09df-47a4-b9fe-6d340de0cacc&access=2WUM7dMmC42u5m2g6wzOeN665etwNgA4
- End URL: https://coapebehawiorysta.vercel.app/payment?bookingId=04b2d8a0-09df-47a4-b9fe-6d340de0cacc&access=2WUM7dMmC42u5m2g6wzOeN665etwNgA4
- Note: locator.waitFor: Timeout 60000ms exceeded.
Call log:
[2m  - waiting for locator('.booking-row').filter({ hasText: 'qa-live-20260331-220213@example.com' }).first().getByRole('button', { name: /Odrzuć wpłatę/i }) to be visible[22m


### FAIL - Confirmation live: stan po odrzuceniu
- Start URL: https://coapebehawiorysta.vercel.app/payment?bookingId=04b2d8a0-09df-47a4-b9fe-6d340de0cacc&access=2WUM7dMmC42u5m2g6wzOeN665etwNgA4
- End URL: https://coapebehawiorysta.vercel.app/payment?bookingId=04b2d8a0-09df-47a4-b9fe-6d340de0cacc&access=2WUM7dMmC42u5m2g6wzOeN665etwNgA4
- Note: Brak URL confirmation do odświeżenia.

## Runtime issues
- Brak zebranych błędów konsoli, pageerrorów i same-origin request failures/HTTP >= 400.

## Uwagi
- `mailto:` zostało zweryfikowane po href-ie; nie otwierałem zewnętrznego klienta poczty.
- Ścieżka rezerwacji na produkcji nie została doprowadzona do końca bezpiecznej sekwencji manual review/reject w tym przebiegu.
- Nie wykonywałem realnej płatności PayU ani fałszywego potwierdzenia wpłaty na live.
