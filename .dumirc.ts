import { defineConfig } from 'dumi';

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
  resolve: {
    docDirs: ['docs'],
    atomDirs: [
      // {
      //   type: 'home',
      //   dir: 'docs',
      // },
      {
        type: 'component',
        dir: 'packages/studio-importor/src',
      },
      {
        type: 'component',
        dir: 'packages/studio-query/src',
      },
    ],
  },
  mfsu: false,
  links: [],
  themeConfig,
});
