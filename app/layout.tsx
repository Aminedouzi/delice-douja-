import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const display = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  display: "swap",
});

const sans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

function metadataBaseUrl(): URL {
  const raw = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").trim();
  try {
    return new URL(raw);
  } catch {
    return new URL("http://localhost:3000");
  }
}

export const metadata: Metadata = {
  metadataBase: metadataBaseUrl(),
  title: {
    default: "Délice Douja — L'art de la haute pâtisserie",
    template: "%s | Délice Douja",
  },
  description:
    "Pâtisserie artisanale au Maroc — gâteaux, cookies, brownies, Dwaz Atay et plus. Commandez via WhatsApp ou notre formulaire.",
  keywords: [
    "pâtisserie",
    "Maroc",
    "gâteau",
    "cookies",
    "Délice Douja",
    "brownies",
    "Dwaz Atay",
  ],
  openGraph: {
    type: "website",
    locale: "fr_MA",
    siteName: "Délice Douja",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/brand/delice-douja.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${display.variable} ${sans.variable} flex min-h-screen flex-col`}
      >
        {children}
      </body>
    </html>
  );
}
