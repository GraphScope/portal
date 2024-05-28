import { defineConfig } from 'dumi';
import { join } from 'path';
// reference:https://dumi-theme-antd-style.arvinx.app/zh-CN/config
const themeConfig = {
  name: 'GraphScope',
  logo: 'https://img.alicdn.com/imgextra/i3/O1CN01DaSVLB1lD7ZIbDOi2_!!6000000004784-2-tps-256-257.png',
  socialLinks: { github: '' },
  footer: 'Made with ❤️ by GraphScope team',
  apiHeader: false,
  hideHomeNav: true,
};

export default defineConfig({
  title: 'GraphScope', // 网站header标题
  favicons: ['https://img.alicdn.com/imgextra/i3/O1CN01DaSVLB1lD7ZIbDOi2_!!6000000004784-2-tps-256-257.png'], // 网站 favicon
  metas: [
    // 自定义 meta 标签
    { name: 'keywords', content: 'GraphScope' },
    {
      name: 'description',
      content: 'A collection of React Components',
    },
  ],
  alias: {
    '@graphscope/studio-components': join(__dirname, 'packages', 'studio-components'),
  },
  resolve: {
    docDirs: ['docs'],
    atomDirs: [
      // {
      //   type: 'products',
      //   dir: 'packages/studio-sdk/src',
      // },
      // {
      //   type: 'products',
      //   dir: 'packages/studio-sdk-py/src',
      // },
      // {
      //   type: 'component',
      //   dir: 'packages/studio-canvas/src',
      // },
      // {
      //   type: 'component',
      //   dir: 'packages/studio-importor/src',
      // },
      // {
      //   type: 'component',
      //   dir: 'packages/studio-query/src',
      // },
      {
        type: 'component',
        dir: 'packages/studio-components/src',
      },
    ],
  },
  mfsu: false,
  links: [],
  themeConfig,
});
