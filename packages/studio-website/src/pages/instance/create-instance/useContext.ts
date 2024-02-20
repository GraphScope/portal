import { IUserEdge } from '@antv/graphin';
import { proxy, useSnapshot } from 'valtio';
import type { INTERNAL_Snapshot as Snapshot } from 'valtio';

export interface NodeSchema {
  key: string;
  label: string;
  properties: any[];
}
export interface EdgeSchema {
  key: string;
  label: string;
  source: string;
  target: string;
  properties: any[];
}
export type IStore<T> = T & {
  /********* STEP 1 *************/
  /** 引擎类型 */
  engineType: string;
  /** 引擎input */
  engineInput: string;
  /** 引擎Directed */
  engineDirected: boolean;
  /** 图名称 */
  graphName: string;
  /********* STEP 2 *************/
  /** 当前选择的元素类型，节点 or 边 */
  currentType: 'node' | 'edge';
  nodeList: NodeSchema[];
  edgeList: EdgeSchema[];
  /** 当前正在编辑的节点ID */
  nodeActiveKey: string;
  /** 当前正在编辑的边ID */
  edgeActiveKey: string;

  /** Source Node Label/Target Node Label options */
  option: { value: string; label: string }[];
  isAlert: boolean;

  /** graphIn data */
  graphData: {
    nodes: { id: string; label: string; style: any }[];
    edges: IUserEdge[];
  };
  /** node tabs items */
  nodeItems: {};
  /**edge tabs items */
  edgeItems: {};
  /** create or detail */
  detail: boolean;
  /** result view */
  checked: 'table' | 'json' | 'graph';
  currentStep: number;
  /** 实例创建是否成功 */
  createInstaseResult: true | false;
};

export const initialStore: IStore<{}> = {
  /** 引擎类型 */
  engineType: 'mutable_csr',
  /** 图名称 */
  graphName: '',
  /** 当前步骤 */
  currentStep: 0,

  nodeList: [],
  edgeList: [],
  option: [],
  isAlert: false,
  currentType: 'node',
  nodeActiveKey: '',
  edgeActiveKey: '',
  graphData: { nodes: [], edges: [] },
  nodeItems: {},
  edgeItems: {},
  detail: false,
  checked: 'table',

  createInstaseResult: false,
  engineInput: '',
  engineDirected: false,
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
