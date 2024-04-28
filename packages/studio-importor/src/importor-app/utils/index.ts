import { Position, MarkerType } from 'reactflow';

export function transformDataToReactFlow(nodes, edges) {
  const nodes_flow = nodes.map(item => {
    const { id, label, properties, _fromEdge } = item;
    return {
      id,
      _fromEdge,
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      data: { label, properties },
      label,
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      style: _fromEdge
        ? {
            background: '#ddd',
            color: '#000',
            strokeWidth: 2,
          }
        : {
            height: '180px',
            background: 'rgb(29 121 255)',
            color: '#000',
            strokeWidth: 2,
          },
    };
  });
  const edges_flow = edges.map(item => {
    const { id, label, source, target, properties, key } = item;
    return {
      id: id || key,
      label,
      data: { properties },
      source,
      target,
      markerEnd: { type: MarkerType.ArrowClosed },
    };
  });
  return {
    nodes_flow,
    edges_flow,
  };
}
