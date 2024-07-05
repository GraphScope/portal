import React, { useEffect, useState } from 'react';
import { getJobById } from './service';
import { Utils, useThemeContainer } from '@graphscope/studio-components';
import Section from '@/components/section';
const { getUrlParams } = Utils;

const Detail: React.FunctionComponent = () => {
  console.log(getUrlParams());

  const { jobId } = getUrlParams() || '';
  const [detailData, setDetailData] = useState<string>('');
  const { jobDetailBorder, jobDetailColor } = useThemeContainer();
  /** 获取详情job */
  useEffect(() => {
    const fetchJobDetails = async () => {
      const response = await getJobById(jobId);
      const { log } = response;
      setDetailData(log);
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
          title: 'ID',
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
