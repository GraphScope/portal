import { IUserEdge } from '@antv/graphin';
import { proxy, useSnapshot } from 'valtio';
import type { INTERNAL_Snapshot as Snapshot } from 'valtio';

export interface NodeSchema {
  key: string;
  label: string;
  properties: any[];
  isAdd?: boolean;
}
export interface EdgeSchema {
  key: string;
  label: string;
  source: string;
  target: string;
  properties: any[];
  /** true | false 判断是否为groot 新建类型*/
  isAdd?: boolean;
}
export type IStore = {
  mode: 'create' | 'view';
  engineType: 'interactive' | 'groot';
  currentStep: number;
  /********* STEP 1 *************/
  /** 图名称 */
  graphName: string;
  /** 存储类型 */
  storeType: 'mutable_csr';
  /** 引擎Directed */
  engineDirected: boolean;
  /********* STEP 2 *************/
  /** 当前选择的元素类型，节点 or 边 */
  currentType: 'node' | 'edge';
  nodeList: NodeSchema[];
  edgeList: EdgeSchema[];
  /** 当前正在编辑的节点ID */
  nodeActiveKey: string;
  /** 当前正在编辑的边ID */
  edgeActiveKey: string;

  /** STEP-3 */
  checked: 'table' | 'json' | 'graph';

  /** 实例创建是否成功 */
  createInstaseResult: true | false;
};

export const initialStore: IStore = {
  /** 引擎类型 */
  engineType: 'interactive',
  mode: 'create',
  storeType: 'mutable_csr',
  /** 图名称 */
  graphName: '',
  /** 当前步骤 */
  currentStep: 0,
  nodeList: [],
  edgeList: [],
  currentType: 'node',
  nodeActiveKey: '',
  edgeActiveKey: '',
  checked: 'table',
  createInstaseResult: false,
  engineDirected: false,
};

type ContextType<T> = {
  store: Snapshot<IStore>;
  updateStore: (fn: (draft: IStore) => void) => void;
};

const proxyStore = proxy(initialStore) as IStore;
export function useContext<T>(): ContextType<T> {
  const store = useSnapshot(proxyStore);
  return {
    store,
    updateStore: (fn: (draft: IStore) => void) => {
      return fn(proxyStore);
    },
  };
}

export function useStore() {
  return useSnapshot(proxyStore);
}
export function updateStore(fn: (draft: IStore) => void) {
  return fn(proxyStore);
}
