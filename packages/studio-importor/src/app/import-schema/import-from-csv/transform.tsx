import { transformGraphNodes, transformEdges } from '../../elements/index';
import { uuid } from 'uuidv4';
const DATA_TYPE_MAPPING = {
  number: 'DT_DOUBLE',
  string: 'DT_SIGNED_INT32',
};
export const transform = schemaData => {
  const nodes = schemaData.nodes.map(item => {
    const { label, properties } = item;
    return {
      id: label,
      label,
      properties: properties.map(p => {
        const { name, type } = p;
        return {
          name,
          type: DATA_TYPE_MAPPING[type],
          key: uuid(),
          disable: false,
          primaryKey: false,
        };
      }),
    };
  });
  //@ts-ignore
  const edges = schemaData.edges.map(item => {
    const { label, properties, source, target } = item;
    return {
      id: label,
      label,
      source,
      target,
      properties: properties.map(p => {
        const { name, type } = p;
        return {
          name,
          type: DATA_TYPE_MAPPING[type],
          key: uuid(),
          disable: false,
          primaryKey: false,
        };
      }),
    };
  });
  return {
    nodes: transformGraphNodes(nodes, 'graph'),
    edges: transformEdges(edges, 'graph'),
  };
};
