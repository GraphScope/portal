import { Position, MarkerType } from 'reactflow';
import processEdges from './processEdges';
import dagre from 'dagre';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

let HAS_GRAPH_LAYOUT = false;
let GRAPH_POSITION_MAP = {};

export function layout(data, direction) {
  const { nodes, edges } = data;
  dagreGraph.setGraph({ rankdir: direction });
  nodes.forEach(node => {
    const { _fromEdge } = node;
    dagreGraph.setNode(node.id, { width: _fromEdge ? 170 : 170, height: _fromEdge ? 100 : 200 });
  });
  edges.forEach(edge => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return dagreGraph;
}
export function transformGraphNodes(nodes, displayMode) {
  return nodes.map(item => {
    const { position, id, _fromEdge } = item;
    if (position) {
      GRAPH_POSITION_MAP[id] = position;
    }

    console.log('GRAPH_POSITION_MAP', id, GRAPH_POSITION_MAP);

    const prevPosition = GRAPH_POSITION_MAP[id] ||
      dagreGraph.node(item.id) || { x: Math.random() * 500, y: Math.random() * 500 };

    return {
      ...item,
      id,
      type: displayMode === 'table' ? 'table-node' : 'graph-node',
      _fromEdge,
      targetPosition: Position.Left,
      sourcePosition: Position.Right,
      position: position || {
        x: prevPosition.x,
        y: prevPosition.y,
      },
    };
  });
}
export function transformNodes(nodes, displayMode) {
  return nodes.map(item => {
    const { position, id, _fromEdge } = item;
    const nodeWithPosition = dagreGraph.node(item.id) || { x: Math.random() * 500, y: Math.random() * 500 };
    GRAPH_POSITION_MAP[id] = position;
    return {
      ...item,
      id,
      type: displayMode === 'table' ? 'table-node' : 'graph-node',
      _fromEdge,
      targetPosition: Position.Left,
      sourcePosition: Position.Right,
      position: position || {
        x: nodeWithPosition.x,
        y: nodeWithPosition.y,
      },
      data: {
        _fromEdge,
        label: id,
      },
    };
  });
}
export function transformEdges(_edges, displayMode) {
  const edges = processEdges(_edges);
  return edges.map((item, index) => {
    const { id, label, source, target, data, _isRevert, _isLoop, _isPoly, _offset, ...others } = item;
    return {
      ...others,
      id: id || `${source}-${target}-${index}`,
      label,
      data: {
        ...data,
        _isRevert,
        _isLoop,
        _offset,
        _isPoly,
      },
      source,
      target,
      type: displayMode === 'table' ? 'smoothstep' : 'graph-edge',
      // sourceHandle: _isRevert ? 'right-revert' : 'right',
      // targetHandle: _isRevert ? 'left-revert' : 'left',
      markerEnd: {
        type: 'graph-edge-arrow',
        width: 20,
        height: 20,
        refX: 9,
        refY: 3,
        color: '#FF0072',
      },
    };
  });
}

export function transformDataToReactFlow(nodes, edges, { displayMode, graphPosition }) {
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
    if (!HAS_GRAPH_LAYOUT) {
      layout({ nodes, edges }, 'LR');
      HAS_GRAPH_LAYOUT = true;
    }

    return {
      nodes: transformGraphNodes(nodes, displayMode),
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
    const { source, target, id, data } = item;
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
      data: data,
    };
  });
  return {
    nodes: [
      ...nodes.map(item => {
        return {
          ...item,
          position: null,
        };
      }),
      ...entity.map(item => {
        return {
          ...item,
          position: null,
        };
      }),
    ],
    edges: relationship,
  };
}