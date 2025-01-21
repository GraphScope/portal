import React from 'react';
import { Flex, Avatar, Typography } from 'antd';
import StyledButton from './StyledButton';
import { gradientTextStyle, data } from './const';
const { Title, Text } = Typography;

const ComplexSupport = () => (
  <Flex style={{ padding: '50px' }} vertical justify="center" align="center" gap={60}>
    <Flex style={{ padding: '36px', backgroundColor: '#f8f8f8', borderRadius: '12px' }} align="center" gap={24}>
      <Avatar
        size={120}
        src={'https://memgraph.com/_next/image?url=%2Fimages%2Fhomepage%2FDominik-image.png&w=256&q=75'}
      />
      <Flex vertical>
        <Title level={3}>
          “I try to embody our philosophy around our core value of{' '}
          <span style={gradientTextStyle}> building relationships, not edges</span>.”
        </Title>
        <Text type="secondary">Dominik Tomicevic, Co-Founder & CEO, Memgraph</Text>
      </Flex>
    </Flex>

    <Flex vertical justify="center" align="center" gap={24}>
      <Title style={{ margin: 0 }}>Subscribe to our newsletter</Title>
      <Title style={{ margin: 0, width: '60%', textAlign: 'center' }} level={5}>
        Stay up to date with product updates, tips, tricks and industry related news.
      </Title>
      <Flex>
        <StyledButton>Subscribe</StyledButton>
      </Flex>
    </Flex>
  </Flex>
);

export default ComplexSupport;
