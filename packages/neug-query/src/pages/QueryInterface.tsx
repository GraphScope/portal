import React, { useEffect } from 'react';
import StudioQuery from '@graphscope/studio-query';
import { theme } from 'antd';
import { useStudioProvier, Utils } from '@graphscope/studio-components';
import { QueryService } from '../services/query';
const { storage } = Utils;

// 添加获取前缀参数的函数
const getPrefixParams = () => {
  // 目前默认设置为 cypher，保留 gremlin 作为备用选项
  const language: 'cypher' | 'gremlin' = 'cypher';

  // 根据语言类型设置默认查询脚本
  const globalScript =
    language === 'cypher'
      ? 'MATCH (n) RETURN n LIMIT 500' // cypher 默认查询
      : 'g.V().outE().limit(500)'; // gremlin 默认查询（备用）

  return {
    language,
    globalScript,
  };
};

const QueryInterface: React.FC = () => {
  const { token } = theme.useToken();
  const { locale, isLight } = useStudioProvier();

  // 获取语言和全局脚本配置
  const { language, globalScript } = getPrefixParams();
  const apiService = new QueryService(language);
  // query_initiation
  useEffect(() => {
    storage.set('query_mode', 'neug-query');
    storage.set('query_initiation', 'Server');
    storage.set('query_initiation_service', `${window.location.origin}/cypherv2`);
  }, []);
  return (
    <StudioQuery
      autoRun={false}
      /** 是否启用绝对定位布局 */
      enableAbsolutePosition={false}
      /** 语句默认展示的模式 */
      dispalyMode="flow"
      /** 查询类型 */
      globalScript={globalScript}
      language={language}
      /** 主题和国际化配置 */
      theme={{
        primaryColor: '#fff',
        mode: isLight ? 'lightAlgorithm' : 'darkAlgorithm',
      }}
      locale={locale || 'zh-CN'}
      /** 语句服务  */
      queryStatements={apiService.queryStatements.bind(apiService)}
      createStatements={apiService.createStatements.bind(apiService)}
      deleteStatements={apiService.deleteStatements.bind(apiService)}
      /** 查询图数据 */
      //@ts-ignore
      queryGraphData={apiService.queryGraphData.bind(apiService)}
      /** 查询Schema */
      //@ts-ignore
      queryGraphSchema={apiService.queryGraphSchema.bind(apiService)}
      /** 是否立即查询 */
      enableImmediateQuery={true}
      onlyCypher={true}
      notStoredProcedures={true}
      displaySidebarType="Segmented"
      sidebarStyle={{ width: '300px', padding: '0px', background: token.colorBgBase }}
      sidebarCollapsed={false}
    />
  );
};

export default QueryInterface;
