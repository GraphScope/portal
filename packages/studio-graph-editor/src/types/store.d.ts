import { EdgeChange, NodeChange, OnConnect } from 'reactflow';
import { ISchemaEdge } from './edge';
import { ISchemaNode } from './node';

export type IStore = {
  /** APP类型 */
  appMode: 'DATA_MODELING' | 'DATA_IMPORTING';
  /**不可编辑状态 */
  disabled: boolean;
  currentType: 'nodes' | 'edges';
  currentId: string;
  nodes: ISchemaNode[];
  edges: ISchemaEdge[];
  source: {
    nodes: ISchemaNode[];
    edges: ISchemaEdge[];
  };
  displayMode: 'graph' | 'table';
  graphPosition: Record<string, { x: number; y: number }>;
  tablePosition: Record<string, { x: number; y: number }>;

  hasLayouted: boolean;
  elementOptions: {
    /** 是否可以点击，包含点和边 */
    isEditable: boolean;
    /** 是否可以编辑标签，包括节点和边 */
    isConnectable: boolean;
  };
  theme: {
    primaryColor: string;
  };
};

export interface GraphProps {
  setting: IStore;
  nodes: ISchemaNode[];
  edges: ISchemaEdge[];
}

export interface GraphState extends GraphProps {
  onNodesChange: (nodes: NodeChange[]) => void;
  onEdgesChange: (edges: EdgeChange[]) => void;
  onConnect: OnConnect;
  addNode: (node: ISchemaNode) => void;
  addEdge: (edge: ISchemaEdge) => void;
  deleteNode: (nodeId: string) => void;
  deleteEdge: (edgeId: string) => void;
  setNodes: (nodes: ISchemaNode[]) => void;
  setEdges: (edges: ISchemaEdge[]) => void;
  setSetting: (setting: Partial<IStore>) => void;
}
