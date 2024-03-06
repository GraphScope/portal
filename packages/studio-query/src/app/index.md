## StudioQuery 数据查询模块

```jsx
import StudioQuery from './index';

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
  return <StudioQuery queryInfo={queryInfo} queryGraphSchema={queryGraphSchema} queryStatements={queryStatements} />;
};
```
