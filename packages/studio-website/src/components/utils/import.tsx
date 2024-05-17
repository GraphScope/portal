import type { EdgeMapping, SchemaMapping, VertexMapping, Schema } from '@graphscope/studio-server';
import type { BindingEdge, BindingNode } from '../../pages/instance/import-data/useContext';
import { transformSchemaToOptions } from '@/components/utils/schema';
import type { DeepRequired } from '@/components/utils/schema';

export interface ItemType {
  property_mapping: { [x: string]: string }[];
  destination_pk_column_map: { column: { name: string } }[];
  source_pk_column_map: { column: { name: string } }[];
}
/**
 * 将后端标准的 Schema 结构转化为 Importor 组件需要的 Options
 * @param schema GraphSchema
 * @returns
 */
export function transformSchemaToImportOptions(schema: Schema) {
  //@ts-ignore
  const schemaOption = transformSchemaToOptions(schema, false);

  const nodes = schemaOption.nodes.map(item => {
    return {
      ...item,
      datatype: 'csv',
      filelocation: '',
      isBind: false,
    };
  });
  /** 将 nodes 所属 primary 的 properties 信息拿到 */
  const vertex_id_properties_map: Record<string, any> = nodes.reduce((acc, curr) => {
    return {
      ...acc,
      [curr.key as string]: curr.properties.find(p => p.name === curr.primary),
    };
  }, {});
  const edges = schemaOption.edges.map(item => {
    const { properties, source, target } = item;
    const source_vertex = vertex_id_properties_map[source];
    const target_vertex = vertex_id_properties_map[target];

    return {
      ...item,
      datatype: 'csv',
      filelocation: '',
      isBind: false,
      properties: [
        /** source 和 target 在后端不算做 properties ，但是在前端需要他俩作为属性，因此手动添加 */
        { ...source_vertex, name: `#source.${source_vertex.name}` },
        { ...target_vertex, name: `#target.${target_vertex.name}` },
        ...properties,
      ],
    };
  });

  return { nodes, edges };
}
/** loading_config 空数据 || undefined 处理 */
function loadingConfig(loading_config: { format: { type: string; metadata: { delimiter: string } } }): any {
  if (loading_config) {
    const { type, metadata } = loading_config?.format || { type: 'csv' };
    const { delimiter } = metadata || { delimiter: ',' };
    return {
      type,
      delimiter,
    };
  }
}
/** properties change value */
const loadingdataFields = (type: string, properties: any, mapping?: VertexMapping | EdgeMapping | undefined) => {
  if (type === 'nodes') {
    return properties.map((V: { name: string }) => (V.name.startsWith('#') ? V.name.substring(1) : V.name));
  }
  return properties
    .map((p: { name: string }, index: number) => {
      const { name } = p;
      return {
        token: mappingName(mapping, name, index),
      };
    })
    .map((V: { token: string }) => (typeof V.token === 'string' ? V.token.split('_')[1] : V.token));
};
/** token */
function mappingName(mapping: any, name: string, index: number): string {
  let token = '';
  if (mapping) {
    const isSource = name.startsWith('#source');
    const isTarget = name.startsWith('#target');
    let match;
    if (isSource) {
      match = mapping && mapping.source_vertex_mappings[0].column.name;
    } else if (isTarget) {
      match = mapping && mapping.destination_vertex_mappings[0].column.name;
    } else {
      match = mapping && mapping.properties_mappings[name].name;
    }

    if (match) {
      token = match || '';
    }
  }
  return `${index}_${token}`;
}
/**
 * 将后端标准的 MappingSchema 和 GrahSchema 转化为 Importor 需要的 Options
 * @param schemaMapping  后端标准的 MappingSchema
 * @param schema 后端标准的  GraphSchema
 * @returns
 */
