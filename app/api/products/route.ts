import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { isProductCategory } from "@/lib/constants";
import { toProductPublic } from "@/lib/types/database";
import {
  addProduct,
  getAllProducts,
  getProductsByCategory,
} from "@/services/products";
import { serviceRoleMissingResponse } from "@/lib/ensure-service-role";
import { revalidateProductPaths } from "@/lib/revalidate-products";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const rows =
      category && isProductCategory(category)
        ? await getProductsByCategory(category)
        : await getAllProducts();
    return NextResponse.json(rows.map(toProductPublic));
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load products.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return NextResponse.json(auth.body, { status: auth.status });
  }
  const missing = serviceRoleMissingResponse();
  if (missing) return missing;
  try {
    const body = await request.json();
    const { name, description, price, image, category } = body;
    if (
      typeof name !== "string" ||
      typeof description !== "string" ||
      typeof image !== "string" ||
      typeof category !== "string" ||
      !isProductCategory(category)
    ) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    const priceNum = Number(price);
    if (!Number.isFinite(priceNum) || priceNum < 0) {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 });
    }
    const row = await addProduct({
      name,
      description,
      price: priceNum,
      image,
      category,
    });
    revalidateProductPaths();
    return NextResponse.json(toProductPublic(row));
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
