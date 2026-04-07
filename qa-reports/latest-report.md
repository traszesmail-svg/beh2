# Raport QA Live Clickthrough

- Data: 2026-04-07 10:19:04 Europe/Warsaw
- URL: https://coapebehawiorysta.vercel.app
- Wynik ogĂłlny: PASS
- Kroki zaliczone: 19/19
- Liczba zebranych issue z runtime: 0
- Booking QA identity: QA LIVE 20260407-101904 / qa-live-20260407-101904@example.com
- Bezpiecznik pĹ‚atnoĹ›ci: bez realnej pĹ‚atnoĹ›ci PayU i bez faĹ‚szywego approve na produkcji; test manual zakoĹ„czony reject w adminie

## Kroki
### PASSED - Home
- Start URL: about:blank
- End URL: https://coapebehawiorysta.vercel.app/
- Note: Hero i 3 wejĹ›cia sÄ… widoczne na stronie gĹ‚Ăłwnej.

### PASSED - Hero CTA x3
- Start URL: https://coapebehawiorysta.vercel.app/
- End URL: https://coapebehawiorysta.vercel.app/kontakt
- Note: Mam psa -> /book
- Note: Mam kota -> /koty
- Note: Nie wiem, od czego zaczĂ„â€¦Ă„â€ˇ -> /kontakt

### PASSED - /koty
- Start URL: https://coapebehawiorysta.vercel.app/kontakt
- End URL: https://coapebehawiorysta.vercel.app/koty
- Note: Strona kotow pokazuje 5 kategorii z obrazami.

### PASSED - /book
- Start URL: https://coapebehawiorysta.vercel.app/koty
- End URL: https://coapebehawiorysta.vercel.app/book
- Note: Wejscie do book dziala i pokazuje tylko psie tematy.

### PASSED - /slot
- Start URL: https://coapebehawiorysta.vercel.app/book
- End URL: https://coapebehawiorysta.vercel.app/slot?problem=kot-stres
- Note: Pierwszy slot: 11:40

### PASSED - /form
- Start URL: https://coapebehawiorysta.vercel.app/slot?problem=kot-stres
- End URL: https://coapebehawiorysta.vercel.app/payment?bookingId=630e75dc-72a8-45af-8c24-c2125b1fccd0&access=FjlFJaypBG11tDn5t5azyOsUhncgOD2i
- Note: Formularz przeszedl do payment.

### PASSED - /koty -> slot / 30 min
- Start URL: https://coapebehawiorysta.vercel.app/payment?bookingId=630e75dc-72a8-45af-8c24-c2125b1fccd0&access=FjlFJaypBG11tDn5t5azyOsUhncgOD2i
- End URL: https://coapebehawiorysta.vercel.app/slot?problem=kot-kuweta&service=konsultacja-30-min
- Note: Kocia sciezka 30 min zachowuje service=konsultacja-30-min.

### PASSED - /payment
- Start URL: https://coapebehawiorysta.vercel.app/slot?problem=kot-kuweta&service=konsultacja-30-min
- End URL: https://coapebehawiorysta.vercel.app/payment?bookingId=630e75dc-72a8-45af-8c24-c2125b1fccd0&access=FjlFJaypBG11tDn5t5azyOsUhncgOD2i
- Note: manualVisible=true
- Note: payuVisible=false

### PASSED - manual payment -> pending
- Start URL: https://coapebehawiorysta.vercel.app/payment?bookingId=630e75dc-72a8-45af-8c24-c2125b1fccd0&access=FjlFJaypBG11tDn5t5azyOsUhncgOD2i
- End URL: https://coapebehawiorysta.vercel.app/confirmation?bookingId=630e75dc-72a8-45af-8c24-c2125b1fccd0&manual=reported&access=FjlFJaypBG11tDn5t5azyOsUhncgOD2i&adminNotice=failed
- Note: POST /api/payments/manual zwrocil canonical redirectTo i potwierdzenie pokazalo pending manual review.
- Note: Rezerwacja przeszĹ‚a do pending manual review.

### PASSED - admin reject
- Start URL: https://coapebehawiorysta.vercel.app/confirmation?bookingId=630e75dc-72a8-45af-8c24-c2125b1fccd0&manual=reported&access=FjlFJaypBG11tDn5t5azyOsUhncgOD2i&adminNotice=failed
- End URL: https://coapebehawiorysta.vercel.app/confirmation?bookingId=630e75dc-72a8-45af-8c24-c2125b1fccd0&manual=reported&access=FjlFJaypBG11tDn5t5azyOsUhncgOD2i&adminNotice=failed
- Note: Admin odrzuciĹ‚ testowÄ… wpĹ‚atÄ™ QA.

### PASSED - /confirmation
- Start URL: https://coapebehawiorysta.vercel.app/confirmation?bookingId=630e75dc-72a8-45af-8c24-c2125b1fccd0&manual=reported&access=FjlFJaypBG11tDn5t5azyOsUhncgOD2i&adminNotice=failed
- End URL: https://coapebehawiorysta.vercel.app/confirmation?bookingId=630e75dc-72a8-45af-8c24-c2125b1fccd0&manual=reported&access=FjlFJaypBG11tDn5t5azyOsUhncgOD2i&adminNotice=failed
- Note: Confirmation pokazuje stan odrzuconej wpĹ‚aty.

