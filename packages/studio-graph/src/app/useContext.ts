import React from 'react';
import { proxy, useSnapshot } from 'valtio';
import type { INTERNAL_Snapshot as Snapshot } from 'valtio';
import type { NodeData, EdgeData } from './typing';

import { Utils, useMultipleInstance } from '@graphscope/studio-components';
import type { Emitter, Graph } from '../graph/types';
export type IStore = {
  nodes: NodeData[];
  edges: EdgeData[];
  render: '2D' | '3D';
  isReady: boolean;
  graph: Graph;
  emitter: null | Emitter;
};

export const initialStore: IStore = {
  nodes: [],
  edges: [],
  render: '2D',
  graph: null,
  isReady: false,
  emitter: null,
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
