import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/.well-known/appspecific/com.tesla.3p.public-key.pem',
        destination: '/wellknown/appspecific/com.tesla.3p.public-key.txt',
      },
      {
        source: '/.well-known/:path*',
        destination: '/wellknown/:path*',
      },
    ];
  },
};

export default nextConfig;
