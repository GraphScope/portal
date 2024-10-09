import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import { getJobById } from './service';
import { Utils, useCustomToken } from '@graphscope/studio-components';
import Section from '@/components/section';
const { getSearchParams } = Utils;

const Detail: React.FunctionComponent = () => {
  const jobId = getSearchParams('jobId') || '';
  const [detailData, setDetailData] = useState<string>('');
  const { jobDetailBorder, jobDetailColor } = useCustomToken();
  /** 获取详情job */
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await getJobById(jobId);
        //@ts-ignore
        const { log } = response;
        setDetailData(log);
      } catch (error) {
        history.push('/job');
      }
    };

    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);
  /** code style */
  const containerStyles = {
    margin: '-12px -10px',
    border: `${jobDetailBorder} 1px solid`,
    borderRadius: '6px',
    padding: '12px',
    color: jobDetailColor,
  };
  return (
    <Section
      breadcrumb={[
        {
          title: 'Jobs',
        },
        {
          title: jobId,
        },
      ]}
      desc={{ id: 'The jobid of the running state of the graph model is {jobId} verbose logs.', values: { jobId } }}
    >
      <pre style={containerStyles}>
        <code style={{ whiteSpace: 'pre-wrap' }}>{detailData}</code>
      </pre>
    </Section>
  );
};

export default Detail;
