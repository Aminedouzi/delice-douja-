import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { isProductCategory } from "@/lib/constants";
import { toProductPublic } from "@/lib/types/database";
import {
  deleteProduct,
  getProductById,
  updateProduct,
} from "@/services/products";
import { serviceRoleMissingResponse } from "@/lib/ensure-service-role";
import { revalidateProductPaths } from "@/lib/revalidate-products";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    const product = await getProductById(id);
    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(toProductPublic(product));
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load product.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return NextResponse.json(auth.body, { status: auth.status });
  }
  const missing = serviceRoleMissingResponse();
  if (missing) return missing;
  const id = Number(params.id);
  if (!Number.isFinite(id) || id < 1) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  try {
    const body = await request.json();
    const patch: {
      name?: string;
      description?: string;
      price?: number;
      image?: string;
      category?: string;
    } = {};

    if (typeof body.name === "string") patch.name = body.name;
    if (typeof body.description === "string")
      patch.description = body.description;
    if (body.price !== undefined) {
      const priceNum = Number(body.price);
      if (!Number.isFinite(priceNum) || priceNum < 0) {
        return NextResponse.json({ error: "Invalid price" }, { status: 400 });
      }
      patch.price = priceNum;
    }
    if (typeof body.image === "string") patch.image = body.image;
    if (body.category !== undefined) {
      if (typeof body.category !== "string" || !isProductCategory(body.category)) {
        return NextResponse.json({ error: "Invalid category" }, { status: 400 });
      }
      patch.category = body.category;
    }

    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const row = await updateProduct(id, patch);
    revalidateProductPaths();
    return NextResponse.json(toProductPublic(row));
  } catch (e) {
    const message = e instanceof Error ? e.message : "Update failed";
    const status = message.includes("No rows") ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return NextResponse.json(auth.body, { status: auth.status });
  }
  const missing = serviceRoleMissingResponse();
  if (missing) return missing;
  const id = Number(params.id);
  if (!Number.isFinite(id) || id < 1) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  try {
    await deleteProduct(id);
    revalidateProductPaths();
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
