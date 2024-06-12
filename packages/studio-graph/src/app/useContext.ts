import { proxy, useSnapshot } from 'valtio';
import type { INTERNAL_Snapshot as Snapshot } from 'valtio';
import type { NodeData, EdgeData } from './typing';
import React from 'react';
import { Utils, useMultipleInstance } from '@graphscope/studio-components';

export type IStore = {
  nodes: NodeData[];
  edges: EdgeData[];
};

export const initialStore: IStore = {
  nodes: [],
  edges: [],
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
