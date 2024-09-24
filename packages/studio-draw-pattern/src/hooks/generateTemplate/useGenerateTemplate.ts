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
          data: { label: '' },
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
          data: { label: '', _extra: { count: 1, index: 0, isLoop: true } },
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
          position: { x: 400, y: 200 },
          type: 'graph-node',
          data: { label: '' },
          width: 100,
          height: 100,
          selected: false,
          positionAbsolute: { x: 702, y: 572 },
          dragging: false,
        },
        {
          id: node2Id,
          position: { x: 200, y: 400 },
          type: 'graph-node',
          data: { label: '' },
          width: 100,
          height: 100,
          selected: true,
          positionAbsolute: { x: 877.25, y: 324.75 },
          dragging: false,
        },
        {
          id: node3Id,
          position: { x: 500, y: 480 },
          type: 'graph-node',
          data: { label: '' },
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
          data: { label: '', _extra: { count: 1, index: 0, isLoop: false } },
          selected: false,
        },
        {
          id: edge2Id,
          source: node2Id,
          target: node3Id,
          type: 'graph-edge',
          data: { label: '', _extra: { count: 1, index: 0, isLoop: false } },
        },
        {
          id: edge3Id,
          source: node3Id,
          target: node1Id,
          type: 'graph-edge',
          data: { label: '', _extra: { count: 1, index: 0, isLoop: false } },
        },
      ],
    };
  }, []);

  const generatePaperChallenge = useCallback(() => {
    const node1Id = uuidv4();
    const node2Id = uuidv4();
    const edge1Id = uuidv4();

    return {
      edges: [
        {
          id: edge1Id,
          source: node1Id,
          target: node2Id,
          type: 'graph-edge',
          data: {
            label: '',
            _extra: {
              count: 1,
              index: 0,
              isLoop: false,
            },
          },
          selected: false,
        },
      ],
      nodes: [
        {
          id: node1Id,
          position: {
            x: 238.5,
            y: 283.5,
          },
          type: 'graph-node',
          data: {
            label: 'Paper',
          },
          width: 100,
          height: 100,
          selected: false,
          positionAbsolute: {
            x: 238.5,
            y: 283.5,
          },
          dragging: false,
        },
        {
          id: node2Id,
          position: {
            x: 593,
            y: 176,
          },
          type: 'graph-node',
          data: {
            label: 'Challenge',
          },
          width: 100,
          height: 100,
          selected: false,
          positionAbsolute: {
            x: 593,
            y: 176,
          },
          dragging: false,
        },
      ],
    };
  }, []);

  const generatePaperChallengeSolution = useCallback(() => {
    const node1Id = uuidv4();
    const node2Id = uuidv4();
    const node3Id = uuidv4();
    const edge1Id = uuidv4();
    const edge2Id = uuidv4();

    return {
      edges: [
        {
          id: edge1Id,
          source: node1Id,
          target: node2Id,
          type: 'graph-edge',
          data: {
            label: '',
            _extra: {
              count: 1,
              index: 0,
              isLoop: false,
            },
          },
          selected: false,
        },
        {
          id: edge2Id,
          source: node2Id,
          target: node3Id,
          type: 'graph-edge',
          data: {
            label: '',
            _extra: {
              count: 1,
              index: 0,
              isLoop: false,
            },
          },
          selected: true,
        },
      ],
      nodes: [
        {
          id: node2Id,
          position: {
            x: 383.5,
            y: 327.5,
          },
          type: 'graph-node',
          data: {
            label: 'Challenge',
          },
          width: 100,
          height: 100,
          selected: false,
          positionAbsolute: {
            x: 383.5,
            y: 327.5,
          },
          dragging: false,
        },
        {
          id: node1Id,
          position: {
            x: 200,
            y: 100,
          },
          type: 'graph-node',
          data: {
            label: 'Paper',
          },
          width: 100,
          height: 100,
          selected: false,
          dragging: false,
        },
        {
          id: node3Id,
          position: {
            x: 628.4000000000003,
            y: 119,
          },
          type: 'graph-node',
          data: {
            label: 'Solution',
          },
          width: 100,
          height: 100,
          selected: false,
          positionAbsolute: {
            x: 628.4000000000003,
            y: 119,
          },
          dragging: false,
        },
      ],
    };
  }, []);
  const generatePaperCite = useCallback(() => {
    const node1Id = uuidv4();
    const node2Id = uuidv4();
    const node3Id = uuidv4();
    const edge1Id = uuidv4();
    const edge2Id = uuidv4();

    return {
      edges: [
        {
          id: edge1Id,
          source: node1Id,
          target: node2Id,
          type: 'graph-edge',
          data: {
            label: 'Cite',
            _extra: {
              count: 1,
              index: 0,
              isLoop: false,
            },
          },
          selected: false,
        },
        {
          id: edge2Id,
          source: node2Id,
          target: node3Id,
          type: 'graph-edge',
          data: {
            label: 'Cite',
            _extra: {
              count: 1,
              index: 0,
              isLoop: false,
            },
          },
          selected: true,
        },
      ],
      nodes: [
        {
          id: node2Id,
          position: {
            x: 383.5,
            y: 327.5,
          },
          type: 'graph-node',
          data: {
            label: 'Paper',
          },
          width: 100,
          height: 100,
          selected: false,
          positionAbsolute: {
            x: 383.5,
            y: 327.5,
          },
          dragging: false,
        },
        {
          id: node1Id,
          position: {
            x: 200,
            y: 100,
          },
          type: 'graph-node',
          data: {
            label: 'Paper',
          },
          width: 100,
          height: 100,
          selected: false,
          dragging: false,
        },
        {
          id: node3Id,
          position: {
            x: 628.4000000000003,
            y: 119,
          },
          type: 'graph-node',
          data: {
            label: 'Paper',
          },
          width: 100,
          height: 100,
          selected: false,
          positionAbsolute: {
            x: 628.4000000000003,
            y: 119,
          },
          dragging: false,
        },
      ],
    };
  }, []);

  const generateComplexPaperCite = useCallback(() => {
    const node1Id = uuidv4();
    const node2Id = uuidv4();
    const node3Id = uuidv4();
    const node4Id = uuidv4();
    const node5Id = uuidv4();

    const edge1Id = uuidv4();
    const edge2Id = uuidv4();
    const edge3Id = uuidv4();
    const edge4Id = uuidv4();
    const edge5Id = uuidv4();
    const edge6Id = uuidv4();

    return {
      edges: [
        {
          id: edge1Id,
          source: node1Id,
          target: node2Id,
          type: 'graph-edge',
          data: {
            label: 'Cite',
            _extra: {
              count: 1,
              index: 0,
              isLoop: false,
            },
          },
          selected: false,
        },
        {
          id: edge2Id,
          source: node2Id,
          target: node3Id,
          type: 'graph-edge',
          data: {
            label: 'Cite',
            _extra: {
              count: 1,
              index: 0,
              isLoop: false,
            },
          },
          selected: false,
        },
        {
          id: edge3Id,
          source: node1Id,
          target: node4Id,
          type: 'graph-edge',
          data: {
            label: '',
            _extra: {
              count: 1,
              index: 0,
              isLoop: false,
            },
          },
          selected: false,
        },
        {
          id: edge4Id,
          source: node2Id,
          target: node4Id,
          type: 'graph-edge',
          data: {
            label: '',
            _extra: {
              count: 1,
              index: 0,
              isLoop: false,
            },
          },
          selected: false,
        },
        {
          id: edge5Id,
          source: node2Id,
          target: node5Id,
          type: 'graph-edge',
          data: {
            label: '',
            _extra: {
              count: 1,
              index: 0,
              isLoop: false,
            },
          },
          selected: false,
        },
        {
          id: edge6Id,
          source: node3Id,
          target: node5Id,
          type: 'graph-edge',
          data: {
            label: '',
            _extra: {
              count: 1,
              index: 0,
              isLoop: false,
            },
          },
          selected: false,
        },
      ],
      nodes: [
        {
          id: node1Id,
          position: {
            x: 394.444360104079,
            y: 218.78591352988423,
          },
          type: 'graph-node',
          data: {
            label: 'Paper',
          },
          width: 100,
          height: 100,
          selected: false,
          positionAbsolute: {
            x: 394.444360104079,
            y: 218.78591352988423,
          },
          dragging: false,
        },
        {
          id: node2Id,
          position: {
            x: 632.9830537728634,
            y: 214.96446600176026,
          },
          type: 'graph-node',
          data: {
            label: 'Paper',
          },
          width: 100,
          height: 100,
          selected: false,
          positionAbsolute: {
            x: 632.9830537728634,
            y: 214.96446600176026,
          },
          dragging: false,
        },
        {
          id: node3Id,
          position: {
            x: 875.9922071088333,
            y: 210.94593515264864,
          },
          type: 'graph-node',
          data: {
            label: 'Paper',
          },
          width: 100,
          height: 100,
          selected: false,
          positionAbsolute: {
            x: 875.9922071088333,
            y: 210.94593515264864,
          },
          dragging: false,
        },
        {
          id: node4Id,
          position: {
            x: 522.3616593234866,
            y: 443.3323212489479,
          },
          type: 'graph-node',
          data: {
            label: 'Challenge',
          },
          width: 100,
          height: 100,
          selected: false,
          positionAbsolute: {
            x: 522.3616593234866,
            y: 443.3323212489479,
          },
          dragging: false,
        },
        {
          id: node5Id,
          position: {
            x: 757.340588627554,
            y: 428.36785524718766,
          },
          type: 'graph-node',
          data: {
            label: 'Challenge',
          },
          width: 100,
          height: 100,
          selected: false,
          positionAbsolute: {
            x: 757.340588627554,
            y: 428.36785524718766,
          },
          dragging: false,
        },
      ],
    };
  }, []);
  return {
    generateSelfLoop,
    generateTriangleLoop,
    generatePaperChallenge,
    generatePaperChallengeSolution,
    generatePaperCite,
    generateComplexPaperCite,
  };
};
