import * as React from 'react';
import { Table } from 'antd';
const { useState } = React;
import { Property } from './typing';
interface IPropertiesListProps {
  properties: Property[];
  selectedKeys: React.Key[];
  handleChange: (properties: Property[]) => void;
}
const PropertiesList: React.FunctionComponent<IPropertiesListProps> = props => {
  const { handleChange, properties, selectedKeys } = props;
  const columns = [
    {
      key: 1,
      title: 'Name',
      dataIndex: 'name',
    },
    {
      key: 2,
      title: 'Type',
      dataIndex: 'type',
    },
  ];

  const rowSelection = {
    selectedRowKeys: selectedKeys.map(item => item?.key),
    onChange: (newSelectedRowKeys: React.Key[], selectedRows: Property[]) => {
      console.log(`selectedRowKeys: ${newSelectedRowKeys}`, 'selectedRows: ', selectedRows);
      handleChange(selectedRows);
    },
  };

  return <Table columns={columns} dataSource={properties} rowSelection={rowSelection} pagination={false} />;
};

export default PropertiesList;
