import { proxy, useSnapshot } from 'valtio';
import type { INTERNAL_Snapshot as Snapshot } from 'valtio';

export const localStorageVars = {
  mode: 'GS_STUDIO_QUERY_MODE',
};

export interface IStatement {
  /** 语句ID */
  id: string;
  /** 查询ID */
  queryId?: string;
  /** 语句脚本 */
  script: string;
  /** 时间戳 */
  timestamp?: string;
  /** 语句名称 */
  name?: string;
}

export type IStore<T> = T & {
  /** is ready  */
  isReady: boolean;
  /** graph schema data */
  schemaData: any;
  /** graph name */
  graphName: string;
  // nav collapse
  collapse: boolean;
  // active navbar
  activeNavbar: 'saved' | 'info' | 'gpt' | 'store_procedure';
  /** 单击选中的语句,如果是 fLow 模式，则滚动定位到这条语句 ，如果是 Tabs 模式，则直接展示*/
  activeId: string;
  /** 保存的语句 */
  historyStatements: IStatement[];
  /** 查询的语句 */
  statements: IStatement[];
  /** 展示的模式 */
  mode: 'flow' | 'tabs';
  /** 保存的语句 */
  savedStatements: IStatement[];
  storeProcedures: IStatement[];
  /** 启用绝对布局 */
  absolutePosition: boolean;
  /** 启用立即查询 */
  enableImmediateQuery: boolean;
  /** 全局的语句 */
  globalScript: string;
};

const initialStore: IStore<{}> = {
  /** isReady */
  isReady: false,
  graphName: 'movie',
  activeNavbar: 'saved',
  collapse: true,
  activeId: 'query-1',
  /** 全局语句 */
  globalScript: 'Match (n) return n limit 10',
  /** 启用绝对布局 */
  absolutePosition: false,
  schemaData: {
    nodes: [],
    edges: [],
  },
  historyStatements: [],
  statements: [],
  savedStatements: [
    {
      id: 'my-query-1 ',
      name: 'my-query-1',
      script: 'Match (n) return n limit 100',
    },
    {
      id: 'my-query-2',
      name: 'my-query-2',
      script: 'Match (n) return n limit 300',
    },
  ],
  storeProcedures: [
    {
      id: 'store-procedure-1 ',
      name: 'store-procedure-1 ',
      script: 'CALL actore()',
    },
  ],
  mode: (localStorage.getItem(localStorageVars.mode) as 'flow' | 'tabs') || 'flow',
  enableImmediateQuery: false,
};

type ContextType<T> = {
  store: Snapshot<IStore<T>>;
  updateStore: (fn: (draft: IStore<T>) => void) => void;
};

export function useContext<T>(): ContextType<T> {
  const proxyStore = proxy(initialStore) as IStore<T>;
  const store = useSnapshot(proxyStore);
  return {
    store,
    updateStore: (fn: (draft: IStore<T>) => void) => {
      return fn(proxyStore);
    },
  };
}

export interface Info {
  name: string;
  connect_url: string;
  home_url: string;
}

export interface IGraphData {
  nodes: { id: string; label: string; properties: { [key: string]: any } }[];
  edges: { id: string; label: string; properties: { [key: string]: any }; source: string; target: string }[];
}
export interface IGraphSchema {
  nodes: { id: string; label: string; properties: { [key: string]: any } }[];
  edges: { id: string; label: string; properties: { [key: string]: any }; source: string; target: string }[];
}
export interface IStudioQueryProps {
  queryInfo: () => Promise<Info>;
  /**  查询语句列表 */
  queryStatement: () => Promise<IStatement[]>;
  /** 查看历史语句 */
  queryHistoryStatements?: (dt?: string) => Promise<IGraphSchema>;
  /** 删除历史语句 */
  deleteHistoryStatements?: (ids?: string[]) => void;
  /**  更新语句 */
  updateStatement: (params: IStatement) => Promise<IStatement>;
  /** 创建语句 */
  createStatement: (params: IStatement) => Promise<IStatement>;
  /** 删除语句 */
  deleteStatement: (id: string) => Promise<boolean>;
  /** 查询图数据 */
  queryGraphData: (params: IStatement) => Promise<IGraphData>;
  /** 查询Schema */
  queryGraphSchema: (id: string) => Promise<IGraphSchema>;

  /** 语句的类型 */
  type: 'gremlin' | 'cypher' | 'iso_gql';
  /** 返回按钮 */
  onBack: () => {};
  /** 自定义配置 */
  /** 展示的模式 */
  dispalyMode?: 'flow' | 'tabs';
  /** 侧边栏展示的位置 */
  displaySidebarPosition?: 'left' | 'right';
  /** 是否需要再添加查询语句的时候，切换展示为 absolute */
  enableAbsolutePosition?: boolean;
  /**  启用立刻查询 */
  enableImmediateQuery: boolean;
}
