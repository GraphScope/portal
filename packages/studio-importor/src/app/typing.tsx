import type { Property } from '@graphscope/studio-components';
import type { Node, Edge } from 'reactflow';
export interface ISchemaNode extends Node {
  data: {
    label: string;
    properties?: Property[];

    [key: string]: any;
  };
}

export type ISchemaEdge = {
  data: {
    label: string;
    properties?: Property[];
    source_vertex_fields?: Property;
    target_vertex_fields?: Property;
    [key: string]: any;
  };
} & Edge;

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
    type: 'Select' | 'InputNumber';
  };

  queryGraphSchema?: () => Promise<any>;
  queryBoundSchema?: () => Promise<any>;
  handleUploadFile?: (file: File) => Promise<string>;
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
