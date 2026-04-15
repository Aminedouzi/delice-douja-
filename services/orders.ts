import { createServerSupabase } from "@/lib/supabaseServer";
import { toUserMessage } from "@/lib/supabase-errors";

export type OrderInput = {
  name: string;
  email: string;
  phone: string;
  address: string;
  quantity: number;
  category: string;
  message?: string | null;
};

/**
 * Inserts a row into the `orders` table (contact / order form).
 * Does not return the new id: with RLS, anon clients often cannot SELECT orders after insert.
 */
export async function createOrder(orderData: OrderInput): Promise<void> {
  const supabase = createServerSupabase();
  const { error } = await supabase.from("orders").insert({
    name: orderData.name,
    email: orderData.email,
    phone: orderData.phone,
    address: orderData.address,
    quantity: orderData.quantity,
    category: orderData.category,
    message: orderData.message ?? null,
  });

  if (error) throw new Error(toUserMessage(error));
}
