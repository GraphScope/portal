import type { Schema, VertexType, EdgeType } from '@graphscope/studio-server';
import { v4 as uuidv4 } from 'uuid';

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
  label: string;
  /** 节点属性 */
  properties: Properties[];
  /** 节点主键 */
  primary: string;
  /** 唯一标识 */
  key?: string;
}

export interface TransformedEdge {
  /** 边类型 */
  label: string;
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

export function transformSchema(originalSchema: DeepRequired<Schema>): TransformedSchema {
  const { vertex_types, edge_types } = originalSchema;

  const transformNode = (vertexType: DeepRequired<VertexType>): TransformedNode => ({
    label: vertexType.type_name,
    properties: vertexType.properties.map(item => {
      const { property_name, property_type } = item;
      return {
        name: property_name,
        type: property_type.primitive_type,
      };
    }),
    primary: vertexType.primary_keys[0],
  });

  /** Edges  */
  const edges: TransformedEdge[] = [];
  edge_types.forEach(edge => {
    const { type_name, properties, vertex_type_pair_relations } = edge;
    vertex_type_pair_relations.forEach(c => {
      const { destination_vertex, source_vertex, relation } = c;
      edges.push({
        label: type_name,
        properties: (properties || []).map(({ property_name, property_type }) => ({
          name: property_name,
          type: property_type.primitive_type,
        })),

        source: source_vertex,
        target: destination_vertex,
        relation,
      });
    });
  });

  const transformedSchema: TransformedSchema = {
    nodes: vertex_types.map(transformNode),
    edges,
  };

  return transformedSchema;
}

export function transformSchemaToOptions(originalSchema: DeepRequired<Schema>, disable: boolean) {
  const schema = transformSchema(originalSchema);
  const nodeMap: Record<string, string> = {};
  const nodes: TransformedNode[] = schema.nodes.map(item => {
    const { properties, primary, label, ...others } = item;
    const key = uuidv4();
    nodeMap[label] = key;
    return {
      ...others,
      primary,
      label,
      key,
      properties: properties.map((p, pIdx) => {
        const { name, type } = p;
        return {
          name,
          type,
          primaryKey: name === primary,
          disable,
          id: uuidv4(),
          token: pIdx,
        };
      }),
    };
  });
  const edges = schema.edges.map(item => {
    const { properties, source, target, ...others } = item;
    const key = uuidv4();
    return {
      ...others,
      key,
      source: nodeMap[source],
      target: nodeMap[target],
      properties: properties.map((p, pIdx) => {
        const { name, type } = p;
        return {
          name,
          type,
          disable,
          id: uuidv4(),
          token: pIdx,
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
 *
 * @param options 将store中的schema信息转化为引擎需要的schema
 * @returns
 */
export function transOptionsToSchema(options: DeepRequired<TransformedSchema>) {
  const { edges } = options;
  const nodeMap: Record<string, string> = {};
  //@ts-ignore
  const vertex_types: VertexType[] = options.nodes.map((item, itemIdx) => {
    nodeMap[item.key] = item.label;
    return {
      primary_keys: [item.primary],
      type_id: itemIdx, // item.key,
      type_name: item.label,
      properties: item.properties.map((p, pIdx) => {
        return {
          property_id: pIdx, // p.id,
          property_name: p.name,
          property_type: {
            primitive_type: p.type,
          },
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
      destination_vertex: target,
      relation,
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
        properties: properties.map((p, pIdx) => {
          return {
            property_id: pIdx, //p.id,
            property_name: p.name,
            property_type: {
              primitive_type: p.type,
            },
          };
        }),
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
