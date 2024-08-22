import type { Property } from '@graphscope/studio-components';
import type { Edge } from 'reactflow';

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

export type ISchemaEdge = Edge<IEdgeData> & { data: IEdgeData };
