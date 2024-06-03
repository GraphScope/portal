# Quick Start

## What is `@graphscope/studio-components`?

`@graphscope/studio-components` is a component library based on GraphScope Portal, helping developers quickly build graph applications.
<InstallDependencies 
  npm='$ npm install @graphscope/studio-components' 
  yarn='$ yarn add @graphscope/studio-components' 
  pnpm='$ pnpm install @graphscope/studio-components' 
/>
</InstallDependencies>

## What is `@graphscope/studio-importor`?

`@graphscope/studio-importor` is a data modeling module based on GraphScope Portal, allowing users to manually drag and drop to model, easily creating graph nodes, edges, and attributes. It supports CSV and SQL DDL import for modeling, giving users the freedom to design graph models as if on a whiteboard.

<InstallDependencies 
  npm='$ npm install @graphscope/studio-importor' 
  yarn='$ yarn add @graphscope/studio-importor' 
  pnpm='$ pnpm install @graphscope/studio-importor' 
/>
</InstallDependencies>

- Online Experience: [Modeling](/modelings)

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

## What is `@graphscope/studio-query`?

`@graphscope/studio-query` is a data querying module based on GraphScope Portal, allowing users to query graph data by connecting to the engine address with a single click. It supports Cypher/Gremlin syntax, historical queries, and intelligent queries, making data querying easy and hassle-free for users.

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
