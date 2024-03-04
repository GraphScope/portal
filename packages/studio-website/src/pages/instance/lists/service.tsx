import { GraphApiFactory, ServiceApiFactory, ServiceApi, DeploymentApiFactory } from '@graphscope/studio-server';
import { message } from 'antd';

export const listGraphs = async () => {
  const status = await ServiceApiFactory(undefined, location.origin)
    .getServiceStatus()
    .then(res => {
      if (res.status === 200) {
        return res.data;
      }
      return {};
    });
  const deployments = await DeploymentApiFactory(undefined, location.origin)
    .getDeploymentInfo()
    .then(res => {
      return res.data;
    });

  const graphs = await GraphApiFactory(undefined, location.origin)
    .listGraphs()
    .then(res => {
      if (res.status === 200) {
        return res.data;
      }
    });
  const graphs_map = graphs?.reduce((acc, curr) => {
    return {
      ...acc,
      [curr.name as string]: curr,
    };
  }, {});

  console.log(status, deployments);
  const { graphs_info, version, solution, cluster_type } = deployments;

  const info = Object.values(graphs_info!).map(item => {
    const { name, creation_time, last_dataloading_time, update_time } = item;
    const { graph_name } = status;
    const isMatch = graph_name === name;
    //@ts-ignore
    const { schema, store_type, stored_procedures } = graphs_map[name];

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
      schema: schema,
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
        message.success(res.data);
        return true;
      } else {
        message.error(res.data);
        return false;
      }
    });
};

export const startService = async (name: string) => {
  return await ServiceApiFactory(undefined, location.origin)
    .startService({
      graph_name: name,
    })
    .then(res => {
      if (res.status === 200) {
        message.success(res.data);
        return true;
      } else {
        message.error(res.data);
        return false;
      }
    });
};
export const stopService = async (name: string) => {
  return await ServiceApiFactory(undefined, location.origin)
    .stopService({
      graph_name: name,
    })
    .then(res => {
      if (res.status === 200) {
        message.success(res.data);
        return true;
      } else {
        message.error(res.data);
        return false;
      }
    });
};
