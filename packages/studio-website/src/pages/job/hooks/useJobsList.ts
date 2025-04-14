import { useCallback, useEffect, useState } from 'react';
import { message } from 'antd';
import { listJobs, deleteJobById, IJobType } from '../service';
import useStore from './useStore';

export interface IState {
  jobsList: IJobType[];
  rawJobsList: IJobType[];
  typeOptions: { value: string; label: string }[];
  searchOptions: { value: string; label: string }[];
  jobId: string;
  loading: boolean;
}

export const useJobsList = () => {
  const [state, setState] = useState<IState>({
    jobsList: [],
    rawJobsList: [],
    typeOptions: [],
    searchOptions: [],
    jobId: '',
    loading: false,
  });

  const { handleChange } = useStore();

  const getJobList = useCallback(async () => {
    try {
      setState(prevState => ({ ...prevState, loading: true }));
      const res = await listJobs();
      const uniqueTypes = Array.from(new Set(res.map(item => item.type)));
      const typeOptions = uniqueTypes.map(type => ({ value: type, label: type }));
      const searchOptions = res.map(item => ({ value: item.id, label: item.id }));

      setState(prevState => ({
        ...prevState,
        jobsList: res,
        rawJobsList: res,
        typeOptions,
        searchOptions,
        loading: false,
      }));
    } catch (error) {
      message.error('Failed to load jobs');
    }
  }, []);

  const handleDeleteJob = useCallback(
    async (jobId: string) => {
      try {
        await deleteJobById(jobId);
        message.success('Job deleted successfully');
        getJobList();
      } catch {
        message.error('Failed to delete job');
      }
    },
    [getJobList],
  );

  useEffect(() => {
    getJobList();
  }, []);

  return { state, setState, handleChange, handleDeleteJob };
};
