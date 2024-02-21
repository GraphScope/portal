import { GraphApiFactory } from '@graphscope/studio-server';
import type { BindingNode } from './useContext';
import { transformSchemaToOptions } from '@/components/utils/schema';

export const getSchema = async (graph_name: string) => {
  const schema = await GraphApiFactory(undefined, location.origin)
    .getSchema(graph_name)
    .then(res => {
      if (res.status === 200) {
        return res.data;
      }
    });
  if (!schema) {
    return {};
  }

  const { vertex_types, edge_types } = schema;
  //@ts-ignore
  const schemaOption = transformSchemaToOptions(schema, false);

  const nodes = schemaOption.nodes.map(item => {
    return {
      ...item,
      datatype: 'ODPS',
      filelocation: '/xxxx/xxxx/node.csv',
      isBind: false,
    };
  });
  const edges = schemaOption.edges.map(item => {
    return {
      ...item,
      datatype: 'ODPS',
      filelocation: '/xxxx/xxxx/edge.csv',
      isBind: false,
    };
  });
  console.log('schemaOption', schemaOption, nodes, edges);

  return { nodes, edges };
};
