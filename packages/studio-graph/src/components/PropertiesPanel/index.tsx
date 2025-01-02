import * as React from 'react';
import { Flex, theme } from 'antd';
import { useContext } from '../../index';
import PropertiesTable from './PropertiesTable';
import PropertyInfo from './PropertyInfo';
import { getSelectData } from './utils';

export interface IPropertiesPanelProps {}

export const width = '240px';
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
    width: width,
    boxShadow: token.boxShadow,
    zIndex: 1999,
    background: token.colorBgContainer,
    borderRadius: token.borderRadius,
    overflowY: 'scroll',
    padding: token.padding,
  };

  const tableStyle: React.CSSProperties = {
    display: 'flex',
    position: 'absolute',
    bottom: '12px',
    left: '12px',
    right: '12px',
    boxSizing: 'border-box',
    maxHeight: width,
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
  if (selectNodes.length === 1 || selectEdges.length === 1) {
    return <PropertyInfo style={rootStyle} />;
  }
  if (selectNodes.length > 1) {
    return <PropertiesTable data={selectNodes} style={tableStyle} />;
  }
  if (selectEdges.length > 1) {
    return <PropertiesTable data={selectEdges} style={tableStyle} />;
  }
  return null;
};

export default PropertiesPanel;
