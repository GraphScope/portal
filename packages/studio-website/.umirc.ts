import { defineConfig } from 'umi';

export default defineConfig({
  routes: [
    { path: '/', redirect: '/instance' },
    { path: '/instance', component: 'instance' },
    { path: '/setting', component: 'setting' },
    { path: '/instance/create', component: 'instance/create-instance' },
    { path: '/instance/schema', component: 'instance/view-schema' },
    { path: '/instance/import-data', component: 'instance/import-data' },
    { path: '/query', component: 'query' },
    { path: '/query-app', component: 'query', layout: false },
    { path: '/job', component: 'job' },
    { path: '/extension', component: 'extension' },
    { path: '/alert', component: 'alert' },
    { path: '/deployment', component: 'deployment' },
  ],
  npmClient: 'pnpm',
  monorepoRedirect: {},
  // externals: { react: 'React', 'react-dom': 'ReactDOM' },
  // headScripts: [
  //   'https://gw.alipayobjects.com/os/lib/react/18.2.0/umd/react.production.min.js',
  //   'https://gw.alipayobjects.com/os/lib/react-dom/18.2.0/umd/react-dom.production.min.js',
  // ],
});
