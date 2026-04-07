# Raport QA Live Clickthrough

- Data: 2026-03-28 09:51:57 Europe/Warsaw
- URL: https://coapebehawiorysta.vercel.app
- Wynik ogólny: FAIL
- Kroki zaliczone: 13/16
- Liczba zebranych issue z runtime: 4
- Booking QA identity: QA LIVE 20260328-095157 / qa-live-20260328-095157@example.com
- Bezpiecznik płatności: bez realnej płatności PayU i bez fałszywego approve na produkcji; test manual zakończony reject w adminie

## Najważniejsze ustalenia
- Booking live: zgłoszenie manual payment -> pending: locator.click: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for getByRole('button', { name: /Wpłata manualna/i }).first()[22m

- Admin live: odrzucenie testowej wpłaty QA: locator.waitFor: Timeout 20000ms exceeded.
Call log:
[2m  - waiting for locator('.booking-row').filter({ hasText: 'qa-live-20260328-095157@example.com' }).first().getByRole('button', { name: /Odrzuć wpłatę/i }) to be visible[22m

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
- End URL: https://coapebehawiorysta.vercel.app/form?problem=kot&slotId=2026-03-28-11%3A20
- Note: Wybrany temat: kot
- Note: Wybrany slot: 11:20

### PASS - Booking live: formularz -> payment
- Start URL: https://coapebehawiorysta.vercel.app/form?problem=kot&slotId=2026-03-28-11%3A20
- End URL: https://coapebehawiorysta.vercel.app/payment?bookingId=43c9f4e3-a68d-454a-a9fc-f47c54ea03fb&access=ScVPV-JUxD0GXQnp06p8-EY32k5xkO0k
- Note: manualVisible=false
- Note: payuVisible=true

### PASS - Booking live: pokój zablokowany przed paid
- Start URL: https://coapebehawiorysta.vercel.app/payment?bookingId=43c9f4e3-a68d-454a-a9fc-f47c54ea03fb&access=ScVPV-JUxD0GXQnp06p8-EY32k5xkO0k
- End URL: https://coapebehawiorysta.vercel.app/payment?bookingId=43c9f4e3-a68d-454a-a9fc-f47c54ea03fb&access=ScVPV-JUxD0GXQnp06p8-EY32k5xkO0k
- Note: Pokój nie wpuszcza przed statusem paid.

### FAIL - Booking live: zgłoszenie manual payment -> pending
- Start URL: https://coapebehawiorysta.vercel.app/payment?bookingId=43c9f4e3-a68d-454a-a9fc-f47c54ea03fb&access=ScVPV-JUxD0GXQnp06p8-EY32k5xkO0k
- End URL: https://coapebehawiorysta.vercel.app/payment?bookingId=43c9f4e3-a68d-454a-a9fc-f47c54ea03fb&access=ScVPV-JUxD0GXQnp06p8-EY32k5xkO0k
- Note: locator.click: Timeout 30000ms exceeded.
Call log:
[2m  - waiting for getByRole('button', { name: /Wpłata manualna/i }).first()[22m


### FAIL - Admin live: odrzucenie testowej wpłaty QA
- Start URL: https://coapebehawiorysta.vercel.app/payment?bookingId=43c9f4e3-a68d-454a-a9fc-f47c54ea03fb&access=ScVPV-JUxD0GXQnp06p8-EY32k5xkO0k
- End URL: https://coapebehawiorysta.vercel.app/payment?bookingId=43c9f4e3-a68d-454a-a9fc-f47c54ea03fb&access=ScVPV-JUxD0GXQnp06p8-EY32k5xkO0k
- Note: locator.waitFor: Timeout 20000ms exceeded.
Call log:
[2m  - waiting for locator('.booking-row').filter({ hasText: 'qa-live-20260328-095157@example.com' }).first().getByRole('button', { name: /Odrzuć wpłatę/i }) to be visible[22m


### FAIL - Confirmation live: stan po odrzuceniu
- Start URL: https://coapebehawiorysta.vercel.app/payment?bookingId=43c9f4e3-a68d-454a-a9fc-f47c54ea03fb&access=ScVPV-JUxD0GXQnp06p8-EY32k5xkO0k
- End URL: https://coapebehawiorysta.vercel.app/payment?bookingId=43c9f4e3-a68d-454a-a9fc-f47c54ea03fb&access=ScVPV-JUxD0GXQnp06p8-EY32k5xkO0k
- Note: Brak URL confirmation do odświeżenia.

## Runtime issues
- [console] public | https://coapebehawiorysta.vercel.app/kontakt?service=poradniki-pdf&guide=pies-zostaje-sam-plan-pierwszych-krokow | Failed to fetch RSC payload for https://coapebehawiorysta.vercel.app/oferta/konsultacja-30-min. Falling back to browser navigation. TypeError: Failed to fetch at f (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:45433) at https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:58959 at Object.u [as task] (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:31834) at c.s (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:32539) at c.enqueue (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:31964) at s (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:58922) at i (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:58462) at a (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:65251) at f (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:75111) at Object.action (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:2:7082)
- [console] public | https://coapebehawiorysta.vercel.app/kontakt?service=poradniki-pdf&guide=pies-zostaje-sam-plan-pierwszych-krokow | Failed to fetch RSC payload for https://coapebehawiorysta.vercel.app/oferta/konsultacja-domowa-wyjazdowa. Falling back to browser navigation. TypeError: Failed to fetch at f (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:45433) at https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:58959 at Object.u [as task] (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:31834) at c.s (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:32539) at c.enqueue (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:31964) at s (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:58922) at i (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:58462) at a (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:65251) at f (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:75111) at Object.action (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:2:7082)
- [console] public | https://coapebehawiorysta.vercel.app/kontakt?service=poradniki-pdf&guide=pies-zostaje-sam-plan-pierwszych-krokow | Failed to fetch RSC payload for https://coapebehawiorysta.vercel.app/oferta/konsultacja-behawioralna-online. Falling back to browser navigation. TypeError: Failed to fetch at f (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:45433) at https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:58959 at Object.u [as task] (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:31834) at c.s (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:32539) at c.enqueue (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:31964) at s (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:58922) at i (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:58462) at a (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:65251) at f (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:75111) at Object.action (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:2:7082)
- [console] public | https://coapebehawiorysta.vercel.app/kontakt?service=poradniki-pdf&guide=pies-zostaje-sam-plan-pierwszych-krokow | Failed to fetch RSC payload for https://coapebehawiorysta.vercel.app/oferta/szybka-konsultacja-15-min. Falling back to browser navigation. TypeError: Failed to fetch at f (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:45433) at https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:58959 at Object.u [as task] (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:31834) at c.s (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:32539) at c.enqueue (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:31964) at s (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:58922) at i (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:58462) at a (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:65251) at f (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:75111) at Object.action (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:2:7082)

## Uwagi
- `mailto:` i `tel:` zostały zweryfikowane po href-ach; nie otwierałem zewnętrznego klienta poczty ani dialera.
- Flow bookingowy na produkcji nie został doprowadzony do końca bezpiecznej ścieżki manual review/reject w tym przebiegu.
- Nie wykonywałem realnej płatności PayU ani fałszywego potwierdzenia wpłaty na live.
