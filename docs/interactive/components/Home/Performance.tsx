import React from 'react';
import { Typography, Flex, Row, Col, theme } from 'antd';
import { Download, GithubGradient, Community } from '../Icons';

const { Title, Text } = Typography;

// 定义可复用的样式对象
const containerStyle: React.CSSProperties = { padding: '2% 17%' };

// 定义统计项的接口
interface StatItem {
  icon: JSX.Element;
  label: string;
  count: string;
}

// 创建可复用的统计项组件
const StatItemComponent: React.FC<StatItem> = ({ icon, label, count }) => {
  const { token } = theme.useToken();
  const iconContainerStyle: React.CSSProperties = {
    padding: '12px',
    backgroundColor: token.colorBgLayout,
    borderRadius: '50%',
  };
  return (
    <Col xs={24} sm={24} md={24} lg={8} xl={8}>
      <Flex gap={24} align="center">
        <div style={iconContainerStyle}>{icon}</div>
        <Flex vertical>
          <Title style={{ margin: 0 }} level={2}>
            {count}
          </Title>
          <Text style={{ fontSize: '16px' }} type="secondary">
            {label}
          </Text>
        </Flex>
      </Flex>
    </Col>
  );
};

const Performance: React.FC = () => (
  <Row style={containerStyle} gutter={[48, 24]}>
    {[
      { icon: <Download />, label: 'downloads', count: '2k+' },
      { icon: <GithubGradient />, label: 'GitHub stars', count: '150k+' },
      { icon: <Community />, label: 'community members', count: '150k+' },
    ].map(item => (
      <StatItemComponent key={item.label} {...item} />
    ))}
  </Row>
);

export default Performance;
