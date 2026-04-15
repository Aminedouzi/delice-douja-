/** Row shape returned from Supabase `products` table */
export type ProductRow = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  created_at: string;
};

/** Payload for creating/updating a product (DB columns only) */
export type ProductInput = {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
};

/** Normalized product for UI (API / components) */
export type ProductPublic = {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  created_at?: string;
};

export function toProductPublic(row: ProductRow): ProductPublic {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: String(row.price),
    image: row.image,
    category: row.category,
    created_at: row.created_at,
  };
}
