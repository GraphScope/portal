import React from 'react';
import { Flex } from 'antd';
import InteractiveEngine from './InteractiveEngine';
import Realize from './Realize';
import Performance from './Performance';
import SimplePricing from './SimplePricing';
import ComplexSupport from './ComplexSupport';

const Home = () => (
  <Flex gap={12} vertical>
    <InteractiveEngine />
    <Realize />
    <Performance />
    <SimplePricing />
    {/* <ComplexSupport /> */}
  </Flex>
);

export default Home;
