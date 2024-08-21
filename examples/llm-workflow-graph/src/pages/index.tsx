import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';

import Layout from '../layout';
import { ConfigProvider } from 'antd';
import locales from '../locales';
import { IntlProvider } from 'react-intl';
interface IPagesProps {}

const routes = [
  { path: '/', redirect: '/dataset' },
  { path: '/dataset', index: true, component: React.lazy(() => import('./dataset/list')) },
  { path: '/dataset/create', component: React.lazy(() => import('./dataset/create')) },
  { path: '/dataset/embed', component: React.lazy(() => import('./dataset/embed')) },
  { path: '/dataset/extract', component: React.lazy(() => import('./dataset/extract')) },
  { path: '/dataset/cluster', component: React.lazy(() => import('./dataset/cluster')) },
];

const Pages: React.FunctionComponent<IPagesProps> = props => {
  const locale = 'en-US';
  const messages = locales[locale];
  const routeComponents = routes.map(({ path, redirect, component: Component }, index) => {
    if (redirect) {
      return <Route key={index} path={path} element={<Navigate to={redirect} replace />} />;
    }
    return (
      <Route
        key={index}
        path={path}
        element={
          <Suspense fallback={<div>Loading...</div>}>
            {/** @ts-ignore */}
            <Component />
          </Suspense>
        }
      />
    );
  });

  return (
    <ConfigProvider
      // direction="rtl"
      theme={{
        components: {
          Menu: {
            itemSelectedBg: '#ececec',
            itemSelectedColor: '#191919',
            collapsedWidth: 50,
            collapsedIconSize: 14,
          },
        },
      }}
    >
      <IntlProvider messages={messages} locale={locale}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              {routeComponents}
            </Route>
          </Routes>
        </BrowserRouter>
      </IntlProvider>
    </ConfigProvider>
  );
};

export default Pages;
