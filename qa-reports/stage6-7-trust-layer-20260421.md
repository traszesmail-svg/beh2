# Stage 6-7 Trust Layer QA

- Data: 2026-04-21
- Repo: `regulskibehawiorysta`
- Zakres: etap 6 `trust layer i opinie` + etap 7 `QA i walidacja po wdrożeniu`
- Werdykt lokalny: `PASS z uwagą`

## 1. Zakres wdrożenia

- uporządkowano centralny opis statusu publicznego i profili źródłowych w `lib/site.ts`
- zsynchronizowano `schema` z tym samym opisem statusu i tymi samymi linkami publicznymi
- rozbudowano `content/cases.json` o kontekst: typ problemu, format usługi, etap pracy, przybliżony czas, źródło kontekstu i snapshot efektu
- pokazano ten kontekst na `/opinie` i w `SocialProofSection`
- doprecyzowano copy trust w `lib/trust-layer.ts`

## 2. Walidacja lokalna

- `npm test`: `PASS`
- `npm run build`: `PASS`
- `npm run gen-sitemap`: `PASS`
- `npx tsc --noEmit`: `FAIL` na wcześniejszych, niezwiązanych błędach poza etapem 6/7

## 3. Otwarte uwagi

- `scripts/full-public-crawl-local.ts(104,39)`: błąd typu `ProcessEnv`
- `tests/runtime-config.test.ts(166,33)` i `(167,33)`: dostęp do `index` i `follow` na `string | Robots`
- generator sitemap nadal waliduje pod aktualną produkcję `https://regulskibehawiorysta.pl`, więc nowe lokalne URL-e nie weszły do finalnego `public/sitemap.xml` przed deploymentem

## 4. Co jeszcze zostało po deployu

- sprawdzić `robots.txt`, `sitemap.xml`, canonicale i JSON-LD na preview/production
- zrobić mobilny Lighthouse już na wdrożonym URL, nie lokalnie
