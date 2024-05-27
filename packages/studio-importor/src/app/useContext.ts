import { proxy, useSnapshot } from 'valtio';
import type { INTERNAL_Snapshot as Snapshot } from 'valtio';
import type { Node, Edge } from 'reactflow';

export type IStore = {
  currentType: 'nodes' | 'edges';
  currentId: string;
  nodes: Node[];
  edges: Edge[];
  source: {
    nodes: Node[];
    edges: Edge[];
  };

  displayMode: 'graph' | 'table';
  graphPosition: Record<string, { x: number; y: number }>;
  tablePosition: Record<string, { x: number; y: number }>;
  theme: {
    primaryColor: string;
  };
  collapsed: {
    left: boolean;
    right: boolean;
  };
};

export const initialStore: IStore = {
  // ...data,
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
  theme: {
    primaryColor: '#1978FF',
  },
  collapsed: {
    left: true,
    right: true,
  },
};

type ContextType = {
  store: Snapshot<IStore>;
  updateStore: (fn: (draft: IStore) => void) => void;
};

export const proxyStore = proxy(initialStore) as IStore;

export const updateStore = (fn: (draft: IStore) => void) => {
  return fn(proxyStore);
};

export const useStore = (): Snapshot<IStore> => {
  return useSnapshot(proxyStore);
};

export function useContext(): ContextType {
  const store = useSnapshot(proxyStore);
  return {
    store,
    updateStore,
  };
}
