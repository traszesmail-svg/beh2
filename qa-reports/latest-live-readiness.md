# Raport Go-Live Readiness

- Data: 2026-04-17 16:02:32 Europe/Warsaw
- Tryb: report-only
- Zrodlo env: default runtime env
- Wynik ogolny: READY
- Gotowe: 5/5
- Blockery: 0

## Checki
### GOTOWE - Warstwa danych
- Stan: ready
- Summary: Warstwa danych jest gotowa do ruchu live i korzysta z Supabase zamiast lokalnego fallbacku JSON.
- Next: Brak blokera po stronie runtime danych.

### GOTOWE - Publiczny URL
- Stan: ready
- Summary: Publiczny URL aplikacji jest gotowy do linków zwrotnych i maili: https://regulskibehawiorysta.pl (HTTP 200).
- Next: Brak blokera po stronie publicznego URL i jego dostępności HTTP.

### GOTOWE - Schema Supabase
- Stan: ready
- Summary: Canonical Supabase schema i rollout migrations są zsynchronizowane z aktualnym code path.
- Next: Brak blokera po stronie booking/payment/QA schema.

### GOTOWE - Maile klienta
- Stan: ready
- Summary: Wysyłka maili do klientów zewnętrznych jest gotowa z aktualnej konfiguracji Resend.
- Next: Brak blokera po stronie konfiguracji maili klienta.

### GOTOWE - PayU online
- Stan: ready
- Summary: PayU online jest świadomie wyłączone. Checkout działa przez wpłatę ręczną i potwierdzenie na stronie.
- Next: Możesz wystartować na płatności ręcznej. Po aktywacji produkcyjnego PayU ustaw PAYU_MODE=auto.

