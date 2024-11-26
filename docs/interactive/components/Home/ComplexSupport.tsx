import React from 'react';
import { Flex, List, Card, Avatar, Typography } from 'antd';
import { Support, Quotes } from '../Icons';
import SplitSection from '../SplitSection';
import StyledButton from './StyledButton';
import { gradientTextStyle, data } from './const';
const { Title, Text } = Typography;

const Home = () => (
  <Flex style={{ padding: '50px' }} vertical justify="center" align="center" gap={60}>
    <SplitSection
      leftSide={
        <Flex vertical gap={16}>
          <Title style={{ ...gradientTextStyle, margin: 0 }} level={5}>
            Support
          </Title>
          <Title style={{ margin: 0 }} level={4}>
            Say goodbye to hold times and complex support tickets
          </Title>
          <Text>
            Our dedicated Slack channel connects you directly with the engineers who built Memgraph. Get instant, expert
            support from the people who know the product best.
          </Text>
        </Flex>
      }
      rightSide={<Support />}
    />

    <Title level={3}>
      Don't take our word for it. <span style={gradientTextStyle}>Trust our customers.</span>
    </Title>

    <SplitSection
      leftSide={
        <div style={{ position: 'relative' }}>
          <Card style={{ padding: '50px 30px', boxShadow: '0px 0px 20px 0px rgba(0, 0, 0, .1)', zIndex: 2 }}>
            <Title>
              “We solved four business problems with Memgraph and proved the value without any doubt. Making the
              decision to use Memgraph as our database of choice was a no-brainer in the end.”
            </Title>
            <Text>Derick Schmidt, Head of Product at Capitec Bank</Text>
          </Card>
          <Quotes style={{ position: 'absolute', top: '50px', left: '24px', zIndex: 3 }} />
          <Card
            style={{
              position: 'absolute',
              top: '24px',
              left: '-24px',
              height: '510px',
              boxShadow: '0px 0px 20px 0px rgba(0, 0, 0, .1)',
              zIndex: 1,
            }}
          />
          <Card
            style={{
              position: 'absolute',
              top: '48px',
              left: '-48px',
              height: '460px',
              boxShadow: '0px 0px 20px 0px rgba(0, 0, 0, .1)',
            }}
          />
        </div>
      }
      rightSide={
        <Flex vertical gap={16}>
          <Title style={{ margin: 0 }} level={4}>
            Solving Business Challenges with Memgraph
          </Title>
          <Text>
            Explore how companies are using Memgraph to tackle real-world challenges with real-time data analysis. From
            fraud detection to cybersecurity, see practical examples of how Memgraph's graph database is making a
            difference.
          </Text>
          <Flex>
            <StyledButton>Read customer stories</StyledButton>
          </Flex>
        </Flex>
      }
    />

    <SplitSection
      leftSide={
        <Flex vertical gap={16}>
          <Title style={{ ...gradientTextStyle, margin: 0 }} level={5}>
            Memgraph Office Hours
          </Title>
          <Title style={{ margin: 0 }} level={4}>
            Schedule a 30 min session with one of our engineers to discuss how Memgraph fits with your architecture.
          </Title>
          <Text>
            Our engineers are highly experienced in helping companies of all sizes to integrate and get the most out of
            Memgraph in their projects. Talk to us about data modeling, optimizing queries, defining infrastructure
            requirements or migrating from your existing graph database. No nonsense or sales pitch, just tech.
          </Text>
          <Flex>
            <StyledButton>Book a call</StyledButton>
          </Flex>
        </Flex>
      }
      rightSide={
        <List
          split={false}
          itemLayout="horizontal"
          dataSource={data}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar size="large" src={item.url} />}
                title={<a href="https://ant.design">{item.title}</a>}
                description={item.description}
              />
            </List.Item>
          )}
        />
      }
    />

    <Flex style={{ padding: '36px', backgroundColor: '#f8f8f8', borderRadius: '12px' }} align="center" gap={24}>
      <Avatar
        size={120}
        src={'https://memgraph.com/_next/image?url=%2Fimages%2Fhomepage%2FDominik-image.png&w=256&q=75'}
      />
      <Flex vertical>
        <Title level={3}>
          “I try to embody our philosophy around our core value of{' '}
          <span style={gradientTextStyle}> building relationships, not edges</span>.”
        </Title>
        <Text type="secondary">Dominik Tomicevic, Co-Founder & CEO, Memgraph</Text>
      </Flex>
    </Flex>

    <Flex vertical justify="center" align="center" gap={24}>
      <Title style={{ margin: 0 }}>Subscribe to our newsletter</Title>
      <Title style={{ margin: 0, width: '60%', textAlign: 'center' }} level={5}>
        Stay up to date with product updates, tips, tricks and industry related news.
      </Title>
      <Flex>
        <StyledButton>Subscribe</StyledButton>
      </Flex>
    </Flex>
  </Flex>
);

export default Home;
