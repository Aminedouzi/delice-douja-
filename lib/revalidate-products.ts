import { revalidatePath, revalidateTag } from "next/cache";
import { LOCALES } from "@/lib/constants";

/**
 * Product mutations affect both the admin dashboard and each localized store.
 * Revalidate those paths so App Router does not keep serving stale product lists.
 */
export function revalidateProductPaths() {
  revalidateTag("products");
  revalidatePath("/admin/dashboard");

  for (const locale of LOCALES) {
    revalidatePath(`/${locale}/store`);
  }
}
