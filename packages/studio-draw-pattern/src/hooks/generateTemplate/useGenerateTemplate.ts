import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
export const useGenerateTemplate = () => {
  const generateSelfLoop = useCallback(() => {
    const nodeId = uuidv4();
    const edgeId = uuidv4();
    return {
      nodes: [
        {
          id: nodeId,
          position: { x: 400, y: 400 },
          type: 'graph-node',
          data: { label: 'Vertex_1' },
          width: 100,
          height: 100,
        },
      ],
      edges: [
        {
          id: edgeId,
          source: nodeId,
          target: nodeId,
          type: 'graph-edge',
          data: { label: 'Edge_1', _extra: { count: 1, index: 0, isLoop: true } },
        },
      ],
    };
  }, []);

  const generateTriangleLoop = useCallback(() => {
    const node1Id = uuidv4();
    const node2Id = uuidv4();
    const node3Id = uuidv4();
    const edge1Id = uuidv4();
    const edge2Id = uuidv4();
    const edge3Id = uuidv4();

    return {
      nodes: [
        {
          id: node1Id,
          position: { x: 702, y: 572 },
          type: 'graph-node',
          data: { label: 'Vertex_1' },
          width: 100,
          height: 100,
          selected: false,
          positionAbsolute: { x: 702, y: 572 },
          dragging: false,
        },
        {
          id: node2Id,
          position: { x: 877.25, y: 324.75 },
          type: 'graph-node',
          data: { label: 'Vertex_2' },
          width: 100,
          height: 100,
          selected: true,
          positionAbsolute: { x: 877.25, y: 324.75 },
          dragging: false,
        },
        {
          id: node3Id,
          position: { x: 1104.75, y: 570.75 },
          type: 'graph-node',
          data: { label: 'Vertex_3' },
          width: 100,
          height: 100,
        },
      ],
      edges: [
        {
          id: edge1Id,
          source: node1Id,
          target: node2Id,
          type: 'graph-edge',
          data: { label: 'Edge_1', _extra: { count: 1, index: 0, isLoop: false } },
          selected: false,
        },
        {
          id: edge2Id,
          source: node2Id,
          target: node3Id,
          type: 'graph-edge',
          data: { label: 'Edge_2', _extra: { count: 1, index: 0, isLoop: false } },
        },
        {
          id: edge3Id,
          source: node3Id,
          target: node1Id,
          type: 'graph-edge',
          data: { label: 'Edge_3', _extra: { count: 1, index: 0, isLoop: false } },
        },
      ],
    };
  }, []);

  return {
    generateSelfLoop,
    generateTriangleLoop,
  };
};
