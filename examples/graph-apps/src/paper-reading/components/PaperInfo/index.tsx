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

interface IPaperDetailProps {}

const PaperInfo: React.FC<IPaperDetailProps> = props => {
  const { store } = useContext();
  const { nodeStatus, data } = store;

  const selectNode = data.nodes.find(item => {
    const match = nodeStatus[item.id];
    if (match && match.selected) {
      return match;
    }
  });

  if (!selectNode) {
    return <div>No node selected</div>;
  }
  //@ts-ignore
  const { title, authors, time, citations, problem_def: description } = selectNode.properties;
  console.log('nodeStatus', nodeStatus, selectNode);

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
      <Flex vertical align="start" gap={8}>
        <Insight />
      </Flex>
      <Divider style={{ margin: '12px 0px' }} />
      {description && <Paragraph>{description}</Paragraph>}
    </Flex>
  );
};
export default PaperInfo;
