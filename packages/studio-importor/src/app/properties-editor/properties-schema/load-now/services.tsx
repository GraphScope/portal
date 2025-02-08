import { DataSourceApiFactory, JobApiFactory } from '@graphscope/studio-server';
import { transformImportOptionsToSchemaMapping } from '../../../utils/importing';
import { Utils } from '@graphscope/studio-components';
import { notification } from 'antd';
export const bindDatasourceInBatch = async (options: any): Promise<boolean> => {
  const graph_id = Utils.getSearchParams('graph_id');
  const schema = transformImportOptionsToSchemaMapping(options);
  const res = await DataSourceApiFactory(undefined, window.COORDINATOR_URL).bindDatasourceInBatch(graph_id, schema);

  if (res.data === 'Bind data source mapping successfully') {
    notification.success({
      message: res.data,
    });
    return true;
  }
  notification.error({
    message: res.data,
  });
  return false;
};

export const unbindVertexDatasource = async (label: string, schema: any): Promise<boolean> => {
  const graph_id = Utils.getSearchParams('graph_id');
  const res = await DataSourceApiFactory(undefined, window.COORDINATOR_URL).unbindVertexDatasource(
    graph_id,
    label,
    schema,
  );
  if (res.data === 'Unbind vertex data source successfully') {
    notification.success({
      message: res.data,
    });
    return true;
  }
  notification.error({
    message: res.data,
  });
  return false;
};
export const submitDataloadingJob = async (graphSchema: any, type?: string): Promise<any> => {
  const graph_id = Utils.getSearchParams('graph_id');
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
  const { vertices, edges } = schema;

  let particalSchema = {
    vertices,
    edges,
  };

  if (type === 'nodes') {
    particalSchema = {
      vertices,
      edges: [],
    };
  }
  if (type === 'edges') {
    particalSchema = {
      vertices: [],
      edges,
    };
  }

  return JobApiFactory(undefined, window.COORDINATOR_URL)
    .submitDataloadingJob(graph_id, {
      ...particalSchema,
      loading_config: {
        import_option: 'overwrite',
        format: {
          type: 'csv',
          metadata: {
            delimiter: '|',
            header_row: true,
            quoting: false,
          },
        },
      },
      repeat: 'once',
      schedule: null,
    })
    .then((res: any) => {
      if (res.status === 200) {
        return {
          jobId: res.data && res.data.job_id,
          status: 'success',
          message: `The data loading task has been successfully created. You can view detailed logs in the job center.`,
        };
      }
      return {
        jobId: res.data && res.data.job_id,
        status: 'error',
        message: res.message,
      };
    })
    .catch(error => {
      return {
        jobId: error.response.data && error.response.data.job_id,
        status: 'error',
        message: window.GS_ENGINE_TYPE === 'interactive' ? error.response.data : error.response.data.detail,
      };
    });
};
