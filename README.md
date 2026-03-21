# Behawior15

Lekka aplikacja Next.js dla jednego specjalisty prowadzącego 15-minutowe konsultacje głosowe online.

## Co zawiera

- flow klienta: `problem -> slot -> form -> payment -> confirmation -> call`
- panel `/admin` z zarządzaniem ceną, terminami i podglądem rezerwacji
- materiały przed rozmową: MP4, link, notatki
- przypomnienia mailowe i flow maili przez Resend
- Stripe Checkout i Supabase jako tryb live
- lokalny fallback JSON do developmentu

## Wymagania

- Node.js 20+
- npm 10+

## Instalacja

```bash
npm install
```

## Zmienne środowiskowe

Skopiuj `.env.example` do `.env.local` i uzupełnij wartości.

Najważniejsze zmienne:

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

Pełna lista znajduje się w `.env.example`.

## Migracje SQL

Uruchom w Supabase:

- `supabase/2026-03-21_amount_numeric_and_reminder.sql`
- `supabase/migrations/20260321_pricing_settings.sql`
- `supabase/migrations/20260321_booking_preparation_materials.sql`

Pełniejsze notatki wdrożeniowe są w `LIVE_SETUP.md`.

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
```

## Build produkcyjny

```bash
npm run build
npm run start
```

## Deploy na Vercel

Nowy projekt Vercel powinien wskazywać root repo `/`.

Ustawienia:

- Framework Preset: `Next.js`
- Install Command: `npm ci`
- Build Command: `npm run build`
- Output Directory: domyślne dla Next.js

Po deployu sprawdź:

- `/admin` wymaga Basic Auth
- w `/admin` widoczny jest marker builda `CLEAN_START_REPO_V1`
- sekcja ceny konsultacji działa

## Główne moduły

- `app/admin/page.tsx`
- `components/AdminPricingManager.tsx`
- `components/PreparationMaterialsCard.tsx`
- `app/api/admin/pricing/route.ts`
- `app/api/bookings/[id]/prep/route.ts`
- `app/api/cron/reminders/route.ts`
- `lib/server/db.ts`
- `lib/server/stripe.ts`
