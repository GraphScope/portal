import React, { lazy, Suspense } from 'react';
import { Flex, Spin, Space } from 'antd';
const StudioQuery = lazy(() => import('./app'));
const boxStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
};
const Loading = () => {
  console.log('QueryModule 1 ');
  return (
    <Flex style={boxStyle} vertical justify="center" align="center">
      <Space.Compact direction="vertical">
        <Spin size="large" />
        <p style={{ marginLeft: '24px' }}>Loading...</p>
      </Space.Compact>
    </Flex>
  );
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
