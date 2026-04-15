import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DocumentLang } from "@/components/DocumentLang";
import { getMessages, isLocale } from "@/lib/i18n";
import { createT } from "@/lib/t";
import type { Locale } from "@/lib/constants";
import {
  CONTACT_EMAIL,
  FACEBOOK_URL,
  INSTAGRAM_URL,
  LOCATION_LAT,
  LOCATION_LNG,
  MAPS_URL,
  WHATSAPP_DISPLAY,
} from "@/lib/constants";

type Props = {
  children: React.ReactNode;
  params: { locale: string };
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
  const messages = await getMessages(params.locale);
  const siteUrl = metadataBaseUrl();
  const canonical = new URL(`/${params.locale}`, siteUrl).toString();
  return {
    title: messages.meta.title,
    description: messages.meta.description,
    keywords: [
      "patisserie fes",
      "patisserie maroc",
      "gateaux fes",
      "cookies maroc",
      "brownies maroc",
      "delice douja",
      "commande patisserie fes",
    ],
    alternates: {
      canonical,
      languages: {
        fr: new URL("/fr", siteUrl).toString(),
        en: new URL("/en", siteUrl).toString(),
        ar: new URL("/ar", siteUrl).toString(),
        "x-default": new URL("/fr", siteUrl).toString(),
      },
    },
    openGraph: {
      title: messages.meta.title,
      description: messages.meta.description,
      url: canonical,
      siteName: "Delice Douja",
      locale:
        params.locale === "fr"
          ? "fr_MA"
          : params.locale === "ar"
            ? "ar_MA"
            : "en_MA",
      type: "website",
      images: [
        {
          url: new URL("/brand/delice-douja.png", siteUrl).toString(),
          width: 512,
          height: 512,
          alt: "Delice Douja",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: messages.meta.title,
      description: messages.meta.description,
      images: [new URL("/brand/delice-douja.png", siteUrl).toString()],
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  if (!isLocale(params.locale)) {
    notFound();
  }
  const locale = params.locale as Locale;
  const messages = await getMessages(locale);
  const t = createT(messages);
  const siteUrl = metadataBaseUrl();
  const localeUrl = new URL(`/${locale}`, siteUrl).toString();
  const bakeryJsonLd = {
    "@context": "https://schema.org",
    "@type": "Bakery",
    name: "Delice Douja",
    url: localeUrl,
    image: new URL("/brand/delice-douja.png", siteUrl).toString(),
    logo: new URL("/brand/delice-douja.png", siteUrl).toString(),
    description: messages.meta.description,
    telephone: `+212${WHATSAPP_DISPLAY.slice(1)}`,
    email: CONTACT_EMAIL,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Fes",
      addressRegion: "Fes-Meknes",
      addressCountry: "MA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: LOCATION_LAT,
      longitude: LOCATION_LNG,
    },
    areaServed: [
      { "@type": "City", name: "Fes" },
      { "@type": "Country", name: "Morocco" },
    ],
    priceRange: "$$",
    sameAs: [INSTAGRAM_URL, FACEBOOK_URL, MAPS_URL],
  };

  return (
    <>
      <DocumentLang locale={locale} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bakeryJsonLd) }}
      />
      <Header
        locale={locale}
        navHome={t("nav.home")}
        navAbout={t("nav.about")}
        navStore={t("nav.store")}
        navContact={t("nav.contact")}
        navCart={t("nav.cart")}
        ctaWhatsapp={t("hero.ctaWhatsapp")}
      />
      <main className="flex-1">{children}</main>
      <Footer
        locale={locale}
        tagline={t("hero.tagline")}
        location={t("footer.location")}
        follow={t("footer.follow")}
        map={t("footer.map")}
        about={t("nav.about")}
        store={t("nav.store")}
        contact={t("nav.contact")}
        rights={t("footer.rights")}
      />
    </>
  );
}
