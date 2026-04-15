import { NextResponse } from "next/server";
import { sendOrderNotificationEmail } from "@/lib/email/order-notification";
import { createOrder } from "@/services/orders";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const address = typeof body.address === "string" ? body.address.trim() : "";
    const quantity = Number(body.quantity);
    const category = typeof body.category === "string" ? body.category.trim() : "";
    const message =
      typeof body.message === "string" ? body.message.trim() : undefined;
    type ContactItemInput = {
      name?: unknown;
      image?: unknown;
      category?: unknown;
      quantity?: unknown;
      price?: unknown;
    };
    const items = Array.isArray(body.items)
      ? body.items.flatMap((item: ContactItemInput) => {
          if (
            !item ||
            typeof item.name !== "string" ||
            typeof item.image !== "string" ||
            typeof item.category !== "string"
          ) {
            return [];
          }

          const quantityValue = Number(item.quantity);
          const priceValue = Number(item.price);

          return [
            {
              name: item.name.trim(),
              image: item.image.trim(),
              category: item.category.trim(),
              quantity:
                Number.isFinite(quantityValue) && quantityValue > 0
                  ? quantityValue
                  : 1,
              price: Number.isFinite(priceValue) ? priceValue : 0,
            },
          ];
        })
      : [];

    if (!name || !email || !phone || !address || !category) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 9999) {
      return NextResponse.json(
        { error: "Please enter a valid quantity (1–9999)." },
        { status: 400 }
      );
    }

    const payload = {
      name,
      email,
      phone,
      address,
      quantity,
      category,
      message: message || null,
      items,
    };

    await createOrder(payload);

    try {
      await sendOrderNotificationEmail(payload);
    } catch (emailErr) {
      console.error("[contact] Order saved; email notification failed:", emailErr);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    const msg =
      e instanceof Error
        ? e.message
        : "We could not send your request. Please try again.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
