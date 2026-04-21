# Stage 7 Production QA - 2026-04-21

## Scope
- production deploy promoted on Vercel
- custom domains `regulskibehawiorysta.pl` and `www.regulskibehawiorysta.pl` repointed to deployment `beh2-agpdx2eg3-coapebehawiorysta-6608s-projects.vercel.app`
- public checks executed against `https://regulskibehawiorysta.pl`

## Deployment
- production deployment: `https://beh2-agpdx2eg3-coapebehawiorysta-6608s-projects.vercel.app`
- public aliases now point to this deployment:
  - `https://regulskibehawiorysta.pl`
  - `https://www.regulskibehawiorysta.pl`

## Public validation
- `robots.txt`
  - `Sitemap: https://regulskibehawiorysta.pl/sitemap.xml` present
  - blocked funnel/internal routes present, including `/book`, `/booking`, `/slot`, `/form`, `/payment`, `/confirmation`, `/problem`, `/materialy`, `/przybornik`
- `sitemap.xml`
  - 33 canonical URLs
  - contains `/opinie`
  - contains `/behawiorysta-online-polska`
  - excludes `/dziekuje`
- canonicals and JSON-LD
  - `/` canonical `https://regulskibehawiorysta.pl`, JSON-LD count `2`
  - `/opinie` canonical `https://regulskibehawiorysta.pl/opinie`, JSON-LD count `2`
  - `/behawiorysta-online-polska` canonical `https://regulskibehawiorysta.pl/behawiorysta-online-polska`, JSON-LD count `2`
  - `www` host redirects with `301` to apex on `/` and `/opinie`
- release marker
  - public pages expose `CLEAN_START_REPO_V1:codex-next-build-fix:3e1dd76`
- trust layer on production
  - `/opinie` contains visible copy about `typ problemu`, `format kontaktu`, `etap współpracy` and `przybliżony czas pierwszych zmian`
  - `/opinie` contains visible section `Źródło kontekstu i pierwszy efekt`
  - `/opinie` JSON-LD contains provider proof summary: `Dyplomant COAPE z publicznym profilem CAPBT, technik weterynarii, dogoterapeuta i dietetyk.`

## Automated checks
- `npm.cmd run live-smoke -- --url https://regulskibehawiorysta.pl` -> PASS
  - smoke rules updated in `lib/release-smoke.ts` to match the current public IA and copy
  - canonical service route verified on `/behawiorysta-online-polska`
- Lighthouse mobile public audit on `https://regulskibehawiorysta.pl`
  - report: `qa-reports/lighthouse-public-mobile-full-20260421.json`
  - requested URL: `https://regulskibehawiorysta.pl/`
  - final URL: `https://regulskibehawiorysta.pl/`
  - scores:
    - performance: `95`
    - accessibility: `100`
    - best-practices: `100`
    - seo: `100`
  - metrics:
    - FCP: `1.3 s`
    - LCP: `2.6 s`
    - TBT: `80 ms`
    - CLS: `0`
    - Speed Index: `3.8 s`

## Notes
- Lighthouse CLI exits with Windows cleanup error `EPERM` while removing its temp directory after the audit completes, but the JSON report is fully written and parseable.
- `npx tsc --noEmit` still fails on pre-existing unrelated issues outside Stage 7:
  - `scripts/full-public-crawl-local.ts`
  - `tests/runtime-config.test.ts`
