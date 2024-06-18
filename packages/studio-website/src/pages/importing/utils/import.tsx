import type {
  EdgeMapping,
  SchemaMapping,
  VertexMapping,
  GetGraphSchemaResponse,
  EdgeMappingTypeTriplet,
} from '@graphscope/studio-server';
import { transSchemaToOptions } from '../../modeling/utils/schema';
import type { DeepRequired } from '@/components/utils/schema';
import type { ISchemaEdge, ISchemaNode, ISchemaOptions, Property } from '@graphscope/studio-importor';

const loadingdataFields = (type: 'nodes' | 'edges', properties: Property[]) => {
  return properties.map(item => {
    return item.name;
  });
};

/**
 * 将后端标准的 MappingSchema 和 GrahSchema 转化为 Importor 需要的 Options
 * @param schemaMapping  后端标准的 MappingSchema
 * @param schema 后端标准的  GraphSchema
 * @returns
 */

export function transMappingSchemaToOptions(
  schema: DeepRequired<GetGraphSchemaResponse>,
  schemaMapping: DeepRequired<SchemaMapping> | {},
): ISchemaOptions {
  const schemaOptions = transSchemaToOptions(schema);

  const { nodes, edges } = schemaOptions;

  const itemMapping: Record<
    string,
    (VertexMapping | EdgeMapping) & {
      properties_mappings: { [key: string]: { index: number; token: string | number } };
    }
  > = {};

  if ('vertex_mappings' in schemaMapping) {
    schemaMapping.vertex_mappings.forEach(item => {
      const { type_name, column_mappings = [] } = item;
      itemMapping[type_name] = {
        ...item,
        properties_mappings: column_mappings.reduce((acc, curr) => {
          return {
            ...acc,
            [curr.property]: {
              index: curr.column.index,
              token: curr.column.name,
            },
          };
        }, {}),
      };
    });
  }
  if ('edge_mappings' in schemaMapping) {
    schemaMapping.edge_mappings.forEach(item => {
      const { type_triplet, column_mappings = [] } = item;
      itemMapping[type_triplet.edge] = {
        ...item,
        properties_mappings: column_mappings.reduce((acc, curr) => {
          return {
            ...acc,
            [curr.property]: {
              index: curr.column.index,
              token: curr.column.name,
            },
          };
        }, {}),
      };
    });
  }

  /** 基于schema 进行 properties 中 token 字段的回填*/
  const _nodes = nodes.map(item => {
    const { data } = item;
    const { label, properties = [] } = data;
    const match = itemMapping[label] || {
      inputs: [''],
      properties_mappings: {},
    };
    const filelocation = match.inputs[0];

    return {
      ...item,
      data: {
        ...item.data,
        filelocation,
        isBind: !!filelocation,
        isEidtProperty: true,
        dataFields: loadingdataFields('nodes', properties),
        properties: properties.map((p, index) => {
          const { name } = p;
          const pMatch = (match && match.properties_mappings && match.properties_mappings[name]) || {
            index: 0,
            token: '',
          };
          return {
            ...p,
            index: pMatch.index,
            token: pMatch.token,
          };
        }),
      },
    };
  });
  const _edges = edges
    .map(item => {
      const { data } = item;
      if (!data) {
        return;
      }

      const { label, properties = [] } = data;
      const match = itemMapping[label] || {
        source_vertex_mappings: [{ column: { index: 0, name: '' } }],
        destination_vertex_mappings: [{ column: { index: 0, name: '' } }],
        properties_mappings: {},
        inputs: [''],
      };

      if ('destination_vertex_mappings' in match) {
        const { source_vertex_mappings, destination_vertex_mappings, properties_mappings } = match;
        const filelocation = match.inputs[0];
        return {
          ...item,
          data: {
            ...item.data,
            filelocation,
            isBind: !!filelocation,
            isEidtProperty: true,
            dataFields: loadingdataFields('edges', properties),
            properties: properties.map((p: Property) => {
              const { name } = p;
              const pMatch = properties_mappings[name] || { index: 0, token: '' };
              return {
                ...p,
                index: pMatch.index,
                token: pMatch.token,
                name: name,
              };
            }),
            source_vertex_fields: {
              index: source_vertex_mappings[0].column.index,
              token: source_vertex_mappings[0].column.name,
              name: source_vertex_mappings[0].property,
            },
            target_vertex_fields: {
              index: destination_vertex_mappings[0].column.index,
              token: destination_vertex_mappings[0].column.name,
              name: destination_vertex_mappings[0].property,
            },
          },
        };
      }
    })
    .filter(item => {
      return item;
    }) as ISchemaEdge[];

  return {
    nodes: _nodes,
    edges: _edges,
  };
}

export function transformImportOptionsToSchemaMapping(options: ISchemaOptions): DeepRequired<SchemaMapping> {
  let vertex_mappings: any[] = [];
  let edge_mappings: any[] = [];
  const NODE_LABEL_MAP: Record<string, string> = {};
  const NODE_PRIMARY_MAP: Record<string, string> = {};

  options.nodes.forEach(item => {
    const { id, data } = item;
    const { properties = [], filelocation, label, primary } = data;
    NODE_LABEL_MAP[id] = label;
    NODE_PRIMARY_MAP[id] = primary;
    vertex_mappings.push({
      type_name: label,
      inputs: [filelocation],
      column_mappings: properties.map(p => {
        const { index, token, name } = p;
        return {
          column: {
            index,
            name: token,
          },
          property: name,
        };
      }),
    });
  });

  options.edges.forEach(item => {
    const { data, source, target } = item;

    const {
      properties = [],
      filelocation,
      source_vertex_fields = { index: 0, token: '', name: 'id' },
      target_vertex_fields = { index: 0, token: '', name: 'id' },
      label,
    } = data;
    const column_mappings: any[] = [];
    const source_vertex_mappings: any[] = [];
    const destination_vertex_mappings: any[] = [];

    properties.forEach((p: Property) => {
      const { index, token, name } = p;
      column_mappings.push({
        column: {
          index,
          name: token,
        },
        property: name,
      });
    });
    source_vertex_mappings.push({
      column: {
        index: source_vertex_fields.index,
        name: source_vertex_fields.token,
      },
      property: source_vertex_fields.name,
    });
    destination_vertex_mappings.push({
      column: {
        index: target_vertex_fields.index,
        name: target_vertex_fields.token,
      },
      property: target_vertex_fields.name,
    });
    edge_mappings.push({
      type_triplet: {
        edge: label,
        source_vertex: NODE_LABEL_MAP[source],
        destination_vertex: NODE_LABEL_MAP[target],
      },
      inputs: [filelocation],
      column_mappings,
      source_vertex_mappings,
      destination_vertex_mappings,
    });
  });
  return {
    vertex_mappings,
    edge_mappings,
  };
}
