# Importor

`@graphscope/studio-importor` is a data modeling module based on GraphScope Portal, allowing users to manually drag and drop to model, easily creating graph nodes, edges, and attributes. It supports CSV and SQL DDL import for modeling, giving users the freedom to design graph models as if on a whiteboard.

<InstallDependencies 
  npm='$ npm install @graphscope/studio-importor' 
  yarn='$ yarn add @graphscope/studio-importor' 
  pnpm='$ pnpm install @graphscope/studio-importor' 
/>
</InstallDependencies>

- 建模模式

```jsx
import React, { useState } from 'react';
import { Space, Button } from 'antd';
import ImportorApp from '@graphscope/studio-importor';

export default () => {
  const queryGraphSchema = async () => {
    return { nodes: [], edges: [] };
  };
  return (
    <div >
      <ImportorApp
        /** 属性下拉选项值 */
        queryPrimitiveTypes={() => {
          return ['DT_DOUBLE', 'DT_STRING', 'DT_SIGNED_INT32', 'DT_SIGNED_INT64'].map(item => {
            return { label: item, value: item };
          });
        }}
        queryGraphSchema={queryGraphSchema}
        GS_ENGINE_TYPE={'interactive'}
        appMode="DATA_MODELING"
      />
    </div>
  );
};
```

- 导数模式

```jsx
import React, { useState } from 'react';
import { Space, Button } from 'antd';
import ImportorApp from '@graphscope/studio-importor';

export default () => {
  const queryBoundSchema = async () => {
    return { nodes: [], edges: [] };
  };
  return (
    <div>
      <ImportorApp
        /** 属性下拉选项值 */
        queryPrimitiveTypes={() => {
          return ['DT_DOUBLE', 'DT_STRING', 'DT_SIGNED_INT32', 'DT_SIGNED_INT64'].map(item => {
            return { label: item, value: item };
          });
        }}
        queryBoundSchema={queryBoundSchema}
        appMode="DATA_IMPORTING"
      />
    </div>
  );
};
```
