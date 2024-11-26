import React from 'react';
import { Typography, Flex } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { AntiFraud, MiddleIcon, SecurityIcon } from '../Icons';
import Section from './Section';

const { Title, Text } = Typography;

// Define reusable style constants
const styles: Record<string, React.CSSProperties> = {
  section: {
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
    icon: <AntiFraud style={{ marginRight: '-24px' }} />,
  },
  {
    title: 'Anti-money laundering',
    icon: <MiddleIcon style={{ marginBottom: '-6px' }} />,
  },
  {
    title: 'Security and Intelligence',
    icon: <SecurityIcon />,
  },
];

const Discover: React.FC = () => {
  return (
    <Section style={styles.section}>
      <Title>Our Solutions</Title>
      <Flex gap={24}>
        {solutions.map(({ title, icon }, index) => (
          <Flex key={title} style={styles.solutionCard} justify="space-around" align="center">
            <div>
              <Title style={styles.solutionTitle} level={3}>
                {title}
              </Title>
              <Flex>
                <Text style={styles.solutionTitle}>Discover</Text>
                <ArrowRightOutlined style={styles.arrowIcon} />
              </Flex>
            </div>
            {icon}
          </Flex>
        ))}
      </Flex>
    </Section>
  );
};

export default Discover;
