import { defineConfig } from 'umi';
import dotenv from 'dotenv';
const { parsed } = dotenv.configDotenv();
const { PROXY_URL_GROOT, PROXY_URL_INTERACTIVE, PORXY_URL_LOCAL } = parsed || {};

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
  externals: {
    // '@antv/g2': 'G2',
    'node:os': 'commonjs2 node:os',
    // '@graphscope/_test_gremlin_': 'GS_GREMLIN',
    // react: 'React',
    // 'react-dom': 'ReactDOM',
  },
  mfsu: {
    shared: {
      react: {
        singleton: true,
      },
    },
  },

  proxy: {
    '/api': {
      target: PROXY_URL_GROOT,
      changeOrigin: true,
    },
    '/query': {
      target: PORXY_URL_LOCAL,
      changeOrigin: true,
    },
    '/query_endpoint': {
      target: PORXY_URL_LOCAL,
      changeOrigin: true,
    },
  },
  // analyze: {
  //   analyzerPort: 'auto',
  // },
  // codeSplitting: {
  //   jsStrategy: 'granularChunks',
  // },
  headScripts: [
    // 'https://gw.alipayobjects.com/os/lib/antv/g2/5.1.14/dist/g2.min.js',
    // 'https://gw.alipayobjects.com/os/lib/react/18.2.0/umd/react.production.min.js',
    // 'https://gw.alipayobjects.com/os/lib/react-dom/18.2.0/umd/react-dom.production.min.js',
  ],
});
