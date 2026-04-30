create extension if not exists pg_net with schema extensions;
create extension if not exists pg_cron with schema extensions;
create extension if not exists supabase_vault with schema vault;

create or replace function public.behavior15_read_scheduler_secret(secret_name text)
returns text
language sql
security definer
set search_path = public, vault
as $$
  select decrypted_secret
  from vault.decrypted_secrets
  where name = secret_name
  order by created_at desc
  limit 1
$$;

create or replace function public.behavior15_trigger_reminder_run()
returns bigint
language plpgsql
security definer
set search_path = public, extensions, vault
as $$
declare
  app_url text;
  cron_secret text;
  request_id bigint;
begin
  app_url := trim(public.behavior15_read_scheduler_secret('behavior15_app_url'));
  cron_secret := trim(public.behavior15_read_scheduler_secret('behavior15_cron_secret'));

  if app_url is null or app_url = '' then
    raise exception 'Brak vault secret behavior15_app_url';
  end if;

  if cron_secret is null or cron_secret = '' then
    raise exception 'Brak vault secret behavior15_cron_secret';
  end if;

  select net.http_post(
    url := rtrim(app_url, '/') || '/api/reminders/run',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || cron_secret
    ),
    body := jsonb_build_object(
      'source', 'supabase_pg_cron'
    ),
    timeout_milliseconds := 10000
  )
  into request_id;

  return request_id;
end;
$$;

create or replace function public.behavior15_unschedule_reminder_job()
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  if exists(select 1 from cron.job where jobname = 'behavior15-booking-reminders') then
    perform cron.unschedule('behavior15-booking-reminders');
  end if;
end;
$$;

create or replace function public.behavior15_schedule_reminder_job(job_schedule text default '*/5 * * * *')
returns bigint
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  job_id bigint;
begin
  perform public.behavior15_unschedule_reminder_job();

  select cron.schedule(
    'behavior15-booking-reminders',
    job_schedule,
    $job$select public.behavior15_trigger_reminder_run();$job$
  )
  into job_id;

  return job_id;
end;
$$;

revoke all on function public.behavior15_read_scheduler_secret(text) from public;
revoke all on function public.behavior15_trigger_reminder_run() from public;
revoke all on function public.behavior15_unschedule_reminder_job() from public;
revoke all on function public.behavior15_schedule_reminder_job(text) from public;
