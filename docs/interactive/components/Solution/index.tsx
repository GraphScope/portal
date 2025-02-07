import React from 'react';
import { Flex } from 'antd';
import InteractiveEngine from './InteractiveEngine';
import SolutionInfo from './SolutionInfo';
import VisualizeAnalyze from './VisualizeAnalyze';
import DiscoverPlatform from './DiscoverPlatform';
import DifferenceView from './DifferenceView';
import DataManagement from './DataManagement';
import RelatedResources from './RelatedResources';
import Solutions from './Solutions';

const Solution = () => {
  return (
    <Flex vertical gap={48}>
      <InteractiveEngine />
      <SolutionInfo />
      <VisualizeAnalyze />
      <DiscoverPlatform />
      <DifferenceView />
      <DataManagement />
      <Solutions />
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