### PASSED - /oferta
- Start URL: https://coapebehawiorysta.vercel.app/confirmation?bookingId=630e75dc-72a8-45af-8c24-c2125b1fccd0&manual=reported&access=FjlFJaypBG11tDn5t5azyOsUhncgOD2i&adminNotice=failed
- End URL: https://coapebehawiorysta.vercel.app/oferta
- Note: Pierwsza karta ma 1 gĹ‚Ăłwne CTA: true

### PASSED - oferta -> payment / 30 min CTA
- Start URL: https://coapebehawiorysta.vercel.app/oferta
- End URL: https://coapebehawiorysta.vercel.app/payment?bookingId=5ea281e5-0c4b-48e9-ac77-5221983fc199&access=WaDVEqdFpZP3E3jHNaUtFqr7kuAIMK6f&service=konsultacja-30-min
- Note: /oferta -> /book z service=konsultacja-30-min
- Note: /book -> /slot z problem=separacja
- Note: /slot -> /form z service=konsultacja-30-min
- Note: /form -> /payment z service=konsultacja-30-min
- Note: manualVisible=true
- Note: payuVisible=false

### PASSED - oferta -> slot / online CTA
- Start URL: https://coapebehawiorysta.vercel.app/payment?bookingId=5ea281e5-0c4b-48e9-ac77-5221983fc199&access=WaDVEqdFpZP3E3jHNaUtFqr7kuAIMK6f&service=konsultacja-30-min
- End URL: https://coapebehawiorysta.vercel.app/slot?problem=separacja&service=konsultacja-behawioralna-online
- Note: Online CTA prowadzi do /slot z dostepnymi godzinami.

### PASSED - detail page 1
- Start URL: https://coapebehawiorysta.vercel.app/slot?problem=separacja&service=konsultacja-behawioralna-online
- End URL: https://coapebehawiorysta.vercel.app/oferta/konsultacja-30-min
- Note: Konsultacja 30 min ma skrĂłcony ukĹ‚ad i 2 CTA.

### PASSED - detail page 2
- Start URL: https://coapebehawiorysta.vercel.app/oferta/konsultacja-30-min
- End URL: https://coapebehawiorysta.vercel.app/oferta/pobyty-socjalizacyjno-terapeutyczne
- Note: Pobyty pozostajÄ… opcjÄ… dalszÄ…, nie zimnym pierwszym krokiem.

### PASSED - /kontakt
- Start URL: https://coapebehawiorysta.vercel.app/oferta/pobyty-socjalizacyjno-terapeutyczne
- End URL: https://coapebehawiorysta.vercel.app/kontakt
- Note: Kontakt jest skrĂłcony do akcji i krĂłtkiej toĹĽsamoĹ›ci.

### PASSED - /regulamin
- Start URL: https://coapebehawiorysta.vercel.app/kontakt
- End URL: https://coapebehawiorysta.vercel.app/regulamin
- Note: Regulamin uĹĽywa nowego shellu prawnego bez publicznego telefonu i starego menu.

### PASSED - /polityka-prywatnosci
- Start URL: https://coapebehawiorysta.vercel.app/regulamin
- End URL: https://coapebehawiorysta.vercel.app/polityka-prywatnosci
- Note: Polityka prywatnoĹ›ci uĹĽywa nowego shellu prawnego bez publicznego telefonu i starego menu.

## Mobile
### 360px x 800px
- heroClear=true
- cardsReadable=true
- bottomAreaLean=true
- ctaEasyToTap=true
- layoutStable=true
- Note: decisionBlockVisibleSoon=true
- Note: homeCardsReadable=true
- Note: bookCardsReadable=true
- Note: offerCardsReadable=true
- Note: homeLean=true
- Note: bookLean=true
- Note: kontaktLean=true
- Note: ofertaLean=true

### 375px x 812px
- heroClear=true
- cardsReadable=true
- bottomAreaLean=true
- ctaEasyToTap=true
- layoutStable=true
- Note: decisionBlockVisibleSoon=true
- Note: homeCardsReadable=true
- Note: bookCardsReadable=true
- Note: offerCardsReadable=true
- Note: homeLean=true
- Note: bookLean=true
- Note: kontaktLean=true
- Note: ofertaLean=true

### 390px x 844px
- heroClear=true
- cardsReadable=true
- bottomAreaLean=true
- ctaEasyToTap=true
- layoutStable=true
- Note: decisionBlockVisibleSoon=true
- Note: homeCardsReadable=true
- Note: bookCardsReadable=true
- Note: offerCardsReadable=true
- Note: homeLean=true
- Note: bookLean=true
- Note: kontaktLean=true
- Note: ofertaLean=true

### 430px x 932px
- heroClear=true
- cardsReadable=true
- bottomAreaLean=true
- ctaEasyToTap=true
- layoutStable=true
- Note: decisionBlockVisibleSoon=true
- Note: homeCardsReadable=true
- Note: bookCardsReadable=true
- Note: offerCardsReadable=true
- Note: homeLean=true
- Note: bookLean=true
- Note: kontaktLean=true
- Note: ofertaLean=true

## Runtime issues
- Brak zebranych bĹ‚Ä™dĂłw konsoli, pageerrorĂłw i same-origin request failures/HTTP >= 400.
