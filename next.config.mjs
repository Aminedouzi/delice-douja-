/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Browsers request /favicon.ico by default; we only ship a SVG logo.
      { source: "/favicon.ico", destination: "/brand/delice-douja.svg" },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

// Do not set `webpack` during `next dev --turbo`: it confuses Turbopack and can cause dev-only 500s /
// "missing required error components". The webpack override is safe for server builds and
// is only used when Next is running with webpack, not when Turbopack is active.
nextConfig.webpack = (config) => {
  if (process.env.NODE_ENV === "production") {
    config.cache = false;
    config.parallelism = 1;
  }

  if (config.name === "server") {
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        cacheGroups: {
          default: false,
          defaultVendors: false,
        },
      },
    };
  }

  return config;
};

export default nextConfig;
