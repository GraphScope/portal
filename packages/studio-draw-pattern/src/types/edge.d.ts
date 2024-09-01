import { IEdgeData, ISchemaEdge } from '@graphscope/studio-graph-editor/dist/types/edge';
import { Property } from './property';

export interface EdgeData extends ISchemaEdge {
  variable?: string;
}
export interface Edge {
  edgeKey: string;
  type?: string;
  targetNode?: string;
  sourceNode?: string;
  statement?: string;
  data: EdgeData;
  isErgodic: boolean;
}
