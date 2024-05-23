import * as React from 'react';
import { Button, Input, Table, ConfigProvider } from 'antd';
import SelectType from './SelectType';
import { handleAdd, handleDelete, handleBlur, handlePrimaryKey, handleDoubleClick, handleType } from './utils';
import PrimaryKey from '../Icons/primary-key';
import MapFromFile from './MapFromFile';
import EditName from './EditName';
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
  const handleProperties = properties => {
    updateState(preset => {
      return {
        ...preset,
        properties,
      };
    });
    onChange(properties);
  };
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (...p) => {
        const [row, record] = p;
        return (
          <EditName
            p={p}
            handleDoubleClick={() => {
              handleProperties(handleDoubleClick(record, state));
            }}
            handleBlur={evt => {
              handleProperties(handleBlur(evt, record, state));
            }}
          />
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
              handleProperties(handleType(value, row, state));
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
          onClick={() => handleProperties(handlePrimaryKey(record, state))}
          icon={<PrimaryKey style={{ color: record?.primaryKey ? '#515151' : '#e6e6e6' }} />}
          style={{ backgroundColor: record?.primaryKey && '#e6e6e6' }}
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
        dataSource={[]}
        /** mapfeomfile 控制 */
        isMapFromFile={false}
        selectedRowKeys={selectedRowKeys}
        addProperty={() => {
          handleProperties(handleAdd(state));
        }}
        delProperty={() => {
          handleProperties(handleDelete(state));
        }}
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
