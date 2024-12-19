import { useContext } from './useContext';

// Function to calculate bounding box of nodes
export const calculateBoundingBox = (nodes, ids) => {
  const filteredNodes = nodes.filter(node => ids.includes(node.id));
  const xs = filteredNodes.map(node => node.x);
  const ys = filteredNodes.map(node => node.y);
  const zs = filteredNodes.map(node => node.z || 0);
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
    minZ: Math.min(...zs),
    maxZ: Math.max(...zs),
  };
};

// Function to calculate zoom scale based on bounding box
const calculateZoomScale = (bbox, viewSize) => {
  const { minX, maxX, minY, maxY, minZ, maxZ } = bbox;
  const width = maxX - minX;
  const height = maxY - minY;
  const depth = maxZ - minZ;
  const maxDimension = Math.max(width, height, depth);
  const scaleFactor = 1.2; // Scale factor to ensure some padding around the nodes
  return viewSize / (maxDimension * scaleFactor);
};

const useFoucs = nodeIds => {
  const { store } = useContext();
  const { graph, width, height, render } = store;
  if (graph) {
    const { nodes } = graph.graphData();
    const bbox = calculateBoundingBox(nodes, nodeIds);

    const { minX, maxX, minY, maxY, minZ, maxZ } = bbox;
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const centerZ = (minZ + maxZ) / 2;
    const viewSize = Math.min(width, height);
    const bboxScale = calculateZoomScale(bbox, viewSize);
    if (render === '2D') {
    }
    // graph.cameraPosition({ x: centerX, y: centerY, z: centerZ }, { x: centerX, y: centerY, z: centerZ }, bboxScale);
  }
};
