import React from 'react';
import { Carousel, Flex, Image, Typography } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { carouselItems } from '../const';
const contentStyle: React.CSSProperties = {
  color: '#fff',
  textAlign: 'center',
  backgroundColor: '#f4f4f4',
};
const { Title, Text } = Typography;
const CarouselPanel: React.FC = () => (
  <div style={{ padding: '100px 200px', backgroundColor: '#ccc' }}>
    <Flex vertical gap={48}>
      <Title style={{ textAlign: 'center' }}>We're making a difference</Title>

      <Carousel arrows prevArrow={<LeftOutlined />} nextArrow={<RightOutlined />}>
        {carouselItems.map((item, index) => {
          const { url, title, description } = item;
          return (
            <div key={index} style={contentStyle}>
              <Flex gap={12} justify="center" align="center">
                <Image src={url} width={139} preview={false} />
                <Flex vertical>
                  <Title>{title}</Title>
                  <Text>{description}</Text>
                </Flex>
              </Flex>
            </div>
          );
        })}
      </Carousel>
    </Flex>
  </div>
);

export default CarouselPanel;
