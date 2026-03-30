# Project State

> Historical project snapshot from 2026-03-26. For the current cross-session status, use `C:\Projekt\behawior15-mvp-full\MASTER_HANDOFF.md` and `C:\Projekt\behawior15-mvp-full\CURRENT_WORK.md`.

Date: 2026-03-26
Repo: `C:\Projekt\behawior15-mvp-full\beh2`
Branch: `main`
Current HEAD: `dd68f55`
Base rebrand commit: `6cb62b5`

## Product state on current HEAD

The public site still runs on the broader expert brand:

- `Regulski | Terapia behawioralna`
- dogs and cats as full pillars
- separate low-friction 15-minute booking flow preserved under `/book`

The latest work moved from branding into payment-flow hardening.

## Latest payment-flow hardening

- manual payment review handles approve / reject states more safely
- stale approval clicks no longer fall back to a generic error state
- preparation materials stay locked until booking payment is actually confirmed
- room access stays blocked before payment confirmation
- confirmation page auto-refreshes while the booking is waiting for admin approval
- after approval the confirmation page unlocks:
  - room entry
  - preparation materials
- confirmation view keeps the customer-facing SMS fallback copy
- runtime tests now cover:
  - SMS success
  - invalid phone
  - provider failure
  - duplicate / repeated transitions
  - stale manual review actions

## Key files touched in the current payment workstream

- `app/manual-payment/review/route.ts`
- `app/confirmation/page.tsx`
- `app/payment/page.tsx`
- `app/call/[id]/page.tsx`
- `components/ConfirmationStatusWatcher.tsx`
- `app/api/bookings/[id]/prep/route.ts`
- `app/api/bookings/[id]/prep/video/route.ts`
- `components/PreparationMaterialsCard.tsx`
- `lib/server/notifications.ts`
- `lib/server/payment-options.ts`
- `lib/server/local-store.ts`
- `lib/server/supabase-store.ts`
- `lib/data.ts`
- `scripts/ui-smoke.ts`
- `tests/runtime-config.test.ts`

## Verification on current HEAD

Reconfirmed on `2026-03-26` for `dd68f55`:

- `git status --short` clean
- `npm test` PASS
- `npm run build` PASS
- `npm run verify-flow` PASS
- `npm run pricing-smoke` PASS
- `npm run ui-smoke` PASS
- `npm run live-smoke -- --expected-branch main --expected-commit dd68f55` PASS

Local smoke explicitly confirmed:

- homepage visible
- booking flow starts
- payment page shows both payment methods
- manual payment can be reported
- call room stays blocked before approval
- admin approval unlocks the booking
- confirmation auto-refresh works
- preparation materials can be saved only after payment confirmation
- room iframe keeps the expected audio-only config

## Git state

- branch: `main`
- local `HEAD`: `dd68f55`
- `origin/main`: `dd68f55`
- latest commit message: `Auto-refresh pending payment confirmation flow`

## Open external items

- real production SMS provider configuration: `nie potwierdzilem`
- production Vercel currently has no `SMS_PROVIDER`, `SMS_API_KEY`, `SMS_SENDER`
- production Supabase is missing SMS migration columns; direct check returned `42703` for `bookings.sms_confirmation_status`
