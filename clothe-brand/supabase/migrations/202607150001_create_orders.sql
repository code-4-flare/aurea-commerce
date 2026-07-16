create extension if not exists pgcrypto;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  delivery_county text,
  delivery_town text,
  delivery_address text,
  delivery_notes text,
  subtotal integer not null check (subtotal >= 0),
  delivery_fee integer not null default 0 check (delivery_fee >= 0),
  total integer not null check (total >= 0 and total = subtotal + delivery_fee),
  currency text not null default 'KES' check (currency = 'KES'),
  status text not null default 'pending_payment'
    check (status in ('pending_payment', 'paid', 'processing', 'ready_for_delivery', 'delivered', 'cancelled', 'failed')),
  payment_status text not null default 'pending'
    check (payment_status in ('pending', 'paid', 'failed', 'abandoned', 'refunded')),
  paystack_reference text unique,
  paystack_access_code text,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text,
  product_slug text not null,
  product_name text not null,
  product_image text,
  selected_size text,
  selected_color text,
  unit_price integer not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0),
  line_total integer not null check (line_total >= 0 and line_total = unit_price * quantity),
  created_at timestamptz not null default now()
);

create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete set null,
  paystack_reference text,
  event_type text not null,
  status text,
  amount integer,
  currency text,
  raw_payload jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists order_items_order_id_idx on public.order_items(order_id);
create index if not exists payment_events_order_id_idx on public.payment_events(order_id);
create index if not exists payment_events_reference_idx on public.payment_events(paystack_reference);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payment_events enable row level security;

revoke all on table public.orders, public.order_items, public.payment_events from public, anon, authenticated, service_role;
grant select, insert, update, delete on table public.orders to service_role;
grant insert on table public.order_items to service_role;
grant insert on table public.payment_events to service_role;

revoke execute on function public.set_updated_at() from public, anon, authenticated;
grant execute on function public.set_updated_at() to service_role;

comment on table public.orders is 'Transactional Aurea orders. Server service-role access only.';
comment on table public.order_items is 'Immutable product snapshots captured at checkout.';
comment on table public.payment_events is 'Raw Paystack verification and webhook audit events.';
