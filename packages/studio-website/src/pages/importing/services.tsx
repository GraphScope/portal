import { GraphApiFactory, UtilsApiFactory, DataSourceApiFactory, JobApiFactory } from '@graphscope/studio-server';

import { notification } from '@/pages/utils';
import { transformImportOptionsToSchemaMapping, transMappingSchemaToOptions } from './utils/import';
const { GS_ENGINE_TYPE } = window;
import type { FieldType } from './load-config/left-side';

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
export const bindDatasourceInBatch = async (graph_id: string, options: any) => {
  const schema = transformImportOptionsToSchemaMapping(options);
  return await DataSourceApiFactory(undefined, location.origin)
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

/** 数据绑定 dataMap(nodes/edges集合)*/
export const submitDataloadingJob = async (graph_id: string, graphSchema: any, loadConfig: FieldType) => {
  let NODE_LABEL_MAP: any = {};
  const schema = {
    vertices: graphSchema.nodes.map((item: any) => {
      const { id, data } = item;
      NODE_LABEL_MAP[id] = data.label;
      return {
        type_name: data.label,
      };
    }),
    edges: graphSchema.edges.map((item: any) => {
      const { id, source, data, target } = item;
      return {
        type_name: data.label,
        source_vertex: NODE_LABEL_MAP[source],
        destination_vertex: NODE_LABEL_MAP[target],
      };
    }),
  };

  return JobApiFactory(undefined, location.origin).submitDataloadingJob(graph_id, {
    ...schema,
    loading_config: {
      import_option: loadConfig.import_option,
      format: {
        type: loadConfig.type,
        metadata: {
          delimiter: loadConfig.delimiter,
          header_row: loadConfig.header_row,
        },
      },
    },
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
  }
  return schema;
};

/** getDatasourceById 获取数据源信息 */
export const getDatasourceById = async (graph_id: string, schema: any) => {
  const schemaMapping = await DataSourceApiFactory(undefined, location.origin)
    .getDatasourceById(graph_id!)
    .then(res => res.data)
    .catch(error => {
      notification('error', error);
      return {};
    });

  return transMappingSchemaToOptions(schema, schemaMapping);
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
