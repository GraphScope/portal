/** @type {import('next').NextConfig} */
const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
});

// const isProduction = process.env.NODE_ENV === "production";
// const assetPrefix = isProduction ? "/docs" : "";

const nextConfig = {
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: true,
  // assetPrefix,
  // basePath: assetPrefix,
  output: 'export',
  experimental: {
    esmExternals: 'loose',
    optimizePackageImports: ['node:os'],
  },
};

module.exports = {
  ...withNextra(),
  ...nextConfig,
};
