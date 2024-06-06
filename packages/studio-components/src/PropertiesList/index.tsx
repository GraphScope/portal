import * as React from 'react';
import { Button, Table, ConfigProvider, Checkbox, Tooltip } from 'antd';
import SelectType from './SelectType';
import useStore from './utils';
import type { IState } from './utils';

import Controller from './Controller';
import EditName from './EditName';
import MappingFields from './MappingFields';
import { defaultTypeOptions } from './const';
import type { Property } from './typing';

export interface Option {
  label: string;
  value: string;
  disabled?: boolean;
}
export interface IPropertiesListProps {
  /** 是否可编辑 */

  disabled?: boolean;
  /** 标题，默认是 Properties */
  title?: string | React.ReactNode;
  /** 属性  */
  properties?: Property[];
  propertiesFromFiles?: Property[];
  /** 每当属性改变的时候，会触发该方法 */
  onChange: (properties: Property[]) => void;
  /**  第二项 */
  typeColumn: {
    options: Option[];
  };
  /** 第四项 */
  mappingColumn?: {
    options: Option[];
    type: 'Select' | 'InputNumber';
  };
}

/**
 * name --> nameOptions / name_options
 * type--> typeOptions  / type_options
 * token--> tokenOptions === dataFields
 *
 */
const PropertiesList: React.FunctionComponent<IPropertiesListProps> = props => {
  const { title = 'Properties', onChange = () => {}, disabled, typeColumn, mappingColumn } = props;
  const { options: typeOptions = defaultTypeOptions } = typeColumn || {};

  const { handleAdd, handleDelete, handleBlur, handlePrimaryKey, handleDoubleClick, handleType, handleChangeIndex } =
    useStore();
  const [state, updateState] = React.useState<IState & { selectedRowKeys: string[] }>({
    properties: props.properties || [],
    selectedRowKeys: [],
  });
  const { properties, selectedRowKeys } = state;
  const componentType = 'Select';
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
      title: 'PK',
      dataIndex: 'primaryKey',
      render(text, record: any) {
        return (
          <Checkbox
            checked={text}
            disabled={disabled}
            onClick={() => handleProperties(handlePrimaryKey(record, state))}
          />
        );
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      render: (...p) => {
        const [row, record] = p;
        return (
          <EditName
            disabled={!disabled}
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
            options={typeOptions}
            disabled={disabled}
            onChange={value => {
              handleProperties(handleType(value, row, state));
            }}
          />
        );
      },
    },
  ];
  if (mappingColumn) {
    /** 如果有映射关系，则出现第四列 */
    columns.push({
      title: 'Data Fields',
      dataIndex: 'token',
      render(token, all) {
        return (
          <MappingFields
            options={mappingColumn?.options}
            value={token}
            componentType={mappingColumn?.type}
            onChange={(value: string) => handleProperties(handleChangeIndex(value, all, state))}
          />
        );
      },
    });
  }

  /** isMappingToken 创建图(true) or 导入数据（false） */
  const rowSelection = !mappingColumn && {
    type: 'checkbox',
    onChange: (selectedRowKeys: React.Key[], selectedRows: Property[]) => {
      //@ts-ignore
      updateState(preState => {
        return {
          ...preState,
          selectedRowKeys,
        };
      });
    },
    getCheckboxProps: (record: Property) => ({
      disabled, // Column configuration not to be checked
    }),
  };

  return (
    <div>
      {!mappingColumn && (
        <Controller
          title={title}
          dataSource={[]}
          disabled={disabled}
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
