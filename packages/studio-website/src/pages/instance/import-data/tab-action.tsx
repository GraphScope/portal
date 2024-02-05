import React from 'react';
import { Space, Typography, theme } from 'antd';
import { useContext } from './useContext';
type ITabActionProps = {};
const { Text } = Typography;
const { useToken } = theme;

const TabAction: React.FC<ITabActionProps> = props => {
  const { token } = useToken();
  const { store, updateStore } = useContext();
  const { currentType } = store;
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
  return (
    <Space>
      <Text style={verticesStyle ? styles : activeStyles} onClick={() => handleChange('Vertices')}>
        Vertices
      </Text>
      <Text style={!verticesStyle ? styles : activeStyles} onClick={() => handleChange('Edges')}>
        Edges
      </Text>
    </Space>
  );
};

export default TabAction;
