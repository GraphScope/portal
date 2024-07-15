import React, { lazy, Suspense } from 'react';
import LoadingProgress from './loading-progress';

const StudioQuery = lazy(() => import('./app'));

const QueryModule = () => {
  return (
    <>
      <Suspense fallback={<LoadingProgress />}>
        <StudioQuery />
      </Suspense>
    </>
  );
};

export default QueryModule;
