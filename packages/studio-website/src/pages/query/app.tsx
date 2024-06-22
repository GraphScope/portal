import React from 'react';
import { theme } from 'antd';
import StudioQuery from '@graphscope/studio-query';
import storage from '@/components/utils/localStorage';
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
import { useThemeContainer } from '@graphscope/studio-components';
const { useToken } = theme;
const QueryModule = () => {
  const { GS_ENGINE_TYPE } = window;
  const language = GS_ENGINE_TYPE === 'groot' ? 'gremlin' : 'cypher';
  const globalScript = GS_ENGINE_TYPE === 'groot' ? 'g.V().limit 10' : 'Match (n) return n limit 10';
  const locale = storage.getItem('locale');
  const primaryColor = storage.getItem('primaryColor');
  const { store } = useContext();
  const { graphId } = store;
  const { algorithm } = useThemeContainer();
  const { token } = useToken();
  const { colorPrimary } = token;

  return (
    <>
      <EmptyModelCase />
      <StoppedServiceCase />

      <StudioQuery
        key={graphId}
        //@ts-ignore
        /** 主题相关 */
        // theme={{ mode: algorithm, primaryColor: colorPrimary }}
        /** 国际化 */
        locale={locale}
        /** 侧边栏展示的位置 */
        displaySidebarPosition="right"
        /** 是否启用绝对定位布局 */
        enableAbsolutePosition={false}
        /** 语句默认展示的模式 */
        dispalyMode="flow"
        /** 查询类型 */
        globalScript={globalScript}
        language={language}
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
      />
    </>
  );
};

export default QueryModule;
