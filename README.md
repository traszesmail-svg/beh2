# Behawior15

Lekka aplikacja Next.js dla jednego specjalisty prowadzacego 15-minutowe konsultacje glosowe online.

## Co zawiera

- flow klienta: `problem -> slot -> form -> payment -> confirmation -> call`
- panel `/admin` z zarzadzaniem cena, terminami i podgladem rezerwacji
- materialy przed rozmowa: MP4, link, notatki
- zintegrowany katalog poradnikow PDF trzymany w `content/guides/`
- przypomnienia mailowe i flow maili przez Resend albo Gmail SMTP
- manual review jako aktywny flow platnosci live, z PayU jako opcjonalna sciezka do ponownego wlaczenia oraz legacy Stripe/mock zachowanym do zgodnosci i QA
- kontrolowany test checkout QA z jawna flaga bookingu, env gate i allowlista kontaktow
- first-party funnel ledger oraz wewnetrzny KPI dashboard w `/admin`; GA4 jest opcjonalne i dziala tylko po zgodzie
- serwerowe potwierdzenia platnosci SMS z idempotencja po webhooku / finalnym sukcesie po stronie backendu
- lokalny fallback JSON do developmentu, ktory tworzy katalog `data/` runtime tylko wtedy, gdy pracujesz w trybie local; statyczne tresci produktowe nie powinny byc tam trzymane

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
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- `ADMIN_ACCESS_SECRET`
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `PAYU_CLIENT_ID`
- `PAYU_CLIENT_SECRET`
- `PAYU_POS_ID`
- `PAYU_SECOND_KEY`
- `TEST_CHECKOUT_ENABLED`
- `QA_CHECKOUT_EMAIL_ALLOWLIST`
- `QA_CHECKOUT_PHONE_ALLOWLIST`
- `RESEND_API_KEY`
- `MAIL_PROVIDER`
- `ADMIN_NOTIFICATION_EMAIL`
- `CRON_SECRET`
- `SMS_PROVIDER`
- `SMS_API_KEY`
- `SMS_SENDER`

Uwaga:

- `SUPABASE_SERVICE_ROLE_KEY` musi byc prawdziwym kluczem service role (`sb_secret_...` albo legacy JWT z rola `service_role`).
- Klucz `sb_publishable_...` nie wystarczy do zapisu ceny, bookingow ani adminowych operacji.
- `ADMIN_NOTIFICATION_EMAIL` odbiera maile o kliknieciu `Zaplacilem, czekam na potwierdzenie` dla manualnych wplat.
- `MAIL_PROVIDER=gmail` pozwala wysylac maile klienta i admina przez Gmail SMTP zamiast Resend.
- dla Gmail SMTP potrzebujesz `GMAIL_SMTP_USER`, `GMAIL_SMTP_APP_PASSWORD` i opcjonalnie `GMAIL_FROM_EMAIL` (domyslnie bierze `GMAIL_SMTP_USER`).
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` wlacza tylko consent-gated GA4; wewnetrzny KPI dashboard korzysta z first-party event ledger, nie z GA4.
- Jesli `RESEND_FROM_EMAIL` nadal korzysta z testowego nadawcy `onboarding@resend.dev`, customer maile do zewnetrznych adresow pozostaja zablokowane do czasu weryfikacji domeny w Resend. W tym trybie `ADMIN_NOTIFICATION_EMAIL` powinien wskazywac adres konta Resend, inaczej powiadomienie adminowe tez moze skonczyc sie `403`.
- `CUSTOMER_EMAIL_MODE=auto` i `PAYU_MODE=disabled` sa obecnym launch mode dla manual payment. `CUSTOMER_EMAIL_MODE=disabled` zostaw tylko jako tymczasowy override diagnostyczny.
- `TEST_CHECKOUT_ENABLED=true` razem z `QA_CHECKOUT_EMAIL_ALLOWLIST` albo `QA_CHECKOUT_PHONE_ALLOWLIST` odblokowuje kontrolowany flow QA bez publicznego 0 zl.

Pelna lista znajduje sie w `.env.example`.

## Migracje SQL

Uruchom w Supabase:

- `supabase/2026-03-21_amount_numeric_and_reminder.sql`
- `supabase/migrations/20260321_pricing_settings.sql`
- `supabase/migrations/20260321_booking_preparation_materials.sql`
- `supabase/migrations/20260321_supabase_reminder_scheduler.sql`
- `supabase/migrations/20260326_sms_payment_confirmation.sql`
- `supabase/migrations/20260406_qa_checkout.sql`

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
node --import tsx scripts/slot-form-matrix.ts
node --import tsx scripts/payu-smoke.ts
node --import tsx scripts/payu-smoke.ts --production
node --import tsx scripts/pricing-smoke.ts
node --import tsx scripts/ui-smoke.ts
node --import tsx scripts/reminder-smoke.ts
node --import tsx scripts/funnel-metrics.ts
node --import tsx scripts/live-readiness.ts --report-only
node --import tsx scripts/live-clickthrough-report.ts
```

`scripts/funnel-metrics.ts` czyta lokalny JSON fallback ledgeru i zapisuje raport do `qa-reports`, więc działa nawet wtedy, gdy Supabase nie jest dostępny na tej maszynie.

Warianty PayU smoke:
- sandbox: `npm run payu-smoke`
- production: `npm run payu-smoke:production`

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

- `npm run live-readiness`
- `/admin` wymaga Basic Auth
- w `/admin` widoczny jest marker builda `CLEAN_START_REPO_V1`
- sekcja ceny konsultacji dziala
- job `behavior15-booking-reminders` istnieje po stronie Supabase

## Glowne moduly

- `app/admin/page.tsx`
- `app/api/analytics/events/route.ts`
- `components/AdminPricingManager.tsx`
- `components/PreparationMaterialsCard.tsx`
- `lib/server/funnel-metrics.ts`
- `app/api/admin/pricing/route.ts`
- `app/api/bookings/[id]/prep/route.ts`
- `app/api/reminders/run/route.ts`
- `lib/server/db.ts`
- `lib/server/reminder-runner.ts`
- `lib/server/payu.ts`
- `lib/server/sms.ts`
- `lib/server/stripe.ts`
