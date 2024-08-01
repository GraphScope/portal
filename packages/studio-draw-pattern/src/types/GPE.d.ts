import { Edge } from './edge';
import { Node } from './node';
import { Variable } from './variable';

export interface GPE {
  nodes: Node[];
  edges: Edge[];
  variabels: Variable[];
}
