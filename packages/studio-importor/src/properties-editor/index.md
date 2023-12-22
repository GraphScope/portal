---
nav: components
toc: false
---

## Hello Studio Importor


```jsx
import React, { useRef } from 'react';
import PropertiesEditor from './index.tsx';
const properties = [
  {
    id: 1,
    name: 'id',
    type: 'string',
    token: 'id',
    primaryKey: true,
  },
  {
    id: 2,
    name: 'create-date',
    type: 'datetime',
    token: '__create-date',
    primaryKey: false,
  },
];

export default () => {
  const propertiesRef = useRef();
  const getTable =()=>  console.log('values',propertiesRef.current.getValues())
  const handleChange = (value, values) => {
  console.log(value, values);
};
  return <PropertiesEditor ref={propertiesRef} properties={properties} onChange={handleChange}/>;
};
```

```bash
      const properties =[
        {
          id: string | number; # 字符串或数字，用于标识每个属性的唯一性
          name: string; # 字符串，用于表示属性的名称
          type: 'string'; # 字符串，表示属性的数据类型
          token: 'string'; # 字符串
          primaryKey: boolean, # 布尔 属性主键
        }]
```
