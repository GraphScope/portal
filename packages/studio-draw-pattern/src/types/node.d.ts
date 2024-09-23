import { ISchemaNode } from '@graphscope/studio-graph-editor/dist/types/node';
import type { Property } from './property';

export interface NodeData extends ISchemaNode {
  variable?: string;
}

export interface Node {
  id: string;
  label?: string;
  inRelations?: Set<string>;
  outRelations?: Set<string>;
  statement?: string;
  isErgodic?: boolean;
  variable: string;
  properties?: string[];
}
