/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🔁 Rewrite favicon vers ton SVG
  async rewrites() {
    return [
      {
        source: "/favicon.ico",
        destination: "/brand/delice-douja.svg",
      },
    ];
  },

  // 🖼️ Optimisation images (Supabase / Unsplash etc.)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      // 👉 si tu utilises Supabase Storage, décommente et adapte :
      // {
      //   protocol: "https",
      //   hostname: "YOUR_PROJECT.supabase.co",
      //   pathname: "/storage/v1/object/public/**",
      // },
    ],
  },

  // ⚠️ IMPORTANT : éviter que Vercel bloque le build à cause ESLint
  eslint: {
    ignoreDuringBuilds: true,
  },
};

// ⚙️ Webpack custom (optimisation production)
nextConfig.webpack = (config, { isServer }) => {
  if (process.env.NODE_ENV === "production") {
    config.cache = false;
    config.parallelism = 1;
  }

  // 🔧 optimisation serveur uniquement
  if (isServer) {
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