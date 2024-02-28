import { GraphApiFactory, UtilsApiFactory, JobApiFactory } from '@graphscope/studio-server';
import type { SchemaMapping } from '@graphscope/studio-server';
import type { BindingEdge, BindingNode } from './useContext';
import { transformSchemaToOptions } from '@/components/utils/schema';

export const getSchema = async (graph_name: string): Promise<{ nodes: BindingNode[]; edges: BindingEdge[] }> => {
  const schema = await GraphApiFactory(undefined, location.origin)
    .getSchema(graph_name)
    .then(res => {
      if (res.status === 200) {
        return res.data;
      }
    });
  if (!schema) {
    return { nodes: [], edges: [] };
  }

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

  console.log('schemaOption', schemaOption, nodes, edges);
  const real = { nodes, edges };

  return real;
  // return MOCK_DATA;
};

/** upload file */
export const uploadFile = async (file: File) => {
  return UtilsApiFactory(undefined, location.origin)
    .uploadFile(file)
    .then(res => {
      if (res.status === 200) {
        return res.data;
      }
    });
};

export const createDataloadingJob = async (params: SchemaMapping) => {
  return JobApiFactory(undefined, location.origin)
    .createDataloadingJob(params.graph!, params)
    .then(res => {
      console.log('res', res);
    });
};

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
