import React, { useState } from 'react';
import { Typography, Flex, Button, Card } from 'antd';
import { resources } from './const';
import Section from './Section';
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
  flexContainer: {
    width: '75%',
  },
};

const RelatedResources = () => {
  const [activeDescriptionIndex, setActiveDescriptionIndex] = useState<string>('');

  const handleMouseEnter = (index: string) => setActiveDescriptionIndex(index);
  const handleMouseLeave = () => setActiveDescriptionIndex('');

  return (
    <Section>
      <Flex style={styles.flexContainer} justify="space-between">
        <Title>Related Resources</Title>
        <Button style={styles.button}>Discover All</Button>
      </Flex>
      <Flex style={styles.flexContainer} gap={24}>
        {resources.map((resource, index) => {
          const { img, title, description } = resource;
          const isActive = activeDescriptionIndex === String(index);

          return (
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
                  <Title level={4} style={{ color: isActive ? '#1a89e0' : '#000' }}>
                    {description}
                  </Title>
                }
              />
            </Card>
          );
        })}
      </Flex>
    </Section>
  );
};

export default RelatedResources;
