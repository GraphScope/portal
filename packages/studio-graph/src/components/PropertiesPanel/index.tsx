import * as React from 'react';
import { Flex, theme } from 'antd';
import { useContext } from '../../index';
import PropertiesTable from './PropertiesTable';
import PropertyInfo from './PropertyInfo';
import { getSelectData } from './utils';

export interface IPropertiesPanelProps {
  style?: React.CSSProperties;
}

const PropertiesPanel: React.FunctionComponent<IPropertiesPanelProps> = props => {
  const { store } = useContext();
  const { nodeStatus, data, edgeStatus } = store;
  const { token } = theme.useToken();
  const { data: selectData, type } = getSelectData(data, { nodeStatus, edgeStatus });

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

  if (selectData.length === 0) {
    return null;
  }
  if (selectData.length === 1) {
    return <PropertyInfo data={selectData[0]} style={rootStyle} type={type} />;
  }
  return <PropertiesTable data={selectData} style={{ ...rootStyle, width: '600px' }} />;
};

export default PropertiesPanel;
