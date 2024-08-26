import type { Property } from './property';

export interface Node {
  nodeKey: string;
  data: {
    label?: string;
    properties?: Property[];
    variable?: string;
  };
  inRelations?: string[];
  outRelations?: string[];
  statement?: string;
  isErgodic?: boolean;
}
