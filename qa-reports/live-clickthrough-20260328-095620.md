# Raport QA Live Clickthrough

- Data: 2026-03-28 09:56:20 Europe/Warsaw
- URL: https://coapebehawiorysta.vercel.app
- Wynik ogólny: PASS
- Kroki zaliczone: 16/16
- Liczba zebranych issue z runtime: 8
- Booking QA identity: QA LIVE 20260328-095620 / qa-live-20260328-095620@example.com
- Bezpiecznik płatności: bez realnej płatności PayU i bez fałszywego approve na produkcji; test manual zakończony reject w adminie

## Najważniejsze ustalenia
- Brak krytycznych błędów w przeklikanej ścieżce live przy zachowanym bezpiecznym wariancie bez fałszywego potwierdzania płatności.

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
- End URL: https://coapebehawiorysta.vercel.app/form?problem=kot&slotId=2026-03-28-11%3A40
- Note: Wybrany temat: kot
- Note: Wybrany slot: 11:40

### PASS - Booking live: formularz -> payment
- Start URL: https://coapebehawiorysta.vercel.app/form?problem=kot&slotId=2026-03-28-11%3A40
- End URL: https://coapebehawiorysta.vercel.app/payment?bookingId=3b945195-00de-4e08-8d8a-071de61271f1&access=0kqScc3P3a39bjD0aRRf9DpU0ie4cpQO
- Note: manualVisible=true
- Note: payuVisible=true

### PASS - Booking live: pokój zablokowany przed paid
- Start URL: https://coapebehawiorysta.vercel.app/payment?bookingId=3b945195-00de-4e08-8d8a-071de61271f1&access=0kqScc3P3a39bjD0aRRf9DpU0ie4cpQO
- End URL: https://coapebehawiorysta.vercel.app/payment?bookingId=3b945195-00de-4e08-8d8a-071de61271f1&access=0kqScc3P3a39bjD0aRRf9DpU0ie4cpQO
- Note: Pokój nie wpuszcza przed statusem paid.

### PASS - Booking live: zgłoszenie manual payment -> pending
- Start URL: https://coapebehawiorysta.vercel.app/payment?bookingId=3b945195-00de-4e08-8d8a-071de61271f1&access=0kqScc3P3a39bjD0aRRf9DpU0ie4cpQO
- End URL: https://coapebehawiorysta.vercel.app/confirmation?bookingId=3b945195-00de-4e08-8d8a-071de61271f1&manual=reported&access=0kqScc3P3a39bjD0aRRf9DpU0ie4cpQO
- Note: Rezerwacja przeszła do pending manual review.

### PASS - Admin live: odrzucenie testowej wpłaty QA
- Start URL: https://coapebehawiorysta.vercel.app/confirmation?bookingId=3b945195-00de-4e08-8d8a-071de61271f1&manual=reported&access=0kqScc3P3a39bjD0aRRf9DpU0ie4cpQO
- End URL: https://coapebehawiorysta.vercel.app/confirmation?bookingId=3b945195-00de-4e08-8d8a-071de61271f1&manual=reported&access=0kqScc3P3a39bjD0aRRf9DpU0ie4cpQO
- Note: Testowa wpłata została odrzucona zamiast potwierdzenia, żeby nie zostawić sztucznie opłaconej rezerwacji.

### PASS - Confirmation live: stan po odrzuceniu
- Start URL: https://coapebehawiorysta.vercel.app/confirmation?bookingId=3b945195-00de-4e08-8d8a-071de61271f1&manual=reported&access=0kqScc3P3a39bjD0aRRf9DpU0ie4cpQO
- End URL: https://coapebehawiorysta.vercel.app/confirmation?bookingId=3b945195-00de-4e08-8d8a-071de61271f1&manual=reported&access=0kqScc3P3a39bjD0aRRf9DpU0ie4cpQO
- Note: Publiczny ekran poprawnie pokazuje stan odrzuconej wpłaty.

