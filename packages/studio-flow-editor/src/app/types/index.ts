import type { Property } from '@graphscope/studio-components';
import type { Node, Edge } from 'reactflow';

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

export interface ISchemaOptions {
  nodes: ISchemaNode[];
  edges: ISchemaEdge[];
}

export interface Option {
  label: string;
  value: string;
}
export interface ImportorProps {
  /** 用于多实例管理的 ID */
  id?: string;
  children?: React.ReactNode;
  nodesDraggable?: boolean;
  isPreview?: boolean;
  onNodesChange?: (nodes: ISchemaNode[]) => void;
  onEdgesChange?: (edges: ISchemaEdge[]) => void;
  onSelectionChange?: (nodes: ISchemaNode[], edges: ISchemaEdge[]) => void;
  noDefaultLabel?: boolean;
  defaultNodes?: ISchemaNode[];
  defaultEdges?: ISchemaEdge[];
}
