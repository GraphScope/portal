import type { NodePositionChange } from 'reactflow';
import StoreProvider, { useContext as useZustandContext } from '@graphscope/use-zustand';
import React, { useContext, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ISchemaEdge, ISchemaNode } from '../types';

export interface GraphState {
  displayMode: 'graph' | 'table';
  nodes: ISchemaNode[];
  edges: ISchemaEdge[];
  nodePositionChange: NodePositionChange[];
  hasLayouted: boolean;
  elementOptions: {
    isEditable: boolean;
    isConnectable: boolean;
  };
  theme: {
    primaryColor: string;
  };
  currentId: string;
  currentType: 'nodes' | 'edges';
  selectedNodeIds: string[];
  selectedEdgeIds: string[];
}

const initialStore: GraphState = {
  displayMode: 'graph',
  nodes: [],
  edges: [],
  nodePositionChange: [],
  hasLayouted: false,
  elementOptions: {
    isEditable: true,
    isConnectable: true,
  },
  currentId: '',
  theme: {
    primaryColor: '#1978FF',
  },
  currentType: 'nodes',
  selectedNodeIds: [],
  selectedEdgeIds: []
};
const GraphInstanceContext = React.createContext<string | null>(null);

export const GraphProvider = props => {
  const { children, id } = props;
  const instanceId = useMemo(() => {
    return id || `graph-${uuidv4()}`;
  }, []);
  return (
    <GraphInstanceContext.Provider value={instanceId}>
      <StoreProvider id={instanceId} store={{ ...initialStore }}>
        {children}
      </StoreProvider>
    </GraphInstanceContext.Provider>
  );
};
export const useGraphStore = (id?: string) => {
  const instanceId = useContext(GraphInstanceContext);

  if (!instanceId) {
    throw new Error('请在 GraphProvider 内使用 useGraphStore');
  }
  return useZustandContext<GraphState>(id || instanceId);
};
