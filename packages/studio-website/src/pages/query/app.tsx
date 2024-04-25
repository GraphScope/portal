import * as React from 'react';
import StudioQuery from '@graphscope/studio-query';
import Logo from '@/components/logo';
import { history } from 'umi';

import storage from '@/components/utils/localStorage';
import {
  queryGraphData,
  queryGraphSchema,
  queryInfo,
  queryStatements,
  deleteStatements,
  createStatements,
  handleCancelQuery,
} from './services';

const QueryModule = () => {
  const { GS_ENGINE_TYPE } = window;
  const language = GS_ENGINE_TYPE === 'groot' ? 'gremlin' : 'cypher';
  const globalScript = GS_ENGINE_TYPE === 'groot' ? 'g.V().limit 10' : 'Match (n) return n limit 10';

  const locale = storage.getItem('locale') || 'en-US';
  const primaryColor = storage.getItem('primaryColor') || '#1978FF';
  const themeMode = storage.getItem('themeColor') || 'defaultAlgorithm';

  return (
    <StudioQuery
      /** 主题相关 */
      theme={{ mode: themeMode, primaryColor }}
      /** 国际化 */
      locale={locale}
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
      handleCancelQuery={handleCancelQuery}
      //@ts-ignore
      queryGraphSchema={queryGraphSchema}
      logo={<Logo style={{ width: '140px', marginLeft: '16px' }} />}
    />
  );
};

export default QueryModule;
