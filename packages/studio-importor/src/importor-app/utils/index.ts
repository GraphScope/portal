import { Position, MarkerType } from 'reactflow';

import dagre from 'dagre';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

export function layout(data, direction) {
  const { nodes, edges } = data;
  dagreGraph.setGraph({ rankdir: direction });
  nodes.forEach(node => {
    const { _fromEdge } = node;
    dagreGraph.setNode(node.id, { width: _fromEdge ? 200 : 150, height: _fromEdge ? 200 : 50 });
  });
  edges.forEach(edge => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);
  return dagreGraph;
}

export function transformNodes(nodes, displayMode) {
  return nodes.map(item => {
    const nodeWithPosition = dagreGraph.node(item.id) || { x: Math.random() * 500, y: Math.random() * 500 };
    const { id, label, properties, _fromEdge } = item;
    return {
      id,
      _fromEdge,
      targetPosition: Position.Left,
      sourcePosition: Position.Right,
      position: {
        x: nodeWithPosition.x,
        y: nodeWithPosition.y,
      },
      data: { label, properties },
      label,
      type: displayMode === 'table' ? 'table-node' : 'graph-node',
    };
  });
}
export function transformEdges(edges, displayMode) {
  return edges.map(item => {
    const { id, label, source, target, properties, key, _isRevert, _isLoop, _isPoly, _offset } = item;
    return {
      id: id || key,
      label,
      data: { properties },
      source,
      target,
      type: displayMode === 'table' ? 'table-edge' : 'graph-edge',
      sourceHandle: _isRevert ? 'right-revert' : 'right',
      targetHandle: _isRevert ? 'left-revert' : 'left',
      style: {
        _isRevert,
        _isLoop,
        _offset,
        _isPoly,
      },
      markerEnd: { type: MarkerType.ArrowClosed },
    };
  });
}
export function transformDataToReactFlow(nodes, edges, displayMode) {
  if (displayMode === 'table') {
    const data = transEdge2Entity({ nodes, edges });
    /** layout */
    layout(data, 'LR');
    return {
      nodes: transformNodes(data.nodes, displayMode),
      edges: transformEdges(data.edges, displayMode),
    };
  }
  if (displayMode === 'graph') {
    /** layout */
    layout({ nodes, edges }, 'LR');
    return {
      nodes: transformNodes(nodes, displayMode),
      edges: transformEdges(edges, displayMode),
    };
  }
  return {
    nodes: [],
    edges: [],
  };
}

export function transEdge2Entity(data) {
  const { nodes, edges } = data;
  const relationship: { source; target }[] = [];
  /** 把边也当作一个实体去处理 */
  const entity = edges.map(item => {
    const { source, target, id, properties } = item;
    relationship.push({
      source: source,
      target: id,
    });
    relationship.push({
      source: id,
      target: target,
    });
    return {
      ...item,
      _fromEdge: true,
      id: item.id,
      data: properties,
    };
  });
  return {
    nodes: [...nodes, ...entity],
    edges: relationship,
  };
}
