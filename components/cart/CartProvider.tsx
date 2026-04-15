"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CART_STORAGE_KEY, type CartItem } from "@/lib/cart";

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  totalQuantity: number;
  totalPrice: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CART_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;
      const safeItems = parsed.filter(
        (item) =>
          item &&
          typeof item.id === "number" &&
          typeof item.name === "string" &&
          typeof item.image === "string" &&
          typeof item.price === "number" &&
          typeof item.category === "string" &&
          typeof item.quantity === "number"
      );
      setItems(safeItems);
    } catch {
      window.localStorage.removeItem(CART_STORAGE_KEY);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("cart-updated"));
  }, [items, ready]);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.length;
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    return {
      items,
      itemCount,
      totalQuantity,
      totalPrice,
      addItem(item) {
        setItems((current) => {
          const existing = current.find((entry) => entry.id === item.id);
          if (!existing) return [...current, item];
          return current.map((entry) =>
            entry.id === item.id
              ? { ...entry, quantity: entry.quantity + item.quantity }
              : entry
          );
        });
      },
      removeItem(id) {
        setItems((current) => current.filter((entry) => entry.id !== id));
      },
      updateQuantity(id, quantity) {
        setItems((current) =>
          current.flatMap((entry) => {
            if (entry.id !== id) return [entry];
            if (quantity < 1) return [];
            return [{ ...entry, quantity }];
          })
        );
      },
      clearCart() {
        setItems([]);
      },
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
