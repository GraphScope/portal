import { Utils } from '@graphscope/studio-components';
export function transNeo4jSchema(raw): { nodes: []; edges: [] } {
  try {
    const nodes: any[] = [];
    const edges: any[] = [];
    const [obj] = raw.records[0]['_fields'];
    Object.keys(obj).forEach(label => {
      const item = obj[label];
      const { type, relationships } = item;
      if (type === 'node') {
        nodes.push({
          id: label,
          label: label,
          properties: Object.keys(item.properties).map(property => {
            return {
              name: property,
              type: item.properties[property].type,
            };
          }),
        });
        Object.keys(relationships).forEach(edgeLabel => {
          const edge = relationships[edgeLabel];
          const { direction } = edge;
          const source = direction === 'out' ? label : relationships[edgeLabel].labels[0];
          const target = direction === 'out' ? relationships[edgeLabel].labels[0] : label;
          edges.push({
            id: edgeLabel,
            label: edgeLabel,
            source,
            target,
            type: 'edge',
            properties: Object.keys(relationships[edgeLabel].properties).map(property => {
              return {
                name: property,
                type: relationships[edgeLabel].properties[property].type,
              };
            }),
          });
        });
      }
    });

    const _edges = Utils.uniqueElementsBy(edges, (a, b) => {
      return a.id + a.source + a.target === b.id + b.source + b.target;
    });
    return {
      nodes: nodes as [],
      edges: _edges,
    };
  } catch (error) {
    console.log('error', error);
    return {
      nodes: [],
      edges: [],
    };
  }
}

export function getQueryEngineType() {
  const query_endpoint = Utils.storage.get<string>('query_endpoint') || '';
  if (query_endpoint.startsWith('neo4j+s://')) {
    return 'neo4j';
  }
  if (query_endpoint.startsWith('kuzu_wasm://')) {
    return 'kuzu_wasm';
  }
  return 'graphscope';
}
