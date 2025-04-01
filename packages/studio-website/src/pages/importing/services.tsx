import { GraphApiFactory, UtilsApiFactory, DataSourceApiFactory, JobApiFactory } from '@graphscope/studio-server';
import { notification } from '../../pages/utils';
import { transformImportOptionsToSchemaMapping } from '@graphscope/studio-importor';

import type { FieldType } from './start-load';

/** upload file */
export const uploadFile = async (file: File) => {
  return UtilsApiFactory(undefined, window.COORDINATOR_URL)
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

export const bindDatasourceInBatch = async (graph_id: string, options: any): Promise<any> => {
  const schema = transformImportOptionsToSchemaMapping(options);
  const res = await DataSourceApiFactory(undefined, window.COORDINATOR_URL).bindDatasourceInBatch(graph_id, schema);

  if (res.data === 'Bind data source mapping successfully') {
    notification('success', res.data, 'Bind data source mapping successfully');
    return true;
  }
  notification('error', res.data);
  return false;
};
/** 数据绑定 dataMap(nodes/edges集合)*/
export const submitDataloadingJob = async (graph_id: string, graphSchema: any, loadConfig: FieldType): Promise<any> => {
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

  const quoteParams = loadConfig.quoting
    ? {
        quoting: loadConfig.quoting,
        quote_char: loadConfig.quote_char,
      }
    : {
        quoting: loadConfig.quoting,
      };
  return JobApiFactory(undefined, window.COORDINATOR_URL).submitDataloadingJob(graph_id, {
    ...schema,
    loading_config: {
      import_option: loadConfig.import_option,
      format: {
        type: loadConfig.type,
        metadata: {
          delimiter: loadConfig.delimiter,
          header_row: loadConfig.header_row,
          ...quoteParams,
        },
      },
    },
    repeat: loadConfig.repeat,
    schedule: loadConfig.schedule,
  });
};

/** 获取周期导入的配置文件，only for groot engine*/
export const getLoadScheduleConfig = async (graph_id: string, graphSchema: any): Promise<any> => {
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

  return await JobApiFactory(undefined, window.COORDINATOR_URL).getDataloadingJobConfig(graph_id, {
    ...schema,
    loading_config: {},
    repeat: 'once',
    schedule: '',
  });
};

export const getSchema = async (graph_id: string) => {
  let schema;
  if (window.GS_ENGINE_TYPE === 'interactive' || window.GS_ENGINE_TYPE === 'gart') {
    schema = await GraphApiFactory(undefined, window.COORDINATOR_URL)
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
    schema = await GraphApiFactory(undefined, window.COORDINATOR_URL)
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
export const getDatasourceById = async (graph_id: string) => {
  const schemaMapping = await DataSourceApiFactory(undefined, window.COORDINATOR_URL)
    .getDatasourceById(graph_id!)
    .then(res => res.data)
    .catch(error => {
      notification('error', error);
      return {};
    });

  return schemaMapping;
};

export const queryPrimitiveTypes = () => {
  const { GS_ENGINE_TYPE } = window;
  if (GS_ENGINE_TYPE === 'groot') {
    return ['DT_DOUBLE', 'DT_STRING', 'DT_SIGNED_INT32', 'DT_SIGNED_INT64'].map(item => {
      return { label: item, value: item };
    });
  }
  if (GS_ENGINE_TYPE === 'interactive' || GS_ENGINE_TYPE === 'gart') {
    return ['DT_SIGNED_INT32', 'DT_SIGNED_INT64', 'DT_DOUBLE', 'DT_STRING'].map(item => {
      return { label: item, value: item };
    });
  }
  return [];
};
