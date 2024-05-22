import * as React from 'react';
import { Flex, Button, Checkbox, Select, Input, Table, Space } from 'antd';
import { DeleteFilled, KeyOutlined, PlusCircleOutlined, PlusOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { uuid } from 'uuidv4';
import SelectType from './SelectType';
import PrimaryKey from '../Icons/primary-key';
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

  const [state, updateState] = React.useState({
    properties: props.properties,
    selectedRowKeys: [],
  });
  const { properties } = state;
  /** input->blur */
  const handleBlur = (evt, record) => {
    updateState(preset => {
      const properties = preset.properties.map(item => {
        return {
          ...item,
          name: item.key === record.key ? evt.target.value : item.name,
        };
      });
      onChange(properties);
      return {
        ...preset,
        properties,
      };
    });
  };
  const handlePrimaryKey = record => {
    updateState(preset => {
      const properties = preset.properties.map(item => {
        if (item.key == record.key && item.primaryKey) {
          return {
            ...item,
            primaryKey: false,
          };
        } else {
          if (item.key == record.key && !item.primaryKey) {
            return {
              ...item,
              primaryKey: true,
            };
          } else {
            return {
              ...item,
              primaryKey: false,
            };
          }
        }
      });
      onChange(properties);
      return {
        ...preset,
        properties,
      };
    });
  };
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (...p) => {
        const [row, record] = p;
        return <Input defaultValue={row} onBlur={e => handleBlur(e, record)} />;
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
      render: (_, record: any) => (
        <Button
          size="small"
          type={'text'}
          onClick={() => handlePrimaryKey(record)}
          icon={<PrimaryKey style={{ color: record?.primaryKey ? '#515151' : '#e6e6e6' }} />}
        ></Button>
      ),
    },
  ];

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
        <Space size={[0, 0]}>
          <Button type="text" onClick={handleAdd} icon={<PlusSquareOutlined />}></Button>
          <Button type="text" onClick={handleDelete} icon={<DeleteFilled />}></Button>
        </Space>
      </Flex>
      <Table columns={columns} dataSource={properties} rowSelection={rowSelection} pagination={false} />
    </div>
  );
};

export default PropertiesList;
