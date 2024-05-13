import { proxy, useSnapshot } from 'valtio';
import type { INTERNAL_Snapshot as Snapshot } from 'valtio';
import { initalData, paperData } from './const';
import processEdges from './utils/processEdges';
import type { Node } from 'reactflow';
export interface NodeSchema extends Node {
  id: string;
  data: Record<string, any>;
}
export interface EdgeSchema extends NodeSchema {
  source: string;
  target: string;
}
export type IStore = {
  currentType: 'nodes' | 'edges';
  currentId: string;
  nodes: NodeSchema[];
  edges: EdgeSchema[];
  source: {
    nodes: NodeSchema[];
    edges: EdgeSchema[];
  };

  displayMode: 'graph' | 'table';
  graphPosition: Record<string, { x: number; y: number }>;
  tablePosition: Record<string, { x: number; y: number }>;
  theme: {
    primaryColor: string;
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
