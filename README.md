# Behawior15

Lekka aplikacja Next.js dla jednego specjalisty prowadzacego 15-minutowe konsultacje glosowe online.

## Co zawiera

- flow klienta: `problem -> slot -> form -> payment -> confirmation -> call`
- panel `/admin` z zarzadzaniem cena, terminami i podgladem rezerwacji
- materialy przed rozmowa: MP4, link, notatki
- przypomnienia mailowe i flow maili przez Resend
- Stripe Checkout i Supabase jako tryb live
- lokalny fallback JSON do developmentu, ktory tworzy katalog `data/` runtime tylko wtedy, gdy pracujesz w trybie local

## Wymagania

- Node.js 20+
- npm 10+

## Instalacja

```bash
npm install
```

## Zmienne srodowiskowe

Skopiuj `.env.example` do `.env.local` i uzupelnij wartosci.

Najwazniejsze zmienne:

- `APP_DATA_MODE`
- `APP_PAYMENT_MODE`
- `NEXT_PUBLIC_APP_URL`
- `ADMIN_ACCESS_SECRET`
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `CRON_SECRET`

Uwaga:

- `SUPABASE_SERVICE_ROLE_KEY` musi byc prawdziwym kluczem service role (`sb_secret_...` albo legacy JWT z rola `service_role`).
- Klucz `sb_publishable_...` nie wystarczy do zapisu ceny, bookingow ani adminowych operacji.

Pelna lista znajduje sie w `.env.example`.

## Migracje SQL

Uruchom w Supabase:

- `supabase/2026-03-21_amount_numeric_and_reminder.sql`
- `supabase/migrations/20260321_pricing_settings.sql`
- `supabase/migrations/20260321_booking_preparation_materials.sql`
- `supabase/migrations/20260321_supabase_reminder_scheduler.sql`

Nastepnie wykonaj setup scheduler:

- `supabase/behavior15_reminder_scheduler_setup.sql`

Pelniejsze notatki wdrozeniowe sa w `LIVE_SETUP.md`.

## Lokalny start

```bash
npm run dev
```

## Testy i weryfikacja

```bash
npm run lint
npm test
npm run build
node --import tsx scripts/verify-flow.ts
node --import tsx scripts/pricing-smoke.ts
node --import tsx scripts/ui-smoke.ts
node --import tsx scripts/reminder-smoke.ts
```

## Build produkcyjny

```bash
npm run build
npm run start
```

## Deploy na Vercel Hobby

Nowy projekt Vercel powinien wskazywac root repo `/`.

Ustawienia:

- Framework Preset: `Next.js`
- Install Command: `npm ci`
- Build Command: `npm run build`
- Output Directory: domyslne dla Next.js

Wazne:

- `vercel.json` nie zawiera aktywnego Vercel Cron
- scheduler remindera dziala po stronie Supabase
- aplikacja wystawia chroniony endpoint `POST /api/reminders/run`

Po deployu sprawdz:

- `/admin` wymaga Basic Auth
- w `/admin` widoczny jest marker builda `CLEAN_START_REPO_V1`
- sekcja ceny konsultacji dziala
- job `behavior15-booking-reminders` istnieje po stronie Supabase

## Glowne moduly

- `app/admin/page.tsx`
- `components/AdminPricingManager.tsx`
- `components/PreparationMaterialsCard.tsx`
- `app/api/admin/pricing/route.ts`
- `app/api/bookings/[id]/prep/route.ts`
- `app/api/reminders/run/route.ts`
- `lib/server/db.ts`
- `lib/server/reminder-runner.ts`
- `lib/server/stripe.ts`
