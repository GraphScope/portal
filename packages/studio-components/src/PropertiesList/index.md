# Property list

```jsx
import React, { useState } from 'react';
import { Space } from 'antd';
import Property from './';
/** 初始化数据需要修改token */
const defaultProperties = [
  {
    key: 1,
    name: 'id',
    type: 'DT_STRING',
    primaryKey: true,
    token: 'id',
  },
  {
    key: 2,
    name: 'name',
    type: 'DT_STRING',
    primaryKey: true,
    token: 2,
  },
].map((item, index) => {
  return {
    ...item,
    token: typeof item.token === 'string' ? `${index}_${item.token}` : item.token,
  };
});
const defaultDataFields = ['id', 'name'];
export default () => {
  const [state, updateState] = useState({
    properties: defaultProperties,
  });
  const { properties } = state;
  const handleChange = list => {
    /** 最终数据需要修改回初始值 token */
    updateState(preset => {
      return {
        ...preset,
        properties: list.map((item, index) => {
          return {
            ...item,
            token: typeof item.token === 'string' ? item.token.split('_')[1] : item.token,
          };
        }),
      };
    });
  };
  /** 结果属性值 */
  console.log('properties', properties);
  /**
   * properties 表格值
   * typeOptions 为Type下拉选项
   * selectable 创建图(true) or 导入数据（false）
   * editable  是否编辑表格(view 设置true or false)
   * isUpload 是否为导入数据
   * dataFields 为mapping fields 下拉选项
   * filelocation 上传imputs值
   * onChange 接收修改后table 值
   */
  return (
    <Property
      properties={defaultProperties}
      dataFields={defaultDataFields}
      selectable={false}
      editable={false}
      isUpload={true}
      filelocation="odps://person"
      onChange={handleChange}
    />
  );
};
```
