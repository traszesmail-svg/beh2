alter table public.bookings
  add column if not exists qa_booking boolean not null default false;

create index if not exists bookings_qa_booking_idx on public.bookings(qa_booking);
