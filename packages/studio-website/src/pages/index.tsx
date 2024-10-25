import React, { Suspense } from 'react';
import { Routes, Route, Navigate, HashRouter } from 'react-router-dom';
import { StudioProvier, GlobalSpin } from '@graphscope/studio-components';
import Layout from '../layouts';
import StoreProvider from '@graphscope/use-zustand';
import { initialStore } from '../layouts/useContext';

import locales from '../locales';
interface IPagesProps {
  children?: React.ReactNode;
}

const routes = [
  { path: '/', redirect: '/graphs' },
  { path: '/graphs', index: true, component: React.lazy(() => import('./instance')) },
  { path: '/graphs/create', component: React.lazy(() => import('./instance/create')) },

  { path: '/modeling', component: React.lazy(() => import('./modeling')) },
  { path: '/importing', component: React.lazy(() => import('./importing')) },
  { path: '/querying', component: React.lazy(() => import('./query')) },

  { path: '/setting', component: React.lazy(() => import('./setting')) },
  { path: '/job', component: React.lazy(() => import('./job')) },
  { path: '/job/detail', component: React.lazy(() => import('./job/job-detail')) },
  { path: '/extension', component: React.lazy(() => import('./extension')) },
  { path: '/extension/:name', component: React.lazy(() => import('./extension/create-plugins')) },
];

const Pages: React.FunctionComponent<IPagesProps> = props => {
  const { children } = props;

  const routeComponents = routes.map(({ path, redirect, component: Component }, index) => {
    if (redirect) {
      return <Route key={index} path={path} element={<Navigate to={redirect} replace />} />;
    }
    return (
      <Route
        key={index}
        path={path}
        element={
          <Suspense fallback={<GlobalSpin />}>
            {/** @ts-ignore */}
            <Component />
          </Suspense>
        }
      />
    );
  });

  return (
    <StoreProvider store={initialStore}>
      <StudioProvier locales={locales}>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              {routeComponents}
              {children}
            </Route>
          </Routes>
        </HashRouter>
      </StudioProvier>
    </StoreProvider>
  );
};

export default Pages;
