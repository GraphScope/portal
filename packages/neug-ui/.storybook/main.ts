import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  stories: ['./**/*.stories.@(js|jsx|ts|tsx|mdx)', '../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],

  addons: ['@storybook/addon-links', '@storybook/addon-docs', '@storybook/addon-a11y'],

  framework: {
    name: '@storybook/nextjs',
    options: {},
  },

  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: prop => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },

  // 暂时注释掉 webpack 配置，使用更简单的方式
  // webpackFinal: async (config) => {
  //   return config;
  // },
  staticDirs: ['../public'],
};

export default config;
