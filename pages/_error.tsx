import type { NextPageContext } from "next";

/**
 * Required fallback for Next’s internal error renderer when something throws
 * before/during App Router error boundaries. Without this file, dev can loop on
 * “missing required error components” and return 500 for every route.
 */
function ErrorPage({ statusCode }: { statusCode?: number }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        fontFamily: "system-ui, sans-serif",
        background: "#F5E6D3",
        color: "#4B2E2B",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "1.25rem", fontWeight: 600 }}>
        Something went wrong
      </h1>
      <p style={{ marginTop: "0.5rem", maxWidth: "24rem", opacity: 0.85 }}>
        {statusCode
          ? `The server reported an error (${statusCode}). Check the terminal where Next.js is running for details.`
          : "An error occurred. Check the terminal where Next.js is running for details."}
      </p>
    </div>
  );
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res?.statusCode ?? err?.statusCode ?? 404;
  return { statusCode };
};

export default ErrorPage;
