import { defineConfig } from 'dumi';
import { join } from 'path';
import { defineThemeConfig } from 'dumi-theme-antd/dist/defineThemeConfig';
import { Divider } from 'antd';
import { dir } from 'console';

const isProduction = process.env.NODE_ENV === 'production';
const basePath = isProduction ? '/portal/' : '/';

const themeConfig = defineThemeConfig({
  name: '｜ Portal',
  title: 'GraphScope Portal',
  logo: 'https://img.alicdn.com/imgextra/i4/O1CN012GxzhO1h3j6rsmvuQ_!!6000000004222-2-tps-1890-453.png',
  lastUpdated: true,
  nav: {
    'zh-CN': [
      { title: '图组件', link: '/graphs' },
      { title: '通用组件', link: '/components' },
      { title: '模型编辑', link: '/floweditors' },
      { title: '建模', link: '/modelings' },
      { title: '查询', link: '/queries' },
    ],
    'en-US': [
      { title: 'graph', link: '/graphs' },
      { title: 'components', link: '/components' },
      { title: 'flow-editor', link: '/floweditors' },
      { title: 'modeling', link: '/modelings' },
      { title: 'query', link: '/queries' },
    ],
  },
  footer:
    'Made with<span style="color: rgb(255, 255, 255);">❤</span>by <span>GraphScope | Copyright © 2022-present</span>',
  github: 'https://github.com/GraphScope/portal.git',
  localesEnhance: [
    { id: 'zh-CN', switchPrefix: '中' },
    { id: 'en-US', switchPrefix: 'en' },
  ],
  description: {
    'zh-CN': '基于 GraphScope Portal 的组件库，帮助开发者快速构建图应用',
    'en-US': 'A component library based on GraphScope Portal, helping developers quickly build graph applications.',
  },
  actions: {
    'zh-CN': [
      {
        type: 'primary',
        text: '开始使用',
        link: '/components',
      },
      {
        text: '体验建模',
        link: '/modelings',
      },
      {
        text: '体验查询',
        link: '/queries',
      },
    ],
    'en-US': [
      {
        type: 'primary',
        text: 'Quick start',
        link: '/components-en',
      },
      {
        text: 'Data Modeling',
        link: '/modelings-en',
      },
      {
        text: 'Data Querying',
        link: '/queries-en',
      },
    ],
  },
  features: {
    'zh-CN': [
      {
        title: '数据建模',
        details:
          '手动拖拽建模，轻松创建图的点边标签与属性。支持 CSV，SQL DDL 导入建模，让用户拥有在白板上设计图模型般的自由体验',
      },
      {
        title: '数据查询',
        details:
          '一键连接引擎地址即可查询图数据。支持Cypher/Gremlin 语法，支持历史查询，智能查询，让用户查询数据低门槛无负担',
      },
      {
        title: '开箱即用',
        details: '沉淀 10+ 通用组件，产品与交互标准化。可以在 Web，Jupyternote 端开箱即用，加速图应用研发的效率',
      },
    ],
    'en-US': [
      {
        title: 'Data Modeling',
        details:
          'Manually drag and drop to model, easily creating graph nodes, edges, and attributes. Supports CSV and SQL DDL import for modeling, giving users the freedom to design graph models as if on a whiteboard.',
      },
      {
        title: 'Data Querying',
        details:
          'Query graph data by connecting to the engine address with a single click. Supports Cypher/Gremlin syntax, historical queries, and intelligent queries, making data querying easy and hassle-free for users.',
      },
      {
        title: 'Out-of-the-Box',
        details:
          'Includes over 10 general-purpose components, with standardized product and interaction design. Ready to use in Web and Jupyter Notebook environments, accelerating the efficiency of graph application development.',
      },
    ],
  },

  footerLinks: [
    {
      title: '相关资源',
      items: [
        {
          title: 'graphscope',

          url: 'https://github.com/alibaba/graphscope',
          openExternal: true,
        },
        {
          title: 'graphscope portal',

          url: 'https://github.com/GraphScope/portal',
          openExternal: true,
        },
      ],
    },
    {
      title: '帮助',
      items: [
        {
          title: 'GitHub',
          url: 'https://github.com/GraphScope/portal',
          openExternal: true,
        },
        {
          title: '更新日志',
          url: 'https://github.com/GraphScope/portal/changelog',
        },
      ],
    },
    {
      title: '更多产品',
      icon: 'https://camo.githubusercontent.com/45f3e5a1aa6a8d1229aede5062e8ec28a88658cc4a23ad4bbbbdf112036d6276/68747470733a2f2f677261706873636f70652e696f2f6173736574732f696d616765732f677261706873636f70652d6c6f676f2e737667',
      items: [
        {
          title: 'GART',
          description: 'Graph Analysis on Relational Transactional Datasets',
          url: 'https://github.com/GraphScope/GART',
          openExternal: true,
        },
        {
          title: 'GraphAR',
          description: 'An open source, standard data file format for graph data storage and retrieval.',
          url: 'https://github.com/apache/incubator-graphar',
          openExternal: true,
        },
      ],
    },
  ],
  moreLinks: [
    {
      text: 'GraphScope',
      link: 'https://github.com/alibaba/graphscope',
    },
  ],
});
export default defineConfig({
  base: basePath,
  publicPath: basePath,
  title: 'GraphScope',
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
    '@graphscope/studio-importor': join(__dirname, 'packages', 'studio-importor'),
    '@graphscope/studio-query': join(__dirname, 'packages', 'studio-query'),
    '@graphscope/use-zustand': join(__dirname, 'packages', 'use-zustand'),
    '@graphscope/studio-graph': join(__dirname, 'packages', 'studio-graph'),
    '@graphscope/studio-flow-editor': join(__dirname, 'packages', 'studio-flow-editor'),
  },
  externals: {
    'node:os': 'commonjs2 node:os',
  },
  locales: [
    { id: 'zh-CN', name: '中文', suffix: '' },
    { id: 'en-US', name: 'English', suffix: '-en' },
  ],
  jsMinifier: 'terser',
  resolve: {
    docDirs: ['packages/studio-components'],
    atomDirs: [
      {
        type: 'components',
        dir: 'packages/studio-components/src',
      },
      {
        type: 'components/properties-panel',
        dir: 'packages/studio-query/src/properties-panel',
      },
      {
        type: 'components/query-statement',
        dir: 'packages/studio-query/src/statement',
      },
      {
        type: 'floweditor',
        dir: 'packages/studio-flow-editor/docs',
      },
      {
        type: 'modeling',
        dir: 'packages/studio-importor/src/app',
      },
      {
        type: 'query',
        dir: 'packages/studio-query/src/app',
      },
      {
        type: 'graph',
        dir: 'packages/studio-graph/docs',
      },
    ],
  },
  mfsu: false,
  links: [],
  themeConfig,
});
