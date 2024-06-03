---
order: 1
title: Query
---

```jsx
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