export function transformMappingSchemaToImportOptions(
  schemaMapping: DeepRequired<SchemaMapping>,
  schema: DeepRequired<Schema>,
): {
  edges: BindingEdge[];
  nodes: BindingNode[];
} {
  const schemaOptions = transformSchemaToImportOptions(schema);

  const { nodes, edges } = schemaOptions;
  const { loading_config, vertex_mappings, edge_mappings } = schemaMapping;
  // const { type, metadata } = loading_config?.format || { type: 'csv' };

  const { type, delimiter } = loadingConfig(loading_config);
  const label_mappings: Record<string, VertexMapping | EdgeMapping> = {};
  /** 先将后端数据或者yaml返回的mapping数据做一次Map存储，方便与后续的schema整合取数 */

  vertex_mappings.forEach(item => {
    const { column_mappings, type_name } = item;
    label_mappings[type_name] = {
      ...item,
      //@ts-ignore
      properties_mappings: column_mappings.reduce((acc, curr) => {
        return {
          ...acc,
          [curr.property]: curr.column,
        };
      }, {}),
    };
  });
  edge_mappings.forEach(item => {
    const { column_mappings, type_triplet, destination_vertex_mappings, source_vertex_mappings } = item;
    const { edge } = type_triplet;
    const sourceField = source_vertex_mappings[0].column;
    const targetField = destination_vertex_mappings[0].column;
    label_mappings[edge] = {
      ...item,
      //@ts-ignore
      properties_mappings: {
        [`#source.${sourceField.name}`]: sourceField,
        [`#target.${targetField.name}`]: targetField,
        ...column_mappings.reduce((acc, curr) => {
          return {
            ...acc,
            [curr.property]: curr.column,
          };
        }, {}),
      },
    };
  });
  /** 基于schema 进行 properties 中 token 字段的回填*/
  const _nodes = nodes.map(item => {
    const { label, properties } = item;
    const mapping = label_mappings[label];
    const filelocation = (mapping && mapping.inputs && mapping.inputs[0]) || '';
    return {
      ...item,
      datatype: type,
      filelocation,
      isBind: !!filelocation,
      isEidtProperty: true,
      delimiter,
      dataFields: loadingdataFields('nodes', properties),
      properties: properties.map((p, index) => {
        const { name } = p;
        return {
          ...p,
          // 只支持 name 不支持 index
          token: mappingName(mapping, name, index),
        };
      }),
    };
  });
  const _edges = edges.map(item => {
    const { label, properties } = item;
    const mapping = label_mappings[label];
    const filelocation = (mapping && mapping.inputs && mapping.inputs[0]) || '';
    return {
      ...item,
      datatype: type,
      filelocation,
      isBind: !!filelocation,
      isEidtProperty: true,
      delimiter,
      dataFields: loadingdataFields('edges', properties, mapping),
      properties: properties.map((p, index) => {
        const { name } = p;
        return {
          ...p,
          // 只支持 name 不支持 index
          token: mappingName(mapping, name, index),
        };
      }),
    };
  });
  return {
    nodes: _nodes,
    edges: _edges,
  };
}
/**
 * 将后端groot 标准的 MappingSchema 和 GrahSchema 转化为 Importor 需要的 Options
 * @param schemaMapping  后端标准的 MappingSchema
 * @param schema 后端标准的  GraphSchema
 * @returns
 */
