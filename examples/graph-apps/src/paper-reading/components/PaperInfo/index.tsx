import React from 'react';
import { Flex, Typography, Button, Tooltip } from 'antd';
import { EllipsisOutlined, DeploymentUnitOutlined, PlusOutlined } from '@ant-design/icons';
import Authors from './Authors';
import Pdf from './Icons/pdf';
import Pubmed from './Icons/Pubmed';
import Doi from './Icons/Doi';
import BookMark from './Icons/BookMark';
const { Title, Text, Paragraph } = Typography;

interface IPaperDetailProps {
  title: string;
  authors: string;
  time: string;
  citations: string;
  description: string;
}

const PaperInfo: React.FC<IPaperDetailProps> = props => {
  const { title, authors, time, citations, description } = props;
  const IconButton: React.FC<{ icon: React.ReactNode; tooltipTitle: string; disabled: boolean }> = ({
    icon,
    tooltipTitle,
    ...props
  }) => (
    <Tooltip title={tooltipTitle}>
      <Button type="text" {...props} icon={icon} />
    </Tooltip>
  );
  return (
    <Flex vertical style={{ padding: 24 }} gap={6}>
      {title && <Title level={4}>{title}</Title>}
      {authors && (
        <Text type="secondary">
          <Authors str={authors} />
        </Text>
      )}
      {time && (
        <Flex justify="space-between" align="top">
          <Text type="secondary">{time}</Text>
          <EllipsisOutlined />
        </Flex>
      )}
      {citations && (
        <Flex justify="space-between">
          <Text type="secondary">{citations} Citations</Text>
          <Button type="text" icon={<BookMark />}>
            Save
          </Button>
        </Flex>
      )}
      <Flex justify="start" align="center">
        <Text type="secondary">Open in:</Text>
        <IconButton icon={<Pdf />} tooltipTitle="PDF" disabled />
        <IconButton icon={<Pubmed />} tooltipTitle="PubMed" disabled />
        <IconButton icon={<Doi />} tooltipTitle="DOI" disabled />
      </Flex>
      <Flex justify="start" align="center" gap={6}>
        <Button type="text" icon={<DeploymentUnitOutlined />}>
          Open graph
        </Button>
        <Button type="text" icon={<PlusOutlined />}>
          Add origin
        </Button>
      </Flex>
      {description && <Paragraph>{description}</Paragraph>}
    </Flex>
  );
};
export default PaperInfo;
