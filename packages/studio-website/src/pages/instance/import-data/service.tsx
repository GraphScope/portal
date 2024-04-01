import {
  GraphApiFactory,
  UtilsApiFactory,
  JobApiFactory,
  DatasourceApiFactory,
  LegacyApiFactory,
} from '@graphscope/studio-server';
import type { SchemaMapping } from '@graphscope/studio-server';

import {
  transformSchemaToImportOptions,
  transformMappingSchemaToImportOptions,
  transformDataMapToGrootSchema,
} from '@/components/utils/import';

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
      if (res.status === 200) {
        return res.data;
      }
    })
    .catch(error => {});
};

export const getSchema = async (graph_name: string) => {
  let schema;
  if (window.GS_ENGINE_TYPE === 'interactive') {
    schema = await GraphApiFactory(undefined, location.origin)
      .getSchema(graph_name)
      .then(res => {
        if (res.status === 200) {
          return res.data;
        }
        return { nodes: [], edges: [] };
      });
  }
  if (window.GS_ENGINE_TYPE === 'groot') {
    schema = await LegacyApiFactory(undefined, location.origin)
      .getGrootSchema(graph_name)
      .then(res => {
        if (res.status === 200) {
          return res.data;
        }
        return { nodes: [], edges: [] };
      });
    schema = transformDataMapToGrootSchema(JSON.parse(JSON.stringify(schema)));
  }

  return schema;
};
export const getDataloadingConfig = async (graph_name: string, schema: any) => {
  const schemaMapping = await JobApiFactory(undefined, location.origin)
    .getDataloadingConfig(graph_name!)
    .then(res => res.data)
    .catch(error => {
      return {};
    });
  console.log(schemaMapping);

  if (JSON.stringify(schemaMapping) === '{}') {
    //@ts-ignore
    return transformSchemaToImportOptions(schema);
  }
  //@ts-ignore
  return transformMappingSchemaToImportOptions(schemaMapping, schema);
};
export const createGrootDataloadingJob = async (graph_name: any) => {
  const grootDataloading = await LegacyApiFactory(undefined, location.origin)
    .createGrootDataloadingJob(graph_name!)
    .then(res => res.data)
    .catch(error => {
      return {};
    });
  return grootDataloading;
};
