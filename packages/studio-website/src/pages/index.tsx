import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from '../layouts';

import locales from '../locales';

interface IPagesProps {}

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
  const routeComponents = routes.map(({ path, redirect, component: Component }, index) => {
    if (redirect) {
      return <Route key={index} path={path} element={<Navigate to={redirect} replace />} />;
    }
    return (
      <Route
        key={index}
        path={path}
        element={
          <Suspense fallback={<></>}>
            {/** @ts-ignore */}
            <Component />
          </Suspense>
        }
      />
    );
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {routeComponents}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Pages;
