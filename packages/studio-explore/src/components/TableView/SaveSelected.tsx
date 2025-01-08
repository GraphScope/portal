import * as React from 'react';
import { Button, Dropdown, Typography, MenuProps } from 'antd';
import { MoreOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { useContext } from '@graphscope/studio-graph';
interface ISaveSelectedProps {}

const SaveSelected: React.FunctionComponent<ISaveSelectedProps> = props => {
  const { store, updateStore } = useContext();
  const { selectNodes } = store;

  const handleChangeData = () => {
    updateStore(draft => {
      draft.data.nodes = selectNodes;
      const matchIds = selectNodes.map(item => item.id);
      const newEdges = draft.data.edges.filter(item => {
        const { source, target } = item;
        const matchSource = matchIds.indexOf(typeof source === 'object' ? source.id : source) !== -1;
        const matchTarget = matchIds.indexOf(typeof target === 'object' ? target.id : target) !== -1;
        return matchSource && matchTarget;
      });

      draft.data.edges = newEdges;
      draft.source.nodes = selectNodes;
      draft.source.edges = newEdges;
    });
  };
  const items: MenuProps['items'] = [
    {
      key: 'save',
      label: <Typography.Text onClick={handleChangeData}>Save Selected Nodes</Typography.Text>,
      icon: <PlayCircleOutlined />,
    },
  ];
  return (
    <Dropdown menu={{ items }} placement="bottomRight">
      <Button type="text" icon={<MoreOutlined />}></Button>
    </Dropdown>
  );
};

export default SaveSelected;
