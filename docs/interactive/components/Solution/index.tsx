import React, { useState } from 'react';
import { Typography, Flex, Image, Button, Input } from 'antd';
import SplitSection from '../SplitSection';
import CarouselPanel from './CarouselPanel';
import InteractiveEngine from './InteractiveEngine';
import InfoDisplay from './InfoDisplay';
import DiscoverPlatform from './DiscoverPlatform';
import RelatedResources from './RelatedResources';
import Discover from './Discover';
const { Title, Text } = Typography;

const Solution = () => {
  const [state, updateState] = useState({
    checkDescription: '',
  });
  const { checkDescription } = state;
  const handleMouse = (evt: string) => {
    updateState(preset => {
      return {
        ...preset,
        checkDescription: evt,
      };
    });
  };
  return (
    <Flex vertical gap={50}>
      <InteractiveEngine />
      <InfoDisplay />
      <div
        style={{
          padding: '50px 22%',
          backgroundImage: 'url(https://linkurious.com/images/uploads/2023/05/bg_cta.png)',
          backgroundSize: '60% 150px',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          borderRadius: '6px',
        }}
      >
        <Flex justify="space-between" align="center">
          <Flex vertical>
            <Title style={{ color: '#fff' }} level={3}>
              PEP & Sanctions screening like you’ve never seen before.
            </Title>
            <Text style={{ color: '#fff' }}>
              Experience a new way to search, visualize and analyze millions of open data records in one single
              interface.
            </Text>
          </Flex>
          <Button
            style={{
              fontSize: '16px',
              fontWeight: 600,
              padding: '24px',
              backgroundColor: '#1a9bfe',
              color: '#fff',
              borderRadius: '30px',
            }}
          >
            Try OpenScreening
          </Button>
        </Flex>
      </div>
      <DiscoverPlatform />
      <CarouselPanel />
      <div style={{ position: 'relative', padding: '50px 200px', backgroundColor: '#ebcba6' }}>
        <Flex vertical justify="space-between" align="center">
          <SplitSection
            leftSide={
              <Image
                preview={false}
                src="https://linkurious.com/images/uploads/2023/08/Aptitude_Header-image-2-e1692193957182.png"
              />
            }
            rightSide={
              <Flex vertical gap={24}>
                <Title>Detect financial crime faster. Analyze smarter. Cut costs.</Title>
                <Text>
                  Enhance your organization’s risk management and anti-financial crime efforts with an innovative and
                  cost-effective decision intelligence solution. Unlock the power of advanced entity resolution and
                  graph technology coupled with advanced expertise in data management.
                </Text>
                <Button
                  style={{
                    width: '30%',
                    fontSize: '16px',
                    fontWeight: 600,
                    padding: '24px',
                    backgroundColor: '#fff',
                    color: '#000',
                    borderRadius: '30px',
                  }}
                >
                  Learn more
                </Button>
              </Flex>
            }
          />
          <div style={{ position: 'absolute', right: 0, bottom: '-6px' }}>
            <Image preview={false} src="https://linkurious.com/images/solutions-aml/book-bg.svg" />
          </div>
        </Flex>
      </div>
      <Discover />
      <RelatedResources />
      <div style={{ position: 'relative', padding: '50px 200px', backgroundColor: '#020202' }}>
        <Flex vertical justify="center" align="center" gap={12}>
          <Title style={{ margin: 0, color: '#fff' }}>Subscribe to our newsletter</Title>
          <Text style={{ color: '#fff' }}>A spotlight on graph technology directly in your inbox.</Text>
          <Flex style={{ width: '20%', marginTop: '24px' }} gap={24}>
            <Input style={{ width: '60%' }} placeholder="Enter your emial" />
            <Button
              style={{
                width: '30%',
                fontSize: '16px',
                fontWeight: 600,
                padding: '24px',
                backgroundColor: '#1a9bfe',
                color: '#fff',
                borderRadius: '30px',
              }}
            >
              Send
            </Button>
          </Flex>
          <div style={{ position: 'absolute', left: 0, bottom: '-6px' }}>
            <Image preview={false} src="https://linkurious.com/images/platform/investigation/subscribe-bg.svg" />
          </div>
        </Flex>
      </div>
    </Flex>
  );
};

export default Solution;
