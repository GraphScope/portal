import { GraphApiFactory, UtilsApiFactory, DataSourceApiFactory, JobApiFactory } from '@graphscope/studio-server';
import type { SchemaMapping } from '@graphscope/studio-server';
import { transOptionsToSchema } from './utils/schema';
import { cloneDeep } from 'lodash';
import { notification } from '@/pages/utils';
import {
  transformDataMapToOptions,
  transformImportOptionsToSchemaMapping,
  transformSchemaToImportOptions,
  transformMappingSchemaToImportOptions,
} from '../importing/utils/import';
const { GS_ENGINE_TYPE } = window;

export const createGraph = async (graph_id: string, params: { graphName: string; nodes: any[]; edges: any[] }) => {
  const { graphName, nodes, edges } = params;
  let graphs;
  const schemaJSON = transOptionsToSchema(cloneDeep({ nodes: nodes, edges: edges }));
  if (GS_ENGINE_TYPE === 'interactive') {
    const data = {
      name: String(graphName).trim(),
      description: '',
      schema: schemaJSON,
    };
    graphs = await GraphApiFactory(undefined, location.origin).createGraph(data);
  }
  /** groot 创建 */
  if (GS_ENGINE_TYPE === 'groot') {
    // const schemagrootJSON = transOptionsToGrootSchema(cloneDeep({ nodes: nodes, edges: edges }));
    graphs = await GraphApiFactory(undefined, location.origin)
      .importSchemaById(graph_id, schemaJSON)
      .then(res => {
        if (res.status === 200) {
          return res.data;
        }
        return [];
      })
      .catch(error => {
        notification('error', error);
        return [];
      });
  }
  return graphs;
};
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
/** 数据绑定 dataMap(nodes/edges集合)*/
export const createDataloadingJob = async (graph_id: string, dataMap: SchemaMapping) => {
  const options = transformDataMapToOptions(dataMap);
  const schema = transformImportOptionsToSchemaMapping(options);
  console.log(schema);

  return;
  return DataSourceApiFactory(undefined, location.origin)
    .bindDatasourceInBatch(graph_id, schema)
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
        return { vertex_types: [], edge_types: [] };
      })
      .catch(error => {
        notification('error', error);
        return { vertex_types: [], edge_types: [] };
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
  //@ts-ignore
  schemaMapping.loading_config = loading_config;
  //@ts-ignore
  const { edge_mappings, vertex_mappings } = schemaMapping;
  if (JSON.stringify(edge_mappings) === '[]' && JSON.stringify(vertex_mappings) === '[]') {
    return transformSchemaToImportOptions(schema);
  }
  //@ts-ignore
  return transformMappingSchemaToImportOptions(schemaMapping, schema);
};

export const queryPrimitiveTypes = () => {
  if (GS_ENGINE_TYPE === 'groot') {
    return ['DT_DOUBLE', 'DT_STRING', 'DT_SIGNED_INT32', 'DT_SIGNED_INT64'].map(item => {
      return { label: item, value: item };
    });
  }
  if (GS_ENGINE_TYPE === 'interactive') {
    return ['DT_SIGNED_INT32', 'DT_SIGNED_INT64', 'DT_DOUBLE', 'DT_STRING'].map(item => {
      return { label: item, value: item };
    });
  }
  return [];
};
