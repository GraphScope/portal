import * as React from 'react';
import { useContext } from '@graphscope/studio-graph';
import { Typography, Flex } from 'antd';
import useHover from './useHover';
interface IPaperListProps {}

const Item = props => {
  const { title, authors, published } = props;
  const date = new Date(published);
  const [isHovered, hoverRef] = useHover();
  console.log('isHovered', isHovered);
  const style = {
    background: isHovered ? '#f0f0f0' : 'transparent',
    cursor: 'pointer',
  };

  return (
    <Flex
      justify="space-between"
      vertical
      gap={8}
      style={{ borderBottom: '1px solid #ccc', padding: '8px', ...style }}
      //@ts-ignore
      ref={hoverRef}
    >
      <Typography.Text>{title}</Typography.Text>
      <Flex justify="space-between" align="center" flex={1}>
        <Typography.Paragraph ellipsis={{ rows: 4 }} style={{ maxWidth: '260px' }} type="secondary">
          {authors}
        </Typography.Paragraph>
        <Typography.Text type="secondary">{date.toLocaleDateString()}</Typography.Text>
      </Flex>
    </Flex>
  );
};
const PaperList: React.FunctionComponent<IPaperListProps> = props => {
  const { store } = useContext();
  const { data } = store;
  const { nodes = [] } = data;

  return (
    <Flex justify="space-between" vertical style={{ height: '100%', overflowY: 'scroll' }}>
      {nodes.map(item => {
        const { properties } = item;

        return <Item {...properties} />;
      })}
    </Flex>
  );
};

export default PaperList;
