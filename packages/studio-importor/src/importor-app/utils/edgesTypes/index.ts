import type { EdgeTypes } from 'reactflow';
import BiDirectionalEdge from './BiDirectionalEdge';

export const edgeTypes = {
  bidirectional: BiDirectionalEdge,
} satisfies EdgeTypes;
