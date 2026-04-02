# Raport QA Live Clickthrough

- Data: 2026-03-31 11:37:50 Europe/Warsaw
- URL: https://beh2.vercel.app
- Wynik ogólny: FAIL
- Kroki zaliczone: 16/17
- Liczba zebranych issue z runtime: 0
- Booking QA identity: QA LIVE 20260331-113750 / qa-live-20260331-113750@example.com
- Bezpiecznik płatności: bez realnej płatności PayU i bez fałszywego approve na produkcji; test manual zakończony reject w adminie

## Najważniejsze ustalenia
- Footer: polityka prywatności i regulamin: locator.waitFor: Timeout 20000ms exceeded.
Call log:
[2m  - waiting for getByRole('heading', { name: /Regulski\s+\|\s+Terapia behawioralna/i, level: 1 }) to be visible[22m


## Kroki
### PASS - Home hero + CTA do wyboru pierwszego kroku
- Start URL: about:blank
- End URL: https://beh2.vercel.app/#pierwszy-krok
- Note: CTA hero "Dobierz pierwszy krok" przewija poprawnie do sekcji wyboru.

### PASS - Home hero + CTA do bookingu
- Start URL: https://beh2.vercel.app/#pierwszy-krok
- End URL: https://beh2.vercel.app/book
- Note: CTA hero "Umów 15 min" otwiera osobną ścieżkę rezerwacji.

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

### PASS - Deep routes usług: bezpośrednie wejścia do detali i kontaktu
- Start URL: https://beh2.vercel.app/kontakt
- End URL: https://beh2.vercel.app/kontakt?service=pobyty-socjalizacyjno-terapeutyczne
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
- Start URL: https://beh2.vercel.app/kontakt?service=pobyty-socjalizacyjno-terapeutyczne
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

### FAIL - Footer: polityka prywatności i regulamin
- Start URL: https://beh2.vercel.app/kontakt?service=poradniki-pdf&bundle=pakiet-startowy-psa
- End URL: https://beh2.vercel.app/
- Note: locator.waitFor: Timeout 20000ms exceeded.
Call log:
[2m  - waiting for getByRole('heading', { name: /Regulski\s+\|\s+Terapia behawioralna/i, level: 1 }) to be visible[22m


### PASS - Booking live: wybór tematu i slotu
- Start URL: https://beh2.vercel.app/
- End URL: https://beh2.vercel.app/form?problem=kot&slotId=2026-03-31-18%3A00
- Note: Wybrany temat: kot
- Note: Wybrany slot: 18:00

### PASS - Booking live: formularz -> payment
- Start URL: https://beh2.vercel.app/form?problem=kot&slotId=2026-03-31-18%3A00
- End URL: https://beh2.vercel.app/payment?bookingId=1d53bb07-cd66-4006-bf43-d266db8f9f00&access=6fzGtGmA4aaAK2PokTUMzMIEWe6j5suH
- Note: manualVisible=true
- Note: payuVisible=true

### PASS - Booking live: pokój zablokowany przed paid
- Start URL: https://beh2.vercel.app/payment?bookingId=1d53bb07-cd66-4006-bf43-d266db8f9f00&access=6fzGtGmA4aaAK2PokTUMzMIEWe6j5suH
- End URL: https://beh2.vercel.app/payment?bookingId=1d53bb07-cd66-4006-bf43-d266db8f9f00&access=6fzGtGmA4aaAK2PokTUMzMIEWe6j5suH
- Note: Pokój nie wpuszcza przed statusem paid.

### PASS - Booking live: zgłoszenie manual payment -> pending
- Start URL: https://beh2.vercel.app/payment?bookingId=1d53bb07-cd66-4006-bf43-d266db8f9f00&access=6fzGtGmA4aaAK2PokTUMzMIEWe6j5suH
- End URL: https://beh2.vercel.app/confirmation?bookingId=1d53bb07-cd66-4006-bf43-d266db8f9f00&manual=reported&access=6fzGtGmA4aaAK2PokTUMzMIEWe6j5suH
- Note: Rezerwacja przeszła do pending manual review.

### PASS - Admin live: odrzucenie testowej wpłaty QA
- Start URL: https://beh2.vercel.app/confirmation?bookingId=1d53bb07-cd66-4006-bf43-d266db8f9f00&manual=reported&access=6fzGtGmA4aaAK2PokTUMzMIEWe6j5suH
- End URL: https://beh2.vercel.app/confirmation?bookingId=1d53bb07-cd66-4006-bf43-d266db8f9f00&manual=reported&access=6fzGtGmA4aaAK2PokTUMzMIEWe6j5suH
- Note: Testowa wpłata została odrzucona zamiast potwierdzenia, żeby nie zostawić sztucznie opłaconej rezerwacji.

### PASS - Confirmation live: stan po odrzuceniu
- Start URL: https://beh2.vercel.app/confirmation?bookingId=1d53bb07-cd66-4006-bf43-d266db8f9f00&manual=reported&access=6fzGtGmA4aaAK2PokTUMzMIEWe6j5suH
- End URL: https://beh2.vercel.app/confirmation?bookingId=1d53bb07-cd66-4006-bf43-d266db8f9f00&manual=reported&access=6fzGtGmA4aaAK2PokTUMzMIEWe6j5suH
- Note: Publiczny ekran poprawnie pokazuje stan odrzuconej wpłaty.

## Runtime issues
- Brak zebranych błędów konsoli, pageerrorów i same-origin request failures/HTTP >= 400.

## Uwagi
- `mailto:` i `tel:` zostały zweryfikowane po href-ach; nie otwierałem zewnętrznego klienta poczty ani dialera.
- Ścieżka rezerwacji na produkcji została doprowadzona do `pending manual review`, a następnie odrzucona w adminie, żeby nie zostawić sztucznie opłaconej rezerwacji.
- Nie wykonywałem realnej płatności PayU ani fałszywego potwierdzenia wpłaty na live.
