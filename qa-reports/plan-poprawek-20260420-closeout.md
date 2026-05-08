# Plan Poprawek 2026-04-20: Closeout

Data: 2026-04-20
Repo: `regulskibehawiorysta`
Zakres: domknięcie planu z `PLAN_POPRAWEK_REGULSKIBEHAWIORYSTA_2026-04-20.md`
Status: `PASS`

## 1. Co zostało domknięte

- naprawa blockera builda związanego z `revalidateTag`
- naprawa blokera `tsc` w `scripts/gen-sitemap.ts`
- doprecyzowanie copy po wyborze terminu i po formularzu
- przebudowa `/opinie` na półzweryfikowane case cards
- rozwój `/niezbednik` do roli hubu problemów i treści evergreen
- wzmocnienie linkowania wewnętrznego między usługami, landingami i materiałami
- uporządkowanie porównania `Kwadrans vs 60 min` także na `/oferta`
- dopracowanie warstwy wizualnej na `home`, `oferta`, `niezbednik`, `psy`, `koty`
- poprawa dostępności:
  - wyraźniejszy `focus-visible` dla linków pomocniczych i kart tematów w bookingu
  - oznaczenie wybranych grafik dekoracyjnych pustym `alt`
  - podbicie kontrastu drugorzędnych tekstów na `premium-home-page` i `money-page`

## 2. Weryfikacja techniczna

- `npx tsc --noEmit`: `PASS`
- `npm run build`: `PASS`

## 3. Najważniejsze efekty użytkowe

- oferta i booking są czytelniejsze przy wyborze między `15 min` i `60 min`
- sekcja opinii i `Niezbędnik` lepiej wspierają zaufanie oraz wejście z contentu do usług
- kluczowe widoki mają spójniejszą hierarchię wizualną na desktopie i mobile
- warstwa a11y jest mniej podatna na szum dla czytników ekranu i bardziej czytelna dla obsługi klawiaturą

## 4. Pozostałe ryzyka

- brak świeżego, pełnego browserowego recrawla całego serwisu po ostatnim pakiecie zmian
- brak nowego end-to-end manualnego przebiegu `/call/[id]` w tym domknięciu
- historyczne raporty QA w repo nadal zawierają stare `NO-GO` i archiwalne artefakty

## 5. Następny sensowny ruch

Jeśli kolejny etap ma być praktyczny, a nie dokumentacyjny:

- odpalić jeden świeży audyt browserowy desktop + mobile dla `/`, `/oferta`, `/niezbednik`, `/psy`, `/koty`, `/book`, `/slot`, `/form`, `/payment`, `/confirmation`
- potem zaktualizować `latest-report.md` dopiero na podstawie tego nowego przebiegu
