import React, { useEffect } from 'react';

import Layout from './layout';

import Content from './content';
import SavedStatements from './saved-statements';
import './index.less';
interface Info {
  name: string;
  connect_url: string;
  home_url: string;
}
interface IStatement {
  /** 语句ID */
  id: string;
  /** 语句名称 */
  name: string;
  /** 语句内容 */
  content: string;
}
interface IGraphData {
  nodes: { id: string; label: string; properties: { [key: string]: any } }[];
  edges: { id: string; label: string; properties: { [key: string]: any }; source: string; target: string }[];
}
interface IGraphSchema {
  nodes: { id: string; label: string; properties: { [key: string]: any } }[];
  edges: { id: string; label: string; properties: { [key: string]: any }; source: string; target: string }[];
}
interface IStudioQueryProps {
  queryInfo: () => Promise<Info[]>;
  /**  查询语句列表 */
  queryStatement: () => Promise<IStatement[]>;
  /**  更新语句 */
  updateStatement: (statement: IStatement) => Promise<IStatement>;
  /** 创建语句 */
  createStatement: (statement: IStatement) => Promise<IStatement>;
  /** 删除语句 */
  deleteStatement: (id: string) => Promise<boolean>;
  /** 查询图数据 */
  queryGraphData: (params: { statement: IStatement; instanceId: string }) => Promise<IGraphData>;
  /** 查询Schema */
  queryGraphSchema: (instanceId: string) => Promise<IGraphSchema>;
  /** 语句的类型 */
  type: 'gremlin' | 'cypher' | 'iso_gql';
}

const StudioQuery: React.FunctionComponent<IStudioQueryProps> = props => {
  return (
    <Layout {...props} left={<SavedStatements></SavedStatements>}>
      <Content {...props} />
    </Layout>
  );
};

export default StudioQuery;
