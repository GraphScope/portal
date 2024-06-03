# PropertiesList

## 建模场景

```jsx
/**
 * title: 初始化建模
 * description: 用户可以增加，删除，修改图属性
 */
import React, { useState } from 'react';
import { Space, Divider } from 'antd';
import { PropertiesList } from '@graphscope/studio-components';
import { typeColumn, mappingColumn } from './const';

export default () => {
  const handleChange = list => {
    console.log('properties', list);
  };
  return <PropertiesList typeColumn={typeColumn} onChange={handleChange} />;
};
```

```jsx
/**
 * title: 查看场景
 * description: 用户不可编辑
 */
import React, { useState } from 'react';
import { Space, Divider } from 'antd';
import { PropertiesList } from '@graphscope/studio-components';
import { defaultProperties, typeColumn, mappingColumn } from './const';

export default () => {
  const handleChange = list => {
    console.log('properties', list);
  };
  return (
    <>
      <PropertiesList disabled properties={defaultProperties} typeColumn={typeColumn} onChange={handleChange} />
    </>
  );
};
```

## 导数场景

```jsx
/**
 * title: 映射字段场景
 * description: 用户根据已经建好的Schema，做属性字段映射
 */
import React, { useState } from 'react';
import { Space, Divider } from 'antd';
import { PropertiesList } from '@graphscope/studio-components';
import { defaultProperties, typeColumn, mappingColumn } from './const';

export default () => {
  const handleChange = list => {
    console.log('properties', list);
  };
  return (
    <>
      <PropertiesList
        properties={defaultProperties}
        typeColumn={typeColumn}
        mappingColumn={mappingColumn}
        onChange={handleChange}
      />
    </>
  );
};
```

```jsx
/**
 * title: 查看场景
 * description: 用户不可编辑
 */
import React, { useState } from 'react';
import { Space, Divider } from 'antd';
import { PropertiesList } from '@graphscope/studio-components';
import { defaultProperties, typeColumn, mappingColumn } from './const';

export default () => {
  const handleChange = list => {
    console.log('properties', list);
  };
  return (
    <>
      <PropertiesList
        properties={defaultProperties}
        typeColumn={typeColumn}
        mappingColumn={mappingColumn}
        disabled
        onChange={handleChange}
      />
    </>
  );
};
```
