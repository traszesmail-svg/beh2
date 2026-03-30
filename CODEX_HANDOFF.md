# CODEX HANDOFF

> Historical recovery note from 2026-03-26. For the current cross-session status, use `C:\Projekt\behawior15-mvp-full\MASTER_HANDOFF.md` and `C:\Projekt\behawior15-mvp-full\CURRENT_WORK.md`.

Date: 2026-03-26
Repo: `C:\Projekt\behawior15-mvp-full\beh2`
Branch: `main`
Current commit: `dd68f55`
Remote commit: `dd68f55`

## Current confirmed state

- `HEAD` and `origin/main` are both `dd68f55`
- worktree was clean before documentation refresh in this recovery session
- latest recovery checks on current `HEAD`:
  - `npm test` PASS
  - `npm run build` PASS
  - `npm run verify-flow` PASS
  - `npm run pricing-smoke` PASS
  - `npm run ui-smoke` PASS
  - `npm run live-smoke -- --expected-branch main --expected-commit dd68f55` PASS

## What the latest workstream changed

Recent payment-flow hardening on top of the earlier site rebrand:

- `7b6c71f` - improved manual payment review flow
- `7fbb54a` - blocked preparation materials and room access until payment is really confirmed
- `cebce39` - redeploy marker commit for temporary admin notification email
- `dd68f55` - added auto-refresh on the pending payment confirmation page

## Current functional status confirmed locally

- homepage loads correctly
- booking flow starts correctly
- payment page shows two methods:
  - PayU online
  - manual payment / BLIK on phone / transfer
- preparation materials stay locked before payment confirmation
- user can report manual payment
- `/call/[id]` stays blocked before payment approval
- admin can approve manual payment
- `/confirmation` auto-refreshes and switches from pending to paid after admin approval
- preparation materials unlock after payment approval
- confirmation page keeps the SMS fallback text visible
- room iframe keeps the audio-only meeting config

## Important context after crash recovery

- earlier notes in this repo that mention `7575030` are historical only
- there were no uncommitted code changes left after the blue screen
- the repo state recovered cleanly from git history; nothing had to be reconstructed by hand

## Still not confirmed in this recovery session

- real production SMS delivery with provider credentials: `nie potwierdzilem`

## Confirmed external blockers for SMS rollout

- production Vercel env currently do not include:
  - `SMS_PROVIDER`
  - `SMS_API_KEY`
  - `SMS_SENDER`
- current Supabase production schema is still missing SMS columns:
  - `sms_confirmation_status`
  - `sms_confirmation_sent_at`
  - `sms_provider_message_id`
  - `sms_error_code`
  - `sms_error_message`
  - `customer_phone_normalized`
- direct check against Supabase returned:
  - error code `42703`
  - message `column bookings.sms_confirmation_status does not exist`

## Suggested next step for the next session

1. If the next task is production SMS rollout, verify provider credentials, Vercel env, and Supabase migration from `zrob.txt`.
2. If code changes continue in the payment flow, keep `PROJECT_STATE.md` aligned with them.
3. Commit the refreshed project notes if you want the recovery state saved in git history.
