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
});
