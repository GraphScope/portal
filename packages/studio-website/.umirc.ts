import { defineConfig } from 'umi';

export default defineConfig({
  routes: [
    { path: '/', component: 'overview' },
    { path: '/instance', component: 'instance' },
    { path: '/instance/create', component: 'instance/create-instance' },
    { path: '/instance/create/result', component: 'instance/create-instance/result' },
    { path: '/instance/create/confirm-info', component: 'instance/create-instance/confirm-info' },
    { path: '/instance/schema', component: 'instance/view-schema' },
    { path: '/instance/import-data', component: 'instance/import-data' },
    { path: '/query', component: 'query', layout: false },
    { path: '/job', component: 'job' },
    { path: '/extension', component: 'extension' },
    { path: '/alert', component: 'alert' },
    { path: '/deployment', component: 'deployment' },
  ],
  npmClient: 'pnpm',
  monorepoRedirect: {},
  externals: { react: 'React', 'react-dom': 'ReactDOM' },
  headScripts: [
    'https://gw.alipayobjects.com/os/lib/react/18.2.0/umd/react.production.min.js',
    'https://gw.alipayobjects.com/os/lib/react-dom/18.2.0/umd/react-dom.production.min.js',
  ],
});
