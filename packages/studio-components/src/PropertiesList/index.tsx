import * as React from 'react';
import { Button, Table, ConfigProvider, Checkbox, Tooltip } from 'antd';
import SelectType from './SelectType';
import useStore from './utils';
import type { Property, IState } from './utils';
import PrimaryKey from '../Icons/primary-key';
import MapFromFile from './MapFromFile';
import EditName from './EditName';
import MappingFields from './MappingFields';

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
  /**
   * 创建图(true) or 导入数据（false）
   * */
  selectable?: boolean;
  /** editable === true or false */
  editable?: boolean;
  /** 数据绑定 导入中需要 */
  isUpload?: boolean;
  dataFields?: [];
  filelocation?: string;
}
const defaultTypeOptions = [
  {
    label: 'DT_STRING',
    value: 'DT_STRING',
  },
  {
    label: 'DT_DOUBLE',
    value: 'DT_DOUBLE',
  },
  {
    label: 'DT_SIGNED_INT32',
    value: 'DT_SIGNED_INT32',
  },
  {
    label: 'DT_SIGNED_INT64',
    value: 'DT_SIGNED_INT64',
  },
];
const PropertiesList: React.FunctionComponent<IPropertiesListProps> = props => {
  const {
    title = 'Properties',
    onChange = () => {},
    typeOptions = defaultTypeOptions,
    selectable = true,
    editable = true,
    isUpload = false,
    dataFields = [],
    filelocation = '',
  } = props;
  const { handleAdd, handleDelete, handleBlur, handlePrimaryKey, handleDoubleClick, handleType, handleChangeIndex } =
    useStore();
  const [state, updateState] = React.useState<IState & { selectedRowKeys: string[] }>({
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
            editable={editable}
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
            typeOptions={typeOptions}
            editable={editable}
            onChange={value => {
              handleProperties(handleType(value, row, state));
            }}
          />
        );
      },
    },
    {
      title: 'PK',
      dataIndex: 'primaryKey',
      render(text, record: any) {
        return (
          <Checkbox
            checked={text}
            disabled={!editable}
            onClick={() => handleProperties(handlePrimaryKey(record, state))}
          />
        );
      },
    },
    {
      title: 'mapping fields',
      dataIndex: 'token',
      render(token, all) {
        return (
          <MappingFields
            isUpload={isUpload}
            dataFields={dataFields}
            value={token}
            filelocation={filelocation}
            onChange={(value: string) => handleProperties(handleChangeIndex(value, all, state))}
          />
        );
      },
    },
  ].filter(item => (selectable ? item.dataIndex !== 'token' : item));
  /** selectable 创建图(true) or 导入数据（false） */
  const rowSelection = selectable && {
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
    getCheckboxProps: (record: DataType) => ({
      disabled: !selectable, // Column configuration not to be checked
    }),
  };

  return (
    <div>
      {selectable && (
        <MapFromFile
          title={title}
          dataSource={[]}
          editable={!editable}
          /** mapfeomfile 控制 */
          isMapFromFile={false}
          selectedRowKeys={selectedRowKeys}
          addProperty={() => {
            handleProperties(handleAdd(state));
          }}
          delProperty={() => {
            handleProperties(handleDelete(state));
            /**特殊性 删除选中后需重置为添加状态 */
            updateState(preState => {
              return {
                ...preState,
                selectedRowKeys: [],
              };
            });
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
      )}
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
