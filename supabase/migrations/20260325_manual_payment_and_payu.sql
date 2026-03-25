alter table public.bookings
  add column if not exists payment_method text,
  add column if not exists payment_reference text,
  add column if not exists payu_order_id text,
  add column if not exists payu_order_status text,
  add column if not exists payment_reported_at timestamptz,
  add column if not exists payment_rejected_at timestamptz,
  add column if not exists payment_rejected_reason text;

update public.bookings
set payment_method = coalesce(
  payment_method,
  case
    when checkout_session_id is not null or payment_intent_id is not null then 'stripe'
    else null
  end
);

alter table public.bookings drop constraint if exists bookings_booking_status_check;
alter table public.bookings drop constraint if exists bookings_payment_status_check;
alter table public.bookings drop constraint if exists bookings_payment_method_check;

alter table public.bookings
  add constraint bookings_booking_status_check
    check (booking_status in ('pending', 'pending_manual_payment', 'confirmed', 'done', 'cancelled', 'expired')),
  add constraint bookings_payment_status_check
    check (payment_status in ('unpaid', 'pending_manual_review', 'paid', 'failed', 'rejected', 'refunded')),
  add constraint bookings_payment_method_check
    check (payment_method in ('manual', 'payu', 'stripe', 'mock') or payment_method is null);

create index if not exists bookings_payment_method_idx on public.bookings(payment_method);
create index if not exists bookings_payu_order_id_idx on public.bookings(payu_order_id);
