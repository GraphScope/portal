import React from 'react';
import { Typography, Flex, Image, Button, Timeline, ConfigProvider } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import SplitSection from '../SplitSection';
import Section from './Section';
import { items } from './const';

interface DiscoverPlatformProps {}
// Define reusable style constants
const styles: Record<string, React.CSSProperties> = {
  section: {
    backgroundColor: '#dfecf9',
    marginTop: '50px',
  },
  image: {
    width: '100%',
  },
  button: {
    fontSize: '16px',
    fontWeight: 600,
    padding: '24px',
    backgroundColor: '#1a9bff',
    color: '#fff',
    borderRadius: '30px',
  },
  arrowIcon: {
    color: '#1699fd',
  },
  timelineDot: {
    padding: '8px 12px',
    fontWeight: 600,
    fontSize: '16px',
    backgroundColor: '#b0d3f0',
    borderRadius: '50%',
    color: '#000',
  },
};
const { Title, Text } = Typography;
const DiscoverPlatform: React.FC<DiscoverPlatformProps> = () => {
  // 创建可复用的时间轴项组件
  const renderTimelineItems = () =>
    items.map(({ title, description }, index) => ({
      dot: <span style={styles.timelineDot}>{index + 1}</span>,
      children: (
        <>
          <Title level={3}>{title}</Title>
          <Text>{description}</Text>
        </>
      ),
    }));

  return (
    <Section style={styles.section}>
      <SplitSection
        leftSide={
          <Flex vertical gap={24}>
            <Image
              preview={false}
              src="https://linkurious.com/images/uploads/2022/02/Getting-Started-e1635948191243.png"
              style={styles.image}
            />
            <Title style={{ margin: 0 }}>How it works</Title>
            <Text>
              On-premise or in the cloud, real time or batch, scale to billions of nodes and edges - we've got you
              covered.
            </Text>
            <Flex justify="space-between" align="center" gap={6}>
              <Button style={styles.button}>Discover the platform</Button>
              <Flex justify="center" align="center" gap={6}>
                <Title style={{ margin: 0, color: '#1a9bff' }} level={3}>
                  Get a free trial
                </Title>
                <ArrowRightOutlined style={styles.arrowIcon} />
              </Flex>
            </Flex>
          </Flex>
        }
        rightSide={
          <ConfigProvider
            theme={{
              components: {
                Timeline: {
                  dotBg: '',
                },
              },
            }}
          >
            <Timeline items={renderTimelineItems()} />
          </ConfigProvider>
        }
      />
    </Section>
  );
};

export default DiscoverPlatform;
