import React from 'react';
import { proxy, useSnapshot } from 'valtio';
import type { INTERNAL_Snapshot as Snapshot } from 'valtio';

import { Utils, useMultipleInstance } from '@graphscope/studio-components';
import type { Emitter, Graph } from '../graph/types';
export type IStore = {
  data: {
    nodes: any[];
    edges: any[];
  };
  render: '2D' | '3D';
  isReady: boolean;
  graph: Graph;
  emitter: null | Emitter;
  nodeStyle: any;
};

export const initialStore: IStore = {
  data: {
    nodes: [],
    edges: [],
  },
  render: '2D',
  graph: null,
  isReady: false,
  emitter: null,
  nodeStyle: {},
};

type ContextType = {
  store: Snapshot<IStore>;
  updateStore: (fn: (draft: IStore) => void) => void;
};

export function useContext(): ContextType {
  const { id, currentStore } = useMultipleInstance(proxy(Utils.fakeSnapshot(initialStore)));
  const store = useSnapshot(currentStore);

  return {
    store,
    updateStore: (fn: (draft) => void) => {
      return fn(currentStore);
    },
  };
}
