import React, { useEffect, useState } from 'react';
import { Flex, theme, Table } from 'antd';
import { useContext } from '../../index';
import { getTable } from './getTableData';

import { GraphData, NodeData } from '../../index';
import PropertyInfo from '../PropertiesPanel/PropertyInfo';
import type { TableColumnsType, TableProps } from 'antd';

export interface IPropertiesPanelProps {}

const PropertiesTable: React.FunctionComponent<IPropertiesPanelProps> = props => {
  const { store } = useContext();
  const { selectEdges, selectNodes } = store;
  const { dataSource, columns } = getTable([...selectNodes, ...selectEdges]);

  return (
    <Table
      size="large"
      dataSource={dataSource}
      columns={columns}
      bordered
      scroll={{ x: 'max-content' }}
      pagination={{
        simple: true,
        size: 'small',
      }}
    />
  );
};

export default PropertiesTable;
