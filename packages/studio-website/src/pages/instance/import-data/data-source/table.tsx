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
          属性名
        </Text>
      ),
      dataIndex: 'name',
      key: 'name',
      width: '40%',
    },
    {
      title: (
        <Text type="secondary" style={styles}>
          类型
        </Text>
      ),
      dataIndex: 'type',
      key: 'type',
      width: '30%',
      render(text) {
        return <Select style={{ width: '100%' }} defaultValue={text} disabled options={PROPERTY_KEY_OPTIONS} />;
      },
    },
    {
      title: (
        <Text type="secondary" style={styles}>
          主键
        </Text>
      ),
      dataIndex: 'primaryKey',
      key: 'primaryKey',
      width: '10%',
      render(text) {
        return <Checkbox defaultChecked={text} disabled />;
      },
    },
    {
      title: (
        <Text type="secondary" style={styles}>
          列索引(名称)
        </Text>
      ),
      //   dataIndex: 'dataindex',
      width: '20%',
      editable: true,
      render(text) {
        return <InputNumber min={0} defaultValue={text.dataindex} onChange={value => handleChangeIndex(value, text)} />;
      },
    },
  ];
  return (
    <div>
      <Table columns={defaultColumns} bordered dataSource={dataSource} pagination={false} size="middle" />
    </div>
  );
};

export default TableList;
