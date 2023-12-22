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
const propertyOptions = {
  typeOption :[
    {label: 'DataTime', value: 'datatime' }
  ],
  columnOption :[
    {label: '否',value: false,},
    { label: '是', value: true },
  ]
}
export default () => {
  const propertiesRef = useRef();
  const getTable =()=>  console.log('values',propertiesRef.current.getValues())
  const handleChange = (value, values) => {
  console.log(value, values);
};
  return <PropertiesEditor ref={propertiesRef} properties={properties} onChange={handleChange} propertyOptions={propertyOptions}/>;
};
```

```bash
      const properties =[
        {
          id: string | number; # id数据唯一性
          name: string;
          type: 'string';
          token: 'string';
          primaryKey: boolean,
        }]
```
