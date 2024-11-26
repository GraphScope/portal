import React from 'react';
import { Typography, Flex, Image } from 'antd';

import SplitSection from '../SplitSection';

const { Title, Text } = Typography;

const InfoDisplay = () => {
  return (
    <Flex vertical justify="space-around" align="center" gap={30}>
      <SplitSection
        leftSide={
          <>
            <Title>Get to the bottom of your investigations 10X faster</Title>
            <Text>
              We use machine learning and graph analytics to build a comprehensive network of your clients and what they
              are connected to. Analysts can view the full context surrounding a suspicious client or transaction in
              seconds. Follow your intuition and dynamically filter data or explore new relationships. Make faster
              decisions with the certainty of understanding the full picture.
            </Text>
          </>
        }
        rightSide={
          <Image
            preview={false}
            src="https://linkurious.com/images/uploads/2021/10/8-less-false-negatives-compressed@2x.png"
          />
        }
      />
      <SplitSection
        leftSide={<Image preview={false} src="https://linkurious.com/images/uploads/2021/10/11-expand.png" />}
        rightSide={
          <>
            <Title>Go beyond traditional rules to unmask smart criminals</Title>
            <Text>
              Third party “smurfs,” corporate shells, fake identities: the tactics used by fraud and money laundering
              networks are hard to detect without a holistic view of the networks around clients and transactions.
              Linkurious uses graph analytics to uncover complex hidden connections in your data and reveal criminal
              behaviors that would go undetected with traditional rule systems.
            </Text>
          </>
        }
      />
      <SplitSection
        rightSide={<Image preview={false} src="https://linkurious.com/images/uploads/2021/10/false-positive.gif" />}
        leftSide={
          <>
            <Title>Focus on the 5% of alerts that matter</Title>
            <Text>
              Up to 95% of alerts are false positives. Linkurious' case management system identifies connections across
              your existing alerts. Review entities that are involved in multiple alerts within a single case to better
              assess risk and to speed up analysis. Use machine learning to adjust your AML scoring based on the
              insights of your analysts.
            </Text>
          </>
        }
      />
    </Flex>
  );
};

export default InfoDisplay;
