import { GraphApiFactory, ServiceApiFactory, ServiceApi } from '@graphscope/studio-server';

export const listGraphs = async () => {
  const graphs = await GraphApiFactory(undefined, location.origin)
    .listGraphs()
    .then(res => {
      if (res.status === 200) {
        return res.data;
      }
      return [];
    });
  const status = await ServiceApiFactory(undefined, location.origin)
    .getServiceStatus()
    .then(res => {
      if (res.status === 200) {
        return res.data;
      }
      return {};
    });

  const info = graphs.map(item => {
    const { name } = item;
    const { graph_name } = status;
    const isMatch = graph_name === name;
    return {
      name: name,
      version: 'x.xx.x',
      createtime: 'xxxx-xx-xx',
      updatetime: 'xxxx-xx-xx',
      importtime: 'xxxx-xx-xx',
      server: isMatch ? status.sdk_endpoints?.cypher : '',
      statistics: 'xxxx',
      logs: 'xxxx',
      status: isMatch ? status.status : 'stopped',
    };
  });

  return info;
};
