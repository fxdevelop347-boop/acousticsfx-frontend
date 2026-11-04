import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Tree-shake icon packages (fewer unused icons in the client bundle). */
  experimental: {
    optimizePackageImports: ["lucide-react", "react-icons"],
  },
  /** The category slug is "acoustics"; the old "acoustic" URL was in the sitemap and rendered Not Found. */
  async redirects() {
    return [
      {
        source: "/products/acoustic/:path*",
        destination: "/products/acoustics/:path*",
        permanent: true,
      },
    ];
  },
  /** Cache public assets (paths are not hashed; use SWR so updates propagate without stale-forever risk). */
  async headers() {
    return [
      {
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/3dviewer/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
    /** Default quality steps for `next/image` `quality` prop */
    qualities: [75, 78, 80, 85],
  },
};

export default nextConfig;
