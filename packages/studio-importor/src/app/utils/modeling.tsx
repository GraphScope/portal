import type { GetGraphSchemaResponse } from '@graphscope/studio-server';
import type { Property } from '@graphscope/studio-components';
import { ISchemaEdge, ISchemaNode, ISchemaOptions } from '../typing';

import { v4 as uuidv4 } from 'uuid';

export type DeepRequired<T> = T extends (...args: any[]) => any
  ? T
  : T extends object
    ? { [K in keyof T]-?: DeepRequired<T[K]> }
    : T;

export function transSchemaToOptions(originalSchema: DeepRequired<GetGraphSchemaResponse>): ISchemaOptions {
  const { vertex_types, edge_types } = originalSchema || { vertex_types: [], edge_types: [] };
  const idMappingforNode: Record<string, string> = {};
  const nodes: ISchemaNode[] = vertex_types.map(item => {
    const { primary_keys, properties = [], type_name } = item;
    const id = uuidv4();
    idMappingforNode[type_name] = id;
    return {
      id,
      data: {
        label: type_name,
        primary: primary_keys[0],
        /** 查询中单独节点内是否可以编辑 */
        disabled: true,
        properties: properties.map((item, index) => {
          const { property_name, property_type } = item;
          return {
            key: uuidv4(),
            index: index,
            token: '',
            name: property_name,
            type: 'primitive_type' in property_type ? property_type.primitive_type : 'DT_STRING',
            primaryKey: primary_keys[0] === property_name,
          };
        }),
      },
      position: {
        x: 0,
        y: 0,
      },
    };
  });

  /** Edges  */
  const edges: ISchemaEdge[] = [];
  /** edge_types->undefined 报错 */
  if (edge_types) {
    edge_types.forEach(edge => {
      const { type_name, properties = [], vertex_type_pair_relations } = edge;
      vertex_type_pair_relations.forEach(c => {
        const { destination_vertex, source_vertex, relation } = c;
        const source = idMappingforNode[source_vertex];
        const target = idMappingforNode[destination_vertex];
        edges.push({
          source,
          target,
          id: uuidv4(),
          data: {
            label: type_name,
            /** 查询中单独边内是否可以编辑 */
            disabled: true,
            properties: properties.map(p => {
              return {
                key: uuidv4(),
                name: p.property_name,
                type: 'primitive_type' in p.property_type ? p.property_type.primitive_type : 'DT_STRING',
                primaryKey: false,
                disable: false,
                token: '',
              };
            }),
          },
        });
      });
    });
  }

  return { nodes, edges };
}
/** yaml 上传文件时添加可编辑标识 disabled为false */
export function appendData(originalSchema: ISchemaOptions, options: { disabled: boolean }): ISchemaOptions {
  const { nodes, edges } = originalSchema || { nodes: [], edges: [] };
  const updatedNodes = nodes.map(item => ({
    ...item,
    data: { ...item.data, ...options },
  }));

  const updatedEdges = edges.map(item => ({
    ...item,
    data: { ...item.data, ...options },
  }));

  return { nodes: updatedNodes, edges: updatedEdges };
}

export const handleType = (type?: string) => {
  if (type === 'DT_STRING') {
    return { string: { long_text: '' } };
  } else {
    return { primitive_type: type };
  }
};
/**
 *
 * @param options 将store中的schema信息转化为引擎需要的schema
 * @returns
 */
export function transOptionsToSchema(options: DeepRequired<ISchemaOptions>) {
  const nodeMap: Record<string, string> = {};

  const vertex_types: GetGraphSchemaResponse['vertex_types'] = options.nodes.map((item, index) => {
    const { id, data } = item;
    const { label, properties = [], primary } = data;
    nodeMap[id] = label;
    let primary_key = primary;
    return {
      type_id: index,
      type_name: label,
      properties:
        properties.map((p, pIdx) => {
          if (p.primaryKey) {
            primary_key = p.name;
          }
          return {
            property_id: pIdx,
            property_name: p.name,
            property_type: handleType(p.type) as any,
          };
        }) || [],
      primary_keys: [primary_key],
    };
  });

  const edgeMap = new Map();

  options.edges.forEach((item, itemIdx) => {
    const { source: sourceID, target: targetID, data } = item;
    const { properties = [], label } = data;
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
        type_id: itemIdx,
        type_name: label,
        properties:
          (properties || []).map((p: Property, pIdx: number) => {
            return {
              property_id: pIdx,
              property_name: p.name,
              property_type: handleType(p.type),
            };
          }) || [],
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
