create table if not exists public.urgent_now_requests (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'new' check (status in ('new', 'responded')),
  name text not null,
  email text not null,
  species text not null check (species in ('pies', 'kot')),
  topic_id text not null,
  topic_label text not null,
  message text not null,
  requested_date date not null,
  requested_time text not null,
  responded_at timestamptz,
  proposed_date date,
  proposed_time text,
  response_note text,
  availability_slot_id text references public.availability(id) on delete set null,
  booking_href text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists urgent_now_requests_created_at_idx on public.urgent_now_requests(created_at desc);
create index if not exists urgent_now_requests_status_idx on public.urgent_now_requests(status, created_at desc);
