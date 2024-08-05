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
    idToGraph.set(graph.id, graph.name);
  });

  const data = message.map(V => {
    //@ts-ignore
    const graph_name = idToGraph.get(V?.detail.graph_id);
    return graph_name ? { ...V, graph_name } : V;
  });

  const info = data
    .sort((a, b) => dayjs(b.start_time).valueOf() - dayjs(a.start_time).valueOf())
    .map(item => {
      //@ts-ignore
      const { job_id } = item;
      return {
        ...item,
        key: job_id,
      };
    });
  return info;
};
export const deleteJobById = async (jobId: string, delete_scheduler: boolean) => {
  return await JobApiFactory(undefined, location.origin)
    .deleteJobById(jobId, delete_scheduler)
    .then(res => {
      if (res.status === 200 || 204) {
        notification('success', 'delete job successfully.');
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
