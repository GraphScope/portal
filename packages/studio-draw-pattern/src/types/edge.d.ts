import { Property } from "./property";

export interface Edge {
  edgeKey: string;
  type?: string;
  targetNode: string;
  sourceNode: string;
  statement?: string;
  variable?: string;
  properties?: Property[];
}
