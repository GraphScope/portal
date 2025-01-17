import React from 'react';
import { Typography, Flex, Card, List, Avatar, Col, Image, theme } from 'antd';
import { Pricing, Database, Support, Quotes } from '../../Icons';
import SplitSection from '../../SplitSection';
import StyledButton from '../StyledButton';
import SectionContent from './SectionContent';
import { gradientTextStyle, data } from '../const';

const { Title, Text } = Typography;
const cardBoxShadow = '0px 0px 20px 0px rgba(0, 0, 0, .1)';

const SimplePricing = () => {
  const { token } = theme.useToken();
  const sectionContent = [
    {
      title: 'Performance',
      subtitle: 'Visualize and explore your data',
      text: "Memgraph's sweet spot are mission-critical environments handling over 1,000 transactions per second on both reads and writes, with graph sizes from 100 GB to 4 TB.",
      leftIcon: <Database />,
      buttonText: 'Learn more',
      styles: { padding: '0 17%' },
    },
    {
      title: 'Pricing',
      subtitle: 'Simple and fair pricing that fits on a sticky note',
      text: "Memgraph pricing is so clear you won't need ChatGPT to explain it. Price scales with memory capacity and we charge only for unique data. Support is always included. Starting at $25k for 16 GB.",
      leftIcon: <Pricing />,
      buttonText: 'Go to pricing',
      styles: { padding: '5% 17%', backgroundColor: token.colorBgLayout },
    },
    {
      title: 'Support',
      subtitle: 'Graph Processing',
      text: 'Performing diverse parallel graph operations in a cluster in one unified system.',
      leftIcon: <Image src="https://graphscope.io/docs/_images/sample_pg.png" preview={false} />,
      rightTitle: "Don't take our word for it. Trust our customers.",
      rightTitleGradient: true,
    },
  ];

  return (
    <Flex vertical gap={24}>
      {sectionContent.map((section, index) => (
        <SplitSection
          key={index}
          styles={section.styles}
          splitNumber={index === 1 ? 0 : 24}
          leftSide={index % 2 ? section.leftIcon : <SectionContent section={section} />}
          rightSide={index % 2 ? <SectionContent section={section} /> : section.leftIcon}
        >
          {section.rightTitle && (
            <Title level={3}>
              {section.rightTitle}
              {section.rightTitleGradient && <span style={gradientTextStyle}>Trust our customers.</span>}
            </Title>
          )}
        </SplitSection>
      ))}
      <SplitSection
        leftSide={
          <div style={{ position: 'relative' }}>
            <Card style={{ padding: '50px 30px', boxShadow: cardBoxShadow, zIndex: 2 }}>
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
                height: '460px',
                boxShadow: cardBoxShadow,
                zIndex: 1,
              }}
            />
            <Card
              style={{ position: 'absolute', top: '48px', left: '-48px', height: '410px', boxShadow: cardBoxShadow }}
            />
          </div>
        }
        rightSide={
          <Flex vertical gap={16}>
            <Title style={{ margin: 0 }} level={4}>
              Solving Business Challenges with Memgraph
            </Title>
            <Text>
              Explore how companies are using Memgraph to tackle real-world challenges with real-time data analysis.
              From fraud detection to cybersecurity, see practical examples of how Memgraph's graph database is making a
              difference.
            </Text>
            <Flex>
              <StyledButton>Read customer stories</StyledButton>
            </Flex>
          </Flex>
        }
      />
      {/* <Col xs={0} sm={24} md={24} lg={24} xl={24}>
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
                Our engineers are highly experienced in helping companies of all sizes to integrate and get the most out
                of Memgraph in their projects. Talk to us about data modeling, optimizing queries, defining
                infrastructure requirements or migrating from your existing graph database. No nonsense or sales pitch,
                just tech.
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
      </Col> */}
    </Flex>
  );
};

export default SimplePricing;
