import type { EdgeTypes } from 'reactflow';
import TableEdge from './custom-edge';
import GraphEdge from './graph-edge';
export const edgeTypes = {
  'table-edge': TableEdge,
  'graph-edge': GraphEdge,
} satisfies EdgeTypes;
