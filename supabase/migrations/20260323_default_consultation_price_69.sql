insert into public.pricing_settings (id, consultation_price, updated_at)
values ('consultation', 69.00, timezone('utc', now()))
on conflict (id) do update
set consultation_price = excluded.consultation_price,
    updated_at = excluded.updated_at
where public.pricing_settings.consultation_price = 28.99;
