"use client";

import { create } from "zustand";

import type { CartItem, ColorSwatch, Product } from "@/types/commerce";

type CommerceStore = {
  cartItems: CartItem[];
  isCartOpen: boolean;
  isSearchOpen: boolean;
  wishlist: string[];
  openCart: () => void;
  closeCart: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  addToCart: (product: Product, color: ColorSwatch, size: string, quantity?: number) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  removeCartItem: (id: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
};

export const useCommerceStore = create<CommerceStore>((set, get) => ({
  cartItems: [],
  isCartOpen: false,
  isSearchOpen: false,
  wishlist: [],
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
  addToCart: (product, color, size, quantity = 1) => {
    const id = `${product.id}-${color.name.replace(/\s+/g, "")}-${size}`;
    const existing = get().cartItems.find(item => item.id === id);

    set({
      cartItems: existing
        ? get().cartItems.map(item => (item.id === id ? { ...item, quantity: item.quantity + quantity } : item))
        : [...get().cartItems, { id, product, selectedColor: color, selectedSize: size, quantity }],
      isCartOpen: true,
    });
  },
  updateCartQuantity: (id, quantity) => {
    set({
      cartItems: get().cartItems.map(item => (item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item)),
    });
  },
  removeCartItem: id => set({ cartItems: get().cartItems.filter(item => item.id !== id) }),
  clearCart: () => set({ cartItems: [] }),
  toggleWishlist: productId => {
    const wishlist = get().wishlist;
    set({ wishlist: wishlist.includes(productId) ? wishlist.filter(id => id !== productId) : [...wishlist, productId] });
  },
}));
