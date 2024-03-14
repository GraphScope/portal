import { defineConfig } from 'umi';

export default defineConfig({
  routes: [
    { path: '/', redirect: '/instance' },
    { path: '/instance', component: 'instance' },
    { path: '/setting', component: 'setting' },
    { path: '/instance/create', component: 'instance/create-instance' },
    { path: '/instance/view-schema', component: 'instance/view-schema' },
    { path: '/instance/import-data', component: 'instance/import-data' },
    { path: '/query', component: 'query' },
    { path: '/query-app', component: 'query/app', layout: false },
    { path: '/job', component: 'job' },
    { path: '/job/detail', component: 'job/detail' },
    { path: '/extension', component: 'extension' },
    { path: '/extension/:name', component: 'extension/create-plugins' },
    { path: '/alert', component: 'alert' },
    { path: '/deployment', component: 'deployment' },
  ],
  npmClient: 'pnpm',
  monorepoRedirect: {},
  externals: {
    '@antv/g2': 'G2',
    // react: 'React', 'react-dom': 'ReactDOM'
  },
  proxy: {
    '/api': {
      target:
        // 'http://47.242.172.5:8080',
        // 'https://virtserver.swaggerhub.com/GRAPHSCOPE/flex-api/0.9.1',
        'http://54.157.222.57',
      changeOrigin: true,
    },
  },
  headScripts: [
    'https://gw.alipayobjects.com/os/lib/antv/g2/5.1.14/dist/g2.min.js',
    //   'https://gw.alipayobjects.com/os/lib/react/18.2.0/umd/react.production.min.js',
    //   'https://gw.alipayobjects.com/os/lib/react-dom/18.2.0/umd/react-dom.production.min.js',
  ],
});
