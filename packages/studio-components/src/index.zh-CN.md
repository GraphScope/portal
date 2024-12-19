# 快速开始

## 什么是 `@graphscope/studio-components` ？

`@graphscope/studio-components` 基于 GraphScope Portal 的组件库，帮助开发者快速构建图应用。
<InstallDependencies 
  npm='$ npm install @graphscope/studio-components ' 
  yarn='$ yarn add @graphscope/studio-components' 
  pnpm='$ pnpm install @graphscope/studio-components ' 
/>
</InstallDependencies>

## 什么是 `@graphscope/studio-importor` ?

`@graphscope/studio-importor` 基于 GraphScope Portal 的数据建模模块，用户可以手动拖拽建模，轻松创建图的点边标签与属性。支持 CSV，SQL DDL 导入建模，让用户拥有在白板上设计图模型般的自由体验

<InstallDependencies 
  npm='$ npm install @graphscope/studio-importor ' 
  yarn='$ yarn add @graphscope/studio-importor' 
  pnpm='$ pnpm install @graphscope/studio-importor ' 
/>
</InstallDependencies>

- 在线体验：[Modeling](/modelings)

```jsx | pure
import React, { useState, useEffect } from 'react';
import ModelingApp from '@graphscope/studio-importor';
export default () => {
  return (
    <div>
      <ModelingApp />
    </div>
  );
};
```

## 什么是 `@graphscope/studio-query` ?

`@graphscope/studio-query` 基于 GraphScope Portal 的数据查询模块，用户可以一键连接引擎地址即可查询图数据。支持Cypher/Gremlin 语法，支持历史查询，智能查询，让用户查询数据低门槛无负担

<InstallDependencies 
  npm='$ npm install @graphscope/studio-query ' 
  yarn='$ yarn add @graphscope/studio-query' 
  pnpm='$ pnpm install @graphscope/studio-query ' 
/>
</InstallDependencies>

- 在线体验：[Query](/queries)

````jsx | pure

import QueryApp from '@graphscope/studio-query';
import { Utils } from '@graphscope/studio-components';
const { storage } = Utils;

export default () => {
  const queryInfo = () => {
    return new Promise(resolve => {
      resolve({
        graph_name: 'demo',
      });
    });
  };
  const queryGraphSchema = () => {
    return new Promise(resolve => {
      resolve({
        nodes: [],
        edges: [],
      });
    });
  };
  const queryStatements = () => {
    return new Promise(resolve => {
      resolve([]);
    });
  };
  const { GS_ENGINE_TYPE } = window;
  const language = GS_ENGINE_TYPE === 'groot' ? 'gremlin' : 'cypher';
  const globalScript = GS_ENGINE_TYPE === 'groot' ? 'g.V().limit 10' : 'Match (n) return n limit 10';

  const locale = storage.get('locale') || 'en-US';
  const primaryColor = storage.get('primaryColor') || '#1978FF';
  const themeMode = storage.get('themeColor') || 'defaultAlgorithm';

  return (
    <div
      style={{
        position: 'fixed',
        top: '65px',
        left: '0px',
        right: '0px',
        zIndex: 999,
        bottom: '0px',
        background: '#fff',
      }}
    >
      <QueryApp
        /** 主题相关 */
        theme={{ mode: themeMode, primaryColor }}
        /** 国际化 */
        locale={locale}
        /** 返回导航 */
        globalScript={globalScript}
        language={language}
        queryInfo={queryInfo}
        queryGraphSchema={queryGraphSchema}
        queryStatements={queryStatements}
      />
    </div>
  );
};
```
````
