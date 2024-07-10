import { JobApiFactory, GraphApiFactory } from '@graphscope/studio-server';
import { notification } from '@/pages/utils';
import dayjs from 'dayjs';
export type IJobType = {
  key?: string;
  id: string;
  type: string;
  status: string;
  start_time: string;
  end_time: string;
  log: string;
  detail: {
    additionalProp1: object;
  };
};
export const listJobs = async () => {
  const message = await JobApiFactory(undefined, location.origin)
    .listJobs()
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
  const graphs = await GraphApiFactory(undefined, location.origin)
    .listGraphs()
    .then(res => {
      if (res.status === 200) {
        return res.data;
      }
    })
    .catch(error => {
      notification('error', error);
    });
  const idToGraph = new Map();
  graphs?.forEach(graph => {
    idToGraph.set(graph.id, graph);
  });

  const data = message.map(V => {
    const graph = idToGraph.get(V.id);
    return graph ? { ...V, graph_name: graph.name } : V;
  });

  const info = data
    .sort((a, b) => dayjs(b.start_time).valueOf() - dayjs(a.start_time).valueOf())
    .map(item => {
      const { job_id } = item;
      return {
        ...item,
        key: job_id,
      };
    });
  return info;
};
export const deleteJobById = async (jobId: string) => {
  return await JobApiFactory(undefined, location.origin)
    .deleteJobById(jobId)
    .then(res => {
      if (res.status === 200) {
        return res.data;
      }
      return [];
    })
    .catch(error => {
      notification('error', error);
    });
};
export const getJobById = async (jobId: string) => {
  return await JobApiFactory(undefined, location.origin)
    .getJobById(jobId)
    .then(res => {
      if (res.status === 200) {
        return res.data;
      }
      return [];
    })
    .catch(error => {
      notification('error', error);
    });
};
