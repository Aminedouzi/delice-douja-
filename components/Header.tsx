import Image from "next/image";
import Link from "next/link";
import { HeaderCartButton } from "@/components/cart/HeaderCartButton";
import type { Locale } from "@/lib/constants";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { whatsappOrderLink } from "@/lib/constants";

export function Header({
  locale,
  navHome,
  navAbout,
  navStore,
  navContact,
  navCart,
  ctaWhatsapp,
}: {
  locale: Locale;
  navHome: string;
  navAbout: string;
  navStore: string;
  navContact: string;
  navCart: string;
  ctaWhatsapp: string;
}) {
  const prefix = `/${locale}`;

  return (
    <header className="sticky top-0 z-50 border-b border-rose-200/60 bg-[linear-gradient(180deg,rgba(255,251,248,0.97),rgba(255,244,238,0.92))] backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-full bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.58),transparent_55%),linear-gradient(90deg,rgba(248,200,220,0.08),rgba(212,175,55,0.08),rgba(248,200,220,0.08))]" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6 lg:grid-cols-[minmax(260px,auto)_minmax(0,1fr)_auto] lg:gap-5 lg:px-8">
        <Link
          href={prefix}
          className="group flex min-w-0 items-center gap-3 rounded-[1.75rem] pr-2 transition-all duration-300"
        >
          <div className="relative shrink-0 rounded-[1.6rem] bg-[linear-gradient(145deg,rgba(255,255,255,0.92),rgba(255,241,235,0.86))] p-1.5 shadow-[0_18px_38px_rgba(88,45,32,0.14)] ring-1 ring-white/70 transition duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_22px_44px_rgba(88,45,32,0.18)]">
            <div className="absolute inset-1.5 rounded-[1.25rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.8),transparent_65%)]" />
            <Image
              src="/brand/delice-douja.png"
              alt="Delice Douja logo"
              width={108}
              height={108}
              priority
              className="relative h-[62px] w-[62px] rounded-[1.1rem] border border-rose-100/80 bg-white object-cover sm:h-[72px] sm:w-[72px]"
            />
          </div>
          <div className="min-w-0 flex-1 transition duration-300 group-hover:-translate-y-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-display text-[1.45rem] font-bold leading-none tracking-[0.01em] sm:text-[1.9rem] lg:text-[2.2rem]">
                <span className="text-chocolate">Delice Douja</span>
              </span>
              <span className="hidden rounded-full border border-rose-200/80 bg-rose-50/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-rose-500 xl:inline-flex">
                Maison
              </span>
            </div>
            <span className="mt-1 block whitespace-normal text-[9px] font-medium uppercase tracking-[0.26em] text-gold-dark/90 sm:text-[10px] lg:text-[11px]">
              Haute Patisserie Artisanale
            </span>
          </div>
        </Link>

        <nav className="hidden w-full grid-cols-4 items-stretch gap-2 rounded-[2rem] border border-rose-100/90 bg-white/85 p-2 shadow-[0_18px_40px_rgba(88,45,32,0.10)] backdrop-blur-sm lg:grid">
          <NavLink href={prefix} label={navHome} />
          <NavLink href={`${prefix}/about`} label={navAbout} />
          <NavLink href={`${prefix}/store`} label={navStore} />
          <NavLink href={`${prefix}/contact`} label={navContact} />
        </nav>

        <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-3">
          <HeaderCartButton href={`${prefix}/contact#basket`} label={navCart} />
          <a
            href={whatsappOrderLink(ctaWhatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full bg-[linear-gradient(135deg,#e8c257,#d7a93a)] px-5 py-2.5 text-sm font-semibold text-chocolate shadow-[0_14px_28px_rgba(212,175,55,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(212,175,55,0.34)] xl:inline-block"
          >
            {ctaWhatsapp}
          </a>
          <LanguageSwitcher current={locale} />
        </div>
      </div>

      <div className="relative flex border-t border-white/60 bg-white/35 px-4 py-3 lg:hidden">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:justify-center">
          <MobileNavLink href={prefix} label={navHome} />
          <MobileNavLink href={`${prefix}/about`} label={navAbout} />
          <MobileNavLink href={`${prefix}/store`} label={navStore} />
          <MobileNavLink href={`${prefix}/contact`} label={navContact} />
          <a
            href={whatsappOrderLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="col-span-2 rounded-full bg-[linear-gradient(135deg,#e8c257,#d7a93a)] px-3 py-2 text-center text-xs font-semibold text-chocolate shadow-md sm:col-auto"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex min-h-[54px] items-center justify-center rounded-full border border-transparent bg-white/70 px-4 py-2.5 text-center text-sm font-semibold text-chocolate/80 transition-all duration-300 hover:border-rose-100/90 hover:bg-rose-50 hover:text-gold-dark"
    >
      {label}
    </Link>
  );
}

function MobileNavLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-full border border-white/70 bg-white/60 px-3 py-2 text-center text-xs font-semibold text-chocolate/75 shadow-sm transition-all duration-300 hover:border-rose-200/80 hover:bg-rose-50/80 hover:text-chocolate"
    >
      {label}
    </Link>
  );
}