export function transformGrootMappingSchemaToImportOptions(schemaMapping: any, schema: any) {
  const schemaOptions = transformSchemaToImportOptions(schema);
  console.log(schemaMapping);

  const { nodes, edges } = schemaOptions;
  const { loading_config, vertices_datasource, edges_datasource } = schemaMapping;
  // const { type, metadata } = loading_config?.format || { type: 'csv' };
  const { type, delimiter } = loadingConfig(loading_config);
  const label_mappings: Record<string, VertexMapping | EdgeMapping> = {};
  /** 先将后端数据或者yaml返回的mapping数据做一次Map存储，方便与后续的schema整合取数 */

  vertices_datasource.forEach((item: ItemType & { type_name: string }) => {
    const { property_mapping, type_name } = item;
    label_mappings[type_name] = {
      ...item,
      //@ts-ignore
      properties_mappings: property_mapping?.reduce((acc, curr) => {
        return {
          ...acc,
          [curr.property]: curr.column,
        };
      }, {}),
    };
  });
  edges_datasource.forEach((item: ItemType & { type_triplet: { edge: string } }) => {
    const { property_mapping, type_triplet, destination_pk_column_map, source_pk_column_map } = item;
    const { edge } = type_triplet;
    const sourceField = source_pk_column_map[0].column;
    const targetField = destination_pk_column_map[0].column;
    label_mappings[edge] = {
      ...item,
      //@ts-ignore
      properties_mappings: {
        [`#source.${sourceField.name}`]: sourceField,
        [`#target.${targetField.name}`]: targetField,
        ...property_mapping?.reduce((acc, curr) => {
          return {
            ...acc,
            [curr.property]: curr.column,
          };
        }, {}),
      },
    };
  });
  /** 基于schema 进行 properties 中 token 字段的回填*/
  const _nodes = nodes.map(item => {
    const { label, properties } = item;
    const mapping = label_mappings[label];
    const filelocation = (mapping && mapping.inputs && mapping.inputs[0]) || '';
    return {
      ...item,
      datatype: type,
      filelocation,
      isBind: !!filelocation,
      isEidtProperty: true,
      delimiter,
      properties: properties.map(p => {
        const { name } = p;
        //@ts-ignore
        const match = mapping.properties_mappings[name];
        console.log('match', match, name);
        return {
          ...p,
          // 只支持 name 不支持 index
          token: match.name,
        };
      }),
    };
  });
  const _edges = edges.map(item => {
    const { label, properties } = item;
    const mapping = label_mappings[label];
    const filelocation = (mapping && mapping.inputs && mapping.inputs[0]) || '';
    return {
      ...item,
      datatype: type,
      filelocation,
      isBind: !!filelocation,
      isEidtProperty: true,
      delimiter,
      properties: properties.map(p => {
        const { name } = p;
        //@ts-ignore
        const match = mapping.properties_mappings[name];
        console.log('match', match, name);
        return {
          ...p,
          // 只支持 name 不支持 index
          token: match.name,
        };
      }),
    };
  });
  return {
    nodes: _nodes,
    edges: _edges,
  };
}

