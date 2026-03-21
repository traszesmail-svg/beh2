alter table public.bookings
alter column amount type numeric(10,2)
using amount::numeric(10,2);

alter table public.bookings
add column if not exists reminder_sent boolean not null default false;
