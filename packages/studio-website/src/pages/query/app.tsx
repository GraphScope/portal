import * as React from 'react';
import StudioQuery from '@graphscope/studio-query';
import { LogoImage } from '@/components/logo';
import { history } from 'umi';
import {
  queryGraphData,
  queryGraphSchema,
  queryInfo,
  queryStatements,
  deleteStatements,
  createStatements,
} from './services';

const QueryModule = () => {
  const { GS_ENGINE_TYPE } = window;
  const language = GS_ENGINE_TYPE === 'groot' ? 'gremlin' : 'cypher';
  const globalScript = GS_ENGINE_TYPE === 'groot' ? 'g.V().limit 10' : 'Match (n) return n limit 10';
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
      globalScript={globalScript}
      language={language}
      /** 是否立即查询 */
      enableImmediateQuery={true}
      queryInfo={queryInfo}
      /** 语句  */
      queryStatements={queryStatements}
      createStatements={createStatements}
      deleteStatements={deleteStatements}
      /** 查询图数据 */
      //@ts-ignore
      queryGraphData={queryGraphData}
      //@ts-ignore
      queryGraphSchema={queryGraphSchema}
      logo={<LogoImage style={{ width: '50px', height: '30px' }} />}
    />
  );
};

export default QueryModule;
