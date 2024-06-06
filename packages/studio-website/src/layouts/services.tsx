import {
  GraphApiFactory,
  ServiceApiFactory,
  // DeploymentApiFactory,
  // LegacyApiFactory,
  JobApiFactory,
} from '@graphscope/studio-server';

import { notification } from '@/pages/utils';

export const listGraphs = async () => {
  const status = await ServiceApiFactory(undefined, location.origin)
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

  let graphs;

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
  console.log(graphs, status);

  return {
    graphs,
    status,
  };
};
