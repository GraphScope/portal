import type { Property } from '@graphscope/studio-components';
import type { Node, Edge } from 'reactflow';

export interface IEdgeData {
  label: string;
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
  /** 语言 */
  locale?: 'zh-CN' | 'en-US';
  /** 主题样式 */
  theme?: {
    primaryColor: string;
    mode: 'darkAlgorithm' | 'defaultAlgorithm';
  };
  appMode: 'DATA_MODELING' | 'DATA_IMPORTING';
  /**  第二项 */
  queryPrimitiveTypes: () => {
    options: Option[];
  };
  /** 第四项 */
  mappingColumn?: {
    options: Option[];
    type: 'upload' | 'query';
  };

  queryGraphSchema?: () => Promise<ISchemaOptions>;
  queryBoundSchema?: () => Promise<ISchemaOptions>;
  handleUploadFile: (file: File) => {
    file_path: string;
  };
  queryImportData?: () => void;
  /** 默认样式相关 */
  defaultLeftStyles?: {
    collapsed: boolean;
    width: number;
  };
  defaultRightStyles?: {
    collapsed: boolean;
    width: number;
  };

  elementOptions?: {
    /** 是否能够连线，包括拖拽产生节点 */
    isClickable: boolean;
    /** 是否可以点击，包含点和边 */
    isEditable: boolean;
    /** 是否可以编辑标签，包括节点和边 */
    isConnectable: boolean;
  };
  children?: React.ReactNode;
}
