import React from 'react';
import { Typography, Image, theme } from 'antd';
import { Pricing, Database } from '../../Icons';
import SplitSection from '../../SplitSection';

import SectionContent from './SectionContent';
import { gradientTextStyle } from '../const';

interface SectionType {
  title: string;
  subtitle: string;
  text: string;
  leftIcon: React.ReactNode;
  buttonText?: string;
  styles?: React.CSSProperties;
  rightTitle?: string;
  rightTitleGradient?: boolean;
}
const { Title } = Typography;

const renderSectionContent = (section: SectionType, index: number) => (
  <SplitSection
    key={index}
    styles={section.styles}
    splitNumber={index === 1 ? 0 : 24}
    leftSide={renderLeftOrRightSide(section, index)}
    rightSide={renderLeftOrRightSide(section, index, true)}
  >
    {section.rightTitle && (
      <Title level={3}>
        {section.rightTitle}
        {section.rightTitleGradient && <span style={gradientTextStyle}>Trust our customers.</span>}
      </Title>
    )}
  </SplitSection>
);

const renderLeftOrRightSide = (section: SectionType, index: number, isRightSide = false) =>
  index % 2 === (isRightSide ? 1 : 0) ? <SectionContent section={section} /> : section.leftIcon;
const KnowledgeInfo = () => {
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

  return <>{sectionContent.map(renderSectionContent)}</>;
};

export default KnowledgeInfo;
