import React from 'react';
import { Typography, Flex, Row, Col, theme } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { LeftIcon, RightIcon } from '../Icons';

const { Title, Text } = Typography;

// 定义可复用的样式对象
const containerStyle: React.CSSProperties = {
  position: 'relative',
  padding: '6% 17% 9%',
  backgroundColor: '#199afe',
};
const titleStyle: React.CSSProperties = { margin: '3px 0px' };
const mainTitleStyle: React.CSSProperties = { ...titleStyle, fontWeight: 'bold' };
const discoverStyle: React.CSSProperties = { margin: 0 };

// 创建可复用的图标组件
const IconWrapper: React.FC<{ icon: JSX.Element; position: 'left' | 'right' }> = ({ icon, position }) => (
  <div style={{ position: 'absolute', [position]: 0, bottom: 0 }}>{icon}</div>
);

const InteractiveEngine: React.FC = () => {
  const { token } = theme.useToken();
  return (
    <div style={containerStyle}>
      <Row justify="center">
        <Col>
          <Flex vertical align="center" gap={24}>
            <Title style={titleStyle} level={4}>
              Unleash the Power of Graph Data
            </Title>
            <Title style={mainTitleStyle} level={1}>
              GraphScope Interactive Engine
            </Title>
            <Title style={titleStyle} level={5}>
              High-performance graph processing and analytics for enterprise-scale applications Flex
            </Title>
            <Flex justify="center" align="center" gap={6}>
              <Title style={discoverStyle} level={5}>
                Discover the platform
              </Title>
              <ArrowRightOutlined style={{ color: token.colorBgBase }} />
            </Flex>
          </Flex>
        </Col>
      </Row>
      {/* <IconWrapper icon={<LeftIcon />} position="left" />
  <IconWrapper icon={<RightIcon />} position="right" /> */}
    </div>
  );
};

export default InteractiveEngine;
