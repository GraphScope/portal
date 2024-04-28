import { proxy, useSnapshot } from 'valtio';
import type { INTERNAL_Snapshot as Snapshot } from 'valtio';

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
};

export const initialStore: IStore = {
  currentType: 'nodes',
  nodes: [
    {
      key: 'n_1',
      label: 'person',
      properties: {
        name: 'node1',
      },
    },
    {
      key: 'n_2',
      label: 'software',
      properties: {
        name: 'DT_SIGNED_INT64',
        age: 12,
      },
    },
  ],
  edges: [
    {
      key: 'e_0',
      label: 'knows',
      data: { label: 'knows' },
      properties: {
        name: 'DT_SIGNED_INT64',
      },
      source: 'n_1',
      target: 'n_2',
    },
    {
      key: 'e_1',
      label: 'created',
      data: { label: 'created' },
      properties: {
        name: 'node1',
      },
      source: 'n_2',
      target: 'n_1',
    },
  ],
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
