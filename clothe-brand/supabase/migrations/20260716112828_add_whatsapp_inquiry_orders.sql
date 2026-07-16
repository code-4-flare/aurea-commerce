alter table public.orders
  add column order_channel text not null default 'paystack';

alter table public.orders
  alter column customer_name drop not null,
  alter column customer_email drop not null,
  alter column customer_phone drop not null;

alter table public.orders
  drop constraint if exists orders_status_check,
  drop constraint if exists orders_payment_status_check;

alter table public.orders
  add constraint orders_order_channel_check
    check (order_channel in ('paystack', 'whatsapp_inquiry')),
  add constraint orders_status_check
    check (status in ('pending_payment', 'whatsapp_inquiry', 'paid', 'processing', 'ready_for_delivery', 'delivered', 'cancelled', 'failed')),
  add constraint orders_payment_status_check
    check (payment_status in ('pending', 'not_required', 'paid', 'failed', 'abandoned', 'refunded')),
  add constraint orders_checkout_customer_check
    check (
      order_channel = 'whatsapp_inquiry'
      or (customer_name is not null and customer_email is not null and customer_phone is not null)
    );

create index orders_whatsapp_inquiry_created_at_idx
  on public.orders(created_at desc)
  where order_channel = 'whatsapp_inquiry';

comment on column public.orders.order_channel is
  'Checkout channel. WhatsApp inquiries do not require payment or complete customer details.';
