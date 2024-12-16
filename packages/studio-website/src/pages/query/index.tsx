import React, { lazy, Suspense } from 'react';
import LoadingProgress from './loading-progress';
import { GlobalSpin } from '@graphscope/studio-components';

const StudioQuery = lazy(() => import('./app'));

const QueryModule = () => {
  return (
    <>
      <Suspense fallback={<GlobalSpin />}>
        <StudioQuery />
      </Suspense>
    </>
  );
};

export default QueryModule;
