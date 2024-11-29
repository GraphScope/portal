import React from 'react';
import { Typography, Flex } from 'antd';
import { Pricing } from '../Icons';
import SplitSection from '../SplitSection';
import StyledButton from './StyledButton';
import { gradientTextStyle } from './const';

const { Title, Text } = Typography;

const SimplePricing = () => (
  <Flex style={{ padding: '50px', backgroundColor: '#f8f8f8' }} vertical justify="center" align="center">
    <SplitSection
      leftSide={<Pricing />}
      rightSide={
        <Flex vertical gap={16}>
          <Title style={{ ...gradientTextStyle, margin: 0 }} level={5}>
            Pricing
          </Title>
          <Title style={{ margin: 0 }} level={4}>
            Simple and fair pricing that fits on a sticky note
          </Title>
          <Text>
            Memgraph pricing is so clear you won't need ChatGPT to explain it. Price scales with memory capacity and we
            charge only for unique data. Support is always included. Starting at $25k for 16 GB.
          </Text>
          <Flex>
            <StyledButton>Go to pricing</StyledButton>
          </Flex>
        </Flex>
      }
    />
  </Flex>
);

export default SimplePricing;
