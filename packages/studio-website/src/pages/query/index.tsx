import * as React from 'react';
import StudioQuery from '@graphscope/studio-query';
import Section from '@/components/section';

import {
  queryGraphData,
  queryGraphSchema,
  queryInfo,
  queryStatements,
  deleteStatements,
  createStatements,
} from './services';

const QueryModule = () => {
  return (
    <Section
      breadcrumb={[
        {
          title: 'Home',
        },
        {
          title: 'Query',
        },
      ]}
      title="Query"
      desc="You can use Cypher or Gremlin here to query the graph data"
      style={{
        padding: '0px',
        marginTop: '-24px',
      }}
    >
      <StudioQuery
        /** 侧边栏展示的位置 */
        displaySidebarPosition="right"
        /** 是否启用绝对定位布局 */
        enableAbsolutePosition={true}
        /** 语句默认展示的模式 */
        dispalyMode="flow"
        /** 查询类型 */
        type="cypher"
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
    </Section>
  );
};

export default QueryModule;
