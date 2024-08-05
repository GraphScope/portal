import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import { getJobById } from './service';
import { Utils, useThemeContainer } from '@graphscope/studio-components';
import Section from '@/components/section';
const { getSearchParams } = Utils;

const Detail: React.FunctionComponent = () => {
  const jobId = getSearchParams('jobId') || '';
  const [state, updateState] = useState<{ detailData: string; build_stage_logview: string }>({
    detailData: '',
    build_stage_logview: '',
  });
  const { detailData, build_stage_logview } = state;
  const { jobDetailBorder, jobDetailColor } = useThemeContainer();
  /** 获取详情job */
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await getJobById(jobId);
        //@ts-ignore
        const { log, detail } = response;
        const { build_stage_logview } = detail;
        updateState(preset => {
          return {
            ...preset,
            detailData: log,
            build_stage_logview,
          };
        });
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
  const Content = () => {
    return (
      <>
        {build_stage_logview ? (
          <iframe width="100%" height="100%" src={build_stage_logview}></iframe>
        ) : (
          <pre style={containerStyles}>
            <code style={{ whiteSpace: 'pre-wrap' }}>{detailData}</code>
          </pre>
        )}
      </>
    );
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
      <Content />
    </Section>
  );
};

export default Detail;