## Runtime issues
- [console] public | https://coapebehawiorysta.vercel.app/oferta | Failed to fetch RSC payload for https://coapebehawiorysta.vercel.app/kontakt?service=konsultacja-domowa-wyjazdowa. Falling back to browser navigation. TypeError: Failed to fetch at f (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:45433) at https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:58959 at Object.u [as task] (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:31834) at c.s (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:32539) at Object.u [as task] (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:31896)
- [console] public | https://coapebehawiorysta.vercel.app/oferta | Failed to fetch RSC payload for https://coapebehawiorysta.vercel.app/kontakt?service=pobyty-socjalizacyjno-terapeutyczne. Falling back to browser navigation. TypeError: Failed to fetch at f (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:45433) at https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:58959 at Object.u [as task] (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:31834) at c.s (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:32539) at Object.u [as task] (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:31896)
- [console] public | https://coapebehawiorysta.vercel.app/oferta | Failed to fetch RSC payload for https://coapebehawiorysta.vercel.app/kontakt?service=indywidualna-terapia-behawioralna. Falling back to browser navigation. TypeError: Failed to fetch at f (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:45433) at https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:58959 at Object.u [as task] (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:31834) at c.s (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:32539) at Object.u [as task] (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:31896)
- [console] public | https://coapebehawiorysta.vercel.app/oferta | Failed to fetch RSC payload for https://coapebehawiorysta.vercel.app/oferta/indywidualna-terapia-behawioralna. Falling back to browser navigation. TypeError: Failed to fetch at f (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:45433) at https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:58959 at Object.u [as task] (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:31834) at c.s (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:32539) at Object.u [as task] (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:31896)
- [console] public | https://coapebehawiorysta.vercel.app/kontakt?service=poradniki-pdf&guide=pies-zostaje-sam-plan-pierwszych-krokow | Failed to fetch RSC payload for https://coapebehawiorysta.vercel.app/oferta/konsultacja-domowa-wyjazdowa. Falling back to browser navigation. TypeError: Failed to fetch at f (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:45433) at https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:58959 at Object.u [as task] (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:31834) at c.s (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:32539) at c.enqueue (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:31964) at s (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:58922) at i (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:58462) at a (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:65251) at f (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:75111) at Object.action (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:2:7082)
- [console] public | https://coapebehawiorysta.vercel.app/kontakt?service=poradniki-pdf&guide=pies-zostaje-sam-plan-pierwszych-krokow | Failed to fetch RSC payload for https://coapebehawiorysta.vercel.app/oferta/konsultacja-30-min. Falling back to browser navigation. TypeError: Failed to fetch at f (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:45433) at https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:58959 at Object.u [as task] (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:31834) at c.s (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:32539) at c.enqueue (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:31964) at s (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:58922) at i (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:58462) at a (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:65251) at f (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:75111) at Object.action (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:2:7082)
- [console] public | https://coapebehawiorysta.vercel.app/kontakt?service=poradniki-pdf&guide=pies-zostaje-sam-plan-pierwszych-krokow | Failed to fetch RSC payload for https://coapebehawiorysta.vercel.app/oferta/szybka-konsultacja-15-min. Falling back to browser navigation. TypeError: Failed to fetch at f (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:45433) at https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:58959 at Object.u [as task] (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:31834) at c.s (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:32539) at c.enqueue (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:31964) at s (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:58922) at i (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:58462) at a (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:65251) at f (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:75111) at Object.action (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:2:7082)
- [console] public | https://coapebehawiorysta.vercel.app/kontakt?service=poradniki-pdf&guide=pies-zostaje-sam-plan-pierwszych-krokow | Failed to fetch RSC payload for https://coapebehawiorysta.vercel.app/oferta/konsultacja-behawioralna-online. Falling back to browser navigation. TypeError: Failed to fetch at f (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:45433) at https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:58959 at Object.u [as task] (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:31834) at c.s (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:32539) at c.enqueue (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:31964) at s (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:58922) at i (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:58462) at a (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:65251) at f (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:1:75111) at Object.action (https://coapebehawiorysta.vercel.app/_next/static/chunks/117-c1d9400e3fd5a933.js:2:7082)

## Uwagi
- `mailto:` i `tel:` zostały zweryfikowane po href-ach; nie otwierałem zewnętrznego klienta poczty ani dialera.
- Flow bookingowy na produkcji został doprowadzony do `pending manual review`, a następnie odrzucony w adminie, żeby nie zostawić sztucznie opłaconej rezerwacji.
- Nie wykonywałem realnej płatności PayU ani fałszywego potwierdzenia wpłaty na live.
