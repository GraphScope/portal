import React from 'react';
import { Space, Typography, theme } from 'antd';
import { useContext } from './useContext';
type ITabActionProps = {};
const { Text } = Typography;
const { useToken } = theme;

const TabAction: React.FC<ITabActionProps> = props => {
  const { token } = useToken();
  const { store, updateStore } = useContext();
  const {
    currentType,
    sourceList: { nodes, edges },
  } = store;
  const styles: React.CSSProperties = {
    borderBottom: `2px solid ${token.colorPrimary}`,
    paddingBottom: '7px',
  };
  const activeStyles: React.CSSProperties = {
    borderBottom: 'none',
    paddingBottom: '7px',
  };

  const handleChange = (val: string) => {
    updateStore(draft => {
      draft.currentType = val === 'Vertices' ? 'node' : 'edge';
    });
  };
  const verticesStyle = currentType === 'node';

  const bindNodeCount = nodes.filter(item => item.isBind).length;
  const bindEdgeCount = edges.filter(item => item.isBind).length;
  return (
    <Space>
      <Text style={verticesStyle ? styles : activeStyles} onClick={() => handleChange('Vertices')}>
        Point Data Eource Binding（{bindNodeCount}/{nodes?.length}）
      </Text>
      <Text style={!verticesStyle ? styles : activeStyles} onClick={() => handleChange('Edges')}>
        Edge Data Eource Binding({bindEdgeCount}/{edges?.length})
      </Text>
    </Space>
  );
};

export default TabAction;
