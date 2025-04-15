import type { NodePositionChange } from 'reactflow';
import { create } from 'zustand';
import {produce} from 'immer'
import type { Node, Edge } from 'reactflow';
import type { Property } from '@graphscope/studio-components';

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
interface GraphStore {
  store: GraphState;
  updateStore: (fn: (draft: GraphState) => void) => void;
}

export const useGraphStore = create<GraphStore>(set => ({
  store: {
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
  },
  updateStore: fn =>
    set(state => {
      // ✅ 使用 immer 的 produce 包裹修改逻辑
      return produce(state, draft => {
        // 将原有逻辑放在 immer 的草稿操作中
        fn(draft.store);
      });
    })
}));
