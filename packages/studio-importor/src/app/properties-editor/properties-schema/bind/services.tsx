import { DataSourceApiFactory } from '@graphscope/studio-server';
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

export const unbindEdgeDatasource = async (label: string, source, target, schema: any): Promise<boolean> => {
  const graph_id = Utils.getSearchParams('graph_id');
  const res = await DataSourceApiFactory(undefined, window.COORDINATOR_URL).unbindEdgeDatasource(
    graph_id,
    label,
    source,
    target,
    schema,
  );
  if (res.data === 'Unbind edge data source successfully') {
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
