import React from 'react';
import { Typography, Flex, Image } from 'antd';
import SplitSection from '../SplitSection';

const { Title, Text } = Typography;

// Define an interface for the content data
interface ContentData {
  title: string;
  description: string;
  imageSrc: string;
  imagePosition: 'left' | 'right';
}

// Define an array of content data with type annotations
const contentData: ContentData[] = [
  {
    title: 'Get to the bottom of your investigations 10X faster',
    description:
      'We use machine learning and graph analytics to build a comprehensive network of your clients and what they are connected to. Analysts can view the full context surrounding a suspicious client or transaction in seconds. Follow your intuition and dynamically filter data or explore new relationships. Make faster decisions with the certainty of understanding the full picture.',
    imageSrc: 'https://linkurious.com/images/uploads/2021/10/8-less-false-negatives-compressed@2x.png',
    imagePosition: 'right',
  },
  {
    title: 'Go beyond traditional rules to unmask smart criminals',
    description:
      'Third party “smurfs,” corporate shells, fake identities: the tactics used by fraud and money laundering networks are hard to detect without a holistic view of the networks around clients and transactions. Linkurious uses graph analytics to uncover complex hidden connections in your data and reveal criminal behaviors that would go undetected with traditional rule systems.',
    imageSrc: 'https://linkurious.com/images/uploads/2021/10/11-expand.png',
    imagePosition: 'left',
  },
  {
    title: 'Focus on the 5% of alerts that matter',
    description:
      "Up to 95% of alerts are false positives. Linkurious' case management system identifies connections across your existing alerts. Review entities that are involved in multiple alerts within a single case to better assess risk and to speed up analysis. Use machine learning to adjust your AML scoring based on the insights of your analysts.",
    imageSrc: 'https://linkurious.com/images/uploads/2021/10/false-positive.gif',
    imagePosition: 'right',
  },
];

// Create a reusable component with specified props
const SectionContent: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <>
    <Title level={4}>{title}</Title>
    <Text>{description}</Text>
  </>
);

const InfoDisplay: React.FC = () => (
  <Flex vertical justify="space-between" align="center" gap={30}>
    {contentData.map(({ title, description, imageSrc, imagePosition }, index) => (
      <SplitSection
        key={index}
        styles={{ padding: 0 }}
        splitNumber={index === 1 ? 0 : 24}
        leftSide={
          imagePosition === 'left' ? (
            <Image preview={false} src={imageSrc} />
          ) : (
            <SectionContent title={title} description={description} />
          )
        }
        rightSide={
          imagePosition === 'right' ? (
            <Image preview={false} src={imageSrc} />
          ) : (
            <SectionContent title={title} description={description} />
          )
        }
      />
    ))}
  </Flex>
);

export default InfoDisplay;
