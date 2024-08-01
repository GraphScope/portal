import React, { useEffect, useState } from 'react';
import StudioQuery, { ConnectEndpoint } from '@graphscope/studio-query';
import {
  queryGraphData,
  queryGraphSchema,
  queryInfo,
  queryStatements,
  deleteStatements,
  createStatements,
  queryEndpoint,
} from './services';
import { useContext } from '@/layouts/useContext';
import EmptyModelCase from './empty-model-case';
import StoppedServiceCase from './stopped-service-case';
import SelectGraph from '@/layouts/select-graph';
import { Utils } from '@graphscope/studio-components';
const { storage } = Utils;

const getPrefixParams = () => {
  const { GS_ENGINE_TYPE } = window;
  const language = GS_ENGINE_TYPE === 'groot' ? 'gremlin' : 'cypher';
  let globalScript = GS_ENGINE_TYPE === 'groot' ? 'g.V().limit 10' : 'Match (n) return n limit 10';
  let welcome;
  let autoRun = false;
  let collapsed = true;

  // 临时的需求，后续删除
  const _hack = Utils.getSearchParams('name') === 'graph_algo';

  if (_hack) {
    globalScript = `
  MATCH (a)-[b]->(c) RETURN a,b,c;
  `;
    autoRun = true;
    welcome = {
      title:
        'We are excited to introduce our interactive visualization tool, designed to complement our survey paper on distributed graph algorithms.',
      description:
        'This tool provides a dynamic way to explore the comprehensive analysis from our survey. It allows users to visualize how different algorithms address various challenges, analyze research trends across topics like Centrality, Community Detection, and Pattern Matching, and interactively query specific areas of interest.',
    };
    collapsed = false;
    const tab = Utils.getSearchParams('tab');
    if (!tab) {
      Utils.setSearchParams({
        tab: 'store-procedure',
      });
    }
  }

  return {
    language,
    welcome,
    autoRun,
    collapsed,
    globalScript,
  };
};
export interface IQueryModuleState {
  isEmptyModel: boolean;
  isStoppedServer: boolean;
  isReady: boolean;
}
const QueryModule = () => {
  const [state, setState] = useState<IQueryModuleState>({
    isEmptyModel: true,
    isStoppedServer: true,
    isReady: false,
  });
  const { isReady } = state;
  const { store, updateStore } = useContext();
  const { graphId, displaySidebarPosition, displaySidebarType } = store;
  const { language, globalScript, welcome, autoRun, collapsed } = getPrefixParams();

  const getEndpoint = async () => {
    const { cypher_endpoint, gremlin_endpoint } = await queryEndpoint();
    const { GS_ENGINE_TYPE } = window;

    const language =
      storage.get<'cypher' | 'gremlin'>('query_language') || (GS_ENGINE_TYPE === 'interactive' ? 'cypher' : 'gremlin');
    const endpoint =
      storage.get<string>('query_endpoint') || (GS_ENGINE_TYPE === 'interactive' ? cypher_endpoint : gremlin_endpoint);
    const initiation =
      storage.get<'Server' | 'Browser'>('query_initiation') ||
      (GS_ENGINE_TYPE === 'interactive' ? 'Browser' : 'Server');

    storage.set('query_endpoint', endpoint);
    storage.set('query_language', language);
    storage.set('query_initiation', initiation);
    storage.set('query_username', '');
    storage.set('query_password', '');

    setState(preState => {
      return {
        ...preState,
        isReady: true,
      };
    });
  };
  useEffect(() => {
    getEndpoint();
  }, []);

  if (isReady) {
    return (
      <>
        <StudioQuery
          autoRun={autoRun}
          welcome={welcome}
          key={graphId}
          /** 是否启用绝对定位布局 */
          enableAbsolutePosition={false}
          /** 语句默认展示的模式 */
          dispalyMode="flow"
          /** 查询类型 */
          globalScript={globalScript}
          language={language as 'cypher' | 'gremlin'}
          //@ts-ignore
          queryInfo={queryInfo}
          /** 语句服务  */
          queryStatements={queryStatements}
          createStatements={createStatements}
          deleteStatements={deleteStatements}
          /** 查询图数据 */
          //@ts-ignore
          queryGraphData={queryGraphData}
          /** 查询Schema */
          //@ts-ignore
          queryGraphSchema={queryGraphSchema}
          /** 是否立即查询 */
          enableImmediateQuery={true}
          connectComponent={<SelectGraph />}
          displaySidebarPosition={displaySidebarPosition}
          displaySidebarType={displaySidebarType}
          sidebarStyle={{ width: '320px', padding: '0px' }}
          sidebarCollapsed={collapsed}
        ></StudioQuery>
        <StoppedServiceCase />
        <EmptyModelCase />
      </>
    );
  }
  return null;
};

export default QueryModule;
