import { proxy, useSnapshot } from 'valtio';
import type { INTERNAL_Snapshot as Snapshot } from 'valtio';

export interface IStatement {
  /** 语句ID */
  id: string;
  /** 语句脚本 */
  script: string;
  /** 时间戳 */
  timestamp?: number;
  /** 语句名称 */
  name?: string;
  /** 查询的语言 */
  language?: 'gremlin' | 'cypher';
}

export const localStorageVars = {
  mode: 'GS_STUDIO_QUERY_MODE',
};

export type IStore<T> = T & {
  /** is ready  */
  isReady: boolean;
  /** graph schema data */
  schemaData: any;
  /** graph id */
  graphId: string;
  // nav collapse
  collapse: boolean | undefined;
  // active navbar
  activeNavbar: 'saved' | 'info' | 'gpt' | 'store_procedure' | 'recommended';
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
  autoRun: boolean;
  language: 'gremlin' | 'cypher';
  welcome?: {
    title: string;
    description: string;
  };
  /** 默认的折叠状态 */
  defaultCollapsed: boolean;
};

const initialStore: IStore<{}> = {
  /** isReady */
  isReady: false,
  graphId: '',
  activeNavbar: 'recommended',
  collapse: true,
  activeId: 'query-1',
  /** 全局语句 */
  globalScript: 'Match (n) return n limit 10',
  /** autoRun */
  autoRun: false,
  /** 启用绝对布局 */
  absolutePosition: false,
  schemaData: {
    nodes: [],
    edges: [],
  },
  /** 运行时语句 */
  statements: [],
  /** 历史查询语句 */
  historyStatements: [],
  /** 收藏语句 */
  savedStatements: [],
  /** 存储过程语句 */
  storeProcedures: [],
  mode: 'flow',
  enableImmediateQuery: false,
  language: 'gremlin',
  defaultCollapsed: true,
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
  graph_name: string;
  sdk_endpoints: {
    cypher: string;
    hqps: string;
  };
  status: string;
}

export interface IGraphData {
  nodes: { id: string; label: string; properties: { [key: string]: any } }[];
  edges: { id: string; label: string; properties: { [key: string]: any }; source: string; target: string }[];
}
export interface IGraphSchema {
  nodes: { id: string; label: string; properties: { [key: string]: any } }[];
  edges: { id: string; label: string; properties: { [key: string]: any }; source: string; target: string }[];
}

export type StatementType = 'saved' | 'history' | 'store-procedure';

export interface IStudioQueryProps {
  theme: {
    primaryColor: string;
    mode: 'darkAlgorithm' | 'lightAlgorithm';
  };
  locale: 'zh-CN' | 'en-US';
  language: 'cypher' | 'gremlin';

  globalScript?: string;
  queryInfo: (graph_id: string) => Promise<Info>;
  /** 查询图数据 */
  queryGraphData: (params: IStatement) => Promise<IGraphData>;
  /** 取消查询 */
  handleCancelQuery: (params: IStatement) => Promise<IGraphData>;
  /** 查询Schema */
  queryGraphSchema: (id: string) => Promise<IGraphSchema>;

  /** 创建语句 */
  createStatements: (type: StatementType, params: IStatement) => Promise<boolean>;
  /** 查询语句 */
  queryStatements: (type: StatementType) => Promise<IStatement[]>;
  /** 删除语句 */
  deleteStatements: (type: StatementType, ids: string[]) => Promise<boolean>;

  /** 返回按钮 */
  onBack: () => {};
  /** 自定义配置 */
  /** 展示的模式 */
  dispalyMode?: 'flow' | 'tabs';
  /** 侧边栏展示的位置 */
  displaySidebarPosition?: 'left' | 'right';
  /** 侧边栏展示的类型 */
  displaySidebarType?: 'Sidebar' | 'Segmented';
  /** 侧边栏样式 */
  sidebarStyle?: React.CSSProperties;
  /** 侧边栏默认的折叠状态 */
  sidebarCollapsed?: boolean;

  /** 是否需要再添加查询语句的时候，切换展示为 absolute */
  enableAbsolutePosition?: boolean;
  /**  启用立刻查询 */
  enableImmediateQuery: boolean;
  /** 启动折叠侧边栏 */
  enableCollapseSidebar?: boolean;
  logo?: React.ReactNode;
  /** 连接endpoint的组件 */
  connectComponent?: React.ReactNode;

  /** 是否初始化时候自动执行全局的语句 globalscript */
  autoRun?: boolean;
  /** 欢迎页 */
  welcome?: {
    title: string;
    description: string;
  };
}
