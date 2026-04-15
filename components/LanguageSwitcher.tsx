"use client";

import { usePathname, useRouter } from "next/navigation";
import type { Locale } from "@/lib/constants";
import { LOCALES } from "@/lib/constants";

const labels: Record<Locale, string> = {
  fr: "FR",
  en: "EN",
  ar: "عربي",
};

export function LanguageSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname();
  const router = useRouter();

  function switchLocale(next: Locale) {
    const segments = (pathname ?? "/").split("/").filter(Boolean);
    if (segments.length === 0) {
      router.push(`/${next}`);
      return;
    }
    if (LOCALES.includes(segments[0] as Locale)) {
      segments[0] = next;
    } else {
      segments.unshift(next);
    }
    router.push(`/${segments.join("/")}`);
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-white/70 bg-white/65 p-1 shadow-[0_12px_24px_rgba(88,45,32,0.08)] backdrop-blur-sm">
      {LOCALES.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => switchLocale(loc)}
          className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-all duration-200 sm:px-3 sm:text-sm ${
            current === loc
              ? "bg-[linear-gradient(135deg,#e8c257,#d7a93a)] text-chocolate shadow-md"
              : "text-chocolate/70 hover:bg-rose-50/80 hover:text-chocolate"
          }`}
          aria-pressed={current === loc}
          aria-label={`Language ${loc}`}
        >
          {labels[loc]}
        </button>
      ))}
    </div>
  );
}
