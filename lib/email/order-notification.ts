export type OrderEmailPayload = {
  name: string;
  email: string;
  phone: string;
  address: string;
  quantity: number;
  category: string;
  message: string | null;
  items?: Array<{
    name: string;
    image: string;
    category: string;
    quantity: number;
    price: number;
  }>;
};

const DEFAULT_TO = "Jabbarkhadija78@gmail.com";

/**
 * Sends notification to the bakery inbox using Formspree.
 */
const FORMSPREE_ENDPOINT =
  process.env.FORMSPREE_ENDPOINT?.trim() ||
  "https://formspree.io/f/xgopqjql";

function absoluteImageUrl(image: string): string {
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "").trim().replace(/\/$/, "");
  if (!siteUrl) return image;

  return `${siteUrl}${image.startsWith("/") ? image : `/${image}`}`;
}

export async function sendOrderNotificationEmail(
  data: OrderEmailPayload
): Promise<void> {
  const to = process.env.ORDER_NOTIFICATION_EMAIL?.trim() || DEFAULT_TO;
  const items = data.items ?? [];
  const itemsSummary = items.length
    ? items
        .map((item, index) =>
          [
            `Product ${index + 1}: ${item.name}`,
            `Quantity: ${item.quantity}`,
            `Category: ${item.category}`,
            `Price: ${item.price.toFixed(2)}`,
            `Image: ${absoluteImageUrl(item.image)}`,
          ].join("\n")
        )
        .join("\n\n")
    : null;

  const itemImages = items.length
    ? items
        .map((item) => `${item.name}: ${absoluteImageUrl(item.image)}`)
        .join("\n")
    : null;

  const response = await fetch(FORMSPREE_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      quantity: data.quantity,
      category: data.category,
      message: data.message,
      items_summary: itemsSummary,
      item_images: itemImages,
      _replyto: to,
      _subject: `[Delice Douja] New request - ${data.name}`,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[order-email] Formspree error:", response.status, errorText);
    throw new Error(`Formspree send failed (${response.status})`);
  }
}
