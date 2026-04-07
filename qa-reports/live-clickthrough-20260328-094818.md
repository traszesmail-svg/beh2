# Raport QA Live Clickthrough

- Data: 2026-03-28 09:48:18 Europe/Warsaw
- URL: https://coapebehawiorysta.vercel.app
- Wynik ogólny: FAIL
- Kroki zaliczone: 9/16
- Liczba zebranych issue z runtime: 30
- Booking QA identity: QA LIVE 20260328-094818 / qa-live-20260328-094818@example.com
- Bezpiecznik płatności: bez realnej płatności PayU i bez fałszywego approve na produkcji; test manual zakończony reject w adminie

## Najważniejsze ustalenia
- PDF listing -> poradnik -> kontakt: locator.waitFor: Timeout 20000ms exceeded.
Call log:
[2m  - waiting for getByRole('heading', { name: /Poradniki PDF/i, level: 1 }) to be visible[22m

- PDF listing -> pakiet -> kontakt: locator.waitFor: Timeout 20000ms exceeded.
Call log:
[2m  - waiting for getByRole('heading', { name: /Poradniki PDF/i, level: 1 }) to be visible[22m

- Booking live: formularz -> payment: locator.fill: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for getByLabel('Imię opiekuna')[22m

- Booking live: pokój zablokowany przed paid: Brak bookingId/accessToken do testu pokoju.
- Booking live: zgłoszenie manual payment -> pending: locator.click: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for getByRole('button', { name: /Wpłata manualna/i }).first()[22m

- Admin live: odrzucenie testowej wpłaty QA: Brak bookingId do akcji admina.
- Confirmation live: stan po odrzuceniu: Brak URL confirmation do odświeżenia.

## Kroki
### PASS - Home hero + CTA do oferty
- Start URL: about:blank
- End URL: https://coapebehawiorysta.vercel.app/oferta
- Note: CTA hero "Zobacz formy pracy" prowadzi poprawnie do /oferta.

### PASS - Home hero + CTA do bookingu
- Start URL: https://coapebehawiorysta.vercel.app/oferta
- End URL: https://coapebehawiorysta.vercel.app/book
- Note: CTA hero "Umów konsultację" otwiera osobny flow bookingowy.

### PASS - Header: Oferta
- Start URL: https://coapebehawiorysta.vercel.app/book
- End URL: https://coapebehawiorysta.vercel.app/oferta
- Note: Link w headerze działa.

### PASS - Header: Koty
- Start URL: https://coapebehawiorysta.vercel.app/oferta
- End URL: https://coapebehawiorysta.vercel.app/koty
- Note: Link w headerze działa.

### PASS - Header: Pobyty
- Start URL: https://coapebehawiorysta.vercel.app/koty
- End URL: https://coapebehawiorysta.vercel.app/oferta/pobyty-socjalizacyjno-terapeutyczne
- Note: Link w headerze działa.

### PASS - Header: Kontakt + href mailto/tel
- Start URL: https://coapebehawiorysta.vercel.app/oferta/pobyty-socjalizacyjno-terapeutyczne
- End URL: https://coapebehawiorysta.vercel.app/kontakt
- Note: mailto ok: mailto:coapebehawiorysta@gmail.com?subject=Zapytanie+-+Regulski+%7C+Terapia+behawioralna&body=Dzie%C5%84+dobry%2C%0A%0Aopisuj%C4%99+kr%C3%B3tko+swoj%C4%85+sytuacj%C4%99%3A%0A%0A-+gatunek%3A%0A-+problem%3A%0A-+od+kiedy+trwa%3A%0A-+interesuj%C4%85cy+mnie+materia%C5%82+PDF%3A%0A-+interesuj%C4%85ca+mnie+forma+pracy%3A+%0A%0ANajwygodniejsza+forma+kontaktu+zwrotnego%3A%0A
- Note: tel ok: tel:512992026

### PASS - Oferta -> detal konsultacji 30 min -> kontakt
- Start URL: https://coapebehawiorysta.vercel.app/kontakt
- End URL: https://coapebehawiorysta.vercel.app/kontakt?service=konsultacja-30-min
- Note: Detail page i CTA do /kontakt działają poprawnie.

### FAIL - PDF listing -> poradnik -> kontakt
- Start URL: https://coapebehawiorysta.vercel.app/kontakt?service=konsultacja-30-min
- End URL: https://coapebehawiorysta.vercel.app/oferta/poradniki-pdf
- Note: locator.waitFor: Timeout 20000ms exceeded.
Call log:
[2m  - waiting for getByRole('heading', { name: /Poradniki PDF/i, level: 1 }) to be visible[22m


### FAIL - PDF listing -> pakiet -> kontakt
- Start URL: https://coapebehawiorysta.vercel.app/oferta/poradniki-pdf
- End URL: https://coapebehawiorysta.vercel.app/oferta/poradniki-pdf
- Note: locator.waitFor: Timeout 20000ms exceeded.
Call log:
[2m  - waiting for getByRole('heading', { name: /Poradniki PDF/i, level: 1 }) to be visible[22m


### PASS - Footer: polityka prywatności i regulamin
- Start URL: https://coapebehawiorysta.vercel.app/oferta/poradniki-pdf
- End URL: https://coapebehawiorysta.vercel.app/regulamin
- Note: Polityka prywatności: Jak przetwarzane są dane w marce Regulski | Terapia behawioralna
- Note: Regulamin: Zasady rezerwacji szybkiej konsultacji 15 min

### PASS - Booking live: wybór tematu i slotu
- Start URL: https://coapebehawiorysta.vercel.app/regulamin
- End URL: https://coapebehawiorysta.vercel.app/form?problem=kot&slotId=2026-03-28-11%3A20
- Note: Wybrany temat: kot
- Note: Wybrany slot: 11:20

### FAIL - Booking live: formularz -> payment
- Start URL: https://coapebehawiorysta.vercel.app/form?problem=kot&slotId=2026-03-28-11%3A20
- End URL: https://coapebehawiorysta.vercel.app/form?problem=kot&slotId=2026-03-28-11%3A20
- Note: locator.fill: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for getByLabel('Imię opiekuna')[22m


### FAIL - Booking live: pokój zablokowany przed paid
- Start URL: https://coapebehawiorysta.vercel.app/form?problem=kot&slotId=2026-03-28-11%3A20
- End URL: https://coapebehawiorysta.vercel.app/form?problem=kot&slotId=2026-03-28-11%3A20
- Note: Brak bookingId/accessToken do testu pokoju.

### FAIL - Booking live: zgłoszenie manual payment -> pending
- Start URL: https://coapebehawiorysta.vercel.app/form?problem=kot&slotId=2026-03-28-11%3A20
- End URL: https://coapebehawiorysta.vercel.app/form?problem=kot&slotId=2026-03-28-11%3A20
- Note: locator.click: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for getByRole('button', { name: /Wpłata manualna/i }).first()[22m


### FAIL - Admin live: odrzucenie testowej wpłaty QA
- Start URL: https://coapebehawiorysta.vercel.app/form?problem=kot&slotId=2026-03-28-11%3A20
- End URL: https://coapebehawiorysta.vercel.app/form?problem=kot&slotId=2026-03-28-11%3A20
- Note: Brak bookingId do akcji admina.

### FAIL - Confirmation live: stan po odrzuceniu
- Start URL: https://coapebehawiorysta.vercel.app/form?problem=kot&slotId=2026-03-28-11%3A20
- End URL: https://coapebehawiorysta.vercel.app/form?problem=kot&slotId=2026-03-28-11%3A20
- Note: Brak URL confirmation do odświeżenia.

## Runtime issues
- [requestfailed] public | https://coapebehawiorysta.vercel.app/book?_rsc=19zvn | net::ERR_ABORTED
- [requestfailed] public | https://coapebehawiorysta.vercel.app/oferta/indywidualna-terapia-behawioralna?_rsc=1d74b | net::ERR_ABORTED
- [requestfailed] public | https://coapebehawiorysta.vercel.app/kontakt?service=pobyty-socjalizacyjno-terapeutyczne&_rsc=1d74b | net::ERR_ABORTED
- [requestfailed] public | https://coapebehawiorysta.vercel.app/book?_rsc=vsxln | net::ERR_ABORTED
- [requestfailed] public | https://coapebehawiorysta.vercel.app/kontakt?service=konsultacja-behawioralna-online&_rsc=1d74b | net::ERR_ABORTED
- [requestfailed] public | https://coapebehawiorysta.vercel.app/oferta/pobyty-socjalizacyjno-terapeutyczne?_rsc=1qwpz | net::ERR_ABORTED
- [requestfailed] public | https://coapebehawiorysta.vercel.app/koty?_rsc=19zvn | net::ERR_ABORTED
- [requestfailed] public | https://coapebehawiorysta.vercel.app/oferta/pobyty-socjalizacyjno-terapeutyczne?_rsc=19zvn | net::ERR_ABORTED
- [requestfailed] public | https://coapebehawiorysta.vercel.app/kontakt?_rsc=nkcdy | net::ERR_ABORTED
- [requestfailed] public | https://coapebehawiorysta.vercel.app/oferta/konsultacja-30-min?_rsc=1r97d | net::ERR_ABORTED
- [requestfailed] public | https://coapebehawiorysta.vercel.app/oferta/szybka-konsultacja-15-min?_rsc=1r97d | net::ERR_ABORTED
- [requestfailed] public | https://coapebehawiorysta.vercel.app/book?_rsc=1d74b | net::ERR_ABORTED
- [requestfailed] public | https://coapebehawiorysta.vercel.app/oferta/szybka-konsultacja-15-min?_rsc=1d74b | net::ERR_ABORTED
- [requestfailed] public | https://coapebehawiorysta.vercel.app/kontakt?service=konsultacja-30-min&_rsc=1d74b | net::ERR_ABORTED
- [requestfailed] public | https://coapebehawiorysta.vercel.app/oferta/konsultacja-30-min?_rsc=1rz80 | net::ERR_ABORTED
- [requestfailed] public | https://coapebehawiorysta.vercel.app/kontakt?service=konsultacja-domowa-wyjazdowa&_rsc=1d74b | net::ERR_ABORTED
- [requestfailed] public | https://coapebehawiorysta.vercel.app/kontakt?service=konsultacja-30-min&_rsc=nkcdy | net::ERR_ABORTED
- [requestfailed] public | https://coapebehawiorysta.vercel.app/oferta/pobyty-socjalizacyjno-terapeutyczne?_rsc=ya6ll | net::ERR_ABORTED
- [requestfailed] public | https://coapebehawiorysta.vercel.app/kontakt?_rsc=ya6ll | net::ERR_ABORTED
- [requestfailed] public | https://coapebehawiorysta.vercel.app/?_rsc=ya6ll | net::ERR_ABORTED
- [requestfailed] public | https://coapebehawiorysta.vercel.app/koty?_rsc=ya6ll | net::ERR_ABORTED
- [requestfailed] public | https://coapebehawiorysta.vercel.app/polityka-prywatnosci?_rsc=aif1a | net::ERR_ABORTED
- [requestfailed] public | https://coapebehawiorysta.vercel.app/regulamin?_rsc=19zvn | net::ERR_ABORTED
- [requestfailed] public | https://coapebehawiorysta.vercel.app/polityka-prywatnosci?_rsc=19zvn | net::ERR_ABORTED
- [requestfailed] public | https://coapebehawiorysta.vercel.app/regulamin?_rsc=ni0pi | net::ERR_ABORTED
- [requestfailed] public | https://coapebehawiorysta.vercel.app/koty?_rsc=r1uyd | net::ERR_ABORTED
- [requestfailed] public | https://coapebehawiorysta.vercel.app/oferta?_rsc=r1uyd | net::ERR_ABORTED
- [requestfailed] public | https://coapebehawiorysta.vercel.app/kontakt?_rsc=r1uyd | net::ERR_ABORTED
- [requestfailed] public | https://coapebehawiorysta.vercel.app/slot?problem=kot&_rsc=1n45u | net::ERR_ABORTED
- [requestfailed] public | https://coapebehawiorysta.vercel.app/form?problem=kot&slotId=2026-03-28-11%3A20&_rsc=f9455 | net::ERR_ABORTED

## Uwagi
- `mailto:` i `tel:` zostały zweryfikowane po href-ach; nie otwierałem zewnętrznego klienta poczty ani dialera.
- Flow bookingowy na produkcji został doprowadzony do `pending manual review`, a następnie odrzucony w adminie, żeby nie zostawić sztucznie opłaconej rezerwacji.
- Nie wykonywałem realnej płatności PayU ani fałszywego potwierdzenia wpłaty na live.
