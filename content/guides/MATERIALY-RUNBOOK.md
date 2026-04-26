# Lejek `/materialy` — runbook

3-tier lejek PDF z manualną obsługą BLIK. 21 PDF-ów (2 free + 4 flagowce 29 zł +
15 standard 19 zł) plus 6 pakietów po 49 zł. Bez bramki płatniczej —
płatność BLIK na telefon, kod do pobrania wysyła owner ręcznie.

## Architektura

| Komponent                                  | Plik / katalog                                       |
| ------------------------------------------ | ---------------------------------------------------- |
| Katalog produktów                          | `lib/materialy-catalog.ts`                           |
| Storage (JSON file, append-only)           | `lib/server/materialy-storage.ts` → `data/materialy-orders.json` |
| Powiadomienia email                        | `lib/server/notifications.ts` (3 funkcje `sendMaterialy*`) |
| API: złóż zamówienie                       | `POST /api/materialy/order`                          |
| API: pobierz po kodzie                     | `POST /api/materialy/download`                       |
| API: potwierdź wpłatę (CLI/curl, header)   | `POST /api/materialy/confirm` (`x-admin-secret`)     |
| API: lista zamówień (dla admin UI)         | `GET /api/admin/materialy/list` (Basic Auth)         |
| API: potwierdź wpłatę z admin UI           | `POST /api/admin/materialy/confirm` (Basic Auth)     |
| Landing                                    | `/materialy`                                         |
| Strona produktu                            | `/materialy/[slug]`                                  |
| Strona pakietu                             | `/materialy/pakiet/[slug]`                           |
| Strona pobrania (klient)                   | `/materialy/pobranie`                                |
| Admin UI                                   | `/admin/materialy`                                   |
| Pliki PDF (źródło prawdy)                  | `content/guides/pdf/<slug>.pdf`                      |

## Zmienne środowiskowe

W `.env.local` (lub Vercel project env):

```dotenv
# Numer telefonu pokazywany klientowi w mailu z instrukcją BLIK.
# Domyślnie: 579163241
OWNER_BLIK_PHONE=579163241

# Sekret do nagłówkowego confirma /api/materialy/confirm (curl/Postman).
# Wygeneruj długi losowy ciąg — 32+ znaków.
# Dla samego admin UI ten sekret NIE jest potrzebny (Basic Auth załatwia auth).
MATERIALY_ADMIN_SECRET=<wymyśl-długi-losowy-secret>

# Już istniejące — używane też przez ten lejek:
ADMIN_ACCESS_SECRET=<basic-auth-do-/admin>
GMAIL_SMTP_USER=<adres>
GMAIL_SMTP_APP_PASSWORD=<haslo-aplikacji>
PUBLIC_CONTACT_EMAIL=kontakt@regulskibehawiorysta.pl
```

## Przepływ klienta (paid PDF)

1. Klient wchodzi na `/materialy`, wybiera PDF, klika **Zamów**.
2. Wypełnia formularz na `/materialy/<slug>` → POST `/api/materialy/order`.
3. Storage zapisuje order ze statusem `pending`. System wysyła:
   - **Owner** dostaje mail „Materialy: zamówienie M-XXXXXX-XXXX".
   - **Klient** dostaje mail z instrukcją BLIK (numer telefonu + tytuł = order ID).
4. Klient robi BLIK → owner widzi wpływ w aplikacji bankowej.
5. Owner loguje się do `/admin/materialy`, klika **Potwierdź wpłatę i wyślij kod**.
6. Storage rotuje status na `paid`, generuje 6-cyfrowy kod, ustawia `expiresAt = paidAt + 72h`.
7. Klient dostaje mail z kodem oraz linkiem do `/materialy/pobranie`.
8. Klient wpisuje email + kod → POST `/api/materialy/download` → stream PDF.
9. `usedCount` rośnie, po 3 pobraniach `status` ustawia się na `used`.

## Przepływ klienta (free lead magnet)

Tak samo jak wyżej, ale z `priceAmount === 0`:
- `createOrder` od razu generuje kod i status `paid`.
- Klient dostaje 1 mail: instrukcja BLIK pominięta, od razu dostaje kod.
- Owner też dostaje notyfikację (do listy mailingowej).

## Pakiety (3 PDF za 49 zł)

Klient zamawia pakiet → dostaje **jeden** kod 6-cyfrowy.
Na `/materialy/pobranie` może pobrać każdy z plików oddzielnie podając
„część pakietu" (0, 1, 2). **Każde pobranie zużywa 1 z 3** (więc trzeba
sensownie używać). Po wykonaniu można rozważyć podniesienie limitu pobrań
w `lib/server/materialy-storage.ts:checkAndUseCode` z 3 na np. 5 dla bundli.

## Confirm przez curl (jeśli admin UI niedostępny)

```bash
curl -X POST https://regulskibehawiorysta.pl/api/materialy/confirm \
  -H "x-admin-secret: $MATERIALY_ADMIN_SECRET" \
  -H "content-type: application/json" \
  -d '{"orderId":"M-LK4ZX9-7H3M"}'
```

## Regeneracja PDF-ów

Źródła w `content/guides/sources/<slug>/` (DOCX + spec.json + guide.html).
Po zmianie treści (DOCX z paczki v2) → ekstrakcja → normalizacja → build:

```bash
node scripts/pdf/extract-sources.mjs   # DOCX -> source.html
node scripts/pdf/normalize.mjs         # source.html -> guide.html (semantyzacja)
npm run materialy-build-pdfs           # guide.html -> content/guides/pdf/<slug>.pdf
```

Wymaga lokalnego Chrome (`C:\Program Files\Google\Chrome\Application\chrome.exe`)
albo override w `PLAYWRIGHT_CHROME` env.

## Smoke test storage'u

```bash
npm run materialy-smoke
```

Walkthrough: free → paid → bundle. Sprawdza także integralność katalogu
(każdy slug ma realny plik PDF, każdy bundle jest tańszy niż suma części).

## Limit działalności nierejestrowanej

W 2024 próg to **3 499,50 zł / miesiąc**. Admin UI mógłby pokazywać
sumę sprzedaży w bieżącym miesiącu (TODO). Po przekroczeniu trzeba
zarejestrować działalność gospodarczą.

## Co zostało jako follow-up

- **Eksport sprzedaży miesięcznej** w `/admin/materialy` (suma + alert).
- **Email drip** dla osób, które wzięły lead magnet (D3 upsell, D7 propozycja Kwadransa).
- **Exit-intent modal** na `/book` (gdy user zamyka przed potwierdzeniem rezerwacji).
- **Inline CTA w wpisach blogowych** powiązanych z konkretnymi PDF-ami.
- **Anulowanie zamówienia** z poziomu admina (dziś trzeba ręcznie edytować JSON).
