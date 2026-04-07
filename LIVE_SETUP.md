# Live setup - Behawior 15

## 1. Cena konsultacji
Aktywna cena dla nowych rezerwacji jest przechowywana w warstwie danych:
- lokalnie: runtime plik `data/pricing-settings.json`, tworzony automatycznie tylko w trybie local
- live: tabela `public.pricing_settings`

Zmiana ceny odbywa sie z panelu `/admin`. Istniejace bookingi zachowuja swoja historyczna kwote.

## 2. SQL do uruchomienia w Supabase
Uruchom plik:

`supabase/2026-03-21_amount_numeric_and_reminder.sql`

oraz:

`supabase/migrations/20260321_pricing_settings.sql`
`supabase/migrations/20260326_sms_payment_confirmation.sql`
`supabase/migrations/20260406_qa_checkout.sql`

Zawiera:
- zmiane `bookings.amount` na `numeric(10,2)`
- dodanie `bookings.reminder_sent`
- dodanie `public.pricing_settings`

Po zmianach w booking/payment schema odpal tez:

- `npm run schema-audit`

To sprawdza, czy kanoniczny plik `supabase/schema.sql` i kluczowe migracje rolloutowe nadal pasuja do aktualnego kodu.

## 3. Email
Aby dzialaly maile:
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL` jako techniczny adres nadawcy
- `ADMIN_NOTIFICATION_EMAIL` jako prywatny adres do maili o manualnych wplatach i linkow `jest / nie ma wplaty`
- opcjonalnie `BEHAVIOR15_CONTACT_EMAIL` jesli chcesz nadpisac publiczny adres kontaktowy
- opcjonalnie `BEHAVIOR15_CONTACT_PHONE`

Wazne:
- jesli wysylasz jeszcze z `onboarding@resend.dev`, customer maile do zewnetrznych adresow beda blokowane do czasu weryfikacji domeny w Resend
- w tym trybie `ADMIN_NOTIFICATION_EMAIL` musi wskazywac adres konta Resend, inaczej powiadomienie adminowe tez moze skonczyc sie `403`
- dla obecnego launch mode manual payment `CUSTOMER_EMAIL_MODE=auto` i `PAYU_MODE=disabled` sa oczekiwanym stanem live; `CUSTOMER_EMAIL_MODE=disabled` traktuj tylko jako tymczasowy override
- dla finalnego readiness 4/4 customer email musi byc aktywny: `CUSTOMER_EMAIL_MODE=auto` oraz zweryfikowany `RESEND_FROM_EMAIL`
- jesli `CUSTOMER_EMAIL_MODE=disabled` albo `RESEND_FROM_EMAIL` nadal wskazuje `onboarding@resend.dev`, readiness zostaje zablokowany, a confirmation page staje sie jedynym fallbackiem

Domyslny publiczny adres kontaktowy w aplikacji:
- `coapebehawiorysta@gmail.com`

Domyslny publiczny adres aplikacji:
- `https://coapebehawiorysta.vercel.app`

Jesli podlaczysz wlasna domene `.pl`, ustaw `NEXT_PUBLIC_APP_URL` na jej produkcyjny HTTPS adres i zostaw ten sam adres jako canonical dla linkow, maili i powrotow z platnosci.

## 4. SMS po potwierdzonej platnosci
Uruchom migracje:

- `supabase/migrations/20260326_sms_payment_confirmation.sql`

Ustaw po stronie aplikacji:

- `SMS_PROVIDER=smsapi`
- `SMS_API_KEY`
- `SMS_SENDER`
- opcjonalnie `SMS_API_BASE_URL` jesli korzystasz z innego endpointu niz domyslny `https://api.smsapi.com`

Fallback zgodnosci:

- `SMS_NOTIFICATION_WEBHOOK_URL`
- `SMS_NOTIFICATION_WEBHOOK_TOKEN`

Zasada dzialania:

- SMS jest wysylany tylko po potwierdzonym sukcesie platnosci po stronie serwera
- webhook / finalny backend success oznacza booking jako `processing`, potem zapisuje `sent` albo blad / skip
- confirmation page nie inicjuje drugiej wysylki
- duplikat webhooka nie powinien wyslac drugiego SMS, bo booking po pierwszej probie ma juz zapisany status `sms_confirmation_status`

## 5. Reminder 1h przed konsultacja
Scheduler nie korzysta juz z Vercel Cron.
Run remindera jest wykonywany przez Supabase `pg_cron + pg_net`, ktore wywoluje chroniony endpoint aplikacji:
- `GET/POST /api/reminders/run`

Po stronie aplikacji ustaw:
- `CRON_SECRET`

Po stronie Supabase uruchom dodatkowo:
- `supabase/migrations/20260321_supabase_reminder_scheduler.sql`
- `supabase/behavior15_reminder_scheduler_setup.sql`

