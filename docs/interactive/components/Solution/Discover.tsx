import React from 'react';
import { Typography, Flex, Row, Col } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { AntiFraud, MiddleIcon, SecurityIcon } from '../Icons';
import Section from './Section';

const { Title, Text } = Typography;

// Define reusable style constants
const styles: Record<string, React.CSSProperties> = {
  section: {
    padding: '24px 0',
    backgroundColor: '#f4f4f4',
  },
  solutionCard: {
    flex: 1,
    backgroundColor: '#020202',
    padding: '24px 0 0 24px',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  solutionTitle: {
    color: '#fff',
  },
  arrowIcon: {
    color: '#1a9bff',
  },
};

const solutions: { title: string; icon: React.ReactNode }[] = [
  {
    title: 'Anti-fraud',
    icon: <AntiFraud />,
  },
  {
    title: 'Anti-money laundering',
    icon: <MiddleIcon />,
  },
  {
    title: 'Security and Intelligence',
    icon: <SecurityIcon />,
  },
];

const Discover: React.FC = () => {
  return (
    <Row justify="center" align="middle" gutter={[24, 16]} style={styles.section}>
      <Col span={24} style={{ textAlign: 'center' }}>
        <Title level={3}>Our Solutions</Title>
      </Col>
      {solutions.map(({ title, icon }, index) => (
        <Col key={index} xs={24} sm={24} md={8} lg={8} xl={8}>
          <Flex key={title} style={styles.solutionCard} justify="space-between" align="center">
            <Flex vertical>
              <Title style={styles.solutionTitle} level={4}>
                {title}
              </Title>
              <Flex gap={6}>
                <Text style={styles.solutionTitle}>Discover</Text>
                <ArrowRightOutlined style={styles.arrowIcon} />
              </Flex>
            </Flex>
            <Text>{icon}</Text>
          </Flex>
        </Col>
      ))}
    </Row>
  );
};

export default Discover;
