import React, { useState } from 'react';
import { Typography, Flex, Button, Card, Row, Col } from 'antd';
import { resources } from './const';
import Section from './Section';
import { C } from 'nextra/dist/types-c8e621b7';
const { Title } = Typography;
const { Meta } = Card;

// Define reusable style constants
const styles: Record<string, React.CSSProperties> = {
  section: {
    padding: '100px 200px',
  },
  button: {
    fontSize: '16px',
    fontWeight: 600,
    padding: '24px',
    backgroundColor: '#1a9bfe',
    color: '#000',
    borderRadius: '30px',
  },
  card: {
    flex: 1,
  },
};

const RelatedResources = () => {
  const [activeDescriptionIndex, setActiveDescriptionIndex] = useState<string>('');

  const handleMouseEnter = (index: string) => setActiveDescriptionIndex(index);
  const handleMouseLeave = () => setActiveDescriptionIndex('');

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Flex justify="space-between">
            <Title level={3}>Related Resources</Title>
            <Button style={styles.button}>Discover All</Button>
          </Flex>
        </Col>

        {resources.map((resource, index) => {
          const { img, title, description } = resource;
          const isActive = activeDescriptionIndex === String(index);
          return (
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              <Card
                key={index}
                hoverable
                style={styles.card}
                onMouseEnter={() => handleMouseEnter(String(index))}
                onMouseLeave={handleMouseLeave}
                cover={<img alt="example" src={img} />}
              >
                <Meta
                  title={title}
                  description={
                    <Title level={5} style={{ color: isActive ? '#1a89e0' : '#000' }}>
                      {description}
                    </Title>
                  }
                />
              </Card>
            </Col>
          );
        })}
      </Row>
    </>
  );
};

export default RelatedResources;
