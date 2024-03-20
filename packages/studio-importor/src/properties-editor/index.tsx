import React, { type FC, useEffect, forwardRef, useImperativeHandle, memo } from 'react';
import { Button, Checkbox } from 'antd';
import { uniqueId, cloneDeep } from 'lodash';
import { useImmer } from '../use-immer';
import {
  IndexData,
  PropertyList,
  ConfigColumns,
  MapConfigParamsType,
  PropertyConfigParamsType,
  IMapColumns,
} from './interface';
import { EditType } from './mapdata';
import PrimaryKey from './icons/primary-key';
import PrimaryKeySelect from './icons/primary-key-select';
import Editor from './editor';
type IPropertiesEditorProps = {
  properties?: PropertyList[];
  onChange: any;
  isMapFromFile?: boolean;
  propertyType?: { type: string }[];
  tableConfig?: [];
  /** 控制表格是否编辑 */
  isEditable: boolean;
  locales: { properties: React.ReactNode; addProperty: React.ReactNode; mapFromFile: React.ReactNode };
  mode: string;
};
const PropertiesEditor: FC<IPropertiesEditorProps> = memo(
  forwardRef((props, ref) => {
    const { properties = [], onChange, isMapFromFile, tableConfig, locales, isEditable = false, mode } = props;
    // 使用useImmer创建一个可变状态对象
    const [state, updateState] = useImmer<{
      selectedRows: string[];
      selectedMapRowKeys: any[];
      configList: PropertyList[];
      mapfromfileList: PropertyList[];
      proSelectKey: any;
    }>({
      selectedRows: [],
      selectedMapRowKeys: [],
      configList: properties,
      mapfromfileList: [],
      proSelectKey: [],
    });
    const { selectedRows, selectedMapRowKeys, configList, mapfromfileList, proSelectKey } = state;
    // 初始化表格下拉选项及映射列表值
    useEffect(() => {
      /** map映射值 */
      if (properties.length > 0) {
        const data = cloneDeep(properties);
        let modifiedArray: any = [];
        data?.map(item => {
          modifiedArray.push({ ...item, disable: true });
        });
        updateState(draft => {
          draft.mapfromfileList = modifiedArray;
        });
      }
    }, []);
    // 定义primaryKeyClick回调函数，用于处理主键切换事件
    const primaryKeyClick = val => {
      let reasult = [...configList];
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
      onChange(modifiedArray);
    };
    // 定义addNodeConfig函数，用于添加新的表格行
    const addNodeConfig = () => {
      const list: PropertyList[] = [...configList];
      list.push({
        id: uniqueId(`index_`),
        name: '',
        type: '',
        token: '',
        primaryKey: !list?.length ? true : false,
        disable: false,
      });
      updateState(draft => {
        draft.configList = list;
      });
      onChange(list);
    };
    // 定义rowSelection对象，用于多选功能
    const rowSelection = {
      columnWidth: '48px',
      onChange: (selectedRowKeys, selectedRows) => {
        updateState(draft => {
          draft.selectedRows = selectedRows;
          draft.proSelectKey = selectedRowKeys;
        });
      },
      getCheckboxProps: record => {
        return { disabled: isEditable };
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
    /** map from file table选中数据 */
    const handleSelectRow = selectedRowKeys => {
      updateState(draft => {
        draft.selectedMapRowKeys = selectedRowKeys;
      });
    };
    /** map from file 表格配置 */
    const mapcolumns: IMapColumns[] = [
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
    /** 修改table设置新值 */
    const setConfigList = val => {
      updateState(draft => {
        draft.configList = val;
      });
      onChange(val);
    };
    // 定义mapFromFileConfirm函数，用于从文件映射数据到表格
    const mapFromFileConfirm = () => {
      updateState(draft => {
        draft.selectedMapRowKeys = []; // 映射数据前清空上次选中值
      });
      let data = cloneDeep(mapfromfileList);
      data.filter(item => selectedMapRowKeys.includes(item?.name));
      updateState(draft => {
        draft.configList = data;
      });
      onChange(data);
    };
    /** 点击可编辑属性名称 */
    const inputDoubleClick: (val: { id: string }) => void = val => {
      updateState(draft => {
        draft.configList = configList.map(item => {
          return {
            ...item,
            disable: item.id !== val.id,
          };
        });
      });
    };
    /** 编辑属性名称及时修改数据源 */
    const inputBlur: (val: { disable: boolean }) => void = val => {
      if (!val.disable) {
        updateState(draft => {
          draft.configList = configList.map(item => {
            return {
              ...item,
              disable: true,
            };
          });
        });
      }
    };
    /** 不同主题 主键选中颜色 */
    let PrimaryKeySelectColor = mode === 'defaultAlgorithm' ? <PrimaryKeySelect /> : <PrimaryKey />;
    let PrimaryKeyColor = mode === 'defaultAlgorithm' ? <PrimaryKey /> : <PrimaryKeySelect />;
    /** 初始化表格下拉选项及映射列表值*/
    const getConfigColumns = () => {
      let configcolumns: ConfigColumns[] = [];
      cloneDeep(tableConfig).map(item => {
        switch (item.type) {
          case 'INPUT':
            configcolumns.push({
              ...item,
              key: 'name',
              editable: true,
              editorConfig: (record: IndexData) => {
                return {
                  inputType: EditType.INPUT,
                  prop: {
                    value: record,
                  },
                  disable: isEditable,
                };
              },
            });
            break;
          case 'SELECT':
            configcolumns.push({
              ...item,
              key: 'type',
              editable: true,
              editorConfig: (record: IndexData) => {
                return {
                  inputType: EditType.SELECT,
                  prop: {
                    options: item.option,
                  },
                  disable: isEditable,
                };
              },
            });
            break;
          default:
            configcolumns.push({
              ...item,
              key: 'operate',
              render: (_, record: any) => (
                <Button
                  size="small"
                  type={'text'}
                  onClick={() => !isEditable && primaryKeyClick(record)}
                  icon={record?.primaryKey ? PrimaryKeySelectColor : PrimaryKeyColor}
                ></Button>
              ),
            });
            break;
        }
      });
      return configcolumns;
    };
    // 定义mapConfigParams和propertyConfigParams对象，作为Editor组件的props
    const mapConfigParams: MapConfigParamsType['mapConfigParams'] = {
      dataSource: properties,
      columns: mapcolumns,
      selectedMapRowKeys: selectedMapRowKeys,
      handleSelectAll: handleSelectAll,
      handleSelectRow: handleSelectRow,
      mapFromFileConfirm: mapFromFileConfirm,
      locales: locales,
    };
    const propertyConfigParams: PropertyConfigParamsType['propertyConfigParams'] = {
      dataSource: configList,
      columns: getConfigColumns(),
      rowSelection: rowSelection,
      setConfigList: setConfigList,
      selectedRows: selectedRows,
      addNodeConfig: addNodeConfig,
      delEditTable: delEditTable,
      inputDoubleClick: inputDoubleClick,
      inputBlur: inputBlur,
      isMapFromFile: isMapFromFile,
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

    return <Editor mapConfigParams={mapConfigParams} propertyConfigParams={propertyConfigParams} />;
  }),
);

export default PropertiesEditor;
