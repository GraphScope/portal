import { proxy, useSnapshot } from 'valtio';
// import type { INTERNAL_Snapshot as Snapshot } from 'valtio';
import { Utils } from '@graphscope/studio-components';
import { IStore } from '../types/store';
import { useGraphContext } from '..';

export const defaultStore: IStore = {
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
    isEditable: false,
    isConnectable: true,
  },
  theme: {
    primaryColor: '#1978FF',
  },
};

// type ContextType = {
//   store: Snapshot<IStore>;
//   updateStore: (fn: (draft: IStore) => void) => void;
// };

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

export function useContext() {
  const { graphId } = useGraphContext();
  const id = graphId ?? 'root-1';
  const currentStore = getProxyStoreById(id, proxy(Utils.fakeSnapshot(defaultStore)));
  const onNodesChange = useGraphContext().onNodesChange;
  const onEdgesChange = useGraphContext().onEdgesChange;

  // const { id, currentStore } = useMultipleInstance(proxy(Utils.fakeSnapshot(initialStore)));
  const store = useSnapshot(currentStore);

  return {
    store,
    updateStore: (fn: (draft) => void) => {
      return fn(currentStore);
    },
  };
}
