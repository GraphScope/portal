type ISchemaEdge = {
  label: string;
  source: string;
  target: string;
  properties: any;
};
type ISchemaNode = {
  label: string;
  properties: any;
};
type ISchemaOptions = {
  nodes: ISchemaNode[];
  edges: ISchemaEdge[];
};
import { v4 as uuidv4 } from 'uuid';

export type DeepRequired<T> = T extends (...args: any[]) => any
  ? T
  : T extends object
    ? { [K in keyof T]-?: DeepRequired<T[K]> }
    : T;

export function transSchema(originalSchema: any): ISchemaOptions {
  const { vertex_types, edge_types } = originalSchema || { vertex_types: [], edge_types: [] };

  const nodes: ISchemaNode[] = vertex_types.map(item => {
    const { primary_keys, properties = [], type_name } = item;

    return {
      label: type_name,
      properties: properties.map(item => {
        const { property_name, property_type } = item;
        return {
          name: property_name,
          type: 'primitive_type' in property_type ? property_type.primitive_type : 'DT_STRING',
          primaryKey: primary_keys[0] === property_name,
        };
      }),
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
        edges.push({
          source: source_vertex,
          target: destination_vertex,
          label: type_name,
          properties: properties.map(p => {
            return {
              name: p.property_name,
              type: 'primitive_type' in p.property_type ? p.property_type.primitive_type : 'DT_STRING',
            };
          }),
        });
      });
    });
  }

  return { nodes, edges };
}

export const handleType = (type?: string) => {
  if (type === 'DT_STRING') {
    return { string: { long_text: '' } };
  } else {
    return { primitive_type: type };
  }
};
