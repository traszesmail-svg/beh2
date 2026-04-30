create table if not exists public.funnel_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (
    event_type in (
      'home_view',
      'cta_click',
      'topic_selected',
      'slot_selected',
      'form_started',
      'payment_opened',
      'manual_pending',
      'paid',
      'confirmed',
      'reject_cancel',
      'payment_started',
      'payment_success',
      'payment_failed',
      'faq_open',
      'opinion_add',
      'room_entered'
    )
  ),
  booking_id uuid references public.bookings(id) on delete set null,
  qa_booking boolean not null default false,
  source text not null check (source in ('client', 'server')),
  page_path text,
  location text,
  properties jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists funnel_events_created_at_idx on public.funnel_events(created_at desc);
create index if not exists funnel_events_event_type_idx on public.funnel_events(event_type);
create index if not exists funnel_events_qa_booking_idx on public.funnel_events(qa_booking);
create index if not exists funnel_events_booking_id_idx on public.funnel_events(booking_id);
