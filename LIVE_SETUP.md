# Live setup - Behawior 15

## 1. Cena konsultacji
Aktywna cena dla nowych rezerwacji jest przechowywana w warstwie danych:
- lokalnie: runtime plik `data/pricing-settings.json`, tworzony automatycznie tylko w trybie local
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
- `RESEND_FROM_EMAIL` jako techniczny adres nadawcy
- opcjonalnie `BEHAVIOR15_CONTACT_EMAIL` jesli chcesz nadpisac publiczny adres kontaktowy
- opcjonalnie `BEHAVIOR15_CONTACT_PHONE`

Domyslny publiczny adres kontaktowy w aplikacji:
- `coapebehawiorysta@gmail.com`

## 4. Reminder 1h przed konsultacja
Scheduler nie korzysta juz z Vercel Cron.
Run remindera jest wykonywany przez Supabase `pg_cron + pg_net`, ktore wywoluje chroniony endpoint aplikacji:
- `GET/POST /api/reminders/run`

Po stronie aplikacji ustaw:
- `CRON_SECRET`

Po stronie Supabase uruchom dodatkowo:
- `supabase/migrations/20260321_supabase_reminder_scheduler.sql`
- `supabase/behavior15_reminder_scheduler_setup.sql`

Setup SQL tworzy dwa sekrety w Supabase Vault:
- `behavior15_app_url`
- `behavior15_cron_secret`

Nastepnie aktywuje job:
- `behavior15-booking-reminders`

Manualny smoke trigger:
- `POST /api/reminders/run`
- `Authorization: Bearer <CRON_SECRET>`

## 5. Admin
Ustaw:
- `ADMIN_ACCESS_SECRET`

Login w basic auth:
- `admin`
- haslo = `ADMIN_ACCESS_SECRET`
