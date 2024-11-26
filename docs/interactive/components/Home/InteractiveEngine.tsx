import React from 'react';
import { Typography, Flex, Button, Card } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Earth } from '../Icons';
import { gradientTextStyle } from './const';
import StyledButton from './StyledButton';

const { Title, Text, Paragraph } = Typography;

// 定义可复用的样式对象
const containerStyle: React.CSSProperties = { padding: '0px 350px', background: '#fff', color: '#000' };
const titleStyle: React.CSSProperties = { margin: 0 };
const subtitleStyle: React.CSSProperties = { ...titleStyle, fontSize: '72px' };
const descriptionStyle: React.CSSProperties = { color: '#646265', fontSize: '24px' };
const buttonGroupStyle: React.CSSProperties = { fontSize: '16px', fontWeight: 600 };
const cardStyle: React.CSSProperties = { width: '40%' };
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
  'Linux/MacOS': 'curl -sSf "https://install.memgraph.com" | sh',
  Windows: 'iwr https://windows.memgraph.com | iex',
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

const InteractiveEngine: React.FC = () => (
  <div style={containerStyle}>
    <Flex gap={16} align="center">
      <Flex vertical gap={24}>
        <Title style={subtitleStyle}>
          <span style={gradientTextStyle}>Unleash the Power of Graph Data</span>
        </Title>
        <Title style={titleStyle}>GraphScope Interactive Engine</Title>
        <Text style={descriptionStyle}>
          High-performance graph processing and analytics for enterprise-scale applications
        </Text>
        <Flex align="center" gap={16}>
          <StyledButton>Get started for free</StyledButton>
          <Button style={buttonGroupStyle} type="text" iconPosition="end" icon={<ArrowRightOutlined />}>
            Learn more
          </Button>
        </Flex>
      </Flex>
      <Earth />
    </Flex>

    <Flex style={{ margin: '-36px 0px 80px' }} gap={16}>
      {Object.keys(installCommands).map(os => (
        <InstallCard key={os} os={os as keyof typeof installCommands} />
      ))}
    </Flex>
  </div>
);

export default InteractiveEngine;
