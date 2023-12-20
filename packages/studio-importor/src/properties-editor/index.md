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
const handleChange = (value, values) => {
  console.log(123, value, values);
};
export default () => {
  const propertiesRef = useRef();
  return <PropertiesEditor ref={propertiesRef} properties={properties} onChange={handleChange} />;
};
```

