"use client";

import { useEffect } from "react";

import { useCommerceStore } from "@/store/use-commerce-store";

export default function ClearCartOnPayment() {
  const clearCart = useCommerceStore(state => state.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return null;
}
