import React from 'react';
import { Typography, Flex, Button, Row, Col, theme } from 'antd';

const { Title, Text } = Typography;

const containerStyle: React.CSSProperties = {
  margin: '0 auto',
  padding: '3%',
  backgroundImage: 'url(https://linkurious.com/images/uploads/2023/05/bg_cta.png)',
  backgroundPosition: '100% 0',
  backgroundSize: 'cover',
  borderRadius: '10px',
};

const VisualizeAnalyze = () => {
  const { token } = theme.useToken();
  const buttonStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 'bold',
    padding: '24px',
    backgroundColor: '#1a9bfe',
    color: token.colorBgBase,
    borderRadius: '30px',
  };
  return (
    <div style={containerStyle}>
      <Row gutter={[16, 16]} align={'middle'}>
        <Col xs={24} md={18}>
          <Flex vertical>
            <Title style={{ color: token.colorBgBase }} level={4}>
              PEP & Sanctions screening like you’ve never seen before.
            </Title>
            <Text style={{ color: token.colorBgBase }}>
              Experience a new way to search, visualize and analyze millions of open data records in one single
              interface.
            </Text>
          </Flex>
        </Col>
        <Col xs={24} md={6}>
          <Button style={buttonStyle}>Try OpenScreening</Button>
        </Col>
      </Row>
    </div>
  );
};

export default VisualizeAnalyze;
