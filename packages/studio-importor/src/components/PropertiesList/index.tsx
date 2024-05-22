import * as React from 'react';
import { Flex, Button, Input, Table, Space } from 'antd';
import { DeleteFilled, PlusSquareOutlined } from '@ant-design/icons';
import SelectType from './SelectType';
import { handleAdd, handleDelete, handleBlur, handlePrimaryKey } from './utils';
import PrimaryKey from '../Icons/primary-key';
import MapFromFile from './MapFromFile';
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
const PropertiesList: React.FunctionComponent<IPropertiesListProps> = props => {
  const { title = 'Properties', onChange = () => {}, typeOptions = defaultTypeOptions, selectable = true } = props;
  const [state, updateState] = React.useState({
    properties: props.properties,
    selectedRowKeys: [],
  });
  const { properties, selectedRowKeys } = state;

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (...p) => {
        const [row, record] = p;
        return <Input defaultValue={row} onBlur={e => handleBlur(e, record, updateState, onChange)} />;
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
          onClick={() => handlePrimaryKey(record, updateState, onChange)}
          icon={<PrimaryKey style={{ color: record?.primaryKey ? '#515151' : '#e6e6e6' }} />}
        ></Button>
      ),
    },
  ];

  const rowSelection = {
    type: 'checkbox',
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      updateState(preState => {
        return {
          ...preState,
          selectedRowKeys,
        };
      });
    },
  };

  return (
    <div>
      <MapFromFile
        title={title}
        dataSource={[
          { key: '1', name: '1', type: 'INT' },
          { key: '2', name: '2', type: 'INT' },
        ]}
        /** mapfeomfile 控制 */
        isMapFromFile={false}
        selectedRowKeys={selectedRowKeys}
        addProperty={() => handleAdd(state, updateState, onChange)}
        delProperty={() => handleDelete(state, updateState, onChange)}
        handleMapFromFile={file => {
          updateState(preState => {
            return {
              ...preState,
              properties: file,
            };
          });
        }}
      />
      <Table columns={columns} dataSource={properties} rowSelection={rowSelection} pagination={false} />
    </div>
  );
};

export default PropertiesList;
