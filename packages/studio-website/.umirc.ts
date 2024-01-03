import { defineConfig } from 'umi';

export default defineConfig({
  routes: [
    { path: '/', component: 'overview' },
    { path: '/instance', component: 'instance' },
    { path: '/instance/create', component: 'instance/create-instance' },
    { path: '/instance/schema', component: 'instance/view-schema' },
    { path: '/instance/import', component: 'instance/import-data' },
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
    'https://unpkg.com/react@18.2/umd/react.production.min.js',
    'https://unpkg.com/react-dom@18.2/umd/react-dom.production.min.js',
  ],
});
