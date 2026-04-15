"use client";

import { useRef } from "react";

export function EmailContactLink({
  email,
  mailtoHref,
  gmailHref,
  className,
  children,
}: {
  email: string;
  mailtoHref: string;
  gmailHref: string;
  className?: string;
  children: React.ReactNode;
}) {
  const timeoutRef = useRef<number | null>(null);

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();

    const clearFallback = () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      document.removeEventListener("visibilitychange", clearFallback);
      window.removeEventListener("blur", clearFallback);
    };

    document.addEventListener("visibilitychange", clearFallback, { once: true });
    window.addEventListener("blur", clearFallback, { once: true });

    window.location.href = mailtoHref;

    timeoutRef.current = window.setTimeout(() => {
      clearFallback();
      window.open(gmailHref, "_blank", "noopener,noreferrer");
    }, 900);
  }

  return (
    <a
      href={mailtoHref}
      onClick={handleClick}
      className={className}
      aria-label={`Send an email to ${email}`}
      title={email}
    >
      {children}
    </a>
  );
}
