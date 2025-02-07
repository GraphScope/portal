import React from 'react';
import { Typography, Flex, Button, Card, Row, Col } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { gradientTextStyle } from './const';
import StyledButton from './StyledButton';

const { Title, Text, Paragraph } = Typography;

// 定义可复用的样式对象
const titleStyle: React.CSSProperties = { margin: 0 };
const subtitleStyle: React.CSSProperties = { ...titleStyle, fontSize: '60px' };
const descriptionStyle: React.CSSProperties = { color: '#646265', fontSize: '24px' };
const buttonGroupStyle: React.CSSProperties = { fontSize: '14px', fontWeight: 'bold' };
const cardStyle: React.CSSProperties = { width: '45%', whiteSpace: 'nowrap' };
const codeBlockStyle: React.CSSProperties = {
  padding: '20px',
  lineHeight: '24px',
  backgroundColor: '#231f20',
  color: '#fff',
  borderRadius: '6px',
  letterSpacing: '2px',
  fontSize: '14px',
};

// 定义安装命令
const installCommands: Record<string, string> = {
  'Linux/MacOS': 'python3 -m pip install graphscope --upgrade',
  // Windows: 'iwr https://windows.memgraph.com | iex',
};

interface InstallCardProps {
  os: keyof typeof installCommands;
}

const InstallCard: React.FC<InstallCardProps> = ({ os }) => (
  <Card style={cardStyle}>
    <Title level={4}>Install GraphScope on {os}</Title>
    <Paragraph style={codeBlockStyle} copyable>
      {installCommands[os]}
    </Paragraph>
  </Card>
);

const InteractiveEngine: React.FC = () => {
  return (
    <Row style={{ padding: '6% 0%' }} gutter={[16, 32]}>
      <Col xs={24} sm={14} md={20} lg={20} xl={20}>
        <Flex vertical gap={24}>
          <Title style={subtitleStyle}>
            <span style={gradientTextStyle}>Unleash the Power of Graph Data</span>
          </Title>
          <Title style={titleStyle}>GraphScope Interactive Engine</Title>
          <Text style={descriptionStyle}>
            High-performance graph processing and analytics for enterprise-scale applications
          </Text>
          <Flex align="center" gap={14}>
            <StyledButton url="https://graphscope.io/docs/overview/getting_started">Get started for free</StyledButton>
            <Button
              style={buttonGroupStyle}
              type="text"
              iconPosition="end"
              icon={<ArrowRightOutlined />}
              onClick={() => {
                window.open('https://graphscope.io/docs/learning_engine/getting_started', '_blank');
              }}
            >
              Learn more
            </Button>
          </Flex>
        </Flex>
      </Col>
      {/* <Col xs={0} sm={0} md={0} lg={10} xl={10}>
            <Image src="https://graphscope.io/blog/assets/images/flex-title.jpg" preview={false} />
          </Col> */}
      <Col xs={0} sm={0} md={0} lg={0} xl={24}>
        <Flex gap={16}>
          {Object.keys(installCommands).map(os => (
            <InstallCard key={os} os={os as keyof typeof installCommands} />
          ))}
        </Flex>
      </Col>
    </Row>
  );
};

export default InteractiveEngine;
