import React from 'react';
import { Flex, Typography, Button, Tooltip, Divider, Space, Collapse } from 'antd';
import { EllipsisOutlined, DeploymentUnitOutlined, PlusOutlined, ReadOutlined } from '@ant-design/icons';
import Authors from './Authors';
import Pdf from './Icons/pdf';
import Pubmed from './Icons/Pubmed';
import Doi from './Icons/Doi';
import BookMark from './Icons/BookMark';
import { useContext } from '@graphscope/studio-graph';
import Insight from './Insight';
const { Title, Text, Paragraph } = Typography;

interface IPaperDetailProps {
  children?: React.ReactNode;
}

const PaperInfo: React.FC<IPaperDetailProps> = props => {
  const { children } = props;
  const { store } = useContext();
  const { nodeStatus, data } = store;

  const selectNode = data.nodes.find(item => {
    const match = nodeStatus[item.id];
    if (match && match.selected) {
      return match;
    }
  });

  if (!selectNode) {
    return <div>{children}</div>;
  }
  const { label, properties } = selectNode;
  if (label !== 'Paper') {
    const { name, description } = properties || {};
    return (
      <Flex vertical style={{ padding: 24 }} gap={6}>
        <Title level={4}>{name}</Title>
        <Text>{description}</Text>
      </Flex>
    );
  }

  //@ts-ignore
  const { title, authors, time, citations, problem_def: description } = properties;

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
      {authors && <Text type="secondary">{authors}</Text>}
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
        <Text type="secondary" style={{ marginRight: '12px' }}>
          Open in:
        </Text>
        <IconButton icon={<Pdf />} tooltipTitle="PDF" disabled />
        <IconButton icon={<Pubmed />} tooltipTitle="PubMed" disabled />
        <IconButton icon={<Doi />} tooltipTitle="DOI" disabled />
      </Flex>
      {description && <Paragraph>{description}</Paragraph>}
      <Divider style={{ margin: '12px 0px' }} />
      <Flex vertical align="start" gap={8}>
        <Insight />
      </Flex>
    </Flex>
  );
};
export default PaperInfo;
