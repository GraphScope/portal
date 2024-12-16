import React from 'react';
import StoreProvider, { useContext as useZustandContext } from '@graphscope/use-zustand';
import type {
  NodeStyle,
  EdgeStyle,
  Emitter,
  Graph,
  GraphData,
  GraphSchema,
  NodeStatus,
  EdgeStatus,
  ComboData,
  Layout,
  NodeData,
  EdgeData,
} from './types';

export type IGetServices = <T extends { id: string; query: (...args: any[]) => Promise<any> }>(
  id: T['id'],
) => T['query'];
export type IStore = {
  /**
   * data of graph
   */
  data: GraphData;
  /**
   * data of graph
   */
  source: GraphData;
  /**
   * dataMap
   */
  dataMap: Map<
    string,
    {
      label: string;
      properties: Record<string, any>;
      neighbors: string[];
      links: string[];
      [key: string]: any;
    }
  >;
  /**
   * cluster combos
   */
  combos: ComboData[];
  /**
   * width of graph
   */
  width: number;
  /**
   * height of graph
   */
  height: number;
  /**
   * render type
   */
  render: '2D' | '3D';
  isReady: boolean;
  graph?: Graph;
  emitter: null | Emitter;
  nodeStyle: Record<string, NodeStyle>;
  edgeStyle: Record<string, EdgeStyle>;
  nodeStatus: Record<string, NodeStatus>;
  edgeStatus: Record<string, EdgeStatus>;
  graphId: string;
  schema: GraphSchema;
  isLoading: boolean;
  getService: IGetServices;
  reheatSimulation: boolean;
  layout: Layout;
  focusNodes: string[];
  selectNodes: NodeData[];
  selectEdges: EdgeData[];
};

export const initialStore: IStore = {
  data: {
    nodes: [],
    edges: [],
  },
  layout: {
    type: 'force',
    options: {},
  },
  source: {
    nodes: [],
    edges: [],
  },
  combos: [],
  enableCombo: undefined,
  combosByKey: '',
  width: 200,
  height: 500,
  dataMap: new Map(),
  render: '2D',
  graph: undefined,
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
  //@ts-ignore
  getService: () => {
    return () => {};
  },
  reheatSimulation: false,
  focusNodes: [],
  selectNodes: [],
  selectEdges: [],
};

export const useContext = () => useZustandContext<IStore>();

export const GraphProvider = props => {
  const { children, id, services } = props;
  const getService: IGetServices = (serviceId: string) => {
    const service = services[serviceId];
    if (!service) {
      console.error(`service not found: ${serviceId}`);
      //@ts-ignore
      return () => {};
    }
    return service;
  };
  return (
    <StoreProvider id={id} store={{ ...initialStore, getService }}>
      {children}
    </StoreProvider>
  );
};
