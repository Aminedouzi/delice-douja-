import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/constants";
import type { ProductCategory } from "@/lib/constants";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import type { TFunction } from "@/lib/t";
import type { ProductPublic } from "@/lib/types/database";

export function ProductCard({
  product,
  locale,
  t,
}: {
  product: ProductPublic;
  locale: Locale;
  t: TFunction;
}) {
  const prefix = `/${locale}`;
  const cat = product.category as ProductCategory;
  const isLocalImage = product.image.startsWith("/");

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-chocolate/10 bg-white/80 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <Link
        href={`${prefix}/contact?category=${product.category}`}
        className="relative aspect-[4/3] w-full overflow-hidden bg-light-pink/30"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized={!isLocalImage}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-gold-dark">
          {t(`categories.${cat}`)}
        </p>
        <h3 className="mt-1 font-display text-xl font-semibold text-chocolate">
          {product.name}
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm text-chocolate/70">
          {product.description}
        </p>
        <div className="mt-4 flex items-center justify-between gap-2 border-t border-chocolate/10 pt-4">
          <span className="text-lg font-bold text-chocolate">
            {Number(product.price).toFixed(2)}{" "}
            <span className="text-sm font-medium text-chocolate/60">
              {t("store.price")}
            </span>
          </span>
          <div className="flex flex-wrap justify-end gap-2">
            <AddToCartButton
              product={product}
              label={t("store.addToCart")}
              addedLabel={t("store.addedToCart")}
            />
            <Link
              href={`${prefix}/contact?category=${product.category}`}
              className="rounded-full bg-gold px-4 py-2 text-xs font-semibold text-chocolate transition-colors hover:bg-gold-dark sm:text-sm"
            >
              {t("store.addDetails")}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
