import { Position, MarkerType } from 'reactflow';
import processEdges from './processEdges';
import dagre from 'dagre';
import { v4 as uuidv4 } from 'uuid';
import { ISchemaEdge } from '../types/edge';
import { ISchemaNode } from '../types/node';
import { ISchemaOptions } from '../types/other';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

let HAS_GRAPH_LAYOUT = false;
let GRAPH_POSITION_MAP = {};

export function layout(data, direction) {
  const { nodes, edges } = data;
  dagreGraph.setGraph({ rankdir: direction });
  nodes.forEach(node => {
    const { _fromEdge } = node;
    dagreGraph.setNode(node.id, { width: _fromEdge ? 270 : 270, height: _fromEdge ? 100 : 200 });
  });
  edges.forEach(edge => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return dagreGraph;
}
export function transformGraphNodes(nodes, displayMode) {
  return nodes.map(item => {
    const { position, key, id, _fromEdge, data = {}, ...others } = item;
    if (position) {
      GRAPH_POSITION_MAP[id] = position;
    }
    const prevPosition = GRAPH_POSITION_MAP[id] ||
      dagreGraph.node(item.id) || { x: Math.random() * 500, y: Math.random() * 500 };

    return {
      id: id || key,
      data: {
        ...data,
        ...others,
      },
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

export function transformEdges(_edges: ISchemaEdge[], displayMode): ISchemaEdge[] {
  const edges = processEdges(_edges);
  return edges.map((item, index) => {
    const { id, source, target, data } = item;
    return {
      id: id || `${source}-${target}-${index}`,
      source,
      target,
      type: displayMode === 'table' ? 'smoothstep' : 'graph-edge',
      data,
    };
  });
}

export function transformDataToReactFlow(nodes: ISchemaNode[], edges: ISchemaEdge[], { displayMode }) {
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

export function transEdge2Entity(data: ISchemaOptions): ISchemaOptions {
  const { nodes, edges } = data;
  const relationship: ISchemaEdge[] = [];
  /** 把边也当作一个实体去处理 */
  // @ts-ignore
  const entity: ISchemaNode[] = edges.map(item => {
    const { source, target, id, data, ...others } = item;
    relationship.push({
      id: uuidv4(),
      source: source,
      target: id,
      type: 'smoothstep',
      data: {
        ...others,
        label: '',
      },
    });
    relationship.push({
      id: uuidv4(),
      source: id,
      target: target,
      type: 'smoothstep',
      data: {
        label: '',
      },
    });
    return {
      ...item,
      _fromEdge: true,
      id: item.id,
      data: data,
      position: {
        x: 0,
        y: 0,
      },
    };
  });
  return {
    nodes: [
      ...nodes.map(item => {
        return {
          ...item,
          position: {
            x: 0,
            y: 0,
          },
        };
      }),
      ...entity.map(item => {
        return {
          ...item,
        };
      }),
    ],
    edges: relationship,
  };
}

export function transformNodes(nodes, displayMode) {
  return nodes.map(item => {
    const { position, key, id, _fromEdge, ...properties } = item;
    const nodeWithPosition = dagreGraph.node(item.id) || { x: Math.random() * 500, y: Math.random() * 500 };
    GRAPH_POSITION_MAP[id] = position;

    return {
      ...item,
      id: id || key,
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
        ...properties,
        label: id,
      },
    };
  });
}
