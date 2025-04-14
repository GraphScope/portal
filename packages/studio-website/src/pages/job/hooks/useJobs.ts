import { useCallback, useEffect, useState } from 'react';
import { message } from 'antd';
import { listJobs, deleteJobById } from '../service';
import { IState, IJobType } from '../types';
import useStore from './useStore';

export const useJobs = () => {
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

  const handleFilterChange = useCallback(
    (selectedItems, filterType) => {
      const updatedJobsList = handleChange(selectedItems, filterType, state.rawJobsList);
      setState(prevState => ({ ...prevState, jobsList: updatedJobsList }));
    },
    [handleChange, state.rawJobsList],
  );

  useEffect(() => {
    getJobList();
  }, []);

  return { state, getJobList, handleDeleteJob, handleFilterChange };
};
