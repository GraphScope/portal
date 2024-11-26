import React from 'react';
import { Typography, Flex } from 'antd';
import { GenAI } from '../Icons';
import SplitSection from '../SplitSection';
import StyledButton from './StyledButton';

const { Title, Text } = Typography;

const Realize: React.FC = () => (
  <Flex style={{ padding: '50px', backgroundColor: '#f8f8f8' }} justify="center">
    <SplitSection
      leftSide={<GenAI />}
      rightSide={
        <Flex vertical gap={24}>
          <Title>Realize the full potential of GenAI</Title>
          <Text>
            Reduce hallucination. Integrate multiple and disparate data sources into a knowledge graph to surface
            nuanced real-world context from your Enterprises' internal knowledge bases.
          </Text>
          <Flex>
            <StyledButton>Learn more</StyledButton>
          </Flex>
        </Flex>
      }
    />
  </Flex>
);

export default Realize;
