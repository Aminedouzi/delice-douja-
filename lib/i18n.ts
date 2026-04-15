import type { Locale } from "./constants";

const dictionaries = {
  en: () => import("@/messages/en.json").then((m) => m.default),
  fr: () => import("@/messages/fr.json").then((m) => m.default),
  ar: () => import("@/messages/ar.json").then((m) => m.default),
};

export type Messages = Awaited<ReturnType<(typeof dictionaries)["en"]>>;

export async function getMessages(locale: Locale): Promise<Messages> {
  return dictionaries[locale]();
}

export function isLocale(s: string): s is Locale {
  return s === "en" || s === "fr" || s === "ar";
}
