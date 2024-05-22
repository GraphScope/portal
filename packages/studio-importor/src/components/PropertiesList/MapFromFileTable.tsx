import * as React from 'react';
import { Table, Checkbox } from 'antd';
const { useState } = React;
interface Property {
  key: string;
  name: string;
  type: string;
  index: number;
  primaryKey: boolean;
}

interface DataType {
  key: string;
  name: string;
  type: string;
  index: number;
  primaryKey: boolean;
}

interface IPropertiesListProps {
  properties: Property[];
  handleChange: (properties: Property[]) => void;
}
const PropertiesList: React.FunctionComponent<IPropertiesListProps> = props => {
  const { handleChange, properties } = props;
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Type',
      dataIndex: 'type',
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      handleChange(selectedRows);
    },
  };

  return <Table columns={columns} dataSource={properties} rowSelection={rowSelection} pagination={false} />;
};

export default PropertiesList;
