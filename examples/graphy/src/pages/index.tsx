import React, { Suspense } from 'react';
import { Route, Navigate } from 'react-router-dom';

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
  { path: '/tools/graphy/', redirect: '#/dataset' },
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
];

const ROUTES = routes.map(({ path, redirect, component: Component }, index) => {
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

export default ROUTES;
