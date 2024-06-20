import { proxy, useSnapshot } from 'valtio';
import type { INTERNAL_Snapshot as Snapshot } from 'valtio';

export interface NodeSchema {
  key: string;
  label: string;
  properties: any[];
  isDraft?: boolean;
}
export interface EdgeSchema {
  key: string;
  label: string;
  source: string;
  target: string;
  properties: any[];
  /** 判断是否为新建类型 true | false */
  isDraft?: boolean;
}
export type IStore = {
  mode: 'create' | 'view';
  currentStep: number;
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
/** groot 默认 groot_store，接口暂时没有状态 */
export const storeType = window.GS_ENGINE_TYPE === 'groot' ? 'groot_store' : 'mutable_csr';
export const initialStore: IStore = {
  mode: 'create',
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

type ContextType = {
  store: Snapshot<IStore>;
  updateStore: (fn: (draft: IStore) => void) => void;
};

const proxyStore = proxy(initialStore) as IStore;
export function useContext(): ContextType {
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
