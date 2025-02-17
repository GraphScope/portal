import React from 'react';
import { Flex } from 'antd';
import InteractiveEngine from './InteractiveEngine';
import GraphScopeInstall from './GraphScopeInstall';
import DownloadStatistics from './DownloadStatistics';
import DataAnalysis from './DataAnalysis';
import ComplexSupport from './ComplexSupport';

const Home = () => (
  <Flex gap={60} vertical>
    <InteractiveEngine />
    <GraphScopeInstall />
    <DownloadStatistics />
    <DataAnalysis />
    {/* <ComplexSupport /> */}
  </Flex>
);

export default Home;
