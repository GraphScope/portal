import * as React from 'react';
import { Flex, Button, Input, Table, ConfigProvider } from 'antd';
import { DeleteFilled, PlusSquareOutlined, EditOutlined } from '@ant-design/icons';
import SelectType from './SelectType';
import { handleAdd, handleDelete, handleBlur, handlePrimaryKey, handleDoubleClick } from './utils';
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
  columns?: {
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
  const inputRef = React.useRef();
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (...p) => {
        const [row, record] = p;
        return (
          <>
            {record.disable ? (
              <div
                style={{
                  lineHeight: '12px',
                  width: '100%',
                  padding: '4px',
                  cursor: 'pointer',
                  backgroundColor: '#505256',
                  color: '#fff',
                  borderRadius: '3px',
                  textAlign: 'center',
                }}
                onClick={async () => {
                  await handleDoubleClick(record, updateState, onChange);
                  //@ts-ignore
                  await inputRef.current.focus();
                }}
              >
                {record?.name} <EditOutlined />
              </div>
            ) : (
              <Input
                size="small"
                //@ts-ignore
                ref={inputRef}
                defaultValue={row}
                onBlur={e => handleBlur(e, record, updateState, onChange)}
              />
            )}
          </>
        );
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
          style={{ backgroundColor: record?.primaryKey ? '#e6e6e6' : '#fff' }}
        ></Button>
      ),
    },
  ];

  const rowSelection = {
    type: 'checkbox',
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      //@ts-ignore
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
      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: '#fff',
              headerColor: '#575B5E',
              headerSplitColor: '#fff',
              fontWeightStrong: 400,
              borderColor: '#DADADA',
              cellPaddingBlock: 4, //	单元格纵向内间距
              cellPaddingInline: 8, //单元格横向内间距（默认大尺寸）
            },
            Select: {
              colorBorder: '#DADADA',
            },
          },
        }}
      >
        <Table
          columns={columns}
          dataSource={properties}
          //@ts-ignore
          rowSelection={rowSelection}
          pagination={false}
        />
      </ConfigProvider>
    </div>
  );
};

export default PropertiesList;
