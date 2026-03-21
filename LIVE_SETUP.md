# Live setup - Behawior 15

## 1. Cena konsultacji
Aktywna cena dla nowych rezerwacji jest przechowywana w warstwie danych:
- lokalnie: `data/pricing-settings.json`
- live: tabela `public.pricing_settings`

Zmiana ceny odbywa sie z panelu `/admin`. Istniejace bookingi zachowuja swoja historyczna kwote.

## 2. SQL do uruchomienia w Supabase
Uruchom plik:

`supabase/2026-03-21_amount_numeric_and_reminder.sql`

oraz:

`supabase/migrations/20260321_pricing_settings.sql`

Zawiera:
- zmiane `bookings.amount` na `numeric(10,2)`
- dodanie `bookings.reminder_sent`
- dodanie `public.pricing_settings`

## 3. Email
Aby dzialaly maile:
- `RESEND_API_KEY`
- opcjonalnie `RESEND_FROM_EMAIL`
- opcjonalnie `BEHAVIOR15_CONTACT_EMAIL`
- opcjonalnie `BEHAVIOR15_CONTACT_PHONE`

## 4. Reminder 1h przed konsultacja
Vercel cron jest zdefiniowany w `vercel.json`.
Dla produkcji ustaw dodatkowo:
- `CRON_SECRET`

Cron wywoluje:
- `GET/POST /api/cron/reminders`

Naglowek autoryzacji:
- `Authorization: Bearer <CRON_SECRET>`

## 5. Admin
Ustaw:
- `ADMIN_ACCESS_SECRET`

Login w basic auth:
- `admin`
- haslo = `ADMIN_ACCESS_SECRET`
