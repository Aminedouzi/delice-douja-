import type { AppProps } from "next/app";

/**
 * Minimal Pages Router shell so Next can render `pages/_error` when the dev
 * server needs a fallback (App-only projects otherwise hit “missing required
 * error components”).
 */
export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
