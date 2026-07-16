import "server-only";

import type { CheckoutQuote } from "@/lib/checkout-pricing";
import type { CheckoutPayload, WhatsAppInquiryPayload } from "@/types/checkout";
import { generateOrderNumber, paymentMatchesOrder } from "@/lib/order-utils";
import { getSupabaseAdmin } from "@/src/lib/supabase/server";
import type { OrderInsert, OrderItemInsert, PaymentOrder } from "@/types/orders";
import type { PaymentTransaction, PaymentVerificationResult } from "@/types/payment";

export class OrderPersistenceError extends Error {}

function safeDatabaseError(operation: string, error: { code?: string; message: string }) {
  console.error(`Supabase ${operation} failed`, { code: error.code, message: error.message });
}

function orderItems(orderId: string, quote: CheckoutQuote): OrderItemInsert[] {
  return quote.items.map(item => ({
    order_id: orderId,
    product_id: item.productDocumentId,
    product_slug: item.productId,
    product_name: item.name,
    product_image: item.productImage,
    selected_size: item.size,
    selected_color: item.color,
    unit_price: item.unitPrice,
    quantity: item.quantity,
    line_total: item.unitPrice * item.quantity,
  }));
}

async function insertOrderWithItems(values: OrderInsert, quote: CheckoutQuote) {
  const supabase = getSupabaseAdmin();
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert(values)
    .select("id, order_number, total, currency, status, payment_status, paystack_reference, paid_at")
    .single<PaymentOrder>();

  if (orderError || !order) {
    if (orderError) safeDatabaseError("order creation", orderError);
    throw new OrderPersistenceError("Unable to create the order.");
  }

  const { error: itemError } = await supabase.from("order_items").insert(orderItems(order.id, quote));

  if (itemError) {
    safeDatabaseError("order item creation", itemError);
    const { error: cleanupError } = await supabase.from("orders").delete().eq("id", order.id);
    if (cleanupError) safeDatabaseError("incomplete order cleanup", cleanupError);
    throw new OrderPersistenceError("Unable to save the order items.");
  }

  return order;
}

export async function createPendingOrder(payload: CheckoutPayload, quote: CheckoutQuote) {
  return insertOrderWithItems(
    {
      order_number: generateOrderNumber(),
      order_channel: "paystack",
      customer_name: payload.customer.fullName,
      customer_email: payload.customer.email,
      customer_phone: payload.customer.phone,
      delivery_county: payload.delivery.county,
      delivery_town: payload.delivery.town,
      delivery_address: payload.delivery.address,
      delivery_notes: payload.delivery.notes || null,
      subtotal: quote.subtotal,
      delivery_fee: quote.deliveryFee,
      total: quote.total,
      currency: "KES",
      status: "pending_payment",
      payment_status: "pending",
    },
    quote,
  );
}

export async function createWhatsAppInquiry(payload: WhatsAppInquiryPayload, quote: CheckoutQuote) {
  return insertOrderWithItems(
    {
      order_number: generateOrderNumber(),
      order_channel: "whatsapp_inquiry",
      customer_name: payload.customer?.fullName ?? null,
      customer_email: payload.customer?.email ?? null,
      customer_phone: payload.customer?.phone ?? null,
      delivery_county: payload.delivery?.county ?? null,
      delivery_town: payload.delivery?.town ?? null,
      delivery_address: payload.delivery?.address ?? null,
      delivery_notes: payload.delivery?.notes || null,
      subtotal: quote.subtotal,
      delivery_fee: quote.deliveryFee,
      total: quote.total,
      currency: "KES",
      status: "whatsapp_inquiry",
      payment_status: "not_required",
    },
    quote,
  );
}

export async function attachPaystackTransaction(orderId: string, reference: string, accessCode: string) {
  const { error } = await getSupabaseAdmin()
    .from("orders")
    .update({ paystack_reference: reference, paystack_access_code: accessCode })
    .eq("id", orderId);

  if (error) {
    safeDatabaseError("Paystack reference update", error);
    throw new OrderPersistenceError("Payment started, but the order reference could not be saved.");
  }
}

