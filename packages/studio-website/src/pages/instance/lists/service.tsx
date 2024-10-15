import { GraphApiFactory, ServiceApiFactory, JobApiFactory } from '@graphscope/studio-server';
import type { DataloadingJobConfig } from '@graphscope/studio-server';
import { notification } from '../../../pages/utils';

export const listGraphs = async () => {
  const _status = await ServiceApiFactory(undefined, location.origin)
    .listServiceStatus()
    .then(res => {
      if (res.status === 200) {
        return res.data;
      }
      return [];
    })
    .catch(error => {
      notification('error', error);
    });

  // const { GS_ENGINE_TYPE } = window;
  let graphs;
  // if (GS_ENGINE_TYPE === 'interactive') {
  graphs = await GraphApiFactory(undefined, location.origin)
    .listGraphs()
    .then(res => {
      if (res.status === 200) {
        return res.data;
      }
    })
    .catch(error => {
      notification('error', error);
    });
  // }

  // if (GS_ENGINE_TYPE === 'groot') {
  //   graphs = await LegacyApiFactory(undefined, location.origin)
  //     .listGrootGraph()
  //     .then(res => {
  //       if (res.status === 200) {
  //         return res.data;
  //       }
  //     })
  //     .catch(error => {
  //       notification('error', error);
  //     });
  // }
  const graphs_map = graphs?.map(item => {
    const { schema, store_type, stored_procedures, schema_update_time, data_update_time, creation_time, id, name } =
      item;
    const { sdk_endpoints, status } = _status?.filter(V => V.graph_id === id)[0] || {
      sdk_endpoints: { cypher: '', hqps: '' },
      status: '',
    };
    //@ts-ignore
    const { vertex_types, edge_types, vertices, edges } = schema;
    return {
      id,
      name,
      // engineType: solution,
      // clusterType: cluster_type,
      // version: version,
      createtime: creation_time,
      updatetime: schema_update_time,
      importtime: data_update_time,
      server: sdk_endpoints?.cypher ?? '',
      status,
      hqps: sdk_endpoints?.hqps ?? '',
      schema: {
        vertices: (vertices && vertices.length) || (vertex_types && vertex_types.length),
        edges: (edges && edges.length) || (edge_types && edge_types.length),
      },
      store_type,
      stored_procedures,
    };
  });

  return graphs_map;
};

export const deleteGraph = async (graph_id: string) => {
  return await GraphApiFactory(undefined, location.origin)
    .deleteGraphById(graph_id)
    .then(res => {
      if (res.status === 200) {
        notification('success', JSON.parse(res.data.replace(/'/g, '"')).message);
        return true;
      } else {
        notification('error', res.data);
        return false;
      }
    })
    .catch(error => {
      notification('error', error);
    });
};

export const startService = async (graph_id: string) => {
  return await ServiceApiFactory(undefined, location.origin)
    .startService({
      graph_id,
    })
    .then(res => {
      if (res.status === 200) {
        notification('success', JSON.parse(res.data.replace(/'/g, '"')).message);
        return true;
      } else {
        notification('error', res.data);
        return false;
      }
    })
    .catch(error => {
      notification('error', error);
    });
};
export const stopService = async (graph_id: string) => {
  return await ServiceApiFactory(undefined, location.origin)
    .stopService({
      graph_id,
    })
    .then(res => {
      if (res.status === 200) {
        notification('success', JSON.parse(res.data.replace(/'/g, '"')).message);
        return true;
      } else {
        notification('error', res.data);
        return false;
      }
    })
    .catch(error => {
      notification('error', error);
    });
};
/** 获取是否已经导入 */
export const getDataloadingConfig = async (graph_id: string, dataloadingJobConfig: DataloadingJobConfig) => {
  return await JobApiFactory(undefined, location.origin)
    .getDataloadingJobConfig(graph_id!, dataloadingJobConfig)
    .then(res => {
      if (res.status === 200) {
        return res.data;
      } else {
        return res.data;
      }
    })
    .catch(error => {
      notification('error', error);
      return {};
    });
};
