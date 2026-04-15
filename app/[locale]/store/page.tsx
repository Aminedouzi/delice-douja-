import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMessages, isLocale } from "@/lib/i18n";
import { createT } from "@/lib/t";
import { CATEGORY_ORDER, isProductCategory } from "@/lib/constants";
import type { Locale } from "@/lib/constants";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { CartProvider } from "@/components/cart/CartProvider";
import { toProductPublic } from "@/lib/types/database";
import {
  getAllProducts,
  getProductsByCategory,
} from "@/services/products";
import type { ProductRow } from "@/lib/types/database";

type Props = {
  params: { locale: string };
  searchParams: { category?: string };
};

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
      ? "Boutique patisserie a Fes | Delice Douja"
      : locale === "ar"
        ? "متجر الحلويات في فاس | دليس دوجا"
        : "Pastry shop in Fez | Delice Douja";
  const description = messages.store.subtitle;
  const canonical = new URL(`/${locale}/store`, siteUrl).toString();

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

export default async function StorePage({ params, searchParams }: Props) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const messages = await getMessages(locale);
  const t = createT(messages);
  const prefix = `/${locale}`;

  const filter = searchParams.category;

  let rows: ProductRow[] = [];
  let error = "";
  try {
    rows =
      filter && isProductCategory(filter)
        ? await getProductsByCategory(filter)
        : await getAllProducts();
  } catch (err) {
    rows = [];
    error = err instanceof Error ? err.message : "Failed to load products.";
  }

  const serialized = rows.map(toProductPublic);

  return (
    <CartProvider>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-4xl font-bold text-chocolate">
          {t("store.title")}
        </h1>
        <p className="mt-3 max-w-2xl text-chocolate/75">{t("store.subtitle")}</p>

        <div className="mt-8 flex flex-wrap gap-2">
          <FilterChip
            href={`${prefix}/store`}
            active={!filter}
            label={t("store.all")}
          />
          {CATEGORY_ORDER.map((cat) => (
            <FilterChip
              key={cat}
              href={`${prefix}/store?category=${cat}`}
              active={filter === cat}
              label={t(`categories.${cat}`)}
            />
          ))}
        </div>

        {error ? (
          <p className="mt-16 text-center text-red-700/90">{error}</p>
        ) : serialized.length === 0 ? (
          <p className="mt-16 text-center text-chocolate/60">{t("store.empty")}</p>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {serialized.map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} t={t} />
            ))}
          </div>
        )}
      </div>
    </CartProvider>
  );
}

function FilterChip({
  href,
  active,
  label,
}: {
  href: string;
  active: boolean;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
        active
          ? "border-gold bg-gold text-chocolate shadow-md"
          : "border-chocolate/15 bg-white/70 text-chocolate/80 hover:border-gold/50 hover:bg-light-pink/40"
      }`}
    >
      {label}
    </Link>
  );
}
