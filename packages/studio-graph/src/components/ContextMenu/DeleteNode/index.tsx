import * as React from 'react';
import { Typography, Button } from 'antd';
import { ShareAltOutlined, DeleteOutlined } from '@ant-design/icons';
import { useContext, getDataMap } from '../../../';

interface INeighborQueryProps {}

const DeleteNode: React.FunctionComponent<INeighborQueryProps> = props => {
  const { store, updateStore } = useContext();
  const { nodeStatus, emitter } = store;

  const handleClick = () => {
    emitter?.emit('canvas:click');
    const selectedIds = Object.keys(nodeStatus).filter((key, index) => {
      return nodeStatus[key].selected;
    });
    updateStore(draft => {
      const newData = {
        nodes: draft.data.nodes.filter(node => !selectedIds.includes(node.id)),
        edges: draft.data.edges.filter(
          edge =>
            !selectedIds.includes(typeof edge.source === 'object' ? edge.source.id : edge.source) &&
            !selectedIds.includes(typeof edge.target === 'object' ? edge.target.id : edge.target),
        ),
      };
      draft.data = newData;
      draft.dataMap = getDataMap(newData);
    });
  };
  return (
    <Button
      onClick={handleClick}
      icon={<DeleteOutlined />}
      type="text"
      style={{ width: '100%', justifyContent: 'left' }}
    >
      Delete Vertex
    </Button>
  );
};

export default DeleteNode;
