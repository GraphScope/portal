import { JobApiFactory } from '@graphscope/studio-server';
import dayjs from 'dayjs';
export type IJobType = {
  key?: string;
  job_id: string;
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
    });
  const info = message
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
    });
};
