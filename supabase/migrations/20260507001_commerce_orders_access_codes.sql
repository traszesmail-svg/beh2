create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_email text not null,
  customer_name text not null default '',
  product_id text not null,
  product_name text not null,
  product_type text not null default 'ebook',
  amount numeric(10,2) not null,
  online_amount numeric(10,2) not null,
  manual_amount numeric(10,2) not null,
  currency text not null default 'PLN',
  payment_method text,
  status text not null default 'created',
  access_code text,
  admin_confirmation_token text,
  admin_confirmation_token_used_at timestamptz,
  admin_confirmation_ip text,
  admin_confirmation_user_agent text,
  stripe_checkout_session_id text,
  provider_payment_id text,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  paid_at timestamptz,
  access_sent_at timestamptz,
  payment_reported_at timestamptz,
  cancelled_at timestamptz,
  constraint orders_status_check check (status in (
    'created',
    'waiting_manual_payment',
    'payment_reported',
    'paid',
    'access_sent',
    'cancelled',
    'expired'
  )),
  constraint orders_payment_method_check check (payment_method in ('online', 'blik_phone', 'mock') or payment_method is null)
);

create table if not exists public.access_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  order_id uuid not null references public.orders(id) on delete cascade,
  customer_email text not null,
  product_id text not null,
  status text not null default 'active',
  usage_count integer not null default 0,
  usage_limit integer not null default 1,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  used_at timestamptz,
  constraint access_codes_status_check check (status in ('active', 'used', 'expired', 'revoked'))
);

create index if not exists orders_order_number_idx on public.orders(order_number);
create index if not exists orders_admin_confirmation_token_idx on public.orders(admin_confirmation_token);
create index if not exists orders_stripe_checkout_session_id_idx on public.orders(stripe_checkout_session_id);
create index if not exists access_codes_code_idx on public.access_codes(code);
create index if not exists access_codes_order_id_idx on public.access_codes(order_id);

alter table public.orders enable row level security;
alter table public.access_codes enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'orders' and policyname = 'Service role full access orders'
  ) then
    create policy "Service role full access orders" on public.orders
      for all using (true) with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'access_codes' and policyname = 'Service role full access access_codes'
  ) then
    create policy "Service role full access access_codes" on public.access_codes
      for all using (true) with check (true);
  end if;
end $$;
