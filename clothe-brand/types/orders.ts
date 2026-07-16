export type OrderChannel = "paystack" | "whatsapp_inquiry";
export type OrderCurrency = "KES";
export type OrderStatus =
  | "pending_payment"
  | "whatsapp_inquiry"
  | "paid"
  | "processing"
  | "ready_for_delivery"
  | "delivered"
  | "cancelled"
  | "failed";
export type OrderPaymentStatus = "pending" | "not_required" | "paid" | "failed" | "abandoned" | "refunded";

export type Order = {
  id: string;
  order_number: string;
  order_channel: OrderChannel;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  delivery_county: string | null;
  delivery_town: string | null;
  delivery_address: string | null;
  delivery_notes: string | null;
  subtotal: number;
  delivery_fee: number;
  total: number;
  currency: OrderCurrency;
  status: OrderStatus;
  payment_status: OrderPaymentStatus;
  paystack_reference: string | null;
  paystack_access_code: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_slug: string;
  product_name: string;
  product_image: string | null;
  selected_size: string | null;
  selected_color: string | null;
  unit_price: number;
  quantity: number;
  line_total: number;
  created_at: string;
};

export type OrderInsert = Pick<
  Order,
  | "order_number"
  | "order_channel"
  | "customer_name"
  | "customer_email"
  | "customer_phone"
  | "delivery_county"
  | "delivery_town"
  | "delivery_address"
  | "delivery_notes"
  | "subtotal"
  | "delivery_fee"
  | "total"
  | "currency"
  | "status"
  | "payment_status"
>;

export type OrderItemInsert = Omit<OrderItem, "id" | "created_at">;

export type PaymentOrder = Pick<
  Order,
  "id" | "order_number" | "total" | "currency" | "status" | "payment_status" | "paystack_reference" | "paid_at"
>;
