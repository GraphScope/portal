import { ISchemaNode } from '@graphscope/studio-graph-editor/dist/types/node';
import type { Property } from './property';

export interface NodeData extends ISchemaNode {
  variable?: string;
}

export interface Node {
  nodeKey: string;
  inRelations?: string[];
  outRelations?: string[];
  statement?: string;
  isErgodic?: boolean;
  data: NodeData;
}
