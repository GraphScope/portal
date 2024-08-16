import { proxy, useSnapshot } from 'valtio';
import type { INTERNAL_Snapshot as Snapshot } from 'valtio';
import { Utils } from '@graphscope/studio-components';
import { ISchemaNode, ISchemaEdge } from './typing';

export type IStore = {
  /** APP类型 */
  appMode: 'DATA_MODELING' | 'DATA_IMPORTING';
  /**不可编辑状态 */
  disabled: boolean;
  currentType: 'nodes' | 'edges';
  currentId: string;
  nodes: ISchemaNode[];
  edges: ISchemaEdge[];
  source: {
    nodes: ISchemaNode[];
    edges: ISchemaEdge[];
  };
  displayMode: 'graph' | 'table';
  graphPosition: Record<string, { x: number; y: number }>;
  tablePosition: Record<string, { x: number; y: number }>;

  hasLayouted: boolean;
  elementOptions: {
    /** 是否可以点击，包含点和边 */
    isEditable: boolean;
    /** 是否可以编辑标签，包括节点和边 */
    isConnectable: boolean;
  };
  theme: {
    primaryColor: string;
  };
};

export const initialStore: IStore = {
  /** APP类型 */
  appMode: 'DATA_MODELING',
  /**不可编辑状态 */
  disabled: false,
  nodes: [],
  edges: [],
  source: {
    nodes: [],
    edges: [],
  },
  displayMode: 'graph',
  graphPosition: {},
  tablePosition: {},
  currentType: 'nodes',
  currentId: '',

  hasLayouted: false,
  elementOptions: {
    isEditable: true,
    isConnectable: true,
  },
  theme: {
    primaryColor: '#1978FF',
  },
};

type ContextType = {
  store: Snapshot<IStore>;
  updateStore: (fn: (draft: IStore) => void) => void;
};

export const StoreMap = {};

export const getProxyStoreById = (ContextId: string, _initialStore: any) => {
  if (ContextId) {
    const prevStore = StoreMap[ContextId];
    if (!prevStore) {
      /** 考虑SDK多实例的场景 */
      StoreMap[ContextId] = _initialStore;
    }
  }

  return StoreMap[ContextId];
};

export const useMultipleInstance = initialStore => {
  const id = 'root-1';
  const currentStore = getProxyStoreById(id, initialStore);
  return {
    id,
    currentStore,
  };
};

export function useContext(): ContextType {
  const id = 'root-1';
  const currentStore = getProxyStoreById(id, proxy(Utils.fakeSnapshot(initialStore)));

  // const { id, currentStore } = useMultipleInstance(proxy(Utils.fakeSnapshot(initialStore)));
  const store = useSnapshot(currentStore);

  return {
    store,
    updateStore: (fn: (draft) => void) => {
      return fn(currentStore);
    },
  };
}
