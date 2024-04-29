import {
  GraphApiFactory,
  ServiceApiFactory,
  DeploymentApiFactory,
  LegacyApiFactory,
  JobApiFactory,
} from '@graphscope/studio-server';
import { notification } from '@/pages/utils';

export const listGraphs = async () => {
  const status = await ServiceApiFactory(undefined, location.origin)
    .getServiceStatus()
    .then(res => {
      if (res.status === 200) {
        return res.data;
      }
      return {};
    })
    .catch(error => {
      notification('error', error);
    });
  const deployments = await DeploymentApiFactory(undefined, location.origin)
    .getDeploymentInfo()
    .then(res => {
      return res.data;
    })
    .catch(error => {
      notification('error', error);
    });
  const { GS_ENGINE_TYPE } = window;
  let graphs;
  if (GS_ENGINE_TYPE === 'interactive') {
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
  }

  if (GS_ENGINE_TYPE === 'groot') {
    graphs = await LegacyApiFactory(undefined, location.origin)
      .listGrootGraph()
      .then(res => {
        if (res.status === 200) {
          return res.data;
        }
      })
      .catch(error => {
        notification('error', error);
      });
  }

  const graphs_map = graphs?.reduce((acc, curr) => {
    return {
      ...acc,
      [curr.name as string]: curr,
    };
  }, {});

  console.log(status, deployments);
  const { graphs_info, version, solution, cluster_type } = deployments || { graphs_info: {} };

  const info = Object.values(graphs_info!).map(item => {
    const { name, creation_time, last_dataloading_time, update_time } = item;
    const { graph_name } = status;
    const isMatch = graph_name === name;
    //@ts-ignore
    const { schema, store_type, stored_procedures } = (graphs_map && graphs_map[name]) || {
      schema: {},
      store_type: {},
      stored_procedures: {},
    };
    const { vertex_types, edge_types, vertices, edges } = schema;

    return {
      name: name,
      engineType: solution,
      clusterType: cluster_type,
      version: version,
      createtime: creation_time,
      updatetime: update_time,
      importtime: last_dataloading_time,
      server: isMatch ? status.sdk_endpoints?.cypher : '',
      status: isMatch ? status.status : 'stopped',
      hqps: isMatch ? status.sdk_endpoints?.hqps : '',
      schema: {
        vertices: (vertices && vertices.length) || (vertex_types && vertex_types.length),
        edges: (edges && edges.length) || (edge_types && edge_types.length),
      },
      store_type,
      stored_procedures,
      // statistics: 'xxxx',
      // logs: 'xxxx',
    };
  });

  return info;
};

export const deleteGraph = async (name: string) => {
  return await GraphApiFactory(undefined, location.origin)
    .deleteGraph(name)
    .then(res => {
      if (res.status === 200) {
        notification('success', res.data);
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

export const startService = async (name: string) => {
  return await ServiceApiFactory(undefined, location.origin)
    .startService({
      graph_name: name,
    })
    .then(res => {
      if (res.status === 200) {
        notification('success', res.data);
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
export const stopService = async (name: string) => {
  return await ServiceApiFactory(undefined, location.origin)
    .stopService({
      graph_name: name,
    })
    .then(res => {
      if (res.status === 200) {
        notification('success', res.data);
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
export const getDataloadingConfig = async (graph_name: string) => {
  return await JobApiFactory(undefined, location.origin)
    .getDataloadingConfig(graph_name!)
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
