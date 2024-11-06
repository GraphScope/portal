import type { NodeChange, NodePositionChange } from 'reactflow';

import { ISchemaNode, ISchemaEdge } from './typing';
export type IStore = {
  /** APP类型 */
  appMode: 'DATA_MODELING' | 'DATA_IMPORTING' | 'PURE';
  /**不可编辑状态 */
  disabled: boolean;
  isReady: boolean;
  currentType: 'nodes' | 'edges';
  currentId: string;
  nodes: ISchemaNode[];
  edges: ISchemaEdge[];
  source: {
    nodes: ISchemaNode[];
    edges: ISchemaEdge[];
  };
  nodePositionChange: NodePositionChange[];

  displayMode: 'graph' | 'table';
  graphPosition: Record<string, { x: number; y: number }>;
  tablePosition: Record<string, { x: number; y: number }>;
  theme: {
    primaryColor: string;
  };
  collapsed: {
    left: boolean;
    right: boolean;
  };
  hasLayouted: boolean;
  elementOptions: {
    /** 是否可以点击，包含点和边 */
    isEditable: boolean;
    /** 是否可以编辑标签，包括节点和边 */
    isConnectable: boolean;
  };
  /** 是否保存原始上传的文件 */
  isSaveFiles?: boolean;
  csvFiles: File[];
};

export const initialStore: IStore = {
  /** APP类型 */
  appMode: 'DATA_MODELING',
  /**不可编辑状态 */
  disabled: false,
  nodes: [],
  edges: [],
  source: {
    nodes: [],
    edges: [],
  },
  nodePositionChange: [],
  isReady: false,
  displayMode: 'graph',
  graphPosition: {},
  tablePosition: {},
  currentType: 'nodes',
  currentId: '',
  theme: {
    primaryColor: '#1978FF',
  },
  collapsed: {
    left: true,
    right: true,
  },
  hasLayouted: false,
  elementOptions: {
    isEditable: true,
    isConnectable: true,
  },
  csvFiles: [],
  isSaveFiles: true,
};
