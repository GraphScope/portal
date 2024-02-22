import { GraphApiFactory, UtilsApiFactory } from '@graphscope/studio-server';

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
  const edges = schemaOption.edges.map(item => {
    return {
      ...item,
      datatype: 'csv',
      filelocation: '',
      isBind: false,
    };
  });
  console.log('schemaOption', schemaOption, nodes, edges);

  return { nodes, edges };
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
