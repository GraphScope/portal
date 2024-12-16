import * as React from 'react';
import { Flex, theme } from 'antd';
import { useContext } from '../../index';
import PropertiesTable from './PropertiesTable';
import PropertyInfo from './PropertyInfo';
import { getSelectData } from './utils';

export interface IPropertiesPanelProps {}

const PropertiesPanel: React.FunctionComponent<IPropertiesPanelProps> = props => {
  const { store } = useContext();
  const { selectNodes, selectEdges } = store;
  const { token } = theme.useToken();

  const rootStyle: React.CSSProperties = {
    display: 'flex',
    position: 'absolute',
    top: '12px',
    bottom: '12px',
    right: '12px',
    width: '240px',
    boxShadow: token.boxShadow,
    zIndex: 1999,
    background: token.colorBgContainer,
    borderRadius: token.borderRadius,
    overflowY: 'scroll',
    padding: token.padding,
  };

  if (selectEdges.length === 0 && selectNodes.length === 0) {
    return null;
  }
  if (selectNodes.length === 1) {
    return <PropertyInfo data={selectNodes[0]} style={rootStyle} type={'node'} />;
  }
  if (selectEdges.length === 1) {
    return <PropertyInfo data={selectEdges[0]} style={rootStyle} type={'edge'} />;
  }
  if (selectNodes.length > 1) {
    return <PropertiesTable data={selectNodes} />;
  }
  if (selectEdges.length > 1) {
    return <PropertiesTable data={selectEdges} />;
  }
  return null;
};

export default PropertiesPanel;
