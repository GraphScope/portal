import type { NodePositionChange } from 'reactflow';
import StoreProvider, { useContext as useZustandContext } from '@graphscope/use-zustand';
import type { Node, Edge } from 'reactflow';
import type { Property } from '@graphscope/studio-components';
import React, { useContext, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface IEdgeData {
  label: string;
  /** 禁用：saved / binded / xxxx  */
  disabled?: boolean;
  /** 是否保存在服务端 */
  saved?: boolean;
  properties?: Property[];
  source_vertex_fields?: Property;
  target_vertex_fields?: Property;
  dataFields?: string[];
  delimiter?: string;
  datatype?: 'csv' | 'odps';
  filelocation?: string;
  _extra?: {
    type?: string;
    offset?: string;
    isLoop: boolean;
    isRevert?: boolean;
    isPoly?: boolean;
    index?: number;
    count?: number;
  };
  [key: string]: any;
}

export interface INodeData {
  label: string;
  disabled?: boolean;
  properties?: Property[];
  dataFields?: string[];
  delimiter?: string;
  datatype?: 'csv' | 'odps';
  filelocation?: string;
  [key: string]: any;
}
export type ISchemaNode = Node<INodeData>;

export type ISchemaEdge = Edge<IEdgeData> & { data: IEdgeData };

interface GraphState {
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
};
const GraphInstanceContext = React.createContext<string | null>(null);

export const GraphProvider = props => {
  const { children, id } = props;
  const instanceId = useMemo(() => {
    return id || `graph-${uuidv4()}`;
  }, []);
  console.log('GraphProvider instanceId::: ', instanceId);
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
