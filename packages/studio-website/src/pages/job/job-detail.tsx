import React, { useEffect, useState } from 'react';
import { useHistory } from '../../hooks';
import { getJobById } from './service';
import { Utils, useCustomToken } from '@graphscope/studio-components';
import Section from '../../components/section';
import { theme, Flex, Button } from 'antd';
import { JobStatus } from '@graphscope/studio-server';
import { LinkOutlined } from '@ant-design/icons';
const { getSearchParams } = Utils;

const Detail: React.FunctionComponent = () => {
  const history = useHistory();
  const jobId = getSearchParams('jobId') || '';
  const [state, setState] = useState<{
    content: string;
    reference: string;
  }>({
    content: '',
    reference: '',
  });

  const { token } = theme.useToken();
  /** 获取详情job */
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = (await getJobById(jobId)) as JobStatus;
        const { log, detail } = response;
        setState(preState => {
          return {
            ...preState,
            reference: detail && detail.build_stage_logview,
            content: log || '',
          };
        });
        if (detail && detail.build_stage_logview) {
          window.open(detail.build_stage_logview);
        }
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
    border: `${token.colorBorder} 1px solid`,
    borderRadius: '6px',
    padding: '12px',
    color: token.colorText,
  };
  const { reference, content } = state;
  const handleClick = () => {
    window.open(reference);
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
      <Flex vertical gap={12} justify="start">
        {reference && (
          <Button icon={<LinkOutlined />} onClick={handleClick} style={{ width: '200px' }} type="text">
            See more information
          </Button>
        )}
        <pre style={containerStyles}>
          <code style={{ whiteSpace: 'pre-wrap' }}>{content}</code>
        </pre>
      </Flex>
    </Section>
  );
};

export default Detail;
