import { defineConfig } from 'umi';

export default defineConfig({
  routes: [
    { path: '/', component: 'overview' },
    { path: '/instance', component: 'instance' },
    { path: '/query', component: 'query', layout: false },
    { path: '/job', component: 'job' },
    { path: '/extension', component: 'extension' },
    { path: '/alert', component: 'alert' },
    { path: '/deployment', component: 'deployment' },
  ],
  npmClient: 'pnpm',
  monorepoRedirect: {},
});
