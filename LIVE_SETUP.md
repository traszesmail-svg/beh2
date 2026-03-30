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

Zawiera:
- zmiane `bookings.amount` na `numeric(10,2)`
- dodanie `bookings.reminder_sent`
- dodanie `public.pricing_settings`

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
- dla `beh2` na 2026-03-28 potwierdzony pozostaje tylko zewnetrzny blocker po stronie Resend: brak zweryfikowanej domeny nadawcy dla realnych customer maili

Domyslny publiczny adres kontaktowy w aplikacji:
- `coapebehawiorysta@gmail.com`

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

## 7. PayU smoke przed deployem
Przed deployem mozesz odpalic:

- `npm run payu-smoke`

Skrypt:

- startuje aplikacje lokalnie na losowym porcie
- tworzy testowy booking w `APP_DATA_MODE=local`
- uruchamia prawdziwy checkout PayU sandbox przez `/api/payments/payu/checkout`
- sprawdza, czy booking zapisuje `paymentMethod=payu`, `payuOrderId` i `payuOrderStatus`

Jesli lokalnie nie masz jeszcze swoich sekretow sandbox, skrypt korzysta z oficjalnego publicznego POS testowego PayU dostepnego w dokumentacji sandbox.
Nie uzywaj tych publicznych danych do produkcji.
