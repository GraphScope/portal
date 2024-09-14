import { Utils } from '@graphscope/studio-components';
export const applyStatus = (
  { nodes = [], edges = [] },
  apply = item => {
    return {
      selected: true,
    };
  },
) => {
  const nodeStatus = nodes.reduce((acc, curr: any) => {
    return {
      ...acc,
      [curr.id]: apply(curr),
    };
  }, {});
  const edgeStatus = edges.reduce((acc, curr: any) => {
    return {
      ...acc,
      [curr.id]: apply(curr),
    };
  }, {});
  return {
    nodeStatus,
    edgeStatus,
  };
};
export const applyPositions = (nodes, centerNode, radius = 5) => {
  const angleStep = (2 * Math.PI) / nodes.length;
  return nodes.map((item, index) => {
    const angle = index * angleStep;
    return {
      ...item,
      x: centerNode.x + radius * Math.cos(angle),
      y: centerNode.y + radius * Math.sin(angle),
      z: 0,
    };
  });
};

// Helper function to compute initial positions
export const computeInitialPositions = (nodes, centerNode, radius = 20) => {
  const angleStep = (2 * Math.PI) / nodes.length;
  return nodes.reduce((positions, node, index) => {
    const angle = index * angleStep;
    positions[node.id] = {
      x: centerNode.x + radius * Math.cos(angle),
      y: centerNode.y + radius * Math.sin(angle),
    };
    return positions;
  }, {});
};

// Helper function to apply precomputed positions
const applyPrecomputedPositions = (nodes, positions) => {
  nodes.forEach(node => {
    if (positions[node.id]) {
      node.x = positions[node.id].x;
      node.y = positions[node.id].y;
    }
  });
};

// Helper function to fix node positions
const fixNodePositions = nodes => {
  nodes.forEach(node => {
    if (node.isExpanding) {
      node.fx = node.x;
      node.fy = node.y;
    } else {
      node.fx = null;
      node.fy = null;
    }
  });
};

export const handleExpand = (graph, expandData, selectIds: string[]) => {
  const { nodes, links } = graph.graphData();
  const edges = links.map((item: any) => {
    return {
      ...item,
      source: item.source.id,
      target: item.target.id,
    };
  });
  const expandNode = nodes.filter(node => selectIds.indexOf(node.id) !== -1);
  const expandNodes = applyPositions(expandData.nodes, expandNode);
  const newData = Utils.handleExpand(
    {
      nodes,
      edges,
    },
    { nodes: expandNodes, edges: expandData.edges },
  );
  return newData;
};
