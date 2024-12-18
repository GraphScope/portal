import type { INeighborQueryData, INeighborQueryItems } from '@graphscope/studio-graph';
import { queryStatement } from '../queryStatement';
export const queryNeighborData: INeighborQueryData['query'] = async params => {
  const { key, selectIds } = params;
  const script = `
    MATCH ${key}
    WHERE  elementId(a) IN [${selectIds}] 
    RETURN a,b,c
    `;
  // const data = await queryStatement(script);
  return {
    nodes: [],
    edges: [],
  };
};

export const queryNeighborItems: INeighborQueryItems['query'] = async params => {
  const { schema } = params;
  const itemMap = {};
  schema.nodes.forEach(node => {
    itemMap[node.label] = getOptionsBySchema(schema, node.label);
  });
  return itemMap;
};

function getOptionsBySchema(schema, nodeLabel) {
  const options: { key: string; label: string }[] = [];
  schema.edges.forEach(item => {
    let direction = 'out';
    const { source, target, label } = item;
    const include = nodeLabel === source || nodeLabel === target;
    if (include && source === target) {
      direction = 'both';
      options.push({
        key: `(a:${source})-[b:${label}]-(c:${target})`,
        label: `[${label}]-(${target})`,
      });
      return;
    }
    if (source === nodeLabel) {
      direction = 'out';
      options.push({
        key: `(a:${source})-[b:${label}]->(c:${target})`,
        label: `[${label}]->(${target})`,
      });
    }
    if (target === nodeLabel) {
      direction = 'in';
      options.push({
        key: `(a:${source})<-[b:${label}]-(c:${target})`,
        label: `[${label}]<-(${target})`,
      });
    }
  });

  const extraItems =
    options.length > 1
      ? [
          {
            key: `(a)-[b]-(c)`,
            label: `All Neighbors`,
          },
        ]
      : [];
  return [...extraItems, ...options];
}
