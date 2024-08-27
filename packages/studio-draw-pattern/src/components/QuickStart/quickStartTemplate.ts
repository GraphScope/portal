const quickStartTemplate = [
  {
    templateId: 'self-loop',
    nodes: [
      {
        id: '4c0745db-f124-4c41-af8c-4c328aabf88e',
        position: { x: 260, y: 497.5 },
        type: 'graph-node',
        data: { label: 'Vertex_1' },
        width: 100,
        height: 100,
      },
    ],
    edges: [
      {
        id: 'db5c2ee1-e391-4cf7-b063-5a98ceb6092b',
        source: '4c0745db-f124-4c41-af8c-4c328aabf88e',
        target: '4c0745db-f124-4c41-af8c-4c328aabf88e',
        type: 'graph-edge',
        data: { label: 'Edge_1', _extra: { count: 1, index: 0, isLoop: true } },
      },
    ],
  },
  {
    templateId: 'triangle-loop',
    nodes: [
      {
        id: '360fa71b-b926-46d7-a812-303eb9848a2c',
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
        id: '8b55da83-0ab1-4161-823d-065b7a617f4b',
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
        id: '929ae672-350c-4c8c-83fa-f16a000a5769',
        position: { x: 1104.75, y: 570.75 },
        type: 'graph-node',
        data: { label: 'Vertex_3' },
        width: 100,
        height: 100,
      },
    ],
    edges: [
      {
        id: 'af0bfb70-3b5e-473a-8b0f-09f0db41fd72',
        source: '360fa71b-b926-46d7-a812-303eb9848a2c',
        target: '8b55da83-0ab1-4161-823d-065b7a617f4b',
        type: 'graph-edge',
        data: { label: 'Edge_1', _extra: { count: 1, index: 0, isLoop: false } },
        selected: false,
      },
      {
        id: 'daa9892a-52b9-4726-8e53-d6d4132a43c6',
        source: '8b55da83-0ab1-4161-823d-065b7a617f4b',
        target: '929ae672-350c-4c8c-83fa-f16a000a5769',
        type: 'graph-edge',
        data: { label: 'Edge_2', _extra: { count: 1, index: 0, isLoop: false } },
      },
      {
        id: '6406beaf-f1b7-4cb1-ae53-01c88364cde5',
        source: '929ae672-350c-4c8c-83fa-f16a000a5769',
        target: '360fa71b-b926-46d7-a812-303eb9848a2c',
        type: 'graph-edge',
        data: { label: 'Edge_3', _extra: { count: 1, index: 0, isLoop: false } },
      },
    ],
  },
];

export default quickStartTemplate;
