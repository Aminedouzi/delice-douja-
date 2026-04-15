import { unstable_cache } from "next/cache";
import { createServerSupabase } from "@/lib/supabaseServer";
import { toUserMessage } from "@/lib/supabase-errors";
import type { ProductInput, ProductRow } from "@/lib/types/database";
import { isProductCategory } from "@/lib/constants";

const PRODUCT_COLUMNS =
  "id,name,description,price,image,category,created_at";

function assertCategory(category: string): void {
  if (!isProductCategory(category)) {
    throw new Error("Invalid product category.");
  }
}

async function getAllProductsQuery(): Promise<ProductRow[]> {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .order("created_at", { ascending: false });

  if (error) throw new Error(toUserMessage(error));
  return (data as ProductRow[]) ?? [];
}

const getAllProductsCached = unstable_cache(getAllProductsQuery, ["products"], {
  revalidate: 3600,
  tags: ["products"],
});

const getProductsByCategoryCached = unstable_cache(
  async (value: string) => {
    const supabase = createServerSupabase();
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_COLUMNS)
      .eq("category", value)
      .order("created_at", { ascending: false });

    if (error) throw new Error(toUserMessage(error));
    return (data as ProductRow[]) ?? [];
  },
  ["products-by-category"],
  {
    revalidate: 3600,
    tags: ["products"],
  }
);

export async function getAllProducts(): Promise<ProductRow[]> {
  return getAllProductsCached();
}

export async function getProductsByCategory(
  category: string
): Promise<ProductRow[]> {
  if (!isProductCategory(category)) {
    throw new Error("Invalid product category.");
  }
  return getProductsByCategoryCached(category);
}

export async function getProductById(id: number): Promise<ProductRow | null> {
  if (!Number.isFinite(id) || id < 1) return null;
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(toUserMessage(error));
  return data as ProductRow | null;
}

export async function addProduct(product: ProductInput): Promise<ProductRow> {
  assertCategory(product.category);
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("products")
    .insert({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
    })
    .select()
    .single();

  if (error) throw new Error(toUserMessage(error));
  return data as ProductRow;
}

export async function updateProduct(
  id: number,
  data: Partial<ProductInput>
): Promise<ProductRow> {
  if (!Number.isFinite(id) || id < 1) {
    throw new Error("Invalid product id.");
  }
  if (data.category !== undefined) {
    assertCategory(data.category);
  }

  const patch: Record<string, unknown> = {};
  if (data.name !== undefined) patch.name = data.name;
  if (data.description !== undefined) patch.description = data.description;
  if (data.price !== undefined) patch.price = data.price;
  if (data.image !== undefined) patch.image = data.image;
  if (data.category !== undefined) patch.category = data.category;

  if (Object.keys(patch).length === 0) {
    throw new Error("No fields to update.");
  }

  const supabase = createServerSupabase();
  const { data: row, error } = await supabase
    .from("products")
    .update(patch)
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) throw new Error(toUserMessage(error));
  if (!row) throw new Error("Product not found.");
  return row as ProductRow;
}

export async function deleteProduct(id: number): Promise<void> {
  if (!Number.isFinite(id) || id < 1) {
    throw new Error("Invalid product id.");
  }
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("products")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) throw new Error(toUserMessage(error));
  if (!data) throw new Error("Product not found.");
}
