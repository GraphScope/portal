import React from 'react';
import { proxy, useSnapshot } from 'valtio';
import type { INTERNAL_Snapshot as Snapshot } from 'valtio';
import { Utils, useMultipleInstance } from '@graphscope/studio-components';
import type { StyleConfig, Emitter, Graph, GraphData } from './typing';
import { StatusConfig } from '../components/Prepare/typing';

export type IStore = {
  data: GraphData;
  source: GraphData;
  dataMap: Record<
    string,
    {
      label: string;
      properties: Record<string, any>;
      neighbors: string[];
      links: string[];
      [key: string]: any;
    }
  >;
  groups: any[];
  width: number;
  height: number;
  render: '2D' | '3D';
  isReady: boolean;
  graph: Graph;
  emitter: null | Emitter;
  nodeStyle: Record<string, StyleConfig>;
  edgeStyle: Record<string, StyleConfig>;
  nodeStatus: Record<string, StatusConfig>;
  edgeStatus: Record<string, StatusConfig>;
  graphId: string;
  schema: any;
  isLoading: boolean;
};

export const initialStore: IStore = {
  data: {
    nodes: [],
    edges: [],
  },
  source: {
    nodes: [],
    edges: [],
  },
  groups: [],
  width: 200,
  height: 500,
  dataMap: {},
  render: '2D',
  graph: null,
  isReady: false,
  emitter: null,
  nodeStyle: {},
  edgeStyle: {},
  nodeStatus: {},
  edgeStatus: {},
  graphId: '',
  schema: {
    nodes: [],
    edges: [],
  },
  isLoading: false,
};

type ContextType = {
  id: string;
  store: Snapshot<IStore>;
  updateStore: (fn: (draft: IStore) => void) => void;
};

export function useContext(): ContextType {
  const { id, currentStore } = useMultipleInstance(proxy(Utils.fakeSnapshot(initialStore)));
  const store = useSnapshot(currentStore);

  return {
    id,
    store,
    updateStore: (fn: (draft) => void) => {
      return fn(currentStore);
    },
  };
}
