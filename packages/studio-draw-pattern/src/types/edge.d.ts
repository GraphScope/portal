import { IEdgeData, ISchemaEdge } from '@graphscope/studio-graph-editor/dist/types/edge';
import { Property } from './property';

export interface EdgeData extends ISchemaEdge {
  variable?: string;
  data?: IEdgeData;
}
export interface Edge {
  id: string;
  label?: string;
  targetNode?: string;
  sourceNode?: string;
  statement?: string;
  isErgodic?: boolean;
  variable?: string;
  propertiesId?: string;
}
