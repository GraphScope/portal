import React, { lazy, Suspense } from 'react';

const StudioQuery = lazy(() => import('./app'));

const Loading = () => {
  console.log('QueryModule 1 ');
  return <div>Loading...</div>;
};
const QueryModule = () => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <StudioQuery />
      </Suspense>
    </>
  );
};

export default QueryModule;
