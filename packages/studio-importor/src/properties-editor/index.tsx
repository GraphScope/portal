import React, { type FC, useEffect, forwardRef, useImperativeHandle ,useRef} from 'react';
import { Checkbox, Input } from 'antd';
import { createFromIconfontCN } from '@ant-design/icons';
import { uniqueId, cloneDeep } from 'lodash';
import { useImmer } from 'use-immer';
import { EditType } from './edit-table';
import Editor from './editor';
// 定义EditColumnsType和IndexData类型
export type EditColumnsType<T> = {
  inputType?: string;
  prop: {
    options: Array<{ label: string; value: string }>;
    mode: 'multiple' | 'tags';
  };
};
export interface IndexData {
  id: string | number;
  index: string;
  name?: boolean;
  type?: string;
  column?: string;
  disable?: boolean;
}
export interface PropertyList {
  id: string | number;
  name?: string;
  type?: string;
  token?: string;
  primaryKey?: boolean;
  disable?: boolean;
}
export interface ConfigColumns {
  title: string;
  width?: string;
  dataIndex?: string;
  key?: string;
  editable?: boolean;
  editorConfig?: any;
  render?: () => void;
}
export interface Options {
  typeOption :{label: string, value: string }[],
  columnOption :{label: string, value: boolean }[]
}

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/a/font_4377140_eryoeoa0lk5.js',
});

