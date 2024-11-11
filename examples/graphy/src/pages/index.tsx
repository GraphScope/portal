import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Layout } from '@graphscope/studio-components';
import { SIDE_MENU } from './const';
import { ConfigProvider } from 'antd';
import locales from '../locales';
import { IntlProvider } from 'react-intl';
import PaperReading from '../pages/explore/paper-reading';

/**  注册 服务 */
import { registerServices } from '../pages/explore/paper-reading/components/registerServices';
import {
  queryCypher,
  queryCypherSchema,
  reload,
  queryStatistics,
  queryLLM,
  queryLLMResult,
  setPrompt,
  runClustering,
  runSummarizing,
} from './explore/services/kuzu';

registerServices('queryCypher', queryCypher);
registerServices('queryCypherSchema', queryCypherSchema);
registerServices('queryStatistics', queryStatistics);
registerServices('queryLLM', queryLLM);
registerServices('queryLLMResult', queryLLMResult);
registerServices('setPrompt', setPrompt);
registerServices('runClustering', runClustering);
registerServices('runSummarizing', runSummarizing);

interface IPagesProps {}

const routes = [
  { path: '/', redirect: '/dataset' },
  {
    path: '/dataset',
    index: true,
    component: React.lazy(() => import('./dataset/list')),
  },
  {
    path: '/dataset/create',
    component: React.lazy(() => import('./dataset/create')),
  },
  {
    path: '/dataset/embed',
    component: React.lazy(() => import('./dataset/embed')),
  },
  {
    path: '/dataset/extract',
    component: React.lazy(() => import('./dataset/extract')),
  },
  {
    path: '/dataset/cluster',
    component: React.lazy(() => import('./dataset/cluster')),
  },
  { path: '/explore', component: React.lazy(() => import('./explore')) },
];

const Apps = () => {
  const [isReady, setIsReady] = React.useState(false);
  useEffect(() => {
    reload().then(res => {
      setIsReady(true);
    });
  }, []);
  return (
    <>
      <Outlet />
      {isReady && <PaperReading queryCypher={queryCypher} queryCypherSchema={queryCypherSchema} />}
    </>
  );
};
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
          <Suspense fallback={<></>}>
            {/** @ts-ignore */}
            <Component />
          </Suspense>
        }
      />
    );
  });

  return (
    <ConfigProvider
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
            <Route path="/" element={<Layout sideMenu={[SIDE_MENU]} />}>
              {routeComponents}
            </Route>
            <Route path={'/paper-reading'} element={<Apps />} />
          </Routes>
        </BrowserRouter>
      </IntlProvider>
    </ConfigProvider>
  );
};

export default Pages;
