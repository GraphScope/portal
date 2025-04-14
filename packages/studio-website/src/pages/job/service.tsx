import { JobApiFactory, GraphApiFactory } from '@graphscope/studio-server';
import { notification } from '../../pages/utils';
import dayjs from 'dayjs';

export type IJobType = {
  key?: string;
  id: string;
  type: string;
  status: string;
  graph_name: string;
  start_time: string;
  end_time: string;
  log: string;
  detail: {
    additionalProp1: object;
  };
};

const COORDINATOR_URL = window.COORDINATOR_URL;

/** 通用错误处理函数 */
const handleApiError = (error: any, message: string) => {
  console.error(message, error);
  notification('error', message);
  return [];
};

/** 获取图 ID 到名称的映射 */
const getGraphIdToNameMap = async (): Promise<Map<string, string>> => {
  try {
    const graphs = await GraphApiFactory(undefined, COORDINATOR_URL).listGraphs();
    if (graphs.status === 200) {
      const idToGraph = new Map();
      graphs.data.forEach(graph => {
        idToGraph.set(graph.id, graph.name);
      });
      return idToGraph;
    }
    return new Map();
  } catch (error) {
    handleApiError(error, 'Failed to fetch graphs');
    return new Map();
  }
};

/** 获取作业列表 */
export const listJobs = async (): Promise<IJobType[]> => {
  try {
    const jobsResponse = await JobApiFactory(undefined, COORDINATOR_URL).listJobs();
    if (jobsResponse.status !== 200) {
      return [];
    }

    const idToGraph = await getGraphIdToNameMap();

    return jobsResponse.data
      .map(job => {
        const graph_name = idToGraph.get(job?.detail?.graph_id) || '';
        return { ...job, graph_name };
      })
      .sort((a, b) => dayjs(b.start_time).valueOf() - dayjs(a.start_time).valueOf())
      .map(job => ({
        ...job,
        key: job.job_id,
      }));
  } catch (error) {
    return handleApiError(error, 'Failed to fetch jobs');
  }
};

/** 删除作业 */
export const deleteJobById = async (jobId: string): Promise<any> => {
  try {
    const response = await JobApiFactory(undefined, COORDINATOR_URL).deleteJobById(jobId);
    if (response.status === 200) {
      return response.data;
    }
    return [];
  } catch (error) {
    return handleApiError(error, `Failed to delete job with ID: ${jobId}`);
  }
};

/** 获取作业详情 */
export const getJobById = async (jobId: string): Promise<any> => {
  try {
    const response = await JobApiFactory(undefined, COORDINATOR_URL).getJobById(jobId);
    if (response.status === 200) {
      return response.data;
    }
    return [];
  } catch (error) {
    return handleApiError(error, `Failed to fetch job with ID: ${jobId}`);
  }
};
