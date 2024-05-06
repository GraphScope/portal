import { proxy, useSnapshot } from 'valtio';
import type { INTERNAL_Snapshot as Snapshot } from 'valtio';
import { initalData, process, paperData } from './utils/process';
import processEdges from './utils/processEdges';
export interface NodeSchema {
  key: string;
  label: string;
  properties: any[];
}
export interface EdgeSchema extends NodeSchema {
  source: string;
  target: string;
}
export type IStore = {
  currentType: 'nodes' | 'edges';
  nodes: NodeSchema[];
  edges: EdgeSchema[];
  displayMode: 'graph' | 'table';
};

const edges = processEdges(initalData.edges);
console.log('data', edges, initalData);
export const initialStore: IStore = {
  currentType: 'nodes',
  // ...data,
  nodes: initalData.nodes,
  edges: edges,
  displayMode: 'table',
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
