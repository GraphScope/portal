import type { VertexType, GrootSchema } from '@graphscope/studio-server';
import { DeepRequired, TransformedSchema, Properties } from './schema';
import { v4 as uuidv4 } from 'uuid';
export interface TransformedNode {
  /** 节点类型 */
  label: string;
  /** 节点属性 */
  properties: Properties[];
  /** 唯一标识 */
  key?: string;
}
export function transformGrootSchemaToOptions(schema: GrootSchema | undefined): TransformedSchema {
  if (!schema) {
    return {
      nodes: [],
      edges: [],
    };
  }
  const nodeMap: Record<string, string> = {};
  //@ts-ignore
  const nodes = schema.vertices.map(item => {
    const { properties, label, ...others } = item;
    const key = uuidv4();
    nodeMap[label] = key;
    return {
      ...others,
      label,
      key,
      //@ts-ignore
      properties: properties.map((p, pIdx) => {
        const { id, name, type, is_primary_key } = p;
        return {
          name,
          type,
          primaryKey: is_primary_key,
          disable: false,
          id,
          token: '',
        };
      }),
    };
  });
  //@ts-ignore
  const edges = schema.edges.map(item => {
    const { label, properties, relations, ...others } = item;
    const key = uuidv4();
    const { src_label, dst_label } = relations[0];
    return {
      ...others,
      label,
      key,
      source: nodeMap[src_label],
      target: nodeMap[dst_label],
      properties: properties.map((p, pIdx) => {
        const { id, name, type, is_primary_key } = p;
        return {
          name,
          type,
          primaryKey: is_primary_key,
          disable: false,
          id,
          token: '',
        };
      }),
    };
  });

  return {
    nodes,
    edges,
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

export function transOptionsToGrootDataloading(options: DeepRequired<TransformedSchema>) {
  const nodeMap: Record<string, string> = {};
  //@ts-ignore
  const vertices: VertexType[] = options.nodes.map((item, itemIdx) => {
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
export function transformGrootDeleteEdgeToOptions(schema: { nodes: any[]; edges: any[] }) {
  const nodeMap: Record<string, string> = {};
  //@ts-ignore
  schema.nodes.map(item => {
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
export function transformGrootCreateVertexToOptions(
  schema: { label: string },
  property: { id: string; name: string; primaryKey: boolean; type: string }[],
) {
  const { label } = schema;
  let primary_keys;
  const propertyMap = new Map();
  property.forEach((item, index) => {
    const { name, primaryKey, type } = item;
    if (primaryKey) {
      primary_keys = [name];
    }
    propertyMap.set(item.name, {
      property_name: name,
      property_type: {
        primitive_type: type,
      },
    });
  });
  const properties = [...propertyMap.values()];
  return {
    type_name: label,
    primary_keys,
    properties,
  };
}
export function transformGrootCreateEdgeToOptions(
  nodeList: any[],
  schema: { label: string; source: string; target: string },
  property: { id: string; name: string; primaryKey: boolean; type: string }[],
) {
  const nodeMap: Record<string, string> = {};
  //@ts-ignore
  nodeList.map((item, itemIdx) => {
    nodeMap[item.key] = item.label;
    return item.label;
  });
  const { label, source: sourceID, target: targetID } = schema;
  const source = nodeMap[sourceID];
  const target = nodeMap[targetID];
  const propertyMap = new Map();
  property.forEach((item, index) => {
    const { name, primaryKey, type } = item;
    propertyMap.set(item.name, {
      property_name: name,
      property_type: {
        primitive_type: type,
      },
    });
  });
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