Setup SQL tworzy dwa sekrety w Supabase Vault:
- `behavior15_app_url`
- `behavior15_cron_secret`

Nastepnie aktywuje job:
- `behavior15-booking-reminders`

Manualny smoke trigger:
- `POST /api/reminders/run`
- `Authorization: Bearer <CRON_SECRET>`

## 6. Admin
Ustaw:
- `ADMIN_ACCESS_SECRET`

Login w basic auth:
- `admin`
- haslo = `ADMIN_ACCESS_SECRET`

## 7. Kontrolowany QA checkout
Jesli chcesz odpalac testowy checkout bez realnej platnosci, ustaw:
- `APP_PAYMENT_MODE=mock`
- `TEST_CHECKOUT_ENABLED=true`
- `QA_CHECKOUT_EMAIL_ALLOWLIST` i/lub `QA_CHECKOUT_PHONE_ALLOWLIST`

Wazne:
- booking musi byc jawnie oznaczony jako QA
- bez allowlisty QA checkout pozostaje zablokowany w produkcji
- admin ma osobna akcje `Potwierdź QA` dla takich bookingow

## 8. PayU smoke przed deployem
Przed deployem mozesz odpalic:

- `npm run payu-smoke`
- `npm run payu-smoke:production -- --url https://coapebehawiorysta.vercel.app`
- `npm run funnel-metrics`
- `npm run live-readiness`

Skrypt:

- w trybie sandbox startuje aplikacje lokalnie na losowym porcie i tworzy testowy booking w `APP_DATA_MODE=local`
- w trybie production / controlled rollout odpala sie na publicznym URL przekazanym przez `--url` albo `PAYU_SMOKE_URL`
- uruchamia prawdziwy checkout PayU sandbox albo production przez `/api/payments/payu/checkout`
- sprawdza, czy booking zapisuje `paymentMethod=payu`, `payuOrderId` i `payuOrderStatus` przez `/api/bookings/:id/status`
- tryb production wymaga rzeczywistych kluczy PayU, `PAYU_ENVIRONMENT=production` i publicznego URL
- `npm run payu-smoke:production` bez `--url` / `PAYU_SMOKE_URL` konczy sie szybkim bledem zamiast zgadywac target

`npm run live-readiness`:

- sprawdza, czy runtime danych nie jest juz na local fallback
- sprawdza schema sync dla booking/payment/QA rollout przez `schema-audit`
- sprawdza, czy publiczny URL wyglada na produkcyjny HTTPS endpoint
- domyslnie czyta current production snapshot z `.vercel/.env.production.current`, jesli plik istnieje
- traktuje `CUSTOMER_EMAIL_MODE=auto` i `PAYU_MODE=disabled` jako swiadomy launch mode manual payment; `disabled` to tylko tymczasowy override
- failuje na `RESEND_FROM_EMAIL` w trybie `resend.dev` testing mode tylko wtedy, gdy customer email jest aktywnie wlaczony
- failuje na `PAYU_ENVIRONMENT=sandbox` tylko wtedy, gdy PayU jest aktywnie wlaczone
- zapisuje raport do `qa-reports/latest-live-readiness.md`

Po podlaczeniu wlasnej domeny `.pl` odpal ponownie `npm run live-readiness -- --report-only`, zeby sprawdzic canonicale, publiczny URL i linki mailowe na nowym adresie.
Jesli chcesz zrobic controlled rollout PayU na publicznym Vercel URL, ustaw `PAYU_SMOKE_URL` albo podaj `--url` i dopiero wtedy uruchom `npm run payu-smoke:production`.

Jesli lokalnie nie masz jeszcze swoich sekretow sandbox, skrypt korzysta z oficjalnego publicznego POS testowego PayU dostepnego w dokumentacji sandbox.
Nie uzywaj tych publicznych danych do produkcji.

## 9. Analityka i operacje
First-party KPI nie korzysta z GA4 jako zrodla prawdy. Zamiast tego aplikacja zapisuje eventy do wewnetrznego ledgera i liczy je w `/admin`.

Wazne zmienne:
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` - opcjonalne, consent-gated GA4
- `TEST_CHECKOUT_ENABLED`, `QA_CHECKOUT_EMAIL_ALLOWLIST`, `QA_CHECKOUT_PHONE_ALLOWLIST` - odcinaja ruch QA od produkcyjnych KPI

Raporty i rytual:
- `npm run funnel-metrics` zapisuje `qa-reports/latest-funnel-metrics.md` i archiwum z timestampem; raport czyta lokalny JSON fallback ledgeru, więc działa nawet wtedy, gdy Supabase nie jest dostępny w tej maszynie
- `npm run live-readiness -- --report-only` zapisuje `qa-reports/latest-live-readiness.md`
- `npm run live-clickthrough-report` zapisuje raport klikniec po publicznych trasach
- `/_internal/qa-report` jest surowym viewerem artefaktow QA, a `/admin` pokazuje KPI i status operacyjny
