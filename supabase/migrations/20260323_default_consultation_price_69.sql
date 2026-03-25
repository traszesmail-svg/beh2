insert into public.pricing_settings (id, consultation_price, updated_at)
values ('consultation', 39.00, timezone('utc', now()))
on conflict (id) do update
set consultation_price = excluded.consultation_price,
    updated_at = excluded.updated_at;
