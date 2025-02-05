import React from 'react';
import { Typography, Flex, Card, List, Avatar, Col, Image, theme } from 'antd';
import { Pricing, Database, Support, Quotes } from '../../Icons';
import SplitSection from '../../SplitSection';
import StyledButton from '../StyledButton';
import SectionContent from './SectionContent';
import { gradientTextStyle, data } from '../const';

const { Title, Text, Link } = Typography;
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
    },
    {
      title: 'Pricing',
      subtitle: 'Simple and fair pricing that fits on a sticky note',
      text: "Memgraph pricing is so clear you won't need ChatGPT to explain it. Price scales with memory capacity and we charge only for unique data. Support is always included. Starting at $25k for 16 GB.",
      leftIcon: <Pricing />,
      buttonText: 'Go to pricing',
      styles: { padding: '6%', backgroundColor: token.colorBgLayout },
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
    <Flex vertical gap={32}>
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
            <Card style={{ marginRight: '32px', padding: '30px', boxShadow: cardBoxShadow, zIndex: 2 }}>
              <Title level={2}>
                Throughout the tutorial, we assume all machines are running Linux system. We do not guarantee that it
                works as smoothly as Linux on the other platform. For your reference, we’ve tested the tutorial on
                Ubuntu 20.04.
              </Title>
            </Card>
            <Quotes style={{ position: 'absolute', top: '50px', left: '24px', zIndex: 3 }} />
          </div>
        }
        rightSide={
          <Flex vertical gap={16}>
            <Title style={{ margin: 0 }} level={4}>
              Standalone Deployment for GIE
            </Title>
            <Text type="secondary">
              We have demonstrated &nbsp;
              <Link href="https://graphscope.io/docs/interactive_engine/getting_started" target="_blank">
                how to execute interactive queries
              </Link>
              &nbsp; easily by installing GraphScope via pip on a local machine. However, in real-life applications,
              graphs are often too large to fit on a single machine. In such cases, GraphScope can be deployed on a
              cluster, such as a self-managed k8s cluster, for processing large-scale graphs. But you may wonder, “what
              if I only need the GIE engine and not the whole package of GraphScope?” This tutorial will walk you
              through the process of standalone deployment of GIE on a self-managed k8s cluster.
            </Text>
            <Flex>
              <StyledButton url="https://graphscope.io/docs/deployment/deploy_graphscope_on_self_managed_k8s#prepare-a-kubernetes-cluster">
                Create kubernetes cluster
              </StyledButton>
            </Flex>
          </Flex>
        }
      />
    </Flex>
  );
};

export default SimplePricing;
