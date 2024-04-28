import { Position, MarkerType } from 'reactflow';

export function transformDataToReactFlow(nodes, edges) {
  const nodes_flow = nodes.map(item => {
    const { key, label, properties } = item;
    return {
      id: key,
      type: 'bidirectional',
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      data: { label, properties },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    };
  });
  const edges_flow = edges.map(item => {
    const { key, label, source, target, properties } = item;
    return {
      id: key,
      label,
      data: { label, properties },
      source,
      target,
      sourceHandle: 'right',
      targetHandle: 'left',
      markerEnd: { type: MarkerType.ArrowClosed },
      type: 'bidirectional',
    };
  });
  return {
    nodes_flow,
    edges_flow,
  };
}
