import React from 'react';
import { Typography, Flex } from 'antd';
import StyledButton from '../StyledButton';
import { gradientTextStyle } from '../const';

const { Title, Text } = Typography;

const performanceTitleStyle: React.CSSProperties = { ...gradientTextStyle, margin: 0 };
const performanceSubtitleStyle: React.CSSProperties = { margin: 0 };
interface Section {
  title: string;
  subtitle: string;
  text: string;
  buttonText?: string;
  leftIcon?: React.ReactNode;
  rightTitle?: string;
  rightTitleGradient?: boolean;
  styles?: React.CSSProperties;
}

const SectionContent: React.FC<{ section: Section }> = ({ section }) => {
  return (
    <Flex vertical gap={12}>
      <Title style={performanceTitleStyle} level={3}>
        {section.title}
      </Title>
      <Title style={performanceSubtitleStyle} level={4}>
        {section.subtitle}
      </Title>
      <Text type="secondary">{section.text}</Text>
      {section.buttonText && (
        <Flex>
          <StyledButton>{section.buttonText}</StyledButton>
        </Flex>
      )}
    </Flex>
  );
};

export default SectionContent;
