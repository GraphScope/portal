import * as React from 'react';
import { Typography, Button } from 'antd';
import { ShareAltOutlined, DeleteOutlined } from '@ant-design/icons';
import { useContext } from '../../../hooks/useContext';
interface INeighborQueryProps {}

const DeleteNode: React.FunctionComponent<INeighborQueryProps> = props => {
  const { store } = useContext();
  const { nodeStatus } = store;
  const handleClick = () => {
    console.log('DeleteNode', nodeStatus);
  };
  return (
    <Button
      onClick={handleClick}
      icon={<DeleteOutlined />}
      type="text"
      disabled
      style={{ width: '100%', justifyContent: 'left' }}
    >
      Delete Vertex
    </Button>
  );
};

export default DeleteNode;
