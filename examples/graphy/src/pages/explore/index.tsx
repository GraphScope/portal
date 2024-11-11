import * as React from 'react';
import Container from '../components/Container';

import { Flex, Card, Typography, Divider, Tag, Space, Button } from 'antd';
import { GithubOutlined, ReadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

interface IExploreProps {}

const APP_INFO = [
  {
    name: 'Paper Discovery',
    description:
      'Discover the connections between papers by exploring how research builds upon existing knowledge, linking studies through shared references, methodologies, and findings to create a comprehensive view of academic contributions.',
    icon: 'https://www.connectedpapers.com/img/ScienceMapping.2218dc18.png',
    link: '/paper-reading',
    category: 'Knowledge Graph',
    dataset: 'https://github.com/csuvis/CyberAssetGraphData',
  },
];
const Explore: React.FunctionComponent<IExploreProps> = props => {
  const navigate = useNavigate();
  return (
    <Container
      breadcrumb={[
        {
          title: 'explore',
        },
      ]}
    >
      <Flex gap={24} style={{ padding: '40px' }} vertical>
        <Typography.Title level={1}>Discover More Graph Applications and Inspire Innovation</Typography.Title>
        <Divider />
        <Flex gap={48} wrap align="flex-start">
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
                    <Button type="text" icon={<GithubOutlined />} onClick={() => navigate(item.link || '')}></Button>
                    <Button type="text" icon={<ReadOutlined />} onClick={() => navigate(item.link || '')}></Button>
                  </Space>
                </Flex>
              </Card>
            );
          })}
        </Flex>
      </Flex>
    </Container>
  );
};

export default Explore;
