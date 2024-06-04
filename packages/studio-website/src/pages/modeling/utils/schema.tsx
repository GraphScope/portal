import type { VertexType } from '@graphscope/studio-server';

export interface Properties {
  name: string;
  type: string;
  /** others */
  primaryKey?: boolean;
  /** 属性唯一标识 */
  id?: string;
  /** 是否禁用：UI */
  disable?: boolean;
  /** 属性名映射的数据下标 */
  token?: number | string;
}

export interface TransformedNode {
  /** 节点类型 */
  data: { label: string };
  /** 节点属性 */
  properties: Properties[];
  /** 节点主键 */
  primary: string;
  /** 唯一标识 */
  id?: string;
}

export interface TransformedEdge {
  /** 边类型 */
  data: { label: string };
  /** 边属性 */
  properties: Properties[];
  /** 启始节点ID */
  source: string;
  /** 目标节点ID */
  target: string;
  /** 唯一标识 */
  key?: string;
  /** relation */
  relation?: string;
}

export interface TransformedSchema {
  nodes: TransformedNode[];
  edges: TransformedEdge[];
}

export type DeepRequired<T> = T extends (...args: any[]) => any
  ? T
  : T extends object
    ? { [K in keyof T]-?: DeepRequired<T[K]> }
    : T;

export interface IProperty {
  property_name: string;
  property_type: { primitive_type?: string; string?: { long_text: string } };
}
export interface IEdge {
  type_name: string;
  properties: IProperty[];
  vertex_type_pair_relations: { destination_vertex: string; source_vertex: string; relation: any }[];
}

export const handleType = (type: string) => {
  if (type === 'DT_STRING') {
    return { string: { long_text: '' } };
  }
  return { primitive_type: type };
};
/**
 *
 * @param options 将store中的schema信息转化为引擎需要的schema
 * @returns
 */

export function transOptionsToSchema(options: DeepRequired<TransformedSchema>) {
  // const { edges } = options;
  const nodeMap: Record<string, string> = {};
  //@ts-ignore
  const vertex_types: VertexType[] = options.nodes.map((item, itemIdx) => {
    nodeMap[item.id] = item.data.label;

    let primary_key = 'id';
    return {
      type_id: itemIdx, // item.key,
      type_name: item.data.label,
      properties: item.properties.map((p, pIdx) => {
        if (p.primaryKey) {
          primary_key = p.name;
        }
        return {
          property_id: pIdx, // p.id,
          property_name: p.name,
          property_type: handleType(p.type),
        };
      }),
      primary_keys: [primary_key],
    };
  });
  const edgeMap = new Map();

  options.edges.forEach((item, itemIdx) => {
    const {
      data: { label },
      source: sourceID,
      target: targetID,
      properties,
    } = item;
    const source = nodeMap[sourceID];
    const target = nodeMap[targetID];
    const constraint = {
      destination_vertex: target,
      relation: 'MANY_TO_MANY',
      source_vertex: source,
    };

    const current = edgeMap.get(label);

    if (current) {
      const { vertex_type_pair_relations = [] } = current.properties || {};
      vertex_type_pair_relations.push(constraint);
      edgeMap.set(label, current);
    } else {
      edgeMap.set(label, {
        type_id: itemIdx, //key,
        type_name: label,
        /** 边属性 [] || undefined */
        properties: properties
          ? properties.map((p, pIdx) => {
              return {
                property_id: pIdx, //p.id,
                property_name: p.name,
                property_type: handleType(p.type),
              };
            })
          : [],
        vertex_type_pair_relations: [constraint],
      });
    }
  });
  const edge_types = [...edgeMap.values()];

  return {
    vertex_types,
    edge_types,
  };
}
export function transSchemaToOptions(options: DeepRequired<{ nodes: TransformedNode[]; edges: TransformedEdge[] }>) {
  const nodeMap: Record<string, string> = {};
  //@ts-ignore
  const nodes: VertexType[] = options.vertex_types.map((item, itemIdx) => {
    const { type_id, type_name, properties, primary_keys } = item;
    nodeMap[type_name] = type_id;
    return {
      id: `${type_id}`,
      data: {
        label: type_name,
        properties: properties.map(v => {
          const { property_id, property_name, property_type } = v;
          return {
            id: property_id,
            name: property_name,
            type: Object.hasOwn(property_type, 'string') ? 'DT_STRING' : property_type.primitive_type,
            primaryKey: primary_keys[0] === property_name,
          };
        }),
      },
      position: { x: 200 * itemIdx, y: 100 * itemIdx },
      type: 'graph-node',
    };
  });
  //@ts-ignore
  const edges = options.edge_types.map((item, itemIdx) => {
    const { type_id, type_name, vertex_type_pair_relations, properties, primary_keys } = item;
    const { source_vertex, destination_vertex } = vertex_type_pair_relations[0];
    return {
      id: `${type_id}`,
      type: 'graph-edge',
      source: `${nodeMap[source_vertex]}`,
      target: `${nodeMap[destination_vertex]}`,
      data: {
        label: type_name,
        properties: properties.map(v => {
          const { property_id, property_name, property_type } = v;
          return {
            id: property_id,
            name: property_name,
            type: Object.hasOwn(property_type, 'string') ? 'DT_STRING' : property_type.primitive_type,
            primaryKey: primary_keys[0] === property_name,
          };
        }),
      },
    };
  });
  return {
    nodes,
    edges,
  };
}
