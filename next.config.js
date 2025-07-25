import withNextIntl from 'next-intl/plugin';

const withNextIntlConfig = withNextIntl(
  // This is the default (also the `src` folder is supported out of the box)
  './src/i18n.ts'
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  serverExternalPackages: ['playwright'],
};

export default withNextIntlConfig(nextConfig);
