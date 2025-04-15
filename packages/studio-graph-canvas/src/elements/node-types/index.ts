import type { NodeTypes } from 'reactflow';
import TableNode from './table-node';
import GraphNode from './graph-node';
export const nodeTypes = {
  // Add any of your custom nodes here!
  'table-node': TableNode,
  'graph-node': GraphNode,
} satisfies NodeTypes;
