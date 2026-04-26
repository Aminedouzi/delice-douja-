import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMessages, isLocale } from "@/lib/i18n";
import { createT } from "@/lib/t";
import {
  CATEGORY_ORDER,
  whatsappOrderLink,
  type ProductCategory,
} from "@/lib/constants";
import type { Locale } from "@/lib/constants";
import { getAllProducts } from "@/services/products";
import { toProductPublic } from "@/lib/types/database";
import { ProductCard } from "@/components/ProductCard";

const categoryEmoji: Partial<Record<ProductCategory, string>> = {
  BROWNIES: "🍫",
  COOKIES: "🍪",
};

type CustomOrderMessage = {
  label: "FR" | "EN" | "AR";
  lang: "fr" | "en" | "ar";
  text: string;
  dir?: "rtl";
};

const customOrderMessages: CustomOrderMessage[] = [
  {
    label: "FR",
    lang: "fr",
    text: "Nous réalisons tout type de pâtisserie sur commande.",
  },
  {
    label: "EN",
    lang: "en",
    text: "We can make any type of pastry to order.",
  },
  {
    label: "AR",
    lang: "ar",
    dir: "rtl",
    text: "يمكننا إعداد أي نوع من الحلويات حسب الطلب.",
  },
];

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
      ? "Patisserie a Fes et au Maroc | Delice Douja"
      : locale === "ar"
        ? "حلويات راقية في فاس والمغرب | دليس دوجا"
        : "Pastry in Fez and Morocco | Delice Douja";
  const description = messages.meta.description;
  const canonical = new URL(`/${locale}`, siteUrl).toString();

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      images: [
        {
          url: new URL("/brand/delice-douja.png", siteUrl).toString(),
          width: 512,
          height: 512,
          alt: "Delice Douja",
        },
      ],
    },
  };
}

export default async function HomePage({ params }: Props) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const messages = await getMessages(locale);
  const t = createT(messages);
  const prefix = `/${locale}`;

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-light-pink/40 via-cream to-cream">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,rgba(255,248,243,0.92)_12%,rgba(255,248,243,0.76)_44%,rgba(255,244,238,0.62)_100%)]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 20%, #F5E6D3 0%, transparent 45%),
              radial-gradient(circle at 80% 10%, #D4AF37 0%, transparent 35%)`,
          }}
        />
        <div className="relative mx-auto flex min-h-[calc(100vh-8rem)] max-w-7xl items-center px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
          <div className="animate-fade-up relative w-full overflow-hidden rounded-[2.25rem] border border-white/60 bg-white/48 p-7 shadow-[0_28px_80px_rgba(88,45,32,0.12)] backdrop-blur-md sm:p-10 lg:min-h-[32rem] lg:p-12 xl:p-14">
            <Image
              src="/brand/background.jpeg"
              alt=""
              fill
              priority
              quality={65}
              sizes="(max-width: 768px) 100vw, 1120px"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,248,243,0.9),rgba(255,248,243,0.72))]" />
            <div className="relative space-y-7">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-chocolate/55">
              {t("hero.tagline")}
            </p>
            <h1 className="max-w-5xl font-display text-5xl font-bold leading-[0.95] text-chocolate sm:text-6xl lg:text-7xl xl:text-[5.5rem]">
              {t("hero.title")}
            </h1>
            <p className="max-w-4xl text-xl leading-relaxed text-chocolate/80 sm:text-2xl">
              {t("hero.subtitle")}
            </p>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <Link
                href={`${prefix}/store`}
                className="inline-flex min-h-[58px] w-full items-center justify-center rounded-full bg-chocolate px-8 py-4 text-base font-semibold text-cream shadow-card transition-all duration-300 hover:bg-chocolate/90 hover:shadow-lift"
              >
                {t("hero.ctaStore")}
              </Link>
              <Link
                href={`${prefix}/contact`}
                className="inline-flex min-h-[58px] w-full items-center justify-center rounded-full border-2 border-chocolate/25 bg-cream/80 px-8 py-4 text-base font-semibold text-chocolate transition-all duration-300 hover:border-gold hover:bg-light-pink/30"
              >
                {t("hero.ctaContact")}
              </Link>
              <a
                href={whatsappOrderLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[58px] w-full items-center justify-center rounded-full bg-gold px-8 py-4 text-base font-semibold text-chocolate shadow-md transition-all duration-300 hover:bg-gold-dark"
              >
                {t("hero.ctaWhatsapp")}
              </a>
            </div>
            <div className="rounded-[1.75rem] border border-chocolate/10 bg-cream/80 p-4 shadow-card backdrop-blur-sm sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-chocolate/60">
                Sur commande • Made to order • حسب الطلب
              </p>
              <div className="mt-4 grid gap-3 lg:grid-cols-3">
                {customOrderMessages.map((message) => (
                  <div
                    key={message.label}
                    className="rounded-2xl bg-white/70 p-4 text-sm leading-relaxed text-chocolate shadow-sm"
                  >
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-gold-dark">
                      {message.label}
                    </span>
                    <p
                      lang={message.lang}
                      dir={message.dir}
                      className={message.dir === "rtl" ? "text-right" : undefined}
                    >
                      {message.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-chocolate sm:text-4xl">
            {t("home.categoriesTitle")}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-chocolate/70">
            {t("home.categoriesSubtitle")}
          </p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORY_ORDER.map((cat) => (
            <Link
              key={cat}
              href={`${prefix}/store?category=${cat}`}
              className="group rounded-2xl border border-chocolate/10 bg-white/60 p-6 shadow-card backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-lift"
            >
              <span className="text-2xl" aria-hidden>
                {categoryEmoji[cat] ?? "✨"}
              </span>
              <h3 className="mt-3 font-display text-xl font-semibold text-chocolate group-hover:text-gold-dark">
                {t(`categories.${cat}`)}
              </h3>
              <p className="mt-2 text-sm text-chocolate/60">
                {t("hero.ctaStore")} →
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-chocolate/10 bg-white/40 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center font-display text-3xl font-bold text-chocolate">
            {t("home.trustTitle")}
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                title: t("home.trust1Title"),
                body: t("home.trust1Body"),
              },
              {
                title: t("home.trust2Title"),
                body: t("home.trust2Body"),
              },
              {
                title: t("home.trust3Title"),
                body: t("home.trust3Body"),
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl bg-cream p-6 shadow-card transition-shadow hover:shadow-lift"
              >
                <h3 className="font-display text-lg font-semibold text-chocolate">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-chocolate/75">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-chocolate sm:text-4xl">
            {t("home.featuredTitle") || t("store.title")}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-chocolate/70">
            {t("home.featuredSubtitle") || t("store.subtitle")}
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(
            await getAllProducts()
          )
            .slice(0, 6)
            .map((product) => (
              <ProductCard
                key={product.id}
                product={toProductPublic(product)}
                locale={locale}
                t={t}
              />
            ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href={`${prefix}/store`}
            className="inline-flex rounded-full border-2 border-chocolate/25 bg-cream/80 px-8 py-3 text-base font-semibold text-chocolate transition-all duration-300 hover:border-gold hover:bg-light-pink/30"
          >
            {t("hero.ctaStore")}
          </Link>
        </div>
      </section>
    </>
  );
}
