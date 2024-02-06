import React, { useState } from 'react';
import { Table, Select, Checkbox, InputNumber, Typography } from 'antd';
type EditableTableProps = Parameters<typeof Table>[0];
const { Text } = Typography;
interface DataType {
  key: React.Key;
  name: string;
  type: string;
  primaryKey: boolean;
  dataindex?: number;
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
  const [dataSource, setDataSource] = useState<DataType[]>(tabledata);
  const handleChangeIndex = (value: any, text: any) => {
    const { name } = text;
    dataSource.forEach(item => {
      if (item.name === name) {
        item.dataindex = value;
      }
    });
    setDataSource(dataSource);
    onChange && onChange(dataSource);
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
      width: '30%',
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
      width: '20%',
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
      render(columntype) {
        return (
          <InputNumber
            min={0}
            size="small"
            defaultValue={columntype}
            onChange={value => handleChangeIndex(value, columntype)}
          />
        );
      },
    },
  ];
  return <Table columns={defaultColumns} dataSource={dataSource} pagination={false} size="small" />;
};

export default TableList;
