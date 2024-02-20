import React, { useEffect, useState } from 'react';
import { Table, Select, Checkbox, InputNumber, Typography } from 'antd';
type EditableTableProps = Parameters<typeof Table>[0];
const { Text } = Typography;
interface DataType {
  key: React.Key;
  properties: string;
  type: string;
  primaryKey: boolean;
  columntype?: number;
}
type TableListProps = {
  tabledata: DataType[];
  onChange(val: DataType[]): void;
};
type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

const PROPERTY_KEY_OPTIONS = [
  {
    value: 'long',
    label: 'LONG',
  },
  {
    value: 'double',
    label: 'DOUBLE',
  },
  {
    value: 'str',
    label: 'STRING',
  },
];
const styles: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 400,
};
const TableList: React.FC<TableListProps> = props => {
  const { tabledata, onChange } = props;

  const handleChangeIndex = (value: any, name: string) => {
    tabledata.forEach(item => {
      if (item.properties === name) {
        item.columntype = value;
      }
    });
    onChange && onChange(tabledata);
  };
  const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex?: string })[] = [
    {
      title: (
        <Text type="secondary" style={styles}>
          Properties
        </Text>
      ),
      dataIndex: 'properties',
      key: 'properties',
      width: '25%',
    },
    {
      title: (
        <Text type="secondary" style={styles}>
          Type
        </Text>
      ),
      dataIndex: 'type',
      key: 'type',
      width: '15%',
      render(text) {
        return (
          <Select style={{ width: '100%' }} defaultValue={text} disabled options={PROPERTY_KEY_OPTIONS} size="small" />
        );
      },
    },
    {
      title: (
        <Text type="secondary" style={styles}>
          Main_Key
        </Text>
      ),
      dataIndex: 'main_key',
      key: 'main_key',
      width: '25%',
      render(text) {
        return <Checkbox defaultChecked={text} disabled />;
      },
    },
    {
      title: (
        <Text type="secondary" style={styles}>
          ColumnType or Name
        </Text>
      ),
      dataIndex: 'columntype',
      width: '35%',
      editable: true,
      render(columntype, all) {
        return (
          <InputNumber
            min={0}
            size="small"
            value={columntype}
            onChange={value => handleChangeIndex(value, all.properties)}
          />
        );
      },
    },
  ];
  return <Table columns={defaultColumns} dataSource={tabledata} pagination={false} size="small" />;
};

export default TableList;
