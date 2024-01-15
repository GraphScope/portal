import React, { type FC, useEffect, forwardRef, useImperativeHandle, useRef, memo } from 'react';
import { Checkbox } from 'antd';
import { uniqueId, cloneDeep } from 'lodash';
import { useImmer } from 'use-immer';
import { ImmerType, IndexData, PropertyList, ConfigColumns ,MapConfigParamsType,PropertyConfigParamsType} from './interface';
import { EditType, IconFont } from './mapdata';
import Editor from './editor';

const PropertiesEditor: FC<{ properties: PropertyList; onChange:any ;isMapFromFile?:boolean;tableType:string[];propertyType?:{type:string;}[]}> = memo(
  forwardRef((props, ref) => {
    const { properties, onChange ,isMapFromFile,tableType,propertyType} = props;
    const inputRef = useRef<HTMLInputElement>();
    // 使用useImmer创建一个可变状态对象
    const [state, updateState] = useImmer<ImmerType>({
      selectedRows: [],
      selectedMapRowKeys: [],
      configList: cloneDeep(properties),
      mapfromfileList: [],
      proSelectKey: [],
      propertyOption: [],
      columnOption: [],
    });
    const {
      selectedRows,
      selectedMapRowKeys,
      configList,
      mapfromfileList,
      proSelectKey,
      propertyOption,
      columnOption,
    } = state;
    // 初始化表格下拉选项及映射列表值
    useEffect(() => {
      const data = cloneDeep(properties);
      let option: { label: string; value: string }[] = [];
      let modifiedArray: any = [];
      let pOption: { label: string; value: string }[] = [];
      data?.map(item => {
        pOption.push({ label: item.token, value: item?.token });
        modifiedArray.push({ ...item, disable: true });
      });
      cloneDeep(propertyType)?.map(item => {
        option.push({ label: item.type, value: item?.type });
      });
      updateState(draft => {
        draft.mapfromfileList = modifiedArray;
        draft.propertyOption = option;
        draft.columnOption = pOption;
      });
    }, []);
    // 定义nodeConfigColumns，包含表格列的配置信息
    const nodeConfigColumns: ConfigColumns[] = [
      {
        title: 'Name',
        width: '40%',
        dataIndex: 'name',
        key: 'name',
        editable: true,
        editorConfig: (record: IndexData) => {
          return {
            inputType: EditType.INPUT,
            prop: {
              value: record,
              // disabled: record.disable,
            },
          };
        },
      },
      {
        title: 'Type',
        dataIndex: 'type',
        width: '25%',
        key: 'type',
        editable: true,
        editorConfig: (record: IndexData) => {
          return {
            inputType: EditType.SELECT,
            prop: {
              options: propertyOption,
              // disabled: record.disabled,
            },
          };
        },
      },
      {
        title: 'Column',
        dataIndex: 'token',
        width: '25%',
        key: 'token',
        editable: true,
        editorConfig: (record: IndexData) => {
          // if (!record.index) {
          //     record.isUnique = false;
          // }
          return {
            inputType: EditType.SELECT,
            prop: {
              options: columnOption,
              // disabled: record.disabled,
            },
          };
        },
      },
      {
        title: 'ID',
        dataIndex: 'operate',
        key: 'operate',
        width: '10%',
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
        if (item.id == val.id && item.primaryKey) {
          return {
            ...item,
            primaryKey: false,
          };
        } else {
          if (item.id == val.id && !item.primaryKey) {
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
      updateState(draft => {
        draft.configList = modifiedArray;
      });
    };
    // 定义addNodeConfig函数，用于添加新的表格行
    const addNodeConfig = () => {
      const list: PropertyList[] = [...configList];
      if(!list?.length){
        list.push({ id: uniqueId(`index_`), name: '', type: '', token: '', primaryKey: true, disable: false });
      }else{
        list.push({ id: uniqueId(`index_`), name: '', type: '', token: '', primaryKey: false, disable: false });
      }
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
      const newDataSource = configList.filter(item => !proSelectKey.includes(item?.id));
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
      updateState(draft => {
        draft.selectedMapRowKeys = [] // 映射数据前清空上次选中值
      });
      let data = cloneDeep(mapfromfileList);
      data = data.filter(item => selectedMapRowKeys.includes(item?.name));
      updateState(draft => {
        draft.configList = data;
      });
      onChange(data);
    };
    const inputDoubleClick = async val => {
      let reasult = cloneDeep(configList);
      const modifiedArray = await reasult.map(item => {
        if (item.id == val.id) {
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
      await inputRef?.current?.focus();
    };
    const inputBlur = val => {
      if (!val.disable) {
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
    const mapConfigParams:MapConfigParamsType["mapConfigParams"] = {
      dataSource: properties,
      columns: mapcolumns,
      showHeader: false,
      selectedMapRowKeys: selectedMapRowKeys,
      handleSelectAll: handleSelectAll,
      handleSelectRow: handleSelectRow,
      mapFromFileConfirm: mapFromFileConfirm,
    };
    const propertyConfigParams:PropertyConfigParamsType["propertyConfigParams"] = {
      dataSource: configList,
      columns: nodeConfigColumns?.filter(item=>tableType?.includes(item?.title)),
      bordered: true,
      rowSelection: rowSelection,
      setConfigList: setConfigList,
      selectedRows: selectedRows,
      addNodeConfig: addNodeConfig,
      delEditTable: delEditTable,
      inputDoubleClick: inputDoubleClick,
      inputBlur: inputBlur,
      isMapFromFile:isMapFromFile
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
  }),
);

export default PropertiesEditor;
