import React, { useEffect, useState } from 'react';
import { Breadcrumb } from 'antd';
import { FormattedMessage } from 'react-intl';
import { getJobById } from './service';
import { Utils } from '@graphscope/studio-components';
const { searchParamOf } = Utils;
import { useContext } from '@/layouts/useContext';

const Detail: React.FunctionComponent = () => {
  const jobId: string = searchParamOf('jobId') || '';
  const [detailData, setDetailData] = useState<string>('');
  const { store } = useContext();
  const { mode } = store;
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
    margin: '12px 0px',
    border: `${mode === 'defaultAlgorithm' ? '#efefef' : '#323232'} 1px solid`,
    borderRadius: '6px',
    padding: '12px',
    color: mode === 'defaultAlgorithm' ? '#1F1F1F' : '#808080',
  };
  return (
    <div style={{ padding: '12px 24px' }}>
      <Breadcrumb>
        <Breadcrumb.Item>
          <a href="/job">作业管理</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <FormattedMessage id="Detail" />
        </Breadcrumb.Item>
      </Breadcrumb>
      <pre style={containerStyles}>
        <code style={{ whiteSpace: 'pre-wrap' }}>{detailData}</code>
      </pre>
    </div>
  );
};

export default Detail;
