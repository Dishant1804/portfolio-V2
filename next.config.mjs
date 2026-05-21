/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      {
        source: "/relay/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/relay/array/:path*",
        destination: "https://us-assets.i.posthog.com/array/:path*",
      },
      {
        source: "/relay/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:all*(jpg|jpeg|png|webp|avif|gif|svg)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
