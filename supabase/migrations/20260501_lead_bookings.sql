create table if not exists public.lead_bookings (
  id uuid primary key default gen_random_uuid(),
  access_token text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'pending',
  service text not null,
  service_label text not null,
  service_price text not null,
  name text not null,
  email text not null,
  species text not null,
  description text not null,
  preferred_slots text not null default '',
  confirmed_date text,
  confirmed_time text,
  payment_link text,
  payment_method text,
  paid_at timestamptz,
  call_room_url text,
  calendar_url text,
  admin_notes text
);

alter table public.lead_bookings enable row level security;

create policy "Service role full access" on public.lead_bookings
  for all using (true) with check (true);
