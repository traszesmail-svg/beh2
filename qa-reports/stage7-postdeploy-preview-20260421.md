# Stage 7 Post-Deploy Preview QA

- Data: 2026-04-21
- Zakres: etap 7 po wdrożeniu na preview
- Deployment: `https://beh2-hw1ig1ior-coapebehawiorysta-6608s-projects.vercel.app`
- Status deployu: `READY`
- Werdykt: `PASS z jednym technicznym ograniczeniem`

## 1. Co sprawdzono na deployu

- `vercel inspect`: deploy gotowy
- `vercel curl` na chronionym preview:
  - `robots.txt`
  - `sitemap.xml`
  - `/`
  - `/opinie`
  - `/behawiorysta-online-polska`
- browser sanity na preview przez Playwright:
  - mobile `390x844`
  - desktop `1440x1200`
  - `/opinie`
  - `/book`

## 2. Wynik serwerowy

- `robots.txt`: publiczny crawl dozwolony, ścieżki funnelowe technicznie zablokowane, sitemap wskazuje `https://regulskibehawiorysta.pl/sitemap.xml`
- `sitemap.xml`: 33 adresy, zawiera kanoniczne URL-e publiczne, nie zawiera strony `dziekuje`
- `/`: canonical `https://regulskibehawiorysta.pl`, `JSON-LD` count `2`, marker builda obecny
- `/opinie`: canonical `https://regulskibehawiorysta.pl/opinie`, `JSON-LD` count `2`, nowy trust summary obecny
- `/behawiorysta-online-polska`: canonical `https://regulskibehawiorysta.pl/behawiorysta-online-polska`, `JSON-LD` count `2`

## 3. Wynik przeglądarkowy

- mobile: `/opinie` i `/book` bez poziomego overflow
- desktop: `/opinie` i `/book` bez poziomego overflow
- nowe copy trust na `/opinie` jest dostępne w renderze deployu
- jedyne zanotowane request failures to `ERR_ABORTED` dla części obrazów `/_next/image` i `icon.svg` podczas szybkiej nawigacji headless; nie wyglądają na blocker aplikacji

## 4. Ograniczenie Lighthouse

- uruchomiono mobilny Lighthouse przeciw preview, ale wynik nie jest wiarygodny
- powód: preview jest chroniony przez Vercel Authentication, a Lighthouse został przekierowany na stronę SSO zamiast na właściwą aplikację
- artefakt z tej próby istnieje lokalnie jako `vercel.com_2026-04-21_08-08-55.report.html`, ale nie należy traktować go jako wyniku jakości strony

## 5. Wniosek

- etap 7 jest domknięty na poziomie preview QA dla deployu aplikacji
- jedyny niedomknięty punkt z planu to prawidłowy mobilny Lighthouse na publicznie dostępnym URL:
  - albo po promocji na produkcję
  - albo na preview bez deployment protection
