import React from 'react';
import { Typography, Flex, Card } from 'antd';
import { Quotes } from '../../Icons';
import SplitSection from '../../SplitSection';
import StyledButton from '../StyledButton';
import InteractiveInfo from './InteractiveInfo';
const { Title, Text, Link } = Typography;
const cardBoxShadow = '0px 0px 20px 0px rgba(0, 0, 0, .1)';

const DataAnalysis = () => {
  return (
    <>
      <InteractiveInfo />
      <SplitSection
        splitNumber={0}
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
    </>
  );
};

export default DataAnalysis;
