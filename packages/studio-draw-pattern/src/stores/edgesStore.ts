import { proxy } from 'valtio';
import { Edge } from '../types/edge';

interface EdgesState {
  edges: Edge[];
}

export const edgesState = proxy<EdgesState>({
  edges: [],
});

export const editEdge = (edge: Edge) => {
  // 检测edge是否存在
  const isExist = edgesState.edges.find(item => item.edgeKey === edge.edgeKey);
  if (isExist) {
    // 执行修改逻辑
    const editEdge = edge;
    const editEdgeIndex = edgesState.edges.findIndex(item => item.edgeKey === editEdge.edgeKey);
    edgesState.edges[editEdgeIndex] = editEdge;
  }
  //执行添加edge的逻辑
  else edgesState.edges.push(edge);
};

export const clearEdge = () => {
  // 重置所有节点
  edgesState.edges = [];
};

export const addVariableBykey = (edgeKey: string, variableName: string) => {
  const edgeIndex = edgesState.edges.findIndex(item => item.edgeKey === edgeKey);
  if (edgeIndex === -1) throw new Error('不存在当前路径,请重新书输入');
  edgesState.edges[edgeIndex].variable = variableName;
};
