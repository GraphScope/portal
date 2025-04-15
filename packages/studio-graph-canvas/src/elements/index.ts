import processEdges from './processEdges';
import { ISchemaEdge } from '../types';
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
