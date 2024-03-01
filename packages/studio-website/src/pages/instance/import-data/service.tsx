import { GraphApiFactory, UtilsApiFactory, JobApiFactory } from '@graphscope/studio-server';
import type { EdgeMapping, SchemaMapping, VertexMapping } from '@graphscope/studio-server';

import { transformMappingSchemaToImportOptions, transformSchemaToImportOptions } from '@/components/utils/import';

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
    .then(res => {});
};

export const getSchema = async (graph_name: string) => {
  const schema = await GraphApiFactory(undefined, location.origin)
    .getSchema(graph_name)
    .then(res => {
      if (res.status === 200) {
        return res.data;
      }
      return { nodes: [], edges: [] };
    });
  return schema;
};
export const getDataloadingConfig = async (graph_name: string, schema: any) => {
  const schemaMapping = await JobApiFactory(undefined, location.origin)
    .getDataloadingConfig(graph_name!)
    .then(res => res.data)
    .catch(error => {});

  if (JSON.stringify(schemaMapping) === '{}') {
    //@ts-ignore
    return transformSchemaToImportOptions(schema);
  }
  //@ts-ignore
  return transformMappingSchemaToImportOptions(schemaMapping, schema);
};
