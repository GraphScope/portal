import type { Property } from '@graphscope/studio-components';
import type { Node } from 'reactflow';

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
