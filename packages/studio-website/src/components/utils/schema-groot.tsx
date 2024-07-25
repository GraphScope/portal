import type { VertexType } from '@graphscope/studio-server';
import { DeepRequired, TransformedSchema, Properties } from './schema';
import { handleType } from './schema';
export interface TransformedNode {
  /** 节点类型 */
  label: string;
  /** 节点属性 */
  properties: Properties[];
  /** 唯一标识 */
  key?: string;
}
export interface TransformedNodeOrEdges {
  label: string;
  properties: { id: string; name: string; type: string; is_primary_key: boolean }[];
  relations: { src_label: string; dst_label: string }[];
}

/**
 * groot
 * @param options 将store中的schema信息转化为引擎需要的schema
 * @returns
 */
export function transOptionsToGrootSchema(options: DeepRequired<TransformedSchema>) {
  const nodeMap: Record<string, string> = {};
  const vertices: VertexType[] = options.nodes.map(item => {
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

  options.edges.forEach(item => {
    const { label, source: sourceID, target: targetID, properties } = item;
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

export function transOptionsToGrootDataloading(options: DeepRequired<TransformedSchema>) {
  const nodeMap: Record<string, string> = {};
  //@ts-ignore
  const vertices: VertexType[] = options.nodes.map(item => {
    nodeMap[item.key] = item.label;
    return item.label;
  });
  const edgeMap = new Map();
  options.edges.forEach(item => {
    const { label, source: sourceID, target: targetID } = item;
    const source = nodeMap[sourceID];
    const target = nodeMap[targetID];
    const current = edgeMap.get(label);
    if (current) {
      edgeMap.set(label, current);
    } else {
      edgeMap.set(label, {
        label: label,
        dst_label: target,
        src_label: source,
      });
    }
  });
  const edges = [...edgeMap.values()];

  return {
    vertices,
    edges,
  };
}
/** groot 删除边参数 */
export function transformGrootDeleteEdgeToOptions(schema: {
  nodes: { key: string; label: string }[];
  edges: { label: string; source: string; target: string }[];
}) {
  const nodeMap: Record<string, string> = {};
  schema.nodes.forEach(item => {
    nodeMap[item.key] = item.label;
  });
  const edgeMap = new Map();
  schema.edges.forEach(item => {
    const { label, source: sourceID, target: targetID } = item;
    const source = nodeMap[sourceID];
    const target = nodeMap[targetID];
    const current = edgeMap.get(label);
    if (current) {
      edgeMap.set(label, current);
    } else {
      edgeMap.set(label, {
        typeName: label,
        sourceVertexType: source,
        destinationVertexType: target,
      });
    }
  });
  return [...edgeMap.values()];
}
/** groot 创建点参数 */
export function transformGrootCreateVertexToOptions(params: {
  label: string;
  properties: { id: string; name: string; primaryKey: boolean; type: string }[];
}) {
  const { label, properties } = params;
  let primary_keys;
  const propertyMap = new Map();
  if (properties.length) {
    properties.forEach(item => {
      const { name, primaryKey, type } = item;
      if (primaryKey) {
        primary_keys = [name];
      }
      propertyMap.set(item.name, {
        property_name: name,
        property_type: handleType(type),
      });
    });
  }
  const property = [...propertyMap.values()];
  return {
    type_name: label,
    primary_keys,
    properties: property,
  };
}
export function transformGrootCreateEdgeToOptions(
  nodeList: {
    data: { label: string };
    id: string;
    label: string;
  }[],
  schema: { label: string; source: string; target: string },
  property?: { id: string; name: string; primaryKey: boolean; type: string }[],
) {
  const nodeMap: Record<string, string> = {};
  nodeList.map(item => {
    nodeMap[item.id] = item.data.label;
    return item.data.label;
  });
  const { label, source: sourceID, target: targetID } = schema;
  const source = nodeMap[sourceID];
  const target = nodeMap[targetID];
  const propertyMap = new Map();
  //@ts-ignore
  if (property.length) {
    //@ts-ignore
    property.forEach(item => {
      const { name, type } = item;
      propertyMap.set(item.name, {
        property_name: name,
        property_type: handleType(type),
      });
    });
  }
  const properties = [...propertyMap.values()];
  return {
    type_name: label,
    vertex_type_pair_relations: [
      {
        source_vertex: source,
        destination_vertex: target,
        relation: 'MANY_TO_MANY',
      },
    ],
    properties,
  };
}
