import * as React from 'react';
import { useContext } from '@graphscope/studio-graph';
import { Typography, Flex, Divider, Result, theme } from 'antd';
import { Logo } from '@graphscope/studio-components';

interface IPaperListProps {}

const Item = props => {
  const { title, authors, published, id } = props;
  const { token } = theme.useToken();
  const [state, setState] = React.useState({
    selected: false,
  });
  const { store, updateStore } = useContext();
  const { nodeStatus } = store;
  const selectId = Object.keys(nodeStatus).find(key => {
    return nodeStatus[key].selected;
  });

  const date = new Date(published);

  const style = {
    background: selectId === id ? '#f0f0f0' : 'transparent',
    cursor: 'pointer',
  };
  const onClick = () => {
    setState(preState => {
      return {
        ...preState,
        selected: !preState.selected,
      };
    });
    updateStore(draft => {
      draft.nodeStatus = {
        [id]: {
          selected: true,
        },
      };
    });
  };

  return (
    <Flex
      justify="space-between"
      vertical
      gap={8}
      style={{
        borderTop: `1px solid ${token.colorBorder}`,
        boxSizing: 'border-box',
        padding: '12px',
        width: '100%',
        ...style,
      }}
      onClick={onClick}
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
  const isEmpty = nodes.length === 0;

  return (
    <Flex align="center" vertical style={{ padding: '24px 0px' }}>
      <Logo style={{ width: '200px', transform: 'scale(1.7)', margin: '12px 0px 30px 0px' }} />

      {nodes.map(item => {
        const { properties, id } = item;

        return <Item {...properties} id={id} />;
      })}
      {isEmpty && <Result status="404" title="No data" subTitle="Sorry, the page you visited does not exist." />}
    </Flex>
  );
};

export default PaperList;
