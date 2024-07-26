import React from 'react';
import StudioQuery from '@graphscope/studio-query';
import {
  queryGraphData,
  queryGraphSchema,
  queryInfo,
  queryStatements,
  deleteStatements,
  createStatements,
} from './services';
import { useContext } from '@/layouts/useContext';
import EmptyModelCase from './empty-model-case';
import StoppedServiceCase from './stopped-service-case';
import SelectGraph from '@/layouts/select-graph';
import { Utils } from '@graphscope/studio-components';

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
const QueryModule = () => {
  const { store } = useContext();
  const { graphId, displaySidebarPosition, displaySidebarType } = store;
  const { language, globalScript, welcome, autoRun, collapsed } = getPrefixParams();
  console.log('graphId', graphId);
  if (!graphId) {
    return <EmptyModelCase />;
  }
  return (
    <>
      <EmptyModelCase />
      <StoppedServiceCase />
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
    </>
  );
};

export default QueryModule;
