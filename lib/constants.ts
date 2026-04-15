export const LOCALES = ["en", "fr", "ar"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "fr";

export const CATEGORY_ORDER = [
  "CAKE_ANNIVERSAIRE",
  "DWAZ_ATAY",
  "BISCUIT_DIAMANT",
  "BROWNIES",
  "COOKIES",
] as const;

export type ProductCategory = (typeof CATEGORY_ORDER)[number];

export function isProductCategory(s: string): s is ProductCategory {
  return (CATEGORY_ORDER as readonly string[]).includes(s);
}

export const WHATSAPP_NUMBER = "212776402345"; // Morocco without leading 0
export const WHATSAPP_DISPLAY = "0776402345";
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ||
  "jabbarkhadija78@gmail.com";
export const INSTAGRAM_HANDLE = "delice.douja";
export const LOCATION_LAT = 33.9935278;
export const LOCATION_LNG = -5.0585;
export const LOCATION_COORDS_LABEL = `33°59'36.7"N 5°03'30.6"W`;
export const MAPS_URL = `https://www.google.com/maps?q=${LOCATION_LAT},${LOCATION_LNG}`;
export const MAP_EMBED_URL = `https://www.google.com/maps?q=${LOCATION_LAT},${LOCATION_LNG}&z=17&output=embed`;

export function whatsappOrderLink(message?: string) {
  const text = message ?? "";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function contactEmailLink(subject?: string, body?: string) {
  const params = new URLSearchParams();
  if (subject?.trim()) params.set("subject", subject.trim());
  if (body?.trim()) params.set("body", body.trim());
  const query = params.toString();
  return `mailto:${CONTACT_EMAIL}${query ? `?${query}` : ""}`;
}

export function gmailComposeLink(subject?: string, body?: string) {
  const params = new URLSearchParams();
  params.set("view", "cm");
  params.set("fs", "1");
  params.set("to", CONTACT_EMAIL);
  if (subject?.trim()) params.set("su", subject.trim());
  if (body?.trim()) params.set("body", body.trim());
  return `https://mail.google.com/mail/?${params.toString()}`;
}

export const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`;
/** Update in lib/constants.ts if your Facebook page URL differs */
export const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61566609781979";
