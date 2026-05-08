# Latest QA Report

- Data: 2026-04-20
- Repo: `regulskibehawiorysta`
- Etap: full local crawl refresh after plan execution
- Werdykt: `PASS`

## 1. Zakres

Zweryfikowano aktualny stan po wykonaniu planu z `PLAN_POPRAWEK_REGULSKIBEHAWIORYSTA_2026-04-20.md`, w tym:

- pelny lokalny crawl publicznych tras z manifestem screenshotow desktop + mobile
- aktualny build produkcyjny uzyty jako podstawa audytu
- glowne trasy publiczne, tresci blogowe, lead magnety, poradniki PDF i redirecty legacy
- aliasy bookingowe i sciezki pomocnicze odkryte podczas crawla

## 2. Wyniki

- `npm run build`: `PASS`
- `scripts/full-public-crawl-local.ts`: `PASS`
- `qa-reports/final-crawl/report.md`: statusy `200=139`, `307=2`, blockerow `0`

## 3. Co potwierdzil pelny crawl

- swiezy crawl nie wykazal zadnych automatycznych blockerow ani bledow klasy `500` / `404` na trasach objetych przebiegiem
- dynamiczne strony `blog`, `bezplatne-materialy` i `oferta/poradniki-pdf/*`, ktore wczesniej wywracaly sie w niestabilnym audycie, laduja sie poprawnie po stabilizacji runnera
- redirecty legacy dzialaja zgodnie z oczekiwaniem, m.in. stare wpisy blogowe wracaja do `/blog`, a aliasy typu `/booking`, `/confirm`, `/slot`, `/materialy`, `/przybornik` prowadza do aktualnych tras
- manifest, snapshoty HTML i screenshoty zostaly odswiezone w `qa-reports/final-crawl/`

## 4. Korekty w QA

Podczas domykania etapu zaktualizowano narzedzia QA:

- `scripts/full-public-crawl-local.ts` uruchamia teraz crawl na czystym buildzie `next build + next start`, zamiast na niestabilnym `next dev`
- runner korzysta z losowego portu i mocniejszego cleanupu procesu na Windows, zeby kolejne przebiegi nie trafialy w stary serwer
- `scripts/full-public-crawl.ts` ma zawezona heurystyke overflow, zeby nie oznaczac dlugich stron jako problem tylko dlatego, ze sa dlugie

To byly poprawki samego procesu QA, nie regresje publicznego UI.

## 5. Reczna ocena tras z flaga overflow

Reczny przeglad screenshotow i snapshotow HTML potwierdzil, ze alarmy dla `/kontakt` i `/niezbednik` nie wskazuja na poziomy overflow.

- `/kontakt`: widoczna jest realna, nadmierna pionowa przerwa w koncowej sekcji `#material-przed-kontaktem`
- `/niezbednik`: widoczna jest podobna nienaturalnie wysoka koncowa partia strony przed stopka
- pozostale sygnaly z ostatniego crawla wygladaja na efekt heurystyki lub dlugosci strony, a nie na blocker renderingu

To jest otwarty problem layoutu do osobnej poprawki, ale nie blocker dla wyniku biezacego crawla.

## 6. Status repo po cleanupie

- historyczne artefakty QA zostaly wyczyszczone z `qa-reports/`
- jako biezacy punkt odniesienia pozostawiono `final-crawl/`, `latest-report.md` i aktualne raporty zbiorcze

## 7. Status

Aktualny stan repo po tym przebiegu jest uporzadkowany i gotowy do kolejnego etapu prac. Najblizszy sensowny ruch to juz nie kolejny crawl, tylko poprawka layoutu dla koncowych sekcji `/kontakt` i `/niezbednik`.
