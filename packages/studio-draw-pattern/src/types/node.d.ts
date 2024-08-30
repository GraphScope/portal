import { ISchemaNode } from '@graphscope/studio-graph-editor/dist/types/node';
import type { Property } from './property';

export interface NodeData extends ISchemaNode {
  variable?: string;
}

export interface Node {
  nodeKey: string;
  inRelations?: Set<string>;
  outRelations?: Set<string>;
  statement?: string;
  isErgodic?: boolean;
  data: NodeData;
  properties: Property[];
}
