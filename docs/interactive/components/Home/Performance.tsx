import React from 'react';
import { Typography, Flex } from 'antd';
import { Download, GithubGradient, Community, Database } from '../Icons';
import SplitSection from '../SplitSection';
import StyledButton from './StyledButton';
import { gradientTextStyle } from './const';

const { Title, Text } = Typography;

// 定义可复用的样式对象
const containerStyle: React.CSSProperties = { padding: '50px' };
const iconContainerStyle: React.CSSProperties = { backgroundColor: '#f9f9f9', padding: '24px', borderRadius: '50%' };
const countStyle: React.CSSProperties = { margin: 0 };
const labelStyle: React.CSSProperties = { color: '#646265', fontSize: '20px' };
const performanceTitleStyle: React.CSSProperties = { ...gradientTextStyle, margin: 0 };
const performanceSubtitleStyle: React.CSSProperties = { margin: 0 };

// 定义统计项的接口
interface StatItem {
  icon: JSX.Element;
  label: string;
  count: string;
}

// 创建可复用的统计项组件
const StatItemComponent: React.FC<StatItem> = ({ icon, label, count }) => (
  <Flex gap={50} align="center">
    <div style={iconContainerStyle}>{icon}</div>
    <Flex vertical>
      <Title style={countStyle}>{count}</Title>
      <Text style={labelStyle}>{label}</Text>
    </Flex>
  </Flex>
);

const Performance: React.FC = () => (
  <Flex style={containerStyle} vertical justify="center" align="center" gap={60}>
    <Flex justify="center" gap={120}>
      {[
        { icon: <Download />, label: 'downloads', count: '2k+' },
        { icon: <GithubGradient />, label: 'GitHub stars', count: '150k+' },
        { icon: <Community />, label: 'community members', count: '150k+' },
      ].map(item => (
        <StatItemComponent key={item.label} {...item} />
      ))}
    </Flex>

    <SplitSection
      leftSide={
        <Flex vertical gap={16}>
          <Title style={performanceTitleStyle} level={5}>
            Performance
          </Title>
          <Title style={performanceSubtitleStyle} level={4}>
            Powerful database for real-time analytics in high-velocity environments
          </Title>
          <Text>
            Memgraph's sweet spot are mission-critical environments handling over 1,000 transactions per second on both
            reads and writes, with graph sizes from 100 GB to 4 TB.
          </Text>
          <Flex>
            <StyledButton>Learn more</StyledButton>
          </Flex>
        </Flex>
      }
      rightSide={<Database />}
    />
  </Flex>
);

export default Performance;
