import React from 'react';
import { Typography, Flex } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { LeftIcon, RightIcon } from '../Icons';

const { Title, Text } = Typography;

// 定义可复用的样式对象
const containerStyle: React.CSSProperties = {
  position: 'relative',
  padding: '6% 16% 9%',
  backgroundColor: '#199afe',
};
const titleStyle: React.CSSProperties = { margin: '3px 0px' };
const mainTitleStyle: React.CSSProperties = { ...titleStyle, fontSize: '48px', fontWeight: 600, letterSpacing: '2px' };
const descriptionStyle: React.CSSProperties = {
  width: '60%',
  margin: '24px 0px 48px',
  fontSize: '17px',
  fontWeight: 500,
  textAlign: 'center',
};
const discoverStyle: React.CSSProperties = { margin: 0 };

// 创建可复用的图标组件
const IconWrapper: React.FC<{ icon: JSX.Element; position: 'left' | 'right' }> = ({ icon, position }) => (
  <div style={{ position: 'absolute', [position]: 0, bottom: 0 }}>{icon}</div>
);

const InteractiveEngine: React.FC = () => (
  <div style={containerStyle}>
    <Flex vertical justify="center" align="center">
      <Title style={titleStyle} level={4}>
        Unleash the Power of Graph Data
      </Title>
      <Title style={mainTitleStyle} level={4}>
        GraphScope Interactive Engine
      </Title>
      {/* <Title style={mainTitleStyle} level={4}>
        Neither should you.
      </Title> */}
      <Text style={descriptionStyle}>
        High-performance graph processing and analytics for enterprise-scale applications Flex
      </Text>
      <Flex justify="center" align="center" gap={6}>
        <Title style={discoverStyle} level={4}>
          Discover the platform
        </Title>
        <ArrowRightOutlined />
      </Flex>
    </Flex>
    <IconWrapper icon={<LeftIcon />} position="left" />
    <IconWrapper icon={<RightIcon />} position="right" />
  </div>
);

export default InteractiveEngine;
