import type { Schema, VertexType, EdgeType } from '@graphscope/studio-server';
import { v4 as uuidv4 } from 'uuid';
/** 导出数据*/
export const download = (queryData: string, states: BlobPart) => {
  const eleLink = document.createElement('a');
  eleLink.download = queryData;
  eleLink.style.display = 'none';
  const blob = new Blob([states]);
  eleLink.href = URL.createObjectURL(blob);
  document.body.appendChild(eleLink);
  eleLink.click();
  document.body.removeChild(eleLink);
};

interface Properties {
  name: string;
  type: string;
  /** others */
  primaryKey?: boolean;
  token?: string;
  id?: string;
  disable?: boolean;
}

interface TransformedNode {
  label: string;
  properties: Properties[];
  primary: string;
  /** 唯一标识 */
  key?: string;
}

interface TransformedEdge {
  /** 唯一标识 */
  key?: string;
  label: string;
  properties: Properties[];
  primary: string;
  source: string;
  target: string;
  relation?: string;
}

interface TransformedSchema {
  nodes: TransformedNode[];
  edges: TransformedEdge[];
}

type DeepRequired<T> = T extends (...args: any[]) => any
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

  const transformEdge = (edgeType: DeepRequired<EdgeType>): TransformedEdge => ({
    label: edgeType.type_name,
    properties: (edgeType.properties || []).map(({ property_name, property_type }) => ({
      name: property_name,
      type: property_type.primitive_type,
    })),
    primary: edgeType.type_name,
    source: '',
    target: '',
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
        primary: type_name,
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
  const nodes = schema.nodes.map(item => {
    const { properties, primary, label, ...others } = item;
    const key = uuidv4();
    nodeMap[label] = key;
    return {
      ...others,
      primary,
      label,
      key,
      properties: properties.map(p => {
        const { name, type } = p;
        return {
          name,
          type,
          primaryKey: name === primary,
          disable,
          token: '',
          id: uuidv4(),
        };
      }),
    };
  });
  const edges = schema.edges.map(item => {
    const { properties, primary, source, target, ...others } = item;
    const key = uuidv4();
    return {
      ...others,
      primary,
      key,
      source: nodeMap[source],
      target: nodeMap[target],
      properties: properties.map(p => {
        const { name, type } = p;
        return {
          name,
          type,
          primaryKey: name === primary,
          disable,
          token: '',
          id: uuidv4(),
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