export async function markOrderInitializationFailed(orderId: string) {
  const { error } = await getSupabaseAdmin()
    .from("orders")
    .update({ status: "failed", payment_status: "failed" })
    .eq("id", orderId)
    .eq("payment_status", "pending");
  if (error) safeDatabaseError("initialization failure update", error);
}

export async function findOrderByReference(reference: string) {
  const { data, error } = await getSupabaseAdmin()
    .from("orders")
    .select("id, order_number, total, currency, status, payment_status, paystack_reference, paid_at")
    .eq("paystack_reference", reference)
    .maybeSingle<PaymentOrder>();

  if (error) {
    safeDatabaseError("order lookup", error);
    throw new OrderPersistenceError("Unable to retrieve the order.");
  }
  return data;
}

export async function recordPaymentEvent(input: {
  orderId?: string;
  reference: string;
  eventType: string;
  status?: string;
  amount?: number;
  currency?: string;
  rawPayload: unknown;
}) {
  const { error } = await getSupabaseAdmin().from("payment_events").insert({
    order_id: input.orderId ?? null,
    paystack_reference: input.reference,
    event_type: input.eventType,
    status: input.status ?? null,
    amount: input.amount ?? null,
    currency: input.currency ?? null,
    raw_payload: input.rawPayload,
  });

  if (error) {
    safeDatabaseError("payment event creation", error);
    throw new OrderPersistenceError("Unable to record the payment event.");
  }
}

export async function reconcileOrderPayment(
  order: PaymentOrder,
  transaction: PaymentTransaction,
): Promise<PaymentVerificationResult> {
  if (!paymentMatchesOrder(transaction, order)) {
    const isFinalFailure = ["abandoned", "failed", "reversed"].includes(transaction.status);
    const isMismatch = transaction.status === "success";

    if (isFinalFailure || isMismatch) {
      const paymentStatus = transaction.status === "abandoned" ? "abandoned" : "failed";
      const { error } = await getSupabaseAdmin()
        .from("orders")
        .update({ status: "failed", payment_status: paymentStatus })
        .eq("id", order.id)
        .neq("payment_status", "paid");
      if (error) {
        safeDatabaseError("failed payment update", error);
        throw new OrderPersistenceError("Unable to save the failed payment state.");
      }
    }

    return {
      status: isFinalFailure || isMismatch ? "failed" : "pending",
      orderNumber: order.order_number,
      orderId: order.id,
      message: isMismatch
        ? "The payment amount or currency did not match the order."
        : "The payment has not been confirmed as successful.",
    };
  }

  if (order.payment_status !== "paid") {
    const { data: updatedOrder, error } = await getSupabaseAdmin()
      .from("orders")
      .update({ status: "paid", payment_status: "paid", paid_at: new Date().toISOString() })
      .eq("id", order.id)
      .eq("payment_status", "pending")
      .select("id")
      .maybeSingle();
    if (error) {
      safeDatabaseError("paid order update", error);
      throw new OrderPersistenceError("Unable to update the paid order.");
    }
    if (!updatedOrder) {
      const { data: currentOrder, error: lookupError } = await getSupabaseAdmin()
        .from("orders")
        .select("payment_status")
        .eq("id", order.id)
        .maybeSingle<{ payment_status: string }>();
      if (lookupError) {
        safeDatabaseError("concurrent payment state lookup", lookupError);
        throw new OrderPersistenceError("Unable to confirm the order payment state.");
      }
      if (currentOrder?.payment_status !== "paid") {
        throw new OrderPersistenceError("The order is no longer awaiting payment.");
      }
    }
  }

  return {
    status: "paid",
    orderNumber: order.order_number,
    orderId: order.id,
    message: "Payment verified successfully.",
  };
}
