import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getMessages, isLocale } from "@/lib/i18n";
import { createT } from "@/lib/t";
import {
  LOCATION_COORDS_LABEL,
  MAP_EMBED_URL,
  type Locale,
} from "@/lib/constants";
import { CartProvider } from "@/components/cart/CartProvider";
import { BasketOrderForm } from "@/components/cart/BasketOrderForm";
import { BasketSummary } from "@/components/cart/BasketSummary";
import { ContactForm } from "@/components/ContactForm";

type Props = { params: { locale: string } };

function metadataBaseUrl(): URL {
  const raw = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").trim();
  try {
    return new URL(raw);
  } catch {
    return new URL("http://localhost:3000");
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isLocale(params.locale)) {
    return {};
  }

  const locale = params.locale as Locale;
  const messages = await getMessages(locale);
  const siteUrl = metadataBaseUrl();
  const title =
    locale === "fr"
      ? "Commander une patisserie a Fes | Delice Douja"
      : locale === "ar"
        ? "اطلب الحلويات في فاس | دليس دوجا"
        : "Order pastry in Fez | Delice Douja";
  const description = messages.contact.subtitle;
  const canonical = new URL(`/${locale}/contact`, siteUrl).toString();

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
    },
  };
}

export default async function ContactPage({ params }: Props) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const messages = await getMessages(locale);
  const t = createT(messages);

  return (
    <CartProvider>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="font-display text-4xl font-bold text-chocolate">
            {t("contact.title")}
          </h1>
          <p className="mt-3 text-chocolate/75">{t("contact.subtitle")}</p>
        </div>
        <div className="mt-12 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <BasketSummary messages={messages} />
            <Suspense
              fallback={
                <div className="h-96 animate-pulse rounded-2xl bg-chocolate/10" />
              }
            >
              <BasketOrderForm messages={messages} />
            </Suspense>
          </div>
          <div>
            <div className="mb-6">
              <h2 className="font-display text-2xl font-semibold text-chocolate">
                {t("contact.directTitle")}
              </h2>
              <p className="mt-2 text-sm text-chocolate/70">
                {t("contact.directSubtitle")}
              </p>
            </div>
            <Suspense
              fallback={
                <div className="h-96 animate-pulse rounded-2xl bg-chocolate/10" />
              }
            >
              <ContactForm messages={messages} />
            </Suspense>
          </div>
        </div>
        <div className="mt-12 overflow-hidden rounded-[2rem] border border-chocolate/10 bg-white/70 shadow-[0_20px_60px_rgba(88,45,32,0.08)]">
          <div className="border-b border-chocolate/10 px-6 py-5">
            <p className="font-display text-2xl font-semibold text-chocolate">
              {t("footer.map")}
            </p>
            <p className="mt-2 text-sm text-chocolate/70">
              {LOCATION_COORDS_LABEL}
            </p>
          </div>
          <iframe
            src={MAP_EMBED_URL}
            title="Delice Douja location map"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[360px] w-full border-0 sm:h-[420px]"
          />
        </div>
      </div>
    </CartProvider>
  );
}
