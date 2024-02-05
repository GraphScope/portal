import * as React from 'react';
import StudioQuery from '@graphscope/studio-query';
import { GraphApiFactory } from '@graphscope/studio-server';
import { history } from 'umi';
import {
  queryGraphData,
  queryGraphSchema,
  queryInfo,
  queryStatement,
  deleteStatement,
  updateStatement,
  createStatement,
  queryHistoryStatements,
} from './services';

const QueryModule = () => {
  React.useEffect(() => {
    GraphApiFactory({ basePath: 'localhost:7678' })
      .listGraphs()
      .then(res => {
        console.log('res...', res);
      });
  }, []);
  return (
    <StudioQuery
      /** 返回导航 */
      //@ts-ignore
      onBack={() => {
        history.push('/instance');
      }}
      /** 侧边栏展示的位置 */
      displaySidebarPosition="left"
      /** 是否启用绝对定位布局 */
      enableAbsolutePosition={false}
      /** 语句默认展示的模式 */
      dispalyMode="flow"
      /** 查询类型 */
      type="cypher"
      //@ts-ignore
      queryInfo={queryInfo}
      /** 查询语句列表  */
      //@ts-ignore
      queryStatement={queryStatement}
      /** 查询历史语句列表  */
      //@ts-ignore
      queryHistoryStatements={queryHistoryStatements}
      /**  更新语句 */
      //@ts-ignore
      updateStatement={updateStatement}
      /** 创建语句 */
      //@ts-ignore
      createStatement={createStatement}
      /** 删除语句  */
      //@ts-ignore
      deleteStatement={deleteStatement}
      /** 查询图数据 */
      //@ts-ignore
      queryGraphData={queryGraphData}
      /** 查询Schema */
      //@ts-ignore
      queryGraphSchema={queryGraphSchema}
    />
  );
};

export default QueryModule;
