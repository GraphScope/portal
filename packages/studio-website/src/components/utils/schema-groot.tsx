import type { VertexType, GrootSchema } from '@graphscope/studio-server';
import { DeepRequired, TransformedSchema } from './schema';

export function transformGrootSchemaToOptions(schema: GrootSchema | undefined): TransformedSchema {
  if (!schema) {
    return {
      nodes: [],
      edges: [],
    };
  }
  // todo someting
  return {
    nodes: [],
    edges: [],
  };
}

/**
 * groot
 * @param options 将store中的schema信息转化为引擎需要的schema
 * @returns
 */
export function transOptionsToGrootSchema(options: DeepRequired<TransformedSchema>) {
  const nodeMap: Record<string, string> = {};
  //@ts-ignore
  const vertices: VertexType[] = options.nodes.map((item, itemIdx) => {
    nodeMap[item.key] = item.label;
    return {
      label: item.label,
      properties: item.properties.map((p, pIdx) => {
        return {
          id: pIdx, // p.id,
          name: p.name,
          type: p.type,
          is_primary_key: p.primaryKey,
        };
      }),
    };
  });
  const edgeMap = new Map();

  options.edges.forEach((item, itemIdx) => {
    const { label, source: sourceID, target: targetID, relation, properties, key } = item;
    const source = nodeMap[sourceID];
    const target = nodeMap[targetID];
    const constraint = {
      dst_label: target,
      src_label: source,
    };

    const current = edgeMap.get(label);

    if (current) {
      const { vertex_type_pair_relations = [] } = current.properties || {};
      vertex_type_pair_relations.push(constraint);
      edgeMap.set(label, current);
    } else {
      edgeMap.set(label, {
        label: label,
        properties: properties.map((p, pIdx) => {
          return {
            id: pIdx, //p.id,
            name: p.name,
            type: p.type,
            is_primary_key: p.primaryKey || false,
          };
        }),
        relations: [constraint],
      });
    }
  });
  const edges = [...edgeMap.values()];

  return {
    vertices,
    edges,
  };
}
