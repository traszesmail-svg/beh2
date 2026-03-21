-- 1. Zapisz aktualny URL aplikacji i ten sam secret, ktory masz w CRON_SECRET po stronie Vercel.
select vault.create_secret(
  'https://twoja-aplikacja.vercel.app',
  'behavior15_app_url',
  'Publiczny URL aplikacji Behawior15 do triggera remindera'
);

select vault.create_secret(
  'wklej-tutaj-cron-secret-z-env',
  'behavior15_cron_secret',
  'Bearer secret do /api/reminders/run'
);

-- 2. Aktywuj scheduler co 5 minut po stronie Supabase.
select public.behavior15_schedule_reminder_job();

-- 3. Kontrola pomocnicza:
select jobid, jobname, schedule, command
from cron.job
where jobname = 'behavior15-booking-reminders';
