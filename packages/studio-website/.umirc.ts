import { defineConfig } from 'umi';
import MonacoEditorWebpackPlugin from 'monaco-editor-webpack-plugin';
import dotenv from 'dotenv';

const { parsed } = dotenv.configDotenv();

const { PROXY_URL, BACKEND_URL, SLOT_URL = '' } = parsed || {};
let headScripts;
let externals;

if (process.env.NODE_ENV === 'development') {
  // 开发环境代码
  headScripts = [];
  externals = {
    'node:os': 'commonjs2 node:os',
  };
}
if (process.env.NODE_ENV === 'production') {
  headScripts = [
    'https://gw.alipayobjects.com/os/lib/react/18.2.0/umd/react.production.min.js',
    'https://gw.alipayobjects.com/os/lib/react-dom/18.2.0/umd/react-dom.production.min.js',
    SLOT_URL,
  ];
  externals = {
    'node:os': 'commonjs2 node:os',
    react: 'React',
    'react-dom': 'ReactDOM',
  };
}

export default defineConfig({
  routes: [
    { path: '/', redirect: '/graphs' },
    { path: '/graphs', component: 'instance' },
    { path: '/graphs/create', component: 'instance/create' },
    { path: '/setting', component: 'setting' },
    { path: '/job', component: 'job' },
    { path: '/job/detail', component: 'job/job-detail' },
    { path: '/extension', component: 'extension' },
    { path: '/extension/:name', component: 'extension/create-plugins' },
    { path: '/alert', component: 'alert' },
    { path: '/deployment', component: 'deployment' },
    { path: '/modeling', component: 'modeling' },
    { path: '/importing', component: 'importing' },
    { path: '/querying', component: 'query' },
    { path: '/exploring', component: 'exploring' },
  ],
  jsMinifier: 'terser',
  npmClient: 'pnpm',
  monorepoRedirect: {},
  externals,
  headScripts,
  // 其他 Umi 配置项
  chainWebpack(config) {
    config.plugin('monaco-editor-webpack-plugin').use(MonacoEditorWebpackPlugin, [
      {
        //@ts-ignore
        languages: ['cypher', 'gremlin'], // 只加载 cypher 语言
      },
    ]);
  },
  mfsu: {
    shared: {
      react: {
        singleton: true,
      },
    },
  },
  proxy: {
    '/api/': {
      target: PROXY_URL,
      changeOrigin: true,
    },
    '/graph/': {
      target: BACKEND_URL,
      changeOrigin: true,
    },
  },
  // 只设置 dev 阶段的 sourcemap
  devtool: process.env.NODE_ENV === 'development' ? 'eval' : false,
  // analyze: {
  //   analyzerPort: 'auto',
  // },
  // codeSplitting: {
  //   jsStrategy: 'granularChunks',
  // },
});
