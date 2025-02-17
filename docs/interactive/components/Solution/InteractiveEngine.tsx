import React, { useEffect, useRef, useState } from 'react';
import { Typography, Flex, Row, Col, theme, Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { LeftIcon, RightIcon, LeftPhotoIcon, RightPhotoIcon } from '../Icons';
const { Title } = Typography;

const containerStyle: React.CSSProperties = {
  position: 'relative',
  padding: '6%',
  backgroundColor: '#199afe',
};
const titleStyle: React.CSSProperties = { margin: '3px 0px' };
const mainTitleStyle: React.CSSProperties = { ...titleStyle, fontWeight: 'bold' };

const IconWrapper: React.FC<{ icon: JSX.Element; position: 'left' | 'right' }> = ({ icon, position }) => (
  <div style={{ position: 'absolute', [position]: 0, bottom: 0 }}>{icon}</div>
);

const InteractiveEngine: React.FC = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const { token } = theme.useToken();
  const [isSmallScreen, setIsSmallScreen] = useState<Boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      if (divRef.current) {
        setIsSmallScreen(divRef.current.clientWidth < 500);
      }
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    if (divRef.current) {
      resizeObserver.observe(divRef.current);
    }

    // Cleanup the observer on component unmount
    return () => {
      if (divRef.current) {
        resizeObserver.unobserve(divRef.current);
      }
    };
  }, []);

  return (
    <div ref={divRef} style={containerStyle}>
      <Row justify="center">
        <Col xs={24} sm={24} md={24} lg={16} xl={16}>
          <Flex vertical justify="center" align="center" gap={24}>
            <Title style={titleStyle} level={4}>
              Unleash the Power of Graph Data
            </Title>
            <Title style={mainTitleStyle} level={1}>
              GraphScope Interactive Engine
            </Title>
            <Title style={titleStyle} level={5}>
              High-performance graph processing and analytics for enterprise-scale applications
            </Title>
            <Flex align="center">
              <Button type="text">Discover the platform</Button>
              <ArrowRightOutlined style={{ color: token.colorBgBase }} />
            </Flex>
          </Flex>
        </Col>
      </Row>
      {isSmallScreen ? (
        <>
          <IconWrapper icon={<LeftPhotoIcon />} position="left" />
          <IconWrapper icon={<RightPhotoIcon />} position="right" />
        </>
      ) : (
        <>
          <IconWrapper icon={<LeftIcon />} position="left" />
          <IconWrapper icon={<RightIcon />} position="right" />
        </>
      )}
    </div>
  );
};

export default InteractiveEngine;
