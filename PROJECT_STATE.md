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

## Still pending

- TypeScript/build verification after the rebrand changes.
- Update smoke checks and tests to the new visible copy and new public architecture.
- Local visual verification of the rebuilt homepage and new subpages.
- Git commit, push, and deploy.
- Live post-deploy verification against the new version.
