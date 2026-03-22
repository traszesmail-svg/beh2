create table if not exists public.pricing_settings (
  id text primary key,
  consultation_price numeric(10,2) not null,
  updated_at timestamptz not null default timezone('utc', now())
);

insert into public.pricing_settings (id, consultation_price)
values ('consultation', 28.99)
on conflict (id) do nothing;
