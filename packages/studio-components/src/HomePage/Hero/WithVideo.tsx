import React, { useRef } from 'react';
import LightArea, { useLightArea } from '../LightArea';
import { Flex, Button, theme, Typography, Row, Col } from 'antd';
import { GithubOutlined } from '@ant-design/icons';
import { useEnv } from '../Hooks';

export interface IHeroSectionProps {
  title: string;
  description?: string;
  actions: {
    title: string;
    link: string | null;
    icon: React.ReactNode;
    primary?: boolean;
  }[];
  video?: string;
}

const data = {
  title: 'A High-Performance, Graph-native Engine for Massive Concurrent Queries',
  description: undefined,
  actions: [
    {
      title: 'Try it online',
      link: null,
      icon: null,
      primary: true,
    },
    {
      title: 'Github',
      link: null,
      icon: <GithubOutlined />,
    },
  ],
};
const HeroSection: React.FunctionComponent<IHeroSectionProps> = props => {
  const { title, description, actions, video } = props;
  const { isMobile } = useEnv();

  const { token } = theme.useToken();
  const bannerRef = useRef(null);
  const { updatePosition, lightAreaRef } = useLightArea();
  return (
    <Flex
      vertical
      align="center"
      style={{ width: '100%', overflow: 'hidden' }}
      ref={bannerRef}
      //@ts-ignore
      onMouseMove={updatePosition}
    >
      {/** light area */}
      <LightArea rootRef={bannerRef} ref={lightAreaRef} />
      {/** banner area */}
      <Row gutter={24} style={{ width: '90%' }}>
        <Col span={14}>
          <Flex
            vertical
            justify="center"
            style={{
              height: 'calc(50vh)',
              padding: '0 1.5rem',
              //   textAlign: 'center',
              zIndex: 1,
              maxWidth: '70rem',
            }}
          >
            <Typography.Title level={1} style={{ lineHeight: 1.1, fontWeight: 700 }}>
              {title}
            </Typography.Title>
            {description && (
              <Typography.Text type="secondary" style={{ lineHeight: 1.8, fontSize: '' }}>
                {description}
              </Typography.Text>
            )}

            <Flex gap={12} style={{ paddingTop: 24 }}>
              {actions.map((action, index) => {
                const { title, link, icon, primary } = action;
                return (
                  <Button
                    key={index}
                    size="large"
                    style={{
                      width: '140px',
                      borderRadius: '20px',
                      background: primary ? token.colorPrimary : 'transparent',
                      color: primary ? '#fff' : token.colorText,
                      borderColor: token.colorPrimary,
                    }}
                    onClick={() => {
                      if (link) {
                        window.open(link);
                      }
                    }}
                    icon={icon}
                  >
                    {title}
                  </Button>
                );
              })}
            </Flex>
          </Flex>
        </Col>
        <Col span={10} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={video}
            alt=""
            style={{
              borderRadius: token.borderRadiusLG,
              width: isMobile ? '100%' : '80%',
              //   filter: isDark ? 'invert(1)' : 'none',
              //   boxShadow: token.boxShadowTertiary,
              //   border: `1px solid ${token.colorBorderSecondary}`,
            }}
          />
        </Col>
      </Row>
    </Flex>
  );
};

export default HeroSection;
