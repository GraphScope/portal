import type { EdgeData } from '../types';
export const getSourceId = (source: EdgeData['source']) => {
  return typeof source === 'string' ? source : source.id;
};
export const getTargetId = (target: EdgeData['target']) => {
  return typeof target === 'string' ? target : target.id;
};
export const getSourceTarget = (edge: EdgeData) => {
  return {
    source: getSourceId(edge.source),
    target: getTargetId(edge.target),
  };
};

export function processLinks(links) {
  return links.map(link => {
    return {
      id: link.id,
      label: link.label,
      source: typeof link.source === 'string' ? link.source : link.source.id,
      target: typeof link.target === 'string' ? link.target : link.target.id,
      properties: link.properties,
    };
  });
}
