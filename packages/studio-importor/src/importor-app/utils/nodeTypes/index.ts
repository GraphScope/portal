import type { NodeTypes } from 'reactflow';
import BiDirectionalNode from './BiDirectionalNode';
export const nodeTypes = {
  // Add any of your custom nodes here!
  bidirectional: BiDirectionalNode,
} satisfies NodeTypes;
