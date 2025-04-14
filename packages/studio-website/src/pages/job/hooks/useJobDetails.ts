import { useState, useEffect, useCallback } from 'react';
import { useHistory } from '../../../hooks';
import { getJobById } from '../service';
import { JobStatus } from '@graphscope/studio-server';
import { Utils } from '@graphscope/studio-components';

const { getSearchParams } = Utils;

export const useJobDetails = () => {
  const history = useHistory();
  const jobId = getSearchParams('jobId') || '';
  const [state, setState] = useState({
    content: '', // 日志内容
    reference: '', // 参考链接
  });

  const fetchJobDetails = useCallback(async () => {
    try {
      const response = (await getJobById(jobId)) as JobStatus;
      const { log, detail } = response;

      setState(preState => ({
        ...preState,
        reference: detail?.build_stage_logview || '',
        content: log || '',
      }));

      if (detail?.build_stage_logview) {
        window.open(detail.build_stage_logview);
      }
    } catch (error) {
      history.push('/job'); // 如果获取失败，跳转到 Job 列表页
    }
  }, [jobId, history]);

  useEffect(() => {
    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

  return { state, jobId, fetchJobDetails };
};
