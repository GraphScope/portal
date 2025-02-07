import React from 'react';
import { Typography, Flex, Image, Button } from 'antd';
import SplitSection from '../SplitSection';

const { Title, Text } = Typography;

const DataManagement = () => {
  return (
    // <div style={{ position: 'relative', padding: '50px 200px', backgroundColor: '#ebcba6' }}>
    <SplitSection
      splitNumber={0}
      leftSide={
        <Image
          preview={false}
          src="https://linkurious.com/images/uploads/2023/08/Aptitude_Header-image-2-e1692193957182.png"
        />
      }
      rightSide={
        <Flex vertical gap={24}>
          <Title level={4}>Detect financial crime faster. Analyze smarter. Cut costs.</Title>
          <Text>
            Enhance your organization’s risk management and anti-financial crime efforts with an innovative and
            cost-effective decision intelligence solution. Unlock the power of advanced entity resolution and graph
            technology coupled with advanced expertise in data management.
          </Text>
          <Flex>
            <Button variant="outlined">Learn more</Button>
          </Flex>
        </Flex>
      }
    />
    //   <div style={{ position: 'absolute', right: 0, bottom: '-6px' }}>
    //     <Image preview={false} src="https://linkurious.com/images/solutions-aml/book-bg.svg" />
    //   </div>
    // </div>
  );
};

export default DataManagement;
