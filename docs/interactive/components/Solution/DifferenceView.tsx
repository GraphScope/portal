import React from 'react';
import { Carousel, Flex, Image, Typography, Row, Col } from 'antd';
import { carouselItems } from './const';

const { Title, Text } = Typography;
const DifferenceView: React.FC = () => {
  return (
    <Flex vertical gap={24}>
      <Title style={{ margin: 0, textAlign: 'center' }} level={3}>
        We're making a difference
      </Title>
      <div>
        <Carousel arrows style={{ padding: '12%', backgroundColor: '#ccc', textAlign: 'center' }}>
          {carouselItems.map((item, index) => {
            const { url, title, description } = item;
            return (
              <div key={index}>
                <Row gutter={[12, 12]} align="middle">
                  <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                    <Image src={url} width={120} preview={false} />
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={20} xl={20}>
                    <Title level={3}>{title}</Title>
                    <Text>{description}</Text>
                  </Col>
                </Row>
              </div>
            );
          })}
        </Carousel>
      </div>
    </Flex>
  );
};

export default DifferenceView;
