import React from 'react';
import { Typography, Flex, Button, Card, Row, Col, Image, theme } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Earth } from '../Icons';
import { gradientTextStyle } from './const';
import StyledButton from './StyledButton';

const { Title, Text, Paragraph } = Typography;

// 定义可复用的样式对象
const titleStyle: React.CSSProperties = { margin: 0 };
const subtitleStyle: React.CSSProperties = { ...titleStyle, fontSize: '60px' };
const descriptionStyle: React.CSSProperties = { color: '#646265', fontSize: '24px' };
const buttonGroupStyle: React.CSSProperties = { fontSize: '16px', fontWeight: 600 };
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

const InteractiveEngine: React.FC = () => {
  const { token } = theme.useToken();
  const containerStyle: React.CSSProperties = {
    padding: '3% 17%',
    background: token.colorBgBase,
    color: token.colorTextBase,
  };

  return (
    <div style={containerStyle}>
      <Row gutter={[16, 32]}>
        <Flex gap={24} justify="start">
          <Col xs={24} sm={14} md={20} lg={20} xl={20}>
            <Flex vertical gap={18}>
              <Title style={subtitleStyle}>
                <span style={gradientTextStyle}>Unleash the Power of Graph Data</span>
              </Title>
              <Title style={titleStyle}>GraphScope Interactive Engine</Title>
              <Text style={descriptionStyle}>
                High-performance graph processing and analytics for enterprise-scale applications
              </Text>
              <Row align="middle" gutter={[16, 16]}>
                <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                  <StyledButton url="https://graphscope.io/docs/overview/getting_started">
                    Get started for free
                  </StyledButton>
                </Col>
                <Col xs={24} sm={24} md={24} lg={6} xl={6}>
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
                </Col>
              </Row>
            </Flex>
          </Col>
          {/* <Col xs={0} sm={0} md={0} lg={10} xl={10}>
            <Image src="https://graphscope.io/blog/assets/images/flex-title.jpg" preview={false} />
          </Col> */}
          {/* <Earth /> */}
        </Flex>

        <Col xs={0} sm={0} md={0} lg={0} xl={0} xxl={24}>
          <Flex gap={16}>
            {Object.keys(installCommands).map(os => (
              <InstallCard key={os} os={os as keyof typeof installCommands} />
            ))}
          </Flex>
        </Col>
      </Row>
    </div>
  );
};

export default InteractiveEngine;
