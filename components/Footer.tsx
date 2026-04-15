import Link from "next/link";
import type { Locale } from "@/lib/constants";
import {
  CONTACT_EMAIL,
  FACEBOOK_URL,
  INSTAGRAM_URL,
  MAPS_URL,
  contactEmailLink,
  whatsappOrderLink,
} from "@/lib/constants";

export function Footer({
  locale,
  tagline,
  location,
  follow,
  map,
  about,
  store,
  contact,
  rights,
}: {
  locale: Locale;
  tagline: string;
  location: string;
  follow: string;
  map: string;
  about: string;
  store: string;
  contact: string;
  rights: string;
}) {
  const year = new Date().getFullYear();
  const prefix = `/${locale}`;
  const emailSubject = "Contact Delice Douja";
  const emailBody =
    "Bonjour Delice Douja,\n\nJe souhaite vous contacter concernant...";

  return (
    <footer className="mt-auto border-t border-chocolate/10 bg-chocolate text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        <div>
          <p className="font-display text-2xl font-semibold">
            <span className="italic text-gold">Delice</span>{" "}
            <span className="font-extrabold uppercase text-gold">Douja</span>
          </p>
          <p className="mt-2 max-w-xs text-sm text-cream/80">{tagline}</p>
          <p className="mt-4 text-sm text-cream/70">{location}</p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-gold">
            {follow}
          </p>
          <ul className="mt-4 flex flex-col gap-2 text-sm">
            <li>
              <a
                href={whatsappOrderLink()}
                className="inline-flex items-center gap-3 text-cream/90 transition-colors hover:text-gold"
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp
              </a>
            </li>
            <li>
              <a
                href={contactEmailLink(emailSubject, emailBody)}
                className="inline-flex items-center gap-3 text-cream/90 transition-colors hover:text-gold"
              >
                <MailIcon className="h-4 w-4" />
                {CONTACT_EMAIL}
              </a>
            </li>
            <li>
              <a
                href={INSTAGRAM_URL}
                className="inline-flex items-center gap-3 text-cream/90 transition-colors hover:text-gold"
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstagramIcon className="h-4 w-4" />
                Instagram
              </a>
            </li>
            <li>
              <a
                href={FACEBOOK_URL}
                className="inline-flex items-center gap-3 text-cream/90 transition-colors hover:text-gold"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FacebookIcon className="h-4 w-4" />
                Facebook
              </a>
            </li>
            <li>
              <a
                href={MAPS_URL}
                className="inline-flex items-center gap-3 text-cream/90 transition-colors hover:text-gold"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MapPinIcon className="h-4 w-4" />
                {map}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-gold">
            {store}
          </p>
          <ul className="mt-4 flex flex-col gap-2 text-sm">
            <li>
              <Link
                href={`${prefix}/about`}
                className="text-cream/90 transition-colors hover:text-gold"
              >
                {about}
              </Link>
            </li>
            <li>
              <Link
                href={`${prefix}/store`}
                className="text-cream/90 transition-colors hover:text-gold"
              >
                {store}
              </Link>
            </li>
            <li>
              <Link
                href={`${prefix}/contact`}
                className="text-cream/90 transition-colors hover:text-gold"
              >
                {contact}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10 py-6 text-center text-xs text-cream/50">
        © {year} Delice Douja - {rights}
      </div>
    </footer>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M20 11.5A8.5 8.5 0 0 1 7.54 19l-3.54 1 1.03-3.41A8.5 8.5 0 1 1 20 11.5Z" />
      <path d="M9.4 8.9c.24-.53.5-.54.72-.55h.62c.18 0 .43.07.55.35.12.27.42 1.03.46 1.1.04.08.06.18 0 .29-.06.12-.1.19-.2.3-.1.1-.2.22-.29.3-.1.1-.2.2-.09.4.1.19.47.77 1 1.24.69.62 1.27.82 1.45.92.18.1.29.08.4-.05.1-.12.43-.5.54-.67.12-.18.24-.15.4-.09.17.06 1.07.5 1.25.59.18.1.3.15.34.24.04.1.04.56-.2 1.1-.24.53-1.4 1.04-1.93 1.07-.5.02-1.13.07-3.63-.96-3.01-1.24-4.05-4.2-4.13-4.37-.08-.17-.69-1.14-.69-2.17 0-1.02.53-1.52.72-1.73Z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5h.01" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M14 8h2.5V4.5H14A4 4 0 0 0 10 8.5V11H7v3.5h3V20h3.5v-5.5H16L16.5 11h-3V8.7A.7.7 0 0 1 14 8Z" />
    </svg>
  );
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 21s6-5.33 6-11a6 6 0 1 0-12 0c0 5.67 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}
