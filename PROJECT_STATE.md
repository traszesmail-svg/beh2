# Project State

Date: 2026-03-26
Repo: `C:\Projekt\behawior15-mvp-full\beh2`
Branch: `main`
Base commit before rebrand work: `0332fce`

## Scope of this session

Rebrand and rebuild `https://beh2.vercel.app/` from the product-first landing `Behawior 15` into the broader expert brand:

- `Regulski | Terapia behawioralna`
- dogs and cats as full pillars
- low-friction entry preserved through the 15-minute flow
- broader service architecture:
  - 15 min
  - 30 min
  - behavioral consultation online
  - home / travel consultation
  - individual therapy
  - socialization-therapeutic stays
- PDF guides

## Follow-up change

- Removed the previous cat hero asset from the tracked public branding files.
- Replaced all current references to that image in:
  - `app/page.tsx`
  - `app/koty/page.tsx`
  - `lib/offers.ts`
- Purpose: ensure the asset is no longer used by the current branch or the current production build after redeploy.

## Implemented so far

- Reworked global branding constants, layout metadata, and SEO copy.
- Replaced homepage content with a brand-first structure:
  - hero
  - how I help
  - forms of collaboration
  - stays
  - cats
  - process
  - trust
  - FAQ
  - final CTA
- Added new route structure:
  - `/oferta`
  - `/oferta/[slug]`
  - `/koty`
  - `/kontakt`
- Preserved `/book` as the separate booking flow for the 15-minute consultation and updated its copy to frame it as the first step rather than the whole brand.
- Updated customer-facing legal copy to better match the new brand and visible payment communication.
- Removed the visible public build marker from the footer while keeping a hidden `data-build-marker` in DOM for smoke verification.

## Key files touched

- `app/layout.tsx`
- `app/page.tsx`
- `app/book/page.tsx`
- `app/slot/page.tsx`
- `app/form/page.tsx`
- `app/payment/page.tsx`
- `app/confirmation/page.tsx`
- `app/kontakt/page.tsx`
- `app/koty/page.tsx`
- `app/oferta/page.tsx`
- `app/oferta/[slug]/page.tsx`
- `app/polityka-prywatnosci/page.tsx`
- `app/regulamin/page.tsx`
- `app/sitemap.ts`
- `components/Header.tsx`
- `components/Footer.tsx`
- `app/globals.css`
- `lib/site.ts`
- `lib/seo.ts`
- `lib/offers.ts`

## Verification completed

- `npm run build` PASS
- `npm test` PASS
- `npm run ui-smoke` PASS
- `npm run pricing-smoke` PASS
- `npm run verify-flow` PASS
- `npm run live-smoke` PASS

## Git and deploy

- Commit created: `7fc98d5` - `Rebrand site into expert behavioral therapy brand`
- Pushed to: `origin/main`
- Production deploy completed through Vercel CLI
- Production alias confirmed: `https://beh2.vercel.app/`
- Live smoke confirmed build marker: `CLEAN_START_REPO_V1:main:7fc98d5`

## Live vs previous live

Before deploy, live still showed the old product-first version around `Behawior 15` with visible footer marker `main / 0332fce`.

After deploy, live smoke confirmed the new brand-first architecture is active, including:

- `Regulski | Terapia behawioralna`
- `Jak mogę pomóc`
- `Formy współpracy`
- `Pobyty socjalizacyjno-terapeutyczne`
- `Terapia kotów`

It also confirmed that the old visible footer version marker is no longer exposed on the public pages.
