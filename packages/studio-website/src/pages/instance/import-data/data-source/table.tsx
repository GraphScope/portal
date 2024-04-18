import React from 'react';
import { Table, Select, Checkbox, Typography, InputNumber, Flex } from 'antd';
type EditableTableProps = Parameters<typeof Table>[0];
const { Text } = Typography;
interface DataType {
  key: React.Key;
  name: string;
  type: string;
  primaryKey: boolean;
  token?: number;
}
type TableListProps = {
  tabledata: DataType[];
  dataFields?: string[];
  filelocation: string;
  onChange(val: DataType[]): void;
};
type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

const styles: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 400,
};
const MappingFields = (props: any) => {
  const { dataFields, value, onChange, filelocation } = props;
  if (typeof value === 'number' || !filelocation) {
    return (
      <InputNumber
        size="small"
        value={value}
        min={0}
        onChange={evt => {
          onChange(evt);
        }}
      />
    );
  } else if (dataFields) {
    const options = dataFields.map((item: string, index: number) => {
      console.log('dataFields', value, item);

      return {
        value: `${index}_${item}`,
        label: (
          <Flex justify="space-between" key={index}>
            <span style={{ backgroundColor: '#ddd', padding: '0px 6px', marginRight: '12px' }}>#{index}</span>
            <span>{item}</span>
          </Flex>
        ),
      };
    });
    console.log(options);

    return <Select size="small" options={options} value={value} onChange={onChange} style={{ width: '136px' }} />;
  }
};

const TableList: React.FC<TableListProps> = props => {
  const { tabledata, onChange, dataFields, filelocation } = props;
  const title = dataFields ? 'Mapping Fields' : 'Column';
  const handleChangeIndex = (value: any, all: any) => {
    const { key } = all;
    tabledata.forEach(item => {
      if (item.key === key) {
        item.token = value;
      }
    });
    onChange(tabledata);
  };
  const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex?: string })[] = [
    {
      title: (
        <Text type="secondary" style={styles}>
          Properties
        </Text>
      ),
      dataIndex: 'name',
      key: 'name',
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
        return <Select style={{ width: '100%' }} defaultValue={text} disabled size="small" />;
      },
    },
    {
      title: (
        <Text type="secondary" style={styles}>
          Primary Key
        </Text>
      ),
      dataIndex: 'primaryKey',
      key: 'primaryKey',
      width: '25%',
      render(text) {
        return <Checkbox defaultChecked={text} disabled />;
      },
    },
    {
      title: (
        <Text type="secondary" style={styles}>
          {title}
        </Text>
      ),
      dataIndex: 'token',
      width: '35%',
      editable: true,
      render(token, all) {
        return (
          <MappingFields
            dataFields={dataFields}
            value={token}
            filelocation={filelocation}
            onChange={(value: string) => handleChangeIndex(value, all)}
          />
        );
        // return <Input size="small" value={token} onChange={e => handleChangeIndex(e.target.value, all)} />;
      },
    },
  ];
  return <Table columns={defaultColumns} dataSource={tabledata} pagination={false} size="small" />;
};

export default TableList;
