create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.pricing_settings (
  id text primary key,
  consultation_price numeric(10,2) not null,
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  customer_access_token_hash text not null default '',
  owner_name text not null,
  animal_type text not null,
  problem_type text not null,
  pet_age text not null,
  duration_notes text not null,
  description text not null,
  phone text not null,
  email text not null,
  booking_date date not null,
  booking_time text not null,
  slot_id text not null,
  booking_status text not null check (booking_status in ('pending', 'confirmed', 'done', 'cancelled', 'expired')),
  payment_status text not null check (payment_status in ('unpaid', 'paid', 'failed', 'refunded')),
  amount numeric(10,2) not null,
  meeting_url text not null,
  checkout_session_id text,
  payment_intent_id text,
  paid_at timestamptz,
  cancelled_at timestamptz,
  expired_at timestamptz,
  refunded_at timestamptz,
  recommended_next_step text,
  reminder_sent boolean not null default false,
  prep_video_path text,
  prep_video_filename text,
  prep_video_size_bytes integer,
  prep_link_url text,
  prep_notes text,
  prep_uploaded_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.availability (
  id text primary key,
  booking_date date not null,
  booking_time text not null,
  is_booked boolean not null default false,
  locked_by_booking_id uuid references public.bookings(id) on delete set null,
  locked_until timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (booking_date, booking_time)
);

create index if not exists bookings_status_idx on public.bookings(booking_status, payment_status);
create index if not exists bookings_created_at_idx on public.bookings(created_at desc);
create index if not exists bookings_slot_idx on public.bookings(slot_id);
create index if not exists bookings_customer_access_hash_idx on public.bookings(customer_access_token_hash);
create index if not exists availability_date_idx on public.availability(booking_date, booking_time);
create index if not exists availability_booked_idx on public.availability(is_booked);

insert into public.pricing_settings (id, consultation_price)
values ('consultation', 69.00)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('booking-prep-materials', 'booking-prep-materials', false)
on conflict (id) do update set public = excluded.public;
