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
  async headers() {
    return [
      {
        source: '/(.*)', // 匹配所有路径
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
    ];
  },
};

const { webpack: nextraWebpack, ...othersConfig } = withNextra();

const webpack = (config, options) => {
  /** 先走一遍 nextra 的 webpack 配置 */
  const _config = nextraWebpack(config, options);
  /** 再做自定义 webpack 配置 */
  _config.externals.push({
    'node:os': 'os',
    fsevents: 'fsevents',
    // 'monaco-editor': 'monaco',
  });

  return _config;
};

module.exports = {
  ...othersConfig,
  ...nextConfig,
  webpack,
};
