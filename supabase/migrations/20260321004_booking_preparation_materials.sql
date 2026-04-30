alter table public.bookings
  add column if not exists customer_access_token_hash text not null default '';

alter table public.bookings
  add column if not exists prep_video_path text;

alter table public.bookings
  add column if not exists prep_video_filename text;

alter table public.bookings
  add column if not exists prep_video_size_bytes integer;

alter table public.bookings
  add column if not exists prep_link_url text;

alter table public.bookings
  add column if not exists prep_notes text;

alter table public.bookings
  add column if not exists prep_uploaded_at timestamptz;

create index if not exists bookings_customer_access_hash_idx on public.bookings(customer_access_token_hash);

insert into storage.buckets (id, name, public)
values ('booking-prep-materials', 'booking-prep-materials', false)
on conflict (id) do update set public = excluded.public;
