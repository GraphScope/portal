import * as React from 'react';
import { Flex, Button, Checkbox, Select, Input, Table } from 'antd';
import { DeleteFilled, KeyOutlined, PlusCircleOutlined, PlusOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { uuid } from 'uuidv4';
import SelectType from './SelectType';
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
  title?: string | React.ReactNode;
  properties: Property[];
  onChange: (properties: Property[]) => void;
  mapFromFiles?: any;
  typeOptions?: {
    label: string;
    value: string;
  }[];
  selectable?: boolean;
  columns: {
    title;
    key;
  }[];
}
const defaultTypeOptions = [
  {
    label: 'int',
    value: 'int',
  },
  {
    label: 'number',
    value: 'number',
  },
];
let index = 0;

const styles: Record<string, React.CSSProperties> = {
  th: {
    textAlign: 'left',
    borderBottom: '1px solid #ddd',
    padding: '2px',
  },
};

const PropertiesList: React.FunctionComponent<IPropertiesListProps> = props => {
  const { title = 'Properties', onChange = () => {}, typeOptions = defaultTypeOptions, selectable = true } = props;

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (...p) => {
        const [row, record] = p;
        return <Input value={row} />;
      },
    },
    {
      title: 'Type',
      dataIndex: 'type',
      render: (...p) => {
        const [_data, row, index] = p;
        return (
          <SelectType
            value={row.type}
            onChange={value => {
              updateState(preState => {
                const properties = preState.properties.map((item, index) => {
                  if (item.key === row.key) {
                    return {
                      ...item,
                      type: value,
                    };
                  }
                  return item;
                });
                onChange(properties);
                return {
                  ...preState,
                  properties,
                };
              });
            }}
          />
        );
      },
    },
    {
      title: 'ID',
      dataIndex: 'primaryKey',
    },
  ];

  const [state, updateState] = React.useState({
    properties: props.properties,
    selectedRowKeys: [],
  });
  const { properties } = state;

  const rowSelection = {
    type: 'checkbox',
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      updateState(preState => {
        return {
          ...preState,
          selectedRowKeys,
        };
      });
    },
  };

  const handleAdd = () => {
    const newProperty = {
      key: uuid(),
      name: `property_${index++}`,
      type: '',
      primaryKey: false,
    };

    updateState(preState => {
      const properties = [...preState.properties, newProperty];
      onChange(properties);
      return {
        ...state,
        properties,
      };
    });
  };
  const handleDelete = () => {
    updateState(preState => {
      const properties = preState.properties.filter(item => !preState.selectedRowKeys.includes(item.key));
      onChange(properties);
      return {
        ...state,
        properties,
      };
    });
  };
  return (
    <div>
      <Flex justify="space-between" align="center">
        {title}
        <Button type="text" onClick={handleAdd} icon={<PlusSquareOutlined />}></Button>
        <Button type="text" onClick={handleDelete} icon={<DeleteFilled />}></Button>
      </Flex>
      <Table columns={columns} dataSource={properties} rowSelection={rowSelection} />
    </div>
  );
};

export default PropertiesList;