const PropertiesEditor: FC<{ properties: PropertyList; onChange: () => void ;propertyOptions:Options}> = forwardRef((props, ref) => {
  const { properties, onChange ,propertyOptions} = props;
  const inputRef = useRef()
  // 使用useImmer创建一个可变状态对象
  const [state, updateState] = useImmer<{
    selectedRows: never[];
    selectedMapRowKeys: string[];
    configList: PropertyList[];
    mapfromfileList: PropertyList[];
    proSelectKey: never[];
  }>({
    selectedRows: [],
    selectedMapRowKeys: [],
    configList: [],
    mapfromfileList: [],
    proSelectKey: [],
  });
  const { selectedRows, selectedMapRowKeys, configList, mapfromfileList, proSelectKey } = state;

  useEffect(() => {
    const data = cloneDeep(properties);
    const modifiedArray = data.map(item => {
      return {
        ...item,
        disable: true,
      };
    });
    updateState(draft => {
      draft.mapfromfileList = modifiedArray;
    });
  }, []);
  // 定义nodeConfigColumns，包含表格列的配置信息
  const nodeConfigColumns: ConfigColumns[] = [
    {
      title: 'Name',
      width: '15%',
      dataIndex: 'name',
      key: 'name',
      editable: true,
      editorConfig: (record: IndexData) => {
        return {
          inputType: EditType.INPUT,
          prop: {
            value: record,
            disabled: record.disable,
          },
        };
      },
    },
    {
      title: 'Type',
      dataIndex: 'type',
      width: '40%',
      key: 'type',
      editable: true,
      editorConfig: (record: IndexData) => {
        return {
          inputType: EditType.SELECT,
          prop: {
            options: propertyOptions?.typeOption,
            // disabled: record.disabled,
          },
        };
      },
    },
    {
      title: 'Column',
      dataIndex: 'column',
      width: '25%',
      key: 'column',
      editable: true,
      editorConfig: (record: IndexData) => {
        // if (!record.index) {
        //     record.isUnique = false;
        // }
        return {
          inputType: EditType.SELECT,
          prop: {
            options: propertyOptions?.columnOption,
            // disabled: record.disabled,
          },
        };
      },
    },
    {
      title: 'ID',
      dataIndex: 'operate',
      key: 'operate',
      render: (_, record: any) =>
        record?.primaryKey ? (
          <IconFont type="icon-yuechi" onClick={() => primaryKeyClick(record)} />
        ) : (
          <IconFont type="icon-yuechi1" onClick={() => primaryKeyClick(record)} />
        ),
    },
  ];
  // 定义primaryKeyClick回调函数，用于处理主键切换事件
  const primaryKeyClick = val => {
    let reasult = cloneDeep(configList);
    const modifiedArray = reasult.map(item => {
      if (item.name == val.name) {
        return {
          ...item,
          primaryKey: !item.primaryKey,
        };
      } else {
        return item;
      }
    });
    updateState(draft => {
      draft.configList = modifiedArray;
    });
  };
  // 定义addNodeConfig函数，用于添加新的表格行
  const addNodeConfig = () => {
    const list: PropertyList[] = [...configList];
    list.push({ id: uniqueId(`index_`), name: '', type: '', token: '', primaryKey: false, disable: false });
    updateState(draft => {
      draft.configList = list;
    });
    onChange(list);
  };
  // 定义rowSelection对象，用于多选功能
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      updateState(draft => {
        draft.selectedRows = selectedRows;
        draft.proSelectKey = selectedRowKeys;
      });
    },
  };
  // 定义handleSelectAll、handleSelectRow、mapcolumns等其他辅助函数和变量
  const handleSelectAll = e => {
    if (e.target.checked) {
      updateState(draft => {
        draft.selectedMapRowKeys = mapfromfileList.map(item => item?.name);
      });
    } else {
      updateState(draft => {
        draft.selectedMapRowKeys = [];
      });
    }
  };

  const handleSelectRow = selectedRowKeys => {
    updateState(draft => {
      draft.selectedMapRowKeys = selectedRowKeys;
    });
  };
  const mapcolumns = [
    {
      dataIndex: 'name',
      key: 'name',
      width: 35,
      render: name => (
        <Checkbox
          checked={selectedMapRowKeys.includes(name)}
          onChange={e =>
            handleSelectRow(
              e.target.checked ? [...selectedMapRowKeys, name] : selectedMapRowKeys.filter(key => key !== name),
            )
          }
        />
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: 'Contents',
      dataIndex: 'Contents',
      key: 'Contents',
    },
  ];
  // 定义delEditTable函数，用于删除选中表格行
  const delEditTable = () => {
    const newDataSource = configList.filter(item => !proSelectKey.includes(item.id));
    updateState(draft => {
      draft.selectedRows = [];
      draft.configList = newDataSource;
    });
    onChange(newDataSource);
  };
  const setConfigList = val => {
    updateState(draft => {
      draft.configList = val;
    });
    onChange(val);
  };
  // 定义mapFromFileConfirm函数，用于从文件映射数据到表格
  const mapFromFileConfirm = () => {
    let data = cloneDeep(properties);
    data = data.map((item, index) => {
      if (selectedMapRowKeys.includes(item?.name)) {
        return {
          ...item,
          id: item?.name + index,
          disable: true,
        };
      }
    });
    updateState(draft => {
      draft.configList = data;
    });
    onChange(data);
  };
  const inputDoubleClick = async (val) => {
    let reasult = cloneDeep(configList);
    const modifiedArray = await reasult.map(item => {
      if (item.name == val.name) {
        return {
          ...item,
          disable: false,
        };
      } else {
        return {
          ...item,
          disable: true,
        };
      }
    });
    await updateState(draft => {
      draft.configList = modifiedArray;
    });
    await inputRef?.current?.focus()
  };
  const inputBlur = (val) => {
    if(!val.disable){
      let reasult = cloneDeep(configList);
      const modifiedArray = reasult.map(item => {
        return {
          ...item,
          disable: true,
        };
      });
      updateState(draft => {
        draft.configList = modifiedArray;
      });
    }
  };
  // 定义mapConfigParams和propertyConfigParams对象，作为Editor组件的props
  const mapConfigParams = {
    dataSource: properties,
    columns: mapcolumns,
    showHeader: false,
    bordered: false,
    selectedMapRowKeys: selectedMapRowKeys,
    handleSelectAll: handleSelectAll,
    handleSelectRow: handleSelectRow,
    mapFromFileConfirm: mapFromFileConfirm,
  };
  const propertyConfigParams = {
    dataSource: configList,
    columns: nodeConfigColumns,
    bordered: true,
    pagination: false,
    rowSelection: rowSelection,
    setConfigList: setConfigList,
    selectedRows: selectedRows,
    addNodeConfig: addNodeConfig,
    delEditTable: delEditTable,
    inputDoubleClick: inputDoubleClick,
    inputBlur: inputBlur,
  };
  useImperativeHandle(
    ref,
    () => {
      return {
        getValues() {
          return configList;
        },
      };
    },
    [configList],
  );
  return <Editor ref={inputRef} mapConfigParams={mapConfigParams} propertyConfigParams={propertyConfigParams} />;
});

export default PropertiesEditor;
