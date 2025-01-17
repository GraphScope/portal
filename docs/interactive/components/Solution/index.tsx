import React, { useState } from 'react';
import { Typography, Flex, Image, Button, Input } from 'antd';
import SplitSection from '../SplitSection';
import CarouselPanel from './CarouselPanel';
import InteractiveEngine from './InteractiveEngine';
import InfoDisplay from './InfoDisplay';
import OpenScreening from './OpenScreening';
import Analyse from './Analyse';
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
    <Flex vertical gap={32}>
      <InteractiveEngine />
      <InfoDisplay />
      <OpenScreening />
      <DiscoverPlatform />
      <CarouselPanel />
      <Analyse />
      <Discover />
      <RelatedResources />
      {/* <div style={{ position: 'relative', padding: '50px 200px', backgroundColor: '#020202' }}>
        <Flex vertical justify="center" align="center" gap={12}>
          <Title style={{ margin: 0, color: '#fff' }}>Subscribe to our newsletter</Title>
          <Text style={{ color: '#fff' }}>A spotlight on graph technology directly in your inbox.</Text>
          <Flex style={{ marginTop: '24px' }} gap={24}>
            <Input size="large" placeholder="Enter your emial" />
            <Button size="large" type="primary" style={{ borderRadius: '16px' }}>
              Send
            </Button>
          </Flex>
          <div style={{ position: 'absolute', left: 0, bottom: '-6px' }}>
            <Image preview={false} src="https://linkurious.com/images/platform/investigation/subscribe-bg.svg" />
          </div>
        </Flex>
      </div> */}
    </Flex>
  );
};

export default Solution;