export function transformDataMapToOptions(dataMap: any) {
  const nodes: BindingNode[] = [];
  const edges: BindingEdge[] = [];
  Object.values(dataMap).forEach((item: any) => {
    const { source, target } = item;
    const isEdge = source && target;
    if (isEdge) {
      edges.push(item);
    } else {
      nodes.push(item);
    }
  });
  return { nodes, edges };
}
export function transformImportOptionsToSchemaMapping(options: { nodes: BindingNode[]; edges: BindingEdge[] }) {
  let vertex_mappings: any[] = [];
  let edge_mappings: any[] = [];
  const NODE_LABEL_MAP: Record<string, string> = {};
  const NODE_PRIMARY_MAP: Record<string, string> = {};
  options.nodes.forEach(item => {
    const { key, properties, filelocation, label, primary } = item;
    NODE_LABEL_MAP[key as string] = label;
    NODE_PRIMARY_MAP[key as string] = primary;
    vertex_mappings.push({
      type_name: label,
      inputs: [filelocation],
      column_mappings: properties.map((p, index) => {
        const { token, name } = p;
        const num = parseFloat(token as string);
        const isNumber = !isNaN(num);
        const colmunName = typeof token === 'string' ? token.split('_')[1] : token;
        return {
          column: {
            index,
            name: isNumber ? colmunName : token,
          },
          property: name,
        };
      }),
    });
  });

  options.edges.forEach(item => {
    const { properties, filelocation, label, source, target } = item;
    const column_mappings: any[] = [];
    const source_vertex_mappings: any[] = [];
    const destination_vertex_mappings: any[] = [];
    // 要将 properties 中前端拼接的 #source 和 #target 过滤掉
    properties.forEach((p, pIdx) => {
      const { token, name } = p;
      const isSource = name.startsWith('#source');
      const isTarget = name.startsWith('#target');
      const num = parseFloat(token as string);
      const isNumber = isNaN(num);
      const colmunName = typeof token === 'string' ? token.split('_')[1] : token;
      if (isSource) {
        source_vertex_mappings.push({
          column: {
            index: 0,
            // name: NODE_PRIMARY_MAP[source],
            name: isNumber ? '' : colmunName,
          },
          property: name,
        });
      } else if (isTarget) {
        destination_vertex_mappings.push({
          column: {
            index: 1,
            // name: NODE_PRIMARY_MAP[target],
            name: isNumber ? '' : colmunName,
          },
          property: name,
        });
      } else {
        column_mappings.push({
          column: {
            index: pIdx, //isNumber ? num + 2 : 0,
            name: isNumber ? '' : colmunName,
          },
          property: name,
        });
      }
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
/** groot 数据绑定参数处理 */
export function transformImportOptionsToGrootSchemaMapping(options: {
  currentType: string;
  data: any;
  dataMap: { [x: string]: { key: string; label: string } };
}) {
  const { currentType, data, dataMap } = options;
  const { label, filelocation, datatype, properties, source, target } = data;
  const data_source = datatype === 'csv' ? 'FILE' : 'ODPS';
  if (currentType === 'node') {
    return {
      data_source,
      type_name: label,
      location: filelocation,
      property_mapping: properties.reduce((acc, curr, index) => {
        return {
          ...acc,
          [index]: curr.name,
        };
      }, {}),
    };
  }
  if (currentType === 'edge') {
    let source_vertex: string = '';
    let destination_vertex: string = '';
    Object.values(dataMap).forEach(item => {
      if (item.key === source) {
        source_vertex = item.label;
      }
      if (item.key === target) {
        destination_vertex = item.label;
      }
    });
    // 要将 properties 中前端拼接的 #source 和 #target 过滤掉
    let property_mapping = {};
    let source_pk_column_map = {};
    let destination_pk_column_map = {};
    properties.forEach((p, pIdx) => {
      const { token, name } = p;
      const isSource = name.startsWith('#source');
      const isTarget = name.startsWith('#target');
      if (isSource) {
        source_pk_column_map = { 0: token };
      } else if (isTarget) {
        destination_pk_column_map = { 1: token };
      } else {
        property_mapping = { [pIdx]: token };
      }
    });
    return {
      data_source,
      type_name: label,
      source_vertex,
      destination_vertex,
      location: filelocation,
      source_pk_column_map,
      destination_pk_column_map,
      property_mapping,
    };
  }

  let vertex_mappings: any[] = [];
  let edge_mappings: any[] = [];
  const NODE_LABEL_MAP: Record<string, string> = {};
  const NODE_PRIMARY_MAP: Record<string, string> = {};
  options.nodes.forEach((item: { key: any; properties: any; filelocation: any; label: any; primary: any }) => {
    const { key, properties, filelocation, label, primary } = item;
    NODE_LABEL_MAP[key as string] = label;
    NODE_PRIMARY_MAP[key as string] = primary;
    vertex_mappings.push({
      type_name: label,
      inputs: [filelocation],
      column_mappings: properties.map((p: { token: any; name: any }) => {
        const { token, name } = p;

        const num = parseFloat(token as string);
        const isNumber = !isNaN(num);
        return {
          column: {
            index: isNumber ? num : 0,
            name: isNumber ? '' : token,
          },
          property: name,
        };
      }),
    });
  });

  options.edges.forEach((item: { properties: any; filelocation: any; label: any; source: any; target: any }) => {
    const { properties, filelocation, label, source, target } = item;
    const column_mappings: any[] = [];
    const source_vertex_mappings: any[] = [];
    const destination_vertex_mappings: any[] = [];
    // 要将 properties 中前端拼接的 #source 和 #target 过滤掉
    properties.forEach((p: { token: any; name: any }, pIdx: any) => {
      const { token, name } = p;
      const isSource = name.startsWith('#source');
      const isTarget = name.startsWith('#target');
      const num = parseFloat(token as string);
      const isNumber = !isNaN(num);
      if (isSource) {
        source_vertex_mappings.push({
          column: {
            index: 0,
            name: NODE_PRIMARY_MAP[source],
          },
        });
      } else if (isTarget) {
        destination_vertex_mappings.push({
          column: {
            index: 1,
            name: NODE_PRIMARY_MAP[target],
          },
        });
      } else {
        column_mappings.push({
          column: {
            index: pIdx, //isNumber ? num + 2 : 0,
            name: isNumber ? '' : token,
          },
          property: name,
        });
      }
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

export function transformDataMapToGrootSchema(dataMap: any) {
  const vertex_types: { type_name: string; properties: any; primary_keys: undefined[] }[] = [];
  const edge_types: {
    type_name: string;
    properties: any;
    vertex_type_pair_relations: { destination_vertex: any; relation: string; source_vertex: any }[];
  }[] = [];
  const { vertices, edges } = dataMap;
  if (vertices.length) {
    vertices.forEach((item: { label: string; properties: any }) => {
      const { label, properties } = item;
      let primaryKey;
      vertex_types.push({
        type_name: label,
        properties: properties.map((p: { id: any; is_primary_key: any; name: any; type: any }) => {
          const { id, is_primary_key, name, type } = p;
          if (is_primary_key) {
            primaryKey = name;
          }
          return {
            property_id: id,
            property_name: name,
            property_type: { primitive_type: type },
          };
        }),
        primary_keys: [primaryKey],
      });
    });
  }
  if (edges.length) {
    edges.forEach((item: { label: string; relations: { src_label: string; dst_label: string }[]; properties: any }) => {
      const { label, relations, properties } = item;
      const { src_label, dst_label } = relations[0];
      edge_types.push({
        type_name: label,
        properties: properties.map((p: { id: any; name: any; type: any }) => {
          const { id, name, type } = p;
          return {
            property_id: id,
            property_name: name,
            property_type: { primitive_type: type },
          };
        }),
        vertex_type_pair_relations: [
          {
            destination_vertex: dst_label,
            relation: 'MANY_TO_MANY',
            source_vertex: src_label,
          },
        ],
      });
    });
  }

  return { vertex_types, edge_types };
}

/**
 * 周期导入接口参数转换
 * @param options
 * @returns
 */
export function transformDataMapToScheduledImportOptions(options: any) {
  const { dataMap, data } = options;
  let edge_mappings: { type_name: any; source_vertex: any; destination_vertex: any }[] = [];
  const { label, source, target } = data;
  edge_mappings.push({
    type_name: source && target ? label : '',
    source_vertex: source ? dataMap[source].label : '',
    destination_vertex: target ? dataMap[target].label : '',
  });

  return edge_mappings;
}

export const MOCK_DATA = {
  nodes: [
    {
      primary: 'id',
      label: 'person',
      key: 'cf2551c0-2469-4fd3-91eb-23fbb988d4d5',
      properties: [
        {
          name: 'id',
          type: 'DT_SIGNED_INT64',
          primaryKey: true,
          disable: false,
          id: '77b7d62b-c1ae-4947-baa4-7b22899e7ad8',
          token: 'id',
          key: '77b7d62b-c1ae-4947-baa4-7b22899e7ad8',
        },
        {
          name: 'name',
          type: 'DT_STRING',
          primaryKey: false,
          disable: false,
          id: 'ce93e222-f036-400a-ab0d-6c4df4e67b3a',
          token: 'name',
          key: 'ce93e222-f036-400a-ab0d-6c4df4e67b3a',
        },
        {
          name: 'age',
          type: 'DT_SIGNED_INT32',
          primaryKey: false,
          disable: false,
          id: '626e5fa3-a8ce-4bdf-9f4d-b26b40d3f94f',
          token: 'age',
          key: '626e5fa3-a8ce-4bdf-9f4d-b26b40d3f94f',
        },
      ],
      datatype: 'csv',
      filelocation: '/work/flex/interactive/examples/modern_graph/person.csv',
      isBind: true,
      isEidtProperty: true,
      dataFields: ['id', 'name', 'age'],
      delimiter: '|',
    },
    {
      primary: 'id',
      label: 'software',
      key: 'a659f023-8bc2-4ed2-a5e8-35388f4a1183',
      properties: [
        {
          name: 'id',
          type: 'DT_SIGNED_INT64',
          primaryKey: true,
          disable: false,
          id: '79fde61b-3f86-4480-8f21-3a87705c3dd2',
          token: 'id',
          key: '79fde61b-3f86-4480-8f21-3a87705c3dd2',
        },
        {
          name: 'name',
          type: 'DT_STRING',
          primaryKey: false,
          disable: false,
          id: 'db513bf9-f83d-407f-bebc-7d0d8ccbd91f',
          token: 'name',
          key: 'db513bf9-f83d-407f-bebc-7d0d8ccbd91f',
        },
        {
          name: 'lang',
          type: 'DT_STRING',
          primaryKey: false,
          disable: false,
          id: 'eaaab977-d364-4daa-930d-c6b64f638ae2',
          token: 'lang',
          key: 'eaaab977-d364-4daa-930d-c6b64f638ae2',
        },
      ],
      datatype: 'csv',
      filelocation: '/work/flex/interactive/examples/modern_graph/software.csv',
      isBind: true,
      isEidtProperty: true,
      dataFields: ['id', 'name', 'lang'],
      delimiter: '|',
    },
  ],
  edges: [
    {
      label: 'knows',
      relation: 'MANY_TO_MANY',
      key: 'c5fa4079-572d-40c0-a086-5ba8a31f3c1f',
      source: 'cf2551c0-2469-4fd3-91eb-23fbb988d4d5',
      target: 'cf2551c0-2469-4fd3-91eb-23fbb988d4d5',
      properties: [
        {
          name: 'weight',
          type: 'DT_DOUBLE',
          disable: false,
          id: 'f182a937-3f11-46f5-b979-69c862219c5b',
          token: 'weight',
          key: 'f182a937-3f11-46f5-b979-69c862219c5b',
        },
      ],
      datatype: 'csv',
      filelocation: '/work/flex/interactive/examples/modern_graph/person_knows_person.csv',
      isBind: true,
      isEidtProperty: true,
      dataFields: ['person.id', 'person.id', 'weight'],
      delimiter: '|',
    },
    {
      label: 'created',
      relation: 'MANY_TO_MANY',
      key: '9c996d92-ca86-4666-8216-10cf872e645d',
      source: 'cf2551c0-2469-4fd3-91eb-23fbb988d4d5',
      target: 'a659f023-8bc2-4ed2-a5e8-35388f4a1183',
      properties: [
        {
          name: 'weight',
          type: 'DT_DOUBLE',
          disable: false,
          id: '1cbe2c86-dc6b-4f54-84a3-c117c15acf2a',
          token: 'weight',
          key: '1cbe2c86-dc6b-4f54-84a3-c117c15acf2a',
        },
      ],
      datatype: 'csv',
      filelocation: '/work/flex/interactive/examples/modern_graph/person_created_software.csv',
      isBind: true,
      isEidtProperty: true,
      dataFields: ['person.id', 'software.id', 'weight'],
      delimiter: '|',
    },
  ],
};
