import type { Messages } from "@/lib/i18n";

export type TFunction = (key: string) => string;

export function createT(messages: Messages): TFunction {
  return (key: string) => {
    const parts = key.split(".");
    let cur: unknown = messages;
    for (const p of parts) {
      if (cur && typeof cur === "object" && p in cur) {
        cur = (cur as Record<string, unknown>)[p];
      } else {
        return key;
      }
    }
    return typeof cur === "string" ? cur : key;
  };
}
