import ReactDOM from 'react-dom/client';
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { Flex, Card, Typography, Divider, Tag } from 'antd';
import { ConfigProvider, Skeleton, Space, Button } from 'antd';
import { GithubOutlined, ReadOutlined } from '@ant-design/icons';
// import locales from '../locales';
// import { IntlProvider } from 'react-intl';
import PaperReading from './paper-reading';

interface IPagesProps {}

const APP_INFO = [
  {
    name: 'Graph Data Query Scenarios',
    description:
      'Using powerful query languages like Cypher and Gremlin, enabling you to extract meaningful insights from complex networks of interconnected data',
    icon: 'https://www.connectedpapers.com/img/ScienceMapping.2218dc18.png',
    category: 'Graph Database',
    link: '/paper-reading',
    dataset: 'https://github.com/csuvis/CyberAssetGraphData',
    github: '',
  },

  {
    name: 'Discover Network Vulnerability Risks',
    description:
      'Identify Network Vulnerability Risks by detecting weaknesses and exposures in network infrastructure, enabling proactive security measures to prevent potential threats and safeguard critical systems.',
    icon: 'https://www.connectedpapers.com/img/ScienceMapping.2218dc18.png',
    category: 'Cyber Security',
    link: '/paper-reading',
    dataset: 'https://github.com/csuvis/CyberAssetGraphData',
    github: '',
  },
  {
    name: 'Paper Discovery',
    description:
      'Discover the connections between papers by exploring how research builds upon existing knowledge, linking studies through shared references, methodologies, and findings to create a comprehensive view of academic contributions.',
    icon: 'https://www.connectedpapers.com/img/ScienceMapping.2218dc18.png',
    link: '/paper-reading',
    category: 'Knowledge Graph',
    dataset: 'https://github.com/csuvis/CyberAssetGraphData',
  },
  {
    name: 'GitHub Collaboration Network',
    description:
      'Explore the GitHub Collaboration Network, where developers connect, share code, and collaborate on projects to drive innovation and solve complex problems together.',
    icon: 'https://www.connectedpapers.com/img/ScienceMapping.2218dc18.png',
    link: '/paper-reading',
    category: 'Social Network',
    dataset: 'https://github.com/csuvis/CyberAssetGraphData',
  },
];
const Home = () => {
  const navigate = useNavigate();
  return (
    <Flex justify="center" gap={24} style={{ padding: '80px' }} vertical align="center">
      <Typography.Title level={1}>Discover More Graph Applications and Inspire Innovation</Typography.Title>
      <Divider />
      <Flex justify="center" gap={48} wrap>
        {APP_INFO.map((item, index) => {
          return (
            <Card
              hoverable
              bordered={false}
              key={item.link}
              style={{ width: '400px' }}
              styles={{
                body: {
                  padding: '24px 24px 8px 24px',
                },
              }}
              cover={
                <img
                  alt="example"
                  src={item.icon}
                  onClick={() => {
                    navigate(item.link);
                  }}
                />
              }
            >
              <Typography.Title style={{ margin: '0px' }} level={5}>
                {item.name}
              </Typography.Title>

              <Typography.Paragraph ellipsis={{ rows: 3 }} type="secondary">
                {item.description}
              </Typography.Paragraph>
              <Divider style={{ margin: '0px', marginBottom: '8px' }}></Divider>
              <Flex align="center" justify="space-between">
                <Tag color="geekblue">{item.category}</Tag>
                <Space size={0}>
                  <Button type="text" icon={<GithubOutlined />} onClick={() => navigate(item.github || '')}></Button>
                  <Button type="text" icon={<ReadOutlined />} onClick={() => navigate(item.github || '')}></Button>
                </Space>
              </Flex>
            </Card>
          );
        })}
      </Flex>
    </Flex>
  );
};
const routes = [
  { path: '/', component: Home },
  { path: '/paper-reading', component: React.lazy(() => import('./paper-reading')) },
];

const GraphApps: React.FunctionComponent<IPagesProps> = props => {
  //   const locale = 'en-US';
  //   const messages = locales[locale];
  const routeComponents = routes.map(({ path, component: Component }, index) => {
    return (
      <Route
        key={index}
        path={path}
        element={
          <Suspense fallback={<></>}>
            {/** @ts-ignore */}
            <Component />
          </Suspense>
        }
      />
    );
  });

  return (
    <ConfigProvider
      // direction="rtl"
      theme={{
        components: {
          Menu: {
            itemSelectedBg: '#ececec',
            itemSelectedColor: '#191919',
            collapsedWidth: 50,
            collapsedIconSize: 14,
          },
        },
      }}
    >
      {/* <IntlProvider messages={messages} locale={locale}> */}
      <BrowserRouter>
        <Routes>{routeComponents}</Routes>
      </BrowserRouter>
      {/* </IntlProvider> */}
    </ConfigProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<GraphApps />);

export { PaperReading, GraphApps };
