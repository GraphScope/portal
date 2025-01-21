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
    padding: '24px 0',
    backgroundColor: '#dfecf9',
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
    width: '32px',
    height: '32px',
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
      dot: (
        <Flex style={styles.timelineDot} justify="center" align="center">
          {index + 1}
        </Flex>
      ),
      children: (
        <>
          <Title level={4}>{title}</Title>
          <Text>{description}</Text>
        </>
      ),
    }));

  return (
    <Section style={styles.section}>
      <SplitSection
        splitNumber={0}
        leftSide={
          <Flex vertical gap={24}>
            <Image
              preview={false}
              src="https://linkurious.com/images/uploads/2022/02/Getting-Started-e1635948191243.png"
              style={styles.image}
            />
            <Title style={{ margin: 0 }} level={3}>
              How it works
            </Title>
            <Text>
              On-premise or in the cloud, real time or batch, scale to billions of nodes and edges - we've got you
              covered.
            </Text>
            <Flex align="center" gap={12}>
              <Button style={styles.button}>Discover the platform</Button>
              <Flex justify="center" align="center" gap={6}>
                <Title style={{ margin: 0 }} level={5}>
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
