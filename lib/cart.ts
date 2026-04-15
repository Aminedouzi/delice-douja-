import type { ProductPublic } from "@/lib/types/database";

export const CART_STORAGE_KEY = "delice-douja-cart";

export type CartItem = {
  id: number;
  name: string;
  image: string;
  price: number;
  category: string;
  quantity: number;
};

export function toCartItem(product: ProductPublic): CartItem {
  return {
    id: product.id,
    name: product.name,
    image: product.image,
    price: Number(product.price),
    category: product.category,
    quantity: 1,
  };
}
