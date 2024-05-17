import {
  GraphApiFactory,
  UtilsApiFactory,
  JobApiFactory,
  LegacyApiFactory,
  DatasourceApiFactory,
  DataSourceApiFactory,
} from '@graphscope/studio-server';
import type {
  SchemaMapping,
  GrootDataloadingJobConfig,
  VertexDataSource,
  EdgeDataSource,
} from '@graphscope/studio-server';
import { notification } from '@/pages/utils';
import {
  transformSchemaToImportOptions,
  transformMappingSchemaToImportOptions,
  transformDataMapToGrootSchema,
  transformImportOptionsToGrootSchemaMapping,
} from '@/components/utils/import';

/** upload file */
export const uploadFile = async (file: File) => {
  return UtilsApiFactory(undefined, location.origin)
    .uploadFile(file)
    .then(res => {
      if (res.status === 200) {
        return res.data;
      }
    })
    .catch(error => {
      notification('error', error);
    });
};

export const createDataloadingJob = async (graph_id: string, params: SchemaMapping) => {
  return DataSourceApiFactory(undefined, location.origin)
    .bindDatasourceInBatch(graph_id, params)
    .then(res => {
      if (res.status === 200) {
        return res.data;
      }
    })
    .catch(error => {
      notification('error', error);
    });
};

export const getSchema = async (graph_id: string) => {
  let schema;
  if (window.GS_ENGINE_TYPE === 'interactive') {
    schema = await GraphApiFactory(undefined, location.origin)
      .getGraphById(graph_id)
      .then(res => {
        if (res.status === 200) {
          return res.data.schema;
        }
        return { nodes: [], edges: [] };
      })
      .catch(error => {
        notification('error', error);
      });
  }
  if (window.GS_ENGINE_TYPE === 'groot') {
    schema = await GraphApiFactory(undefined, location.origin)
      .getSchemaById(graph_id)
      .then(res => {
        if (res.status === 200) {
          return res.data;
        }
        return { nodes: [], edges: [] };
      })
      .catch(error => {
        notification('error', error);
      });
    // schema = transformDataMapToGrootSchema(JSON.parse(JSON.stringify(schema)));
  }
  return schema;
};
// export const getDataloadingConfig = async (graph_id: string, schema: any) => {
//   const schemaMapping = await JobApiFactory(undefined, location.origin)
//     .getDataloadingJobConfig(graph_id!)
//     .then(res => res.data)
//     .catch(error => {
//       notification('error', error);
//       return {};
//     });
//   console.log(schemaMapping);

//   if (JSON.stringify(schemaMapping) === '{}') {
//     //@ts-ignore
//     return transformSchemaToImportOptions(schema);
//   }
//   //@ts-ignore
//   return transformMappingSchemaToImportOptions(schemaMapping, schema);
// };
/** getDatasourceById 获取数据源信息 */
export const getDataloadingConfig = async (graph_id: string, schema: any) => {
  const schemaMapping = await DataSourceApiFactory(undefined, location.origin)
    .getDatasourceById(graph_id!)
    .then(res => res.data)
    .catch(error => {
      notification('error', error);
      return {};
    });
  const loading_config = await JobApiFactory(undefined, location.origin)
    .getDataloadingJobConfig(graph_id!)
    .then(res => res.data)
    .catch(error => {
      notification('error', error);
      return {};
    });
  /** 上边两接口获取一条数据 */
  schemaMapping.loading_config = loading_config;
  const { edge_mappings, vertex_mappings } = schemaMapping;
  if (JSON.stringify(edge_mappings) === '[]' && JSON.stringify(vertex_mappings) === '[]') {
    return transformSchemaToImportOptions(schema);
  }
  //@ts-ignore
  return transformMappingSchemaToImportOptions(schemaMapping, schema);
};

export const createGrootDataloadingJob = async (
  graph_name: string,
  grootDataloadingJobConfig: GrootDataloadingJobConfig,
) => {
  const grootDataloading = await LegacyApiFactory(undefined, location.origin)
    .createGrootDataloadingJob(graph_name!, grootDataloadingJobConfig)
    .then(res => {
      if (res.status === 200) {
        res.data;
      }
    })
    .catch(error => {
      notification('error', error);
      return {};
    });
  return grootDataloading;
};
/** groot 绑定点 */
export const bindVertexDatasource = async (graphName: string, vertexDataSource: VertexDataSource) => {
  return DatasourceApiFactory(undefined, location.origin)
    .bindVertexDatasource(graphName, vertexDataSource)
    .then(res => {
      if (res.status === 200) {
        return res.data;
      }
    })
    .catch(error => {
      notification('error', error);
    });
};
/** groot 绑定边 */
export const bindEdgeDatasource = async (graphName: string, edgeDataSource: EdgeDataSource) => {
  return DatasourceApiFactory(undefined, location.origin)
    .bindEdgeDatasource(graphName, edgeDataSource)
    .then(res => {
      if (res.status === 200) {
        return res.data;
      }
    })
    .catch(error => {
      notification('error', error);
    });
};

export const bindDatasource = async (currentType: string, data: any, dataMap: any) => {
  const params = transformImportOptionsToGrootSchemaMapping({ currentType, data, dataMap });
  const { label } = data;
  if (currentType === 'node') {
    await bindVertexDatasource(label, params);
  }
  if (currentType === 'edge') {
    await bindVertexDatasource(label, params);
  }
};
