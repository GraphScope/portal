import React, { useRef } from 'react';
import LightArea, { useLightArea } from '../LightArea';
import { Flex, Col, Row, Button, Space, theme, Typography, ConfigProvider, Descriptions, Card } from 'antd';
import { useDynamicStyle, useIsMobile, useTheme } from '../Hooks';
import Icons from '../Icons';
import { GithubOutlined } from '@ant-design/icons';
const features = [
  {
    icon: Icons.Model,
    title: 'Graph Modeling',
    description: [
      'Property Graph Data Model',
      'Cypher Query Language, Extensible for Other Query Language, e.g. GQL, Gremlin',
    ],
  },
  {
    icon: Icons.Database,
    title: 'Graph-native Storage and Query Optimization',
    description: [
      'Graph-native Adjacency List | No KV/Relational Wrapper',
      'Vectorized Storage and Compressed Result',
      // 'Self-developed graph query optimization with optimality guarantee',
    ],
  },
  {
    icon: Icons.Qps,
    title: 'Tens of thousands of Queries per Second',
    description: [
      'Record-breaking LDBC Benchmarking Resutls',
      'Multi-core Concurrent Query Execution',
      // 'Horisontally Scalable',
    ],
  },
  {
    icon: Icons.Explorer,
    title: 'Visualization Toolkit',
    description: ['Graph visualization in miniseconds', 'Self-developed Exploration Tool', 'LLM integration'],
  },
];
const Home = () => {
  const { token } = theme.useToken();
  const isMobile = useIsMobile();

  const bannerRef = useRef(null);
  const { updatePosition, lightAreaRef } = useLightArea();
  useDynamicStyle(
    `
body{
    overflow-x: hidden;
    background-color:${token.colorBgContainer},
}

.container {
  width: 100%;
  max-width: 90rem;
  margin: 0 auto;
  padding: 0 1.5rem;
}

    `,
    'root',
  );
  return (
    <Flex vertical align="center" justify="center" gap={12}>
      {/** banner */}
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
        <Flex
          vertical
          justify="center"
          style={{
            height: '50vh',
            padding: '1.5rem',
            textAlign: 'center',
            zIndex: 1,
            maxWidth: '70rem',
          }}
        >
          <Typography.Title level={1} style={{ lineHeight: 1.1, fontWeight: 700 }}>
            A High-Performance, Graph-native Engine for Massive Concurrent Queries
          </Typography.Title>

          <Flex justify="center" gap={12} style={{ paddingTop: 24 }}>
            <Button
              size="large"
              style={{
                width: '140px',
                borderRadius: '20px',
                background: token.colorPrimary,
                color: token.colorBgBase,
                borderColor: token.colorPrimary,
              }}
            >
              Try it online
            </Button>
            <Button
              size="large"
              style={{
                width: '140px',
                borderRadius: '20px',
                background: 'transparent',
                color: token.colorText,
                borderColor: token.colorPrimary,
              }}
              icon={<GithubOutlined />}
            >
              Github
            </Button>
          </Flex>
        </Flex>
      </Flex>

      <Flex vertical align="center" style={{ width: '100%', maxWidth: '90rem', padding: '0 1.5rem' }} justify="center">
        <Flex vertical style={{ width: '100%' }} gap={24} align="center">
          <Typography.Title level={2}>Core Features</Typography.Title>
          <Row
            gutter={[
              {
                xs: 12,
                sm: 12,
                md: 12,
                lg: 24,
                xl: 24,
              },
              {
                xs: 12,
                sm: 12,
                md: 12,
                lg: 24,
                xl: 24,
              },
            ]}
          >
            {features.map((item, index) => {
              const { icon: Icon, title, description } = item;

              return (
                <Col key={index} xs={24} sm={12} md={12} lg={6} xl={6}>
                  <Card hoverable>
                    <Flex vertical gap={12}>
                      <Icon
                        style={{
                          fontSize: 48,
                          color: token.colorPrimary,
                          // position: 'absolute',
                          // top: '0px',
                          // right: '0px',
                          zIndex: 0,
                        }}
                      />
                      <Typography.Title level={4} style={{ margin: '0px' }}>
                        {title}
                      </Typography.Title>
                      <Typography.Text style={{ fontWeight: 500, margin: '0px' }} type="secondary">
                        {description.join(',')}
                      </Typography.Text>
                    </Flex>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Flex>

        <section
          style={{
            height: '400px',
            //  background: 'grey',
            width: '100%',
          }}
        ></section>
        {/* <section style={{ height: '50vh', background: 'yellow', width: '100%' }}>Core Features</section> */}
      </Flex>
    </Flex>
  );
};

const algorithmMap = {
  dark: theme.darkAlgorithm,
  light: theme.defaultAlgorithm,
  system: theme.defaultAlgorithm,
};
export default () => {
  const isMobile = useIsMobile();
  const theme = useTheme();
  //@ts-ignore
  const algorithm = algorithmMap[theme];

  console.log('isMobile', isMobile, theme);
  return (
    <ConfigProvider
      theme={{
        algorithm,
        token: {
          colorPrimary: '#2581f0', //'#00b96b',
          fontSizeHeading1: isMobile ? 32 : 60,
        },
      }}
    >
      <Home />
    </ConfigProvider>
  );
};
