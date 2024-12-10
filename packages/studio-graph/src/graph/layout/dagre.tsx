import dagre from 'dagre';

export const dagreLayout = (data, options) => {
  const { nodes, edges } = data;
  const {
    nodeId = 'id',
    rankDir = 'LR',
    ranker = 'longest-path',
    linkSource = 'source',
    linkTarget = 'target',
    nodeWidth = 40,
    nodeHeight = 40,
  } = options;
  const g = new dagre.graphlib.Graph();
  g.setGraph({
    // rankDir: 'LR',
    // ranker: 'network-simplex' // 'tight-tree', 'longest-path'
    acyclicer: 'greedy',
    nodesep: 5,
    edgesep: 1,
    ranksep: 20,
    rankDir,
    ranker,
  });

  nodes.forEach(node =>
    g.setNode(
      node[nodeId],
      Object.assign({}, node, {
        width: nodeWidth,
        height: nodeHeight,
      }),
    ),
  );
  edges.forEach(link => {
    g.setEdge(link[linkSource], link[linkTarget], Object.assign({}, link));
  });

  dagre.layout(g);

  return {
    nodes: g.nodes().map(n => {
      const node = g.node(n);
      if (node) {
        delete node.width;
        delete node.height;
        delete node.fx;
        delete node.fy;
      }
      return node;
    }),
    links: g.edges().map(e => g.edge(e)),
  };
};
